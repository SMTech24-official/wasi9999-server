// import { Request, Response } from "express";
// import catchAsync from "../../../shared/catchAsync";
// import sendResponse from "../../../shared/sendResponse";
// import httpStatus from "http-status";
// import { notificationService } from "./Notification.service";

// const createNotification = catchAsync(async (req: Request, res: Response) => {
//     const result = await notificationService.createNotification(req.body);
//     sendResponse(res, {
//         statusCode: httpStatus.CREATED,
//         success: true,
//         message: "Notification created successfully",
//         data: result,
//     });
// });

// const getAllNotifications = catchAsync(async (req: Request, res: Response) => {
//     const results = await notificationService.getAllNotifications(req.query);
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Notifications retrieved successfully",
//         meta:results.meta,
//         data: results.data,
//     });
// });

// const getSingleNotification = catchAsync(async (req: Request, res: Response) => {
//     const result = await notificationService.getSingleNotification(req.params.id);
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Notification retrieved successfully",
//         data: result,
//     });
// });

// const updateNotification = catchAsync(async (req: Request, res: Response) => {
//     const result = await notificationService.updateNotification(req.params.id, req.body);
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Notification updated successfully",
//         data: result,
//     });
// });

// const deleteNotification = catchAsync(async (req: Request, res: Response) => {
//     const result = await notificationService.deleteNotification(req.params.id);
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Notification deleted successfully",
//         data: result,
//     });
// });

// export const notificationController = {
//     createNotification,
//     getAllNotifications,
//     getSingleNotification,
//     updateNotification,
//     deleteNotification,
// };
