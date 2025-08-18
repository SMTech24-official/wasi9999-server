import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { bookshiftService } from "./BookShift.service";

const createBookShift = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id 
    const {shiftId} = req.body 
    const result = await bookshiftService.createBookShift({userId, shiftId});
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "BookShift created successfully",
        data: result,
    });
});

const getAllMyBookShiftsByUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id
    const results = await bookshiftService.getAllBookShifts({...req.query, userId});
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User BookShifts retrieved successfully",
        meta:results.meta,
        data: results.data,
    });
});
const getBookingShiftStatus = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const results = await bookshiftService.getUserShiftStatus(
      userId
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User BookShifts retrieved successfully",
      data: results
    });
  }
);
const getAllBookShiftsByOrganizer = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id
    const results = await bookshiftService.getAllBookShiftsByOrganizer(req.query, userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Organizer BookShifts retrieved successfully",
        meta:results.meta,
        data: results.data,
    });
});
const getAllBookShifts = catchAsync(async (req: Request, res: Response) => {
    const results = await bookshiftService.getAllBookShifts(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "BookShifts retrieved successfully",
        meta:results.meta,
        data: results.data,
    });
});

const getSingleBookShift = catchAsync(async (req: Request, res: Response) => {
    const result = await bookshiftService.getSingleBookShift(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "BookShift retrieved successfully",
        data: result,
    });
});

const updateBookShift = catchAsync(async (req: Request, res: Response) => {
    const result = await bookshiftService.updateBookShift(req.params.id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "BookShift updated successfully",
        data: result,
    });
});

const deleteBookShift = catchAsync(async (req: Request, res: Response) => {
    const result = await bookshiftService.deleteBookShift(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "BookShift deleted successfully",
        data: result,
    });
});

export const bookshiftController = {
    createBookShift,
    getBookingShiftStatus,
    getAllMyBookShiftsByUser,
    getAllBookShiftsByOrganizer,
    getAllBookShifts,
    getSingleBookShift,
    updateBookShift,
    deleteBookShift,
};
