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

// get all bookshift for user
router.get("/my-bookshift-user", auth(UserRole.USER), bookshiftController.getAllMyBookShiftsByUser);


// get all bookshift for user
router.get("/bookshift-status", auth(UserRole.USER), bookshiftController.getBookingShiftStatus);

//get all my shift booking, for Organizer
router.get("/my-bookshift-organizer", auth(UserRole.ORGANIZER), bookshiftController.getAllBookShiftsByOrganizer);

// get all bookshift
router.get("/", auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), bookshiftController.getAllBookShifts);

// get single bookshift by id
router.get("/:id", auth(), bookshiftController.getSingleBookShift);

// update bookshift
router.put("/:id", auth(), bookshiftController.updateBookShift);

// delete bookshift
router.delete("/:id", auth(), bookshiftController.deleteBookShift);

export const bookshiftRoutes = router;
