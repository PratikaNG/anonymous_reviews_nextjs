import {z} from "zod";

export const messageSchema = z.object({
    content: z
    .string()
    .min(10,"Content must be atleast 10 characters")
    .min(300,"Content must not be more than 300 characters")

})