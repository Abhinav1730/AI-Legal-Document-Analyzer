import path from "path"
import fs from "fs"
import Document from "../models/document.model"
import extractFile from "../utilities/fileParser"
import extractClausesFromText from "../utilities/huggingFace.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const uploadDocument=async (req,res)=>{
    try {
        const user = req.user
        if(!user) return res.status(401).json({error:"Unauthorized User"})
        
        let textContent = ""
        if(req.file){
            textContent=await extractFile(req.file.path,req.file.mimetype)
        }else if(req.body.content){
            textContent=req.body.content
        }else{
            return res.status(400).json({error:"No file or material provided"})
        }

        if(!textContent || textContent.length<5){
            return res.status(400).json({error:"Extracted text is empty or too short"})
        }

        const annotations = await extractClausesFromText(textContent)

        const doc = new Document({
            user:user._id,
            originalName:req.file?req.file.originalName:(req.body.fileName || "text-upload"),
            fileName:req.file ? req.file.fileName : null,
            mimeType:req.file?req.file.mimeType:(req.file.mimeType || "text/plain"),
            text:textContent,annotations
        })

        await doc.save()
        return res.json({id:doc._id,annotations:doc.annotations})
    } catch (error) {
        console.error("Upload Document Error : ",error)
        res.status(500).json({error:"Server Error"})
    }
}

export const listDocuments=async(req,res)=> {
    try {
        const user=req.user
        if(!user) return res.status(401).json({error:"Unauthorized User"})
        
        const docs = await Document.find({user:user._id}).sort({createdAt:-1}).limit(100).lean()
        res.json(docs)
    } catch (error) {
        console.error(error)
        res.status(500).json({error:"Server Error"})
    }
}

export const getDocuments= async(req,res) =>{
    try {
        const user = req.user
        const id=req.params.id
        if(!user) return res.status(401).json({error:"Unauthorized User"})

        const doc = await Document.findOne({_id:id,user:user._id}).lean()
        if(!doc) return res.status(404).json({error:"Not found"})
        res.json(doc)
    } catch (error) {
        console.error(error)
        res.status(500).json({error:"Server Error"})
    }
}

export const deleteDocument=async(req,res)=> {
    try {
        const user = req.user
        const id=req.params.id
        if(!user) return res.status(401).json({error:"Unauthorized User"})
        
        const doc = await Document.findOneAndDelete({_id:id,user:user._id})
        if(!doc) return res.status(404).json({error:"Not found"})

        //deleting stored file if any
        if(doc.fileName){
            const fp = path.join(__dirname,"..","uploads",doc.fileName)
            if(fs.existsSync(fp)) fs.unlinkSync(fp)
        }
        res.json({message:"Deleted"})
    } catch (error) {
        console.error(error)
        res.status(500).json({error:"Server Error"})
    }
}

export const reAnalyze=async(req,res)=> {
    try {
        const user = req.user
        const id = req.params.id
        if(!user) return res.status(401).json({error:"Unauthorized User"})

        const doc = await Document.findOne({_id:id,user:user._id})
        if(!doc) return res.status(404).json({error:"Not Found"})

        const annotations = await extractClausesFromText(doc.text)
        doc.annotations=annotations
        await doc.save()
        res.json({id:doc._id,annotations})
    } catch (error) {
        console.error(error)
        res.status(500).json({error:"Server Error"})
    }
}