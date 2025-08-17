import { z } from "zod";

const ShiftSchema = z.object({
  body: z.object({
    role: z.string(),
    location: z.string(),
    date: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    payAmount: z.number(),
    vacancy: z.number().min(1, "Vacancy must be at least 1").optional(),
    description: z.string(),
    isUrgent: z.boolean().optional(),
  }),
});

const UpdateShiftSchema = z.object({
  body: z.object({
    role: z.string().optional(),
    location: z.string().optional(),
    date: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    payAmount: z.number().optional(),
    vacancy: z.number().min(1, "Vacancy must be at least 1").optional(),
    description: z.string().optional(),
    isUrgent: z.boolean().optional(),
  }),
});
export const ShiftValidation = {
  ShiftSchema,
  UpdateShiftSchema,
};
