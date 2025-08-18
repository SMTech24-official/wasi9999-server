import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { organizerService } from "./Organizer.service";



const getUserOrganizers = catchAsync(async (req: Request, res: Response) => {
    const result = await organizerService.getUserOrganizer(req.user.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Organizer retrieved successfully",
        data: result,
    });
});

const getALLShiftByOrganizer = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id
    const result = await organizerService.getShiftByOrganizer(req.params.id, userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Organizer retrieved successfully",
        data: result,
    });
});
export const organizerController = {
    getUserOrganizers,
    getALLShiftByOrganizer
};
