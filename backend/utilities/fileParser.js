import fs from "fs"
import pdfParse from "pdf-parse"
import mammoth from "mammoth"
import Tesseract from "tesseract.js"


export default async function extractFile(filePath,mimeType) {
    if(!fs.existsSync(filePath)) throw new Error("File not found")
    
    //for pdf
    if(mimeType === "application/pdf"){
        const buffer=fs.readFileSync(filePath)
        const data = await pdfParse(buffer)
        return (data.text || "").trim()
    }

    //for docx and other formats
    if(mimeType==="application/vnd.openxmlformats-officedocument.wordprocessingml.document"||mimeType==="application/msword"){
        const response = await mammoth.extractRawText({path:filePath})
        return(response.text||"").trim()
    }

    //for plain text
    if(mimeType==="text/plain"){
        return fs.readFileSync(filePath,"utf-8").trim()
    }

    //for images
    if(mimeType.startsWith("image/")){
        const {data:{text}} = await Tesseract.recognize(filePath,"eng")
        return (text||"").trim()
    }

    return ""
}
