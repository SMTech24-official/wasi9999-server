import prisma from "../../../shared/prisma";
const getAdminOverviewMetrics = async () => {
  const totalOrganizers = await prisma.user.count({
    where: { role: "ORGANIZER" },
  });

  const totalWorkers = await prisma.user.count({
    where: { role: "USER" },
  });
  const totalShifts = await prisma.shift.count();

  const activeShifts = await prisma.shift.count({
    where: { date: { gte: new Date() } },
  });

  const completedShifts = await prisma.shift.count({
    where: { date: { lt: new Date() } },
  });

  return Promise.resolve({
    totalOrganizers,
    totalWorkers,
    totalShifts,
    activeShifts,
    completedShifts,
  });
};

const getOrganizerOverviewMetrics = async (userId: string) => {
  const [totalShifts, pendingShifts, activeShifts, completedShifts] =
    await prisma.$transaction([
      prisma.shift.count({
        where: { userId },
      }),
      prisma.shift.count({
        where: { userId, status: "PENDING" },
      }),
      prisma.shift.count({
        where: { userId,date: { gte: new Date() } },
      }),
      prisma.shift.count({
        where: {userId, date: { lt: new Date() } },
      }),
    ]);

  // We can assume a shift is 'fulfilled' if it has an associated BookShift entry.
  const fulfilledShifts = await prisma.shift.count({
    where: {
      userId,
      BookShift: {
          some: {
            status: "COMPLETED"
        }, 
      },
    },
  });

  // Calculate the fulfillment rate
  const fulfillmentRate =
    totalShifts > 0 ? (fulfilledShifts / totalShifts) * 100 : 0;

  return Promise.resolve({
    totalShifts,
    pendingShifts,
    activeShifts,
    completedShifts,
    fulfillmentRate, 
  });
};

export const metricsService = {
  getAdminOverviewMetrics,
  getOrganizerOverviewMetrics,
};
