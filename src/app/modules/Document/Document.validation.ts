import { z } from "zod";

 const DocumentSchema = z.object({
    body: z.object({
        name: z.string(),
    }),
});

const UpdateDocumentSchema = z.object({
    body: z.object({
        name: z.string(),
    }),
});
export const DocumentValidation = {
     DocumentSchema,
     UpdateDocumentSchema
};
