import express from "express";

import { AuthRoutes } from "../modules/Auth/auth.routes";
import { UserRoutes } from "../modules/User/user.route";
import { shiftRoutes } from "../modules/Shift/Shift.route";
import { bookshiftRoutes } from "../modules/BookShift/BookShift.route";
import { contactRoutes } from "../modules/Contact/Contact.route";
import { documentRoutes } from "../modules/Document/Document.route";
import { assignworkerRoutes } from "../modules/AssignWorker/AssignWorker.route";
import { organizerRoutes } from "../modules/Organizer/Organizer.route";


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
    path: "/document",
    route: documentRoutes,
  },
  {
    path: "/shift",
    route: shiftRoutes,
  },
  {
    path: "/book-shift",
    route: bookshiftRoutes,
  },
  {
    path: "/assign-worker",
    route: assignworkerRoutes,
  },
  {
    path: "/contact",
    route: contactRoutes,
  },
  {
    path: "/organizer",
    route: organizerRoutes,
  },
  
  
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
