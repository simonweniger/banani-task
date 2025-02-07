import { z } from "zod";

// here i create an extendable zod schema so we can pass in any zod schmema as a content
export const createMessageContentSchema = <T extends z.ZodTypeAny>(designSchema: T) => z.object({
    design: designSchema.optional(),
    message: z.string(),
}).required();

export const MessageContentSchema = createMessageContentSchema(z.any());

export const MessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: MessageContentSchema
});

export type Message = z.infer<typeof MessageSchema>;
