import { Router } from "express";
import { documentController } from "./Document.controller";
import { fileUploader } from "../../../helpars/fileUploader";
import auth from "../../middlewares/auth";

const router = Router();

// create document
router.post("/add", auth(),
    fileUploader.upload.single("document"),
    documentController.createDocument);

// get all document
router.get("/", auth(), documentController.getAllDocuments);

// get single document by id
router.get("/:id", auth(), documentController.getSingleDocument);

// update document
router.put(
  "/:id",
  auth(),
  fileUploader.upload.single("document"),
  documentController.updateDocument
);

// delete document
router.delete("/:id", auth(), documentController.deleteDocument);

export const documentRoutes = router;
