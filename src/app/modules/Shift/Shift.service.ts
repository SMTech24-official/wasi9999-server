import prisma from "../../../shared/prisma";
import QueryBuilder from "../../../helpars/queryBuilder";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { NotificationService } from "../Notification/Notification.service";
import { TShift } from "./Shift.interface";

const createShift = async (data: TShift) => {
  const user = await prisma.user.findUnique({
    where: { id: data.userId, role: "ORGANIZER" },
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Organizer not found..!!");
  }

  if (user.userStatus !== "ACTIVE") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Organizer is not active. Cannot create shift.! Please contact admin."
    );
  }

  //if you wanna add logic here
  const result = await prisma.shift.create({ data });
  // send push notification to all users
  await NotificationService.sendToAll(
    "New Shift Available!",
    `Role: ${result.role} at ${result.location}`
  );

  return result;
};

const getAllShiftsOrganizerName = async () => {
  const organizerName = await prisma.user.findMany({
    where: {
      role: "ORGANIZER",
    },
    select: {
      fullName: true,
    },
  });

  return organizerName;
};

const getAllShiftsRole = async () => {
  const uniqueRoles = await prisma.shift.findMany({
    distinct: ["role"],
    select: {
      role: true,
    },
  });

  return uniqueRoles;
};

const getAllShifts = async (query: Record<string, any>, outlet: any) => {
  const queryBuilder = new QueryBuilder(prisma.shift, query);
  const shifts = await queryBuilder
    .search(["role", "location", "startTime", "endTime"])
    .filter()
    .rawFilter({
      user: {
        fullName: outlet,
      },
    })
    .sort()
    .paginate()
    .fields()
    .include({
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          profileImage: true,
        },
      },
    })
    .execute();

  const meta = await queryBuilder.countTotal();
  return { meta, data: shifts };
};

const getSingleShift = async (id: string) => {
  const result = await prisma.shift.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          profileImage: true,
        },
      },
    },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Shift not found..!!");
  }
  return result;
};

const updateShift = async (id: string, data: any) => {
  const existingShift = await prisma.shift.findUnique({ where: { id } });
  if (!existingShift) {
    throw new ApiError(httpStatus.NOT_FOUND, "Shift not found..!!");
  }
  const result = await prisma.shift.update({ where: { id }, data });
  return result;
};

const deleteShift = async (id: string) => {
  const existingShift = await prisma.shift.findUnique({ where: { id } });
  if (!existingShift) {
    throw new ApiError(httpStatus.NOT_FOUND, "Shift not found..!!");
  }
  const result = await prisma.shift.delete({ where: { id } });
  return null;
};

export const shiftService = {
  createShift,
  getAllShiftsOrganizerName,
  getAllShiftsRole,
  getAllShifts,
  getSingleShift,
  updateShift,
  deleteShift,
};
