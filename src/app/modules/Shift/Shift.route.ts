import { Router } from "express";
import { shiftController } from "./Shift.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { ShiftValidation } from "./Shift.validation";

const router = Router();

// create shift
router.post(
  "/create",
  auth(UserRole.ORGANIZER),
  validateRequest(ShiftValidation.ShiftSchema),
  shiftController.createShift
);

// get all shift
router.get("/", auth(), shiftController.getAllShifts);

// get all organizer name
router.get("/organizer-name", auth(), shiftController.getAllShiftsOrganizerName);

// get single shift by id
router.get("/:id", auth(), shiftController.getSingleShift);

// update shift
router.put(
  "/:id",
  auth(UserRole.ORGANIZER),
  validateRequest(ShiftValidation.UpdateShiftSchema),
  shiftController.updateShift
);

// delete shift
router.delete(
  "/:id",
  auth(UserRole.ORGANIZER, UserRole.SUPER_ADMIN),
  shiftController.deleteShift
);

export const shiftRoutes = router;
