import prisma from "../../../shared/prisma";
import QueryBuilder from "../../../helpars/queryBuilder";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";

const createAssignWorker = async (data: {
  organizerId: string;
  bookShiftId: string;
}) => {
  if (!data.bookShiftId) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Please Provided BookShift Id..!!"
    );
  }
  const bookingShift = await prisma.bookShift.findUnique({
    where: {
      id: data.bookShiftId,
    },
    include: {
      shift: true,
    },
  });
  if (!bookingShift) {
    throw new ApiError(httpStatus.NOT_FOUND, "BookShift not found..!!");
  }

  if (bookingShift.shift.userId !== data.organizerId) {
    throw new ApiError(httpStatus.NOT_FOUND, "You are not authorized..!!");
  }
  const existingAssignWorker = await prisma.assignWorker.findUnique({
    where: {
      bookShiftId: data.bookShiftId,
    },
  });
  if (existingAssignWorker) {
    throw new ApiError(httpStatus.CONFLICT, "AssignWorker already exists");
  }

  //checking vacancy
  const existing = await prisma.assignWorker.findMany({
    where: {
      bookShiftId: data.bookShiftId,
    },
  });

  if (existing.length >= bookingShift.shift.vacancy) {
    throw new ApiError(httpStatus.NOT_FOUND, "Vacancy is full..!!");
  }

  const result = await prisma.$transaction(async (tx) => {
    const assignWorker = await tx.assignWorker.create({ data });
    await tx.bookShift.update({
      where: {
        id: data.bookShiftId,
      },
      data: {
        status: "ASSIGNED",
      },
    });
    await tx.shift.update({
      where: {
        id: bookingShift.shiftId,
      },
      data: {
        status: "ASSIGNED",
      },
    });
    return assignWorker;
  });
  return result;
};

const getAllAssignWorkers = async (query: Record<string, any>) => {
  const queryBuilder = new QueryBuilder(prisma.assignWorker, query);
  const assignworkers = await queryBuilder
    .search([""])
    .filter()
    .sort()
    .paginate()
    .fields()
    .include({
      organizer: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          profileImage: true,
        },
      },
      bookShift: {
        select: {
          status: true,
          shift: {
            select: {
              role: true,
              location: true,
              date: true,
              startTime: true,
              endTime: true,
              payAmount: true,
              vacancy: true,
            },
          },
          worker: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phoneNumber: true,
              profileImage: true,
            },
          },
        },
      },
    })
    .execute();

  const meta = await queryBuilder.countTotal();
  return { meta, data: assignworkers };
};

const getSingleAssignWorker = async (id: string) => {
  const result = await prisma.assignWorker.findUnique({
    where: { id },
    include: {
      organizer: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          profileImage: true,
        },
      },
      bookShift: {
          select: {
            status: true,
          shift: {
            select: {
              role: true,
              location: true,
              date: true,
              startTime: true,
              endTime: true,
              payAmount: true,
              vacancy: true,
            },
          },
          worker: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phoneNumber: true,
              profileImage: true,
            },
          },
        },
      },
    },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "AssignWorker not found..!!");
  }
  return result;
};

const updateAssignWorker = async (
  organizerId: string,
  id: string,
  data: any
) => {
  const existingAssignWorker = await prisma.assignWorker.findUnique({
    where: { id },
  });
  if (!existingAssignWorker) {
    throw new ApiError(httpStatus.NOT_FOUND, "AssignWorker not found..!!");
  }
  if (existingAssignWorker.organizerId !== organizerId) {
    throw new ApiError(httpStatus.NOT_FOUND, "You are not authorized..!!");
  }
  const result = await prisma.assignWorker.update({ where: { id }, data });
  return result;
};

const deleteAssignWorker = async (organizerId: string, id: string) => {
  const existingAssignWorker = await prisma.assignWorker.findUnique({
    where: { id },
  });
  if (!existingAssignWorker) {
    throw new ApiError(httpStatus.NOT_FOUND, "AssignWorker not found..!!");
  }
  if (existingAssignWorker.organizerId !== organizerId) {
    throw new ApiError(httpStatus.NOT_FOUND, "You are not authorized..!!");
  }
  const result = await prisma.assignWorker.delete({ where: { id } });
  return null;
};

export const assignworkerService = {
  createAssignWorker,
  getAllAssignWorkers,
  getSingleAssignWorker,
  updateAssignWorker,
  deleteAssignWorker,
};
