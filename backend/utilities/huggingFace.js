import fetch from "node-fetch"

const HF_Key = process.env.HUGGINGFACE_API_KEY
const HF_Model = process.env.HF_MODEL

if(!HF_Key) console.warn("Api key for hugging face is not present")

export function chunkText(text,chunkSize=3500,overlap=200){
    const chunk=[]
    let i=0
    while(i<text.length){
        const end=Math.min(text.length,i+chunkSize)
        chunk.push(text.slice(i,end))
        i=end-overlap
        if(i<0) i=0
    }
    return chunk
}

export async function callHFModel(prompt) {
    const url=`https://api-inference.huggingface.co/models/${HF_Model}`
    const response = await fetch(url,{
        method:"POST",
        headers:{
            Authorization:`Bearer ${HF_Key}`,
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            inputs:prompt,
            parameters:{
                max_new_tokens:512,
                return_full_text:false
            },
            options:{
                wait_for_model:true
            }
        })
    })

    if(!response.ok){
        const txt=await response.text()
        throw new Error(`HF API error : ${response.status} ${txt}`)
    }
    return response.json()
}

export function parseHFOutput(output){
    // T5-like models return like this [{generated_text: "..."}]
    let text=""
    if(!output) return[]
    if(Array.isArray(output)){
        if(output[0] && output[0].generated_text) text = output[0].generated_text
        else if(typeof output[0]==="string") text=output[0]
        else text=JSON.stringify(output)
    }else if(typeof output === "object" && output.generated_text) text = output.generated_text
    else if(typeof output === " string") text=output

    // Trying to parse JSON array inside text
    try {
        const parsed=JSON.parse(text)
        if(Array.isArray(parsed)) return parsed
    } catch (error) {
        // not strict JSON, attempting to extract JSON-like array
        const match = text.match(/(\[.*])/s)
        if(match){
            try {
                return JSON.parse(match[1])
            } catch (error) {
                console.log(error)
            }
        }
    }
    return [{type : "raw",snippet:text.trim(),confidence:null}]
}

/**
 * extractClausesFromText(fullText)
 * returns array of annotations {type, snippet, start, end, confidence}
 */

export default async function extractClausesFromText(fullText, lang = "en"){
    if(!fullText || !fullText.trim()) return []

    const chunks=chunkText(fullText)
    const annotations=[]
    const seen = new Set()

    for (const chunk of chunks){
        const prompt = `You are a legal assistant that extracts contract clauses.
Given the chunk between <<<DOC>>> and <<<END>>>, identify clauses belonging to these categories:
["termination","payment","liability","confidentiality","governing law","indemnification","dispute resolution"].
Return ONLY a JSON array in language ${lang}. Each item: {"type":"<category>","snippet":"<exact excerpt in ${lang}}","confidence":0.0}
If none, return [].

<<<DOC>>>
${chunk}
<<<END>>>`;

        let out
        try {
            out = await callHFModel(prompt)
        } catch (err) {
            console.error("HF Error : ",err.message);
            continue;
        }

        const parsed = parseHFOutput(out)
        if(!Array.isArray(parsed)) continue
        for (const item of parsed){
            if(!item || !item.snippet) continue
            const type = item.type || "unknown"
            const snippet = String(item.snippet).trim()
            const key = `${type}||${snippet.slice(0,140)}`
            if(seen.has(key)) continue
            seen.add(key)

            // computing start index if possible
            let start = fullText.indexOf(snippet)
            if(start === -1){
                // trying normalized search
                const normSnippet = snippet.replace(/\s+/g, " ").slice(0, 200);
                const normalizedFull = fullText.replace(/\s+/g, " ");
                start = normalizedFull.indexOf(normSnippet);
            }
            const end = start !== -1 ? start + snippet.length : null;
            annotations.push({
                type,
                snippet,
                start: start !== -1 ? start : null,
                end,
                confidence: typeof item.confidence === "number" ? item.confidence : null
            });
        }
    }
    return annotations
}