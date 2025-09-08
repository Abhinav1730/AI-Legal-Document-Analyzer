import multer from "multer";
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir=path.join(__dirname,"..","uploads")
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)

const storage = multer.diskStorage({
    destination:(req,file,cb)=>cb(null,uploadDir),
    filename:(req ,file,cb)=>{
        const safe = file.originalname.replace(/\s+/g,"_")
        cb(null,`${Date.now()}-${safe}`)
    }
})

function fileFilter(req , file,cb){
    const allowed = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "image/png",
        "image/jpeg"
    ]
    cb(null,allowed.includes(file.mimetype))
}

const upload = multer({
    storage,
    fileFilter,
    limits:{fileSize:50*1024*1024} //50mb
})

export default upload