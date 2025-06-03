"use server";

import { db } from "@/app/_lib/prisma";
import type { DeleteTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";

export const deleteTransaction = async ({ transactionId}: DeleteTransactionSchema) => {
  await db.transaction.delete({
    where: {
      id: transactionId
    }
  });
  revalidatePath("/transactions");
  revalidatePath("/");
};