import { z } from "zod";

 const NotificationSchema = z.object({
    body: z.object({
        name: z.string(),
    }),
});

const UpdateNotificationSchema = z.object({
    body: z.object({
        name: z.string(),
    }),
});
export const NotificationValidation = {
     NotificationSchema,
     UpdateNotificationSchema
};
