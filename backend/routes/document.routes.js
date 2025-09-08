import express from "express"
import upload from "../middlewares/upload.middleware.js"
import isAuthenticated from "../middlewares/auth.middleware.js"
import {uploadDocument,listDocuments,getDocuments,deleteDocument,reAnalyze} from "../controllers/document.controller.js"

const router = express.Router()

router.post("/upload",isAuthenticated,upload.single("file"),uploadDocument)
router.get("/",isAuthenticated,listDocuments)
router.get("/:id",isAuthenticated,getDocuments)
router.delete("/:id",isAuthenticated,deleteDocument)
router.post("/:id/analyze",isAuthenticated,reAnalyze)

export default router