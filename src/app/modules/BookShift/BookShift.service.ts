import prisma from "../../../shared/prisma";
import QueryBuilder from "../../../helpars/queryBuilder";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { TBookShift } from "./BookShift.interface";

const createBookShift = async (data: TBookShift) => {
  //if you wanna add logic here
  const existingBookShift = await prisma.bookShift.findUnique({
    where: {
      shiftId_userId: {
        shiftId: data.shiftId,
        userId: data.userId,
      },
    },
  });
  if (existingBookShift) {
    throw new ApiError(httpStatus.CONFLICT, "BookShift already exists");
  }
  const result = await prisma.bookShift.create({ data });
  await prisma.shift.update({
    where: {
      id: data.shiftId,
    },
    data: {
      status: "APPLIED",
    },
  });
  return result;
};

const getAllBookShiftsByOrganizer = async (
  query: Record<string, any>,
  userId: string
) => {
  const queryBuilder = new QueryBuilder(prisma.bookShift, query);
  const bookshifts = await queryBuilder
    .search([""])
    .filter()
    .rawFilter({
      shift: {
        userId,
      },
    })
    .sort()
    .paginate()
    .fields()
    .include({
      worker: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          profileImage: true,
        },
      },
      shift: true,
    })
    .execute();
  
  const meta = await queryBuilder.countTotal();
  return { meta, data: bookshifts };
};

const getAllBookShifts = async (query: Record<string, any>) => {
  const queryBuilder = new QueryBuilder(prisma.bookShift, query);
  const bookshifts = await queryBuilder
    .search([""])
    .filter()
    .sort()
    .paginate()
    .fields()
    .include({
      worker: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          profileImage: true,
        },
      },
      shift: true,
    })
    .execute();

  const meta = await queryBuilder.countTotal();
  return { meta, data: bookshifts };
};

const getSingleBookShift = async (id: string) => {
  const result = await prisma.bookShift.findUnique({
    where: { id },
    include: {
      worker: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          profileImage: true,
        },
      },
      shift: true,
    },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "BookShift not found..!!");
  }
  return result;
};

const updateBookShift = async (id: string, data: any) => {
  const existingBookShift = await prisma.bookShift.findUnique({
    where: { id },
  });
  if (!existingBookShift) {
    throw new ApiError(httpStatus.NOT_FOUND, "BookShift not found..!!");
  }
  const result = await prisma.bookShift.update({ where: { id }, data });
  return result;
};

const deleteBookShift = async (id: string) => {
  const existingBookShift = await prisma.bookShift.findUnique({
    where: { id },
  });
  if (!existingBookShift) {
    throw new ApiError(httpStatus.NOT_FOUND, "BookShift not found..!!");
  }
  const result = await prisma.bookShift.delete({ where: { id } });
  return null;
};

export const bookshiftService = {
  createBookShift,
  getAllBookShiftsByOrganizer,
  getAllBookShifts,
  getSingleBookShift,
  updateBookShift,
  deleteBookShift,
};
