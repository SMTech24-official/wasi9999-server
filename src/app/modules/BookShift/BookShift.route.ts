import { Router } from "express";
import { bookshiftController } from "./BookShift.controller";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { BookShiftValidation } from "./BookShift.validation";

const router = Router();

// create bookshift
router.post(
  "/create",
  auth(UserRole.USER),
  validateRequest(BookShiftValidation.BookShiftSchema),
  bookshiftController.createBookShift
);

// get all bookshift
router.get("/", auth(), bookshiftController.getAllBookShifts);

// get single bookshift by id
router.get("/:id", auth(), bookshiftController.getSingleBookShift);

// update bookshift
router.put("/:id", auth(), bookshiftController.updateBookShift);

// delete bookshift
router.delete("/:id", auth(), bookshiftController.deleteBookShift);

export const bookshiftRoutes = router;
