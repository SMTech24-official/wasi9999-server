import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { assignworkerService } from "./AssignWorker.service";

const createAssignWorker = catchAsync(async (req: Request, res: Response) => {
    const organizerId = req.user.id;
    const { bookShiftId } = req.body;
    const result = await assignworkerService.createAssignWorker({
        organizerId,
        bookShiftId,
    });
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "AssignWorker created successfully",
        data: result,
    });
});

const getAllAssignWorkersByOrganizer = catchAsync(async (req: Request, res: Response) => {
    const organizerId = req.user.id
    const results = await assignworkerService.getAllAssignWorkers({...req.query, organizerId});
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "AssignWorkers retrieved successfully",
        meta:results.meta,
        data: results.data,
    });
});

const getAllAssignWorkers = catchAsync(async (req: Request, res: Response) => {
    const results = await assignworkerService.getAllAssignWorkers(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "AssignWorkers retrieved successfully",
        meta:results.meta,
        data: results.data,
    });
});

const getSingleAssignWorker = catchAsync(async (req: Request, res: Response) => {
    const result = await assignworkerService.getSingleAssignWorker(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "AssignWorker retrieved successfully",
        data: result,
    });
});

const updateAssignWorker = catchAsync(async (req: Request, res: Response) => {
    const organizerId = req.user.id
    const result = await assignworkerService.updateAssignWorker(organizerId,req.params.id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "AssignWorker updated successfully",
        data: result,
    });
});

const deleteAssignWorker = catchAsync(async (req: Request, res: Response) => {
        const organizerId = req.user.id;
    const result = await assignworkerService.deleteAssignWorker(organizerId, req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "AssignWorker deleted successfully",
        data: result,
    });
});

export const assignworkerController = {
    createAssignWorker,
    getAllAssignWorkers,
    getAllAssignWorkersByOrganizer,
    getSingleAssignWorker,
    updateAssignWorker,
    deleteAssignWorker,
};
