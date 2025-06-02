import { isMatch } from "date-fns";
import { z } from "zod";

export const genereteAiRepostSchema = z.object({
  month: z.string().refine(value => isMatch(value, "MM"))
})

export type genereteAiRepostSchema = z.infer<typeof genereteAiRepostSchema>;