import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { shiftService } from "./Shift.service";

const createShift = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id
    const result = await shiftService.createShift({...req.body, userId});
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Shift created successfully",
        data: result,
    });
});

const getAllShifts = catchAsync(async (req: Request, res: Response) => {
    const results = await shiftService.getAllShifts(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Shifts retrieved successfully",
        meta:results.meta,
        data: results.data,
    });
});

const getSingleShift = catchAsync(async (req: Request, res: Response) => {
    const result = await shiftService.getSingleShift(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Shift retrieved successfully",
        data: result,
    });
});

const updateShift = catchAsync(async (req: Request, res: Response) => {
    const result = await shiftService.updateShift(req.params.id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Shift updated successfully",
        data: result,
    });
});

const deleteShift = catchAsync(async (req: Request, res: Response) => {
    const result = await shiftService.deleteShift(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Shift deleted successfully",
        data: result,
    });
});

export const shiftController = {
    createShift,
    getAllShifts,
    getSingleShift,
    updateShift,
    deleteShift,
};
