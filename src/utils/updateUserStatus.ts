import prisma from "../shared/prisma";

// Helper function to get start and end of day
const getDateRange = (date: Date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

// Helper function to get yesterday's date range
const getYesterdayRange = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return getDateRange(yesterday);
};

export const updateShiftStatuses = async () => {
  try {
    console.log("Running shift status update cron job...");

    const yesterday = getYesterdayRange();

    // Find shifts that ended yesterday and are still ASSIGNED
    const expiredShifts = await prisma.shift.findMany({
      where: {
        date: {
          gte: yesterday.start,
          lte: yesterday.end,
        },
        status: "ASSIGNED", 
      },
      include: {
        BookShift: {
          where: {
            status: "ASSIGNED",
          },
        },
      },
    });
      console.log(expiredShifts, 'expiredShifts');

    // Update BookShift status to COMPLETED for shifts that ended yesterday
    for (const shift of expiredShifts) {
      if (shift.BookShift.length > 0) {
        await prisma.bookShift.updateMany({
          where: {
            shiftId: shift.id,
            status: "ASSIGNED",
          },
          data: {
            status: "COMPLETED",
          },
        });

        console.log(
          `Updated ${shift.BookShift.length} booking(s) for shift ${shift.id} to COMPLETED`
        );
      }
    }

    // Update Shift status to COMPLETED for shifts that ended yesterday
    await prisma.shift.updateMany({
      where: {
        date: {
          gte: yesterday.start,
          lte: yesterday.end,
        },
        status: "ASSIGNED",
      },
      data: {
        status: "COMPLETED",
      },
    });

    console.log("Shift status update completed");
  } catch (error) {
    console.error("Error in shift status update cron job:", error);
  }
};
