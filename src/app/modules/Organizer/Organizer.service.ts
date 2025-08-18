import prisma from "../../../shared/prisma";
;


const getUserOrganizer = async (workerId: string) => {
  const organizers = await prisma.user.findMany({
    where: {
      role: "ORGANIZER",

      AssignWorker: {
        some: {
          bookShift: {
            userId: workerId,
          },
        },
      },
    },
    // Select only the data needed for the list
    select: {
      id: true,
      fullName: true,
      profileImage: true,
      // You can add other relevant fields here
    },
  });
};

const getShiftByOrganizer = async (organizerId: string, workerId: string) => {
    const shiftsForOrganizer = await prisma.shift.findMany({
      where: {
        // Condition 1: Find shifts that were assigned by the specific organizer
        user: {
          id: organizerId,
          role: "ORGANIZER",
        },
        // Condition 2: Find shifts that were booked by the current worker
        BookShift: {
          some: {
            userId: workerId,
            // Optional: you can filter by status, e.g., 'ASSIGNED' or 'COMPLETED'
            // status: 'ASSIGNED',
          },
        },
      },
      // Include any other details you need for the list view
      include: {
        BookShift: {
          where: { userId: workerId }, // To only get the book shift details for the current user
          select: {
            status: true,
            AssignWorker: {
              select: {
                paymentStatus: true,
              },
            },
          },
        },
      },
    });

}
export const organizerService = {
    getUserOrganizer,
    getShiftByOrganizer
};
