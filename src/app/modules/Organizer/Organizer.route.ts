import { Router } from "express";
import { organizerController } from "./Organizer.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();


// get single organizer by id
router.get("/get-user-organizer", auth(UserRole.USER), organizerController.getUserOrganizers);


// get single organizer by id
router.get("/:id", auth(UserRole.USER), organizerController.getALLShiftByOrganizer);

// update organizer


export const organizerRoutes = router;
