import path from "path"
import fs from "fs"
import Document from "../models/document.model.js"
import User from "../models/user.model.js"
import extractFile from "../utilities/fileParser.js"
import extractClausesFromText from "../utilities/gemini.js"
import { t } from "../utilities/translations.js"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const uploadDocument=async (req,res)=>{
    try {
        console.log('=== UPLOAD STARTED ===');
        console.log('Upload - req.user:', req.user ? 'present' : 'missing');
        console.log('Upload - req.jwtUser:', req.jwtUser ? 'present' : 'missing');
        console.log('Upload - req.file:', req.file ? 'present' : 'missing');
        
        // Handle both session-based and JWT-based auth
        let user = req.user;
        if (!user && req.jwtUser) {
            console.log('Upload - JWT User ID:', req.jwtUser.id, 'Type:', typeof req.jwtUser.id);
            user = await User.findById(req.jwtUser.id);
            console.log('Upload - User found from JWT:', user ? user._id : 'null');
        }
        const lang = (req.query && req.query.lang) || "en"
        if(!user) {
            console.log('Upload - No user found, returning 401');
            return res.status(401).json({error:"Unauthorized User"})
        }
        
        console.log('Upload - User authenticated:', user._id);
        
        let textContent = ""
        if(req.file){
            console.log('Upload - Extracting text from file:', req.file.originalname, req.file.mimetype);
            textContent=await extractFile(req.file.path,req.file.mimetype)
            console.log('Upload - Extracted text length:', textContent ? textContent.length : 0);
        }else if(req.body.content){
            console.log('Upload - Using text content from body');
            textContent=req.body.content
        }else{
            console.log('Upload - No file or content provided');
            return res.status(400).json({error:"No file or material provided"})
        }

        if(!textContent || textContent.length<5){
            console.log('Upload - Text content too short or empty:', textContent ? textContent.length : 0);
            return res.status(400).json({error:"Extracted text is empty or too short"})
        }

        console.log('Upload - Skipping automatic analysis to prevent memory issues');
        let annotations = [];
        // Analysis will be done manually via the analyze button

        console.log('Upload - Creating document object...');
        const doc = new Document({
            user:user._id,
            originalName:req.file?req.file.originalname:(req.body.fileName || "text-upload"),
            fileName:req.file ? req.file.filename : null,
            mimeType:req.file?req.file.mimetype:(req.body.mimeType || "text/plain"),
            text:textContent,annotations
        })
        console.log('Upload - Document object created, saving to database...');

        console.log('Saving document:', {
            user: user._id,
            userType: typeof user._id,
            originalName: doc.originalName,
            fileName: doc.fileName,
            mimeType: doc.mimeType,
            textLength: textContent.length,
            annotationsCount: annotations.length
        });

        await doc.save()
        console.log('Document saved with ID:', doc._id);
        
        // Verify the document was actually saved
        const savedDoc = await Document.findById(doc._id);
        console.log('Verification - Document exists in DB:', savedDoc ? 'YES' : 'NO');
        if (savedDoc) {
            console.log('Verification - Document user ID:', savedDoc.user);
        }
        return res.json({message:t(lang,"upload_success","Uploaded successfully"), id:doc._id,annotations:doc.annotations})
    } catch (error) {
        console.error("Upload Document Error : ",error)
        res.status(500).json({error:"Server Error"})
    }
}

