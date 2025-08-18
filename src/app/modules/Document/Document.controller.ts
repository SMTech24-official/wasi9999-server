import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { documentService } from "./Document.service";
import config from "../../../config";

const createDocument = catchAsync(async (req: Request, res: Response) => {
    if (req.file) {
        req.body.documentUrl = `${config.backend_image_url}/${req.file.filename}`;
        req.body.name = req.file.originalname
    }
    const result = await documentService.createDocument(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Document created successfully",
        data: result,
    });
});

const getAllDocuments = catchAsync(async (req: Request, res: Response) => {
    const results = await documentService.getAllDocuments(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Documents retrieved successfully",
        meta:results.meta,
        data: results.data,
    });
});

const getSingleDocument = catchAsync(async (req: Request, res: Response) => {
    const result = await documentService.getSingleDocument(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Document retrieved successfully",
        data: result,
    });
});

const updateDocument = catchAsync(async (req: Request, res: Response) => {
        if (req.file) {
          req.body.documentUrl = `${config.backend_image_url}/${req.file.filename}`;
          req.body.name = req.file.originalname;
        }
    const result = await documentService.updateDocument(req.params.id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Document updated successfully",
        data: result,
    });
});

const deleteDocument = catchAsync(async (req: Request, res: Response) => {
    const result = await documentService.deleteDocument(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Document deleted successfully",
        data: result,
    });
});

export const documentController = {
    createDocument,
    getAllDocuments,
    getSingleDocument,
    updateDocument,
    deleteDocument,
};
