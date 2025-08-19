import { Router } from "express";
import { documentController } from "./Document.controller";
import { fileUploader } from "../../../helpars/fileUploader";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

// create document
router.post("/add", auth(),
    fileUploader.upload.single("document"),
    documentController.createDocument);

router.get("/user", auth(), documentController.getAllUserDocuments);
    

    // get all document
router.get("/", auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), documentController.getAllDocuments);

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
