import { z } from "zod";

export const MessageContentSchema = z.object({
    design: z.string(),
    message: z.string(),
}).required();

export const MessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: MessageContentSchema
});

export type Message = z.infer<typeof MessageSchema>;
