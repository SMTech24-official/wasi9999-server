import prisma from "../../../shared/prisma";
import QueryBuilder from "../../../helpars/queryBuilder";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { TBookShift } from "./BookShift.interface";
import { NotificationService } from "../Notification/Notification.service";

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

    // notify shift owner
    const shift = await prisma.shift.findUnique({ where: { id: data.shiftId } });
    if (shift) {
      await NotificationService.sendToUser(
        shift.userId,
        "Your shift got a booking!",
        "A worker just applied to your shift."
      );
      await prisma.notification.create({
        data: {
          userId: shift.userId,
          entityId: result.id,
          entityType: "BOOK_SHIFT",
          title: "Your shift got a booking!",
          message: "A worker just applied to your shift.",
        },
      })
    }
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
      shift: {
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
      },
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

const getUserShiftStatus = async (userId: string) => {
  const notifications = [];

  // --- Scenario 1: Tomorrow's Shifts (Need Attention) ---
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

  const tomorrowShifts = await prisma.bookShift.findMany({
    where: {
      userId: userId,
      status: "ASSIGNED",
      shift: {
        date: {
          gte: tomorrow,
          lt: dayAfterTomorrow,
        },
      },
    },
    include: {
      shift: true,
    },
  });

  if (tomorrowShifts.length > 0) {
    notifications.push({
      type: "Need Attention",
      message: `${tomorrowShifts.length} shifts are scheduled for tomorrow. Are you prepared?`,
      description:
        "Your shifts are booked for tomorrow. Please review the details and make sure you're ready to go. Don't forget to check the exact location and start time.",
      shifts: tomorrowShifts.map((bs) => bs.shift),
    });
  }

  // --- Scenario 2: Today's Shifts (In Progress) ---
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrowForTodayCheck = new Date(today);
  tomorrowForTodayCheck.setDate(tomorrowForTodayCheck.getDate() + 1);

  const todayShifts = await prisma.bookShift.findMany({
    where: {
      userId: userId,
      status: "ASSIGNED",
      shift: {
        date: {
          gte: today,
          lt: tomorrowForTodayCheck,
        },
      },
    },
    include: {
      shift: true,
    },
  });
  console.log(todayShifts, "todayShifts");

  if (todayShifts.length > 0) {
    notifications.push({
      type: "In Progress",
      message: `${todayShifts.length} shifts are ongoing today.`,
      description:
        "You have shifts scheduled for today. Remember to complete your timesheet and get it signed off by the organizer at the end of your shift to confirm your attendance and get paid on time.",
      shifts: todayShifts.map((bs) => bs.shift),
    });
  }

  // --- Scenario 3: Completed Shifts (In Progress - for payment) ---
  const shiftsPendingPayment = await prisma.assignWorker.findMany({
    where: {
      paymentStatus:"UNPAID",
      bookShift: {
        userId: userId,
        status: "COMPLETED",
      },
    },
    include: {
      bookShift: {
        include: {
          shift: true,
        },
      },
    },
  });
  // console.log(shiftsPendingPayment, 'shiftsPendingPayment');

  if (shiftsPendingPayment.length > 0) {
    notifications.push({
      type: "In Progress",
      message: `${shiftsPendingPayment.length} shifts have been approved for payment.`,
      description:
        "Good news! Your timesheets for these shifts have been reviewed and approved. They are now queued for payment and will be processed in the next payroll batch.",
      shifts: shiftsPendingPayment.map((aw) => aw.bookShift.shift),
    });
  }

  // --- Scenario 4: Paid Shifts (Finalized) ---
  const shiftsFinalized = await prisma.assignWorker.findMany({
    where: {
      paymentStatus: "PAID",
      bookShift: {
        userId: userId,
      }},
    include: {
      bookShift: {
        include: {
          shift: true,
        },
      },
    },
  });

  if (shiftsFinalized.length > 0) {
    notifications.push({
      type: "Finalized",
      message: `${shiftsFinalized.length} shifts with payroll.`,
      description:
        "Your payroll is complete for these shifts. The funds have been processed and should be available in your account soon, depending on your bank's processing time.",
      shifts: shiftsFinalized.map((aw) => aw.bookShift.shift),
    });
  }

  if (notifications.length > 0) {
    return notifications;
  } else {
    return {
      type: "No Active Shifts",
      message: "No shifts requiring attention at this time",
      description: "You have no active shifts at this time.",
      shifts: [],
    };
  }
};

export const bookshiftService = {
  createBookShift,
  getUserShiftStatus,
  getAllBookShiftsByOrganizer,
  getAllBookShifts,
  getSingleBookShift,
  updateBookShift,
  deleteBookShift,
};
