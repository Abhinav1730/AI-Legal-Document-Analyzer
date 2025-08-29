import express from "express"
import upload from "../middlewares/upload.middleware.js"
import isAuthenticated from "../middlewares/auth.middleware.js"
import {uploadDocument,listDocuments,getDocuments,deleteDocument,reAnalyze} from "../controllers/document.controller.js"

const router = express.Router()

router.post("/upload",isAuthenticated,upload.single("file"),uploadDocument)
router.get("/",isAuthenticated,listDocuments)
router.get("/:id",isAuthenticated,getDocuments)
router.get("/:id",isAuthenticated,deleteDocument)
router.get("/:id",isAuthenticated,reAnalyze)

export default router