import { Router } from "express";
import { assignworkerController } from "./AssignWorker.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

// create assignworker
router.post("/", auth(UserRole.ORGANIZER), assignworkerController.createAssignWorker);

// get all organizer assign worker assignworker
router.get(
  "/organizer",
  auth(UserRole.ORGANIZER),
  assignworkerController.getAllAssignWorkersByOrganizer
);

// get all assignworker
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  assignworkerController.getAllAssignWorkers
);

// get single assignworker by id
router.get("/:id", auth(), assignworkerController.getSingleAssignWorker);

// update assignworker
router.put("/:id", auth(UserRole.ORGANIZER), assignworkerController.updateAssignWorker);

// delete assignworker
router.delete(
  "/:id",
  auth(UserRole.ORGANIZER ),
  assignworkerController.deleteAssignWorker
);

export const assignworkerRoutes = router;
