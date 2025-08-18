import { Router } from "express";
import { organizerController } from "./Organizer.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();


// get single organizer by id
router.get("/", auth(UserRole.ORGANIZER), organizerController.getUserOrganizers);


// get single organizer by id
router.get("/:id", auth(UserRole.ORGANIZER), organizerController.getALLShiftByOrganizer);

// update organizer


export const organizerRoutes = router;
