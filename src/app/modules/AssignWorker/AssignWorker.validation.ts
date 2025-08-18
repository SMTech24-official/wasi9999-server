import { z } from "zod";

 const AssignWorkerSchema = z.object({
    body: z.object({
        name: z.string(),
    }),
});

const UpdateAssignWorkerSchema = z.object({
    body: z.object({
        name: z.string(),
    }),
});
export const AssignWorkerValidation = {
     AssignWorkerSchema,
     UpdateAssignWorkerSchema
};
