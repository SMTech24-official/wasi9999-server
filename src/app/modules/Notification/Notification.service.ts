import prisma from "../../../shared/prisma";
import { fcm } from "../../lib/firebase";

export const NotificationService = {
  // Save token for a user
  async saveToken(userId: string, token: string) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        fcmToken: token,
      },
    });
  },

  // Send notification to one user
  async sendToUser(userId: string, title: string, body: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId, shifAlert: true },
    });

    if (!user || !user.fcmToken) {
      console.log("No tokens found for user", userId);
      return;
    }

    const message = {
      notification: { title, body },
      tokens: user.fcmToken,
      condition: `'${user.fcmToken}' in topics`,
    };

    const response = await fcm.send(message);
    console.log("Notification sent:", response);
  },

  // Send broadcast notification to all users
  async sendToAll( title: string, body: string) {
    const users = await prisma.user.findMany({
      where: { fcmToken: { not: null }, role: "USER" },
    });

    if (!users.length) {
      console.log("No users found with tokens");
      return;
    }

    const fcmTokens = users.map((u) => u.fcmToken!);

    const message = {
      notification: { title, body },
      tokens: fcmTokens,
    };

    const response = await fcm.sendEachForMulticast(message);
    console.log("Broadcast sent:", response);

    const failedTokens = response.responses
      .map((res, idx) => (!res.success ? fcmTokens[idx] : null))
      .filter((token): token is string => token !== null);

    const successIndices = response.responses
      .map((res, idx) => (res.success ? idx : null))
      .filter((idx) => idx !== null) as number[];

    const successfulUsers = successIndices.map((idx) => users[idx]);

    // await Promise.all(
    //   successfulUsers.map((user) =>
    //     prisma.notification.create({
    //       data: {
    //         userId: user.id,
    //         entityId: user.id,
    //         title: req.body.title,
    //         body: req.body.body,
    //       },
    //     })
    //   )
    // );

    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
      failedTokens,
    };
  },
};

// export const createShift = async (req, res) => {
//   const data = req.body;

//   const shift = await prisma.shift.create({ data });

//   // send push notification to all users
//   await NotificationService.sendToAll(
//     "New Shift Available!",
//     `Role: ${shift.role} at ${shift.location}`
//   );

//   res.json({ success: true, shift });
// };

// export const bookShift = async (req, res) => {
//   const { userId, shiftId } = req.body;

//   const booking = await prisma.bookShift.create({
//     data: { userId, shiftId },
//   });

//   // notify shift owner
//   const shift = await prisma.shift.findUnique({ where: { id: shiftId } });
//   if (shift) {
//     await NotificationService.sendToUser(
//       shift.userId,
//       "Your shift got a booking!",
//       "A worker just applied to your shift."
//     );
//   }

//   res.json({ success: true, booking });
// };
