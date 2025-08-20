// import { fcm } from "./firebase";
// import prisma from "./prisma"; // your prisma client

// export const NotificationService = {
//   // Save token for a user
//   async saveToken(userId: string, token: string) {
//     await prisma.user.update({
//       where: { id: userId },
//       data: {
//         deviceTokens: {
//           push: token,
//         },
//       },
//     });
//   },

//   // Send notification to one user
//   async sendToUser(userId: string, title: string, body: string) {
//     const user = await prisma.user.findUnique({ where: { id: userId } });

//     if (!user || !user.deviceTokens.length) {
//       console.log("No tokens found for user", userId);
//       return;
//     }

//     const message = {
//       notification: { title, body },
//       tokens: user.deviceTokens,
//     };

//     const response = await fcm.sendMulticast(message);
//     console.log("Notification sent:", response);
//   },

//   // Send broadcast notification to all users
//   async sendToAll(title: string, body: string) {
//     const users = await prisma.user.findMany({
//       where: { deviceTokens: { isEmpty: false } },
//     });

//     const tokens = users.flatMap((u) => u.deviceTokens);

//     if (!tokens.length) {
//       console.log("No device tokens found");
//       return;
//     }

//     const message = {
//       notification: { title, body },
//       tokens,
//     };

//     const response = await fcm.sendMulticast(message);
//     console.log("Broadcast sent:", response);
//   },
// };
// import { NotificationService } from "./notification.service";
// import prisma from "./prisma";

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
// import { NotificationService } from "./notification.service";
// import prisma from "./prisma";

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