export const listDocuments=async(req,res)=> {
    try {
        console.log('listDocuments called, req.user:', req.user ? 'present' : 'missing', 'req.jwtUser:', req.jwtUser ? 'present' : 'missing');
        
        // Handle both session-based and JWT-based auth
        let user = req.user;
        if (!user && req.jwtUser) {
            console.log('List - JWT User ID:', req.jwtUser.id, 'Type:', typeof req.jwtUser.id);
            user = await User.findById(req.jwtUser.id);
            console.log('List - User found from JWT:', user ? user._id : 'null');
        }
        if(!user) {
            console.log('No user found, returning 401');
            return res.status(401).json({error:"Unauthorized User"})
        }
        
        console.log('Fetching documents for user:', user._id);
        const docs = await Document.find({user:user._id}).sort({createdAt:-1}).limit(100).lean()
        console.log('Found documents:', docs.length);
        
        // Debug: Check all documents in the database
        const allDocs = await Document.find({}).lean();
        console.log('Total documents in DB:', allDocs.length);
        if (allDocs.length > 0) {
            console.log('All document user IDs:', allDocs.map(d => d.user));
        }
        
        res.json(docs)
    } catch (error) {
        console.error('listDocuments error:', error)
        res.status(500).json({error:"Server Error"})
    }
}

export const getDocuments= async(req,res) =>{
    try {
        // Handle both session-based and JWT-based auth
        let user = req.user;
        if (!user && req.jwtUser) {
            user = await User.findById(req.jwtUser.id);
        }
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
        // Handle both session-based and JWT-based auth
        let user = req.user;
        if (!user && req.jwtUser) {
            user = await User.findById(req.jwtUser.id);
        }
        const id=req.params.id
        if(!user) return res.status(401).json({error:"Unauthorized User"})
        
        const doc = await Document.findOneAndDelete({_id:id,user:user._id})
        if(!doc) return res.status(404).json({error:"Not found"})

        //deleting stored file if any
        if(doc.fileName){
            const fp = path.join(__dirname,"..","uploads",doc.fileName)
            if(fs.existsSync(fp)) fs.unlinkSync(fp)
        }
        const lang = (req.query && req.query.lang) || "en"
        res.json({message:t(lang, "deleted", "Deleted")})
    } catch (error) {
        console.error(error)
        res.status(500).json({error:"Server Error"})
    }
}


export const reAnalyze=async(req,res)=> {
    try {
        console.log('=== RE-ANALYZE STARTED ===');
        console.log('Re-analyze - req.user:', req.user ? 'present' : 'missing');
        console.log('Re-analyze - req.jwtUser:', req.jwtUser ? 'present' : 'missing');
        console.log('Re-analyze - Document ID:', req.params.id);
        
        // Handle both session-based and JWT-based auth
        let user = req.user;
        if (!user && req.jwtUser) {
            user = await User.findById(req.jwtUser.id);
        }
        const id = req.params.id
        if(!user) {
            console.log('Re-analyze - No user found, returning 401');
            return res.status(401).json({error:"Unauthorized User"})
        }

        console.log('Re-analyze - User authenticated:', user._id);
        
        const doc = await Document.findOne({_id:id,user:user._id})
        if(!doc) {
            console.log('Re-analyze - Document not found');
            return res.status(404).json({error:"Not Found"})
        }

        console.log('Re-analyze - Document found:', doc.originalName, 'Text length:', doc.text.length);

        const lang = (req.query && req.query.lang) || "en"
        
        // Enable analysis for documents (Gemini 2.5 Flash is more powerful)
        if (doc.text.length > 10000) { // 10KB limit for analysis
            console.log('Re-analyze: Text too large for AI analysis, skipping...');
            res.json({id:doc._id,annotations:[], message:"Text too large for analysis (limit: 10000 characters)"})
        } else {
            console.log('Re-analyze: Text size acceptable for analysis, processing with Gemini...');
            try {
                const annotations = await extractClausesFromText(doc.text, lang);
                doc.annotations = annotations;
                await doc.save();
                console.log('Re-analyze: Analysis completed successfully, annotations count:', annotations.length);
                res.json({id:doc._id,annotations, message:"Analysis completed successfully with Gemini"})
            } catch (error) {
                console.log('Re-analyze: Analysis failed:', error.message);
                res.json({id:doc._id,annotations:[], message:"Analysis failed: " + error.message})
            }
        }
    } catch (error) {
        console.error('Re-analyze error:', error)
        res.status(500).json({error:"Server Error"})
    }
}