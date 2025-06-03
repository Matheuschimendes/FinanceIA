import { z } from "zod";

export const deleteTransactionShema = z.object({
  transactionId: z.string().uuid()
})

export type DeleteTransactionSchema = z.infer<typeof deleteTransactionShema>