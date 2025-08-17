import { z } from "zod";

 const BookShiftSchema = z.object({
    body: z.object({
        shiftId: z.string(),
    }),
});

const UpdateBookShiftSchema = z.object({
    body: z.object({
        name: z.string(),
    }),
});
export const BookShiftValidation = {
     BookShiftSchema,
     UpdateBookShiftSchema
};
