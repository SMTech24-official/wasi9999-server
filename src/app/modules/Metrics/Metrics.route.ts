import { Router } from "express";
import { metricsController } from "./Metrics.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();


// get all metrics
router.get(
  "/admin-overview",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  metricsController.getAdminOverviewMetrics
);

// get single metrics by id
router.get("/organizer-overview", auth(UserRole.ORGANIZER), metricsController.getOrganizerOverviewMetrics);

export const metricsRoutes = router;
