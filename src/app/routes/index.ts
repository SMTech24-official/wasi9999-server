import express from "express";

import { AuthRoutes } from "../modules/Auth/auth.routes";
import { UserRoutes } from "../modules/User/user.route";
import { shiftRoutes } from "../modules/Shift/Shift.route";
import { bookshiftRoutes } from "../modules/BookShift/BookShift.route";


// import { paymentRoutes } from "../modules/Payment/payment.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },

  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/shift",
    route: shiftRoutes,
  },
  {
    path: "/book-shift",
    route: bookshiftRoutes,
  },
  
  
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
