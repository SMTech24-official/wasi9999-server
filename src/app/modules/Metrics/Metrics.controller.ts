import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { metricsService } from "./Metrics.service";



const getAdminOverviewMetrics = catchAsync(async (req: Request, res: Response) => {
    const result = await metricsService.getAdminOverviewMetrics();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin Overview Metrics retrieved successfully",
        data: result,
    });
});

const getOrganizerOverviewMetrics = catchAsync(
  async (req: Request, res: Response) => {
    const result = await metricsService.getOrganizerOverviewMetrics(
      req.user.id
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Organizer Overview Metrics retrieved successfully",
      data: result,
    });
  }
);


export const metricsController = {
    getAdminOverviewMetrics,
    getOrganizerOverviewMetrics,
};
