import { db } from "../_lib/prisma";
import { DataTable } from "../_components/ui/data-table";
import { transaciontColumns } from "./_columns";
import UpsertTransactionButton from "../_components/add-transaction-button";
import Navbar from "../_components/navbar";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";

const TransactionsPages = async () => {
  // Verificar se o usuário está logado
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }


  // Buscar apenas as transações do usuário logado
  const transactions = await db.transaction.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      date: "desc", // opcional: ordena por data decrescente
    },
  });

  const userCanAddTransaction = await canUserAddTransaction();

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-6">
        {/* Título e botão */}
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Transações</h1>
          <UpsertTransactionButton userCanAddTransaction={userCanAddTransaction} />
        </div>
        {/* Tabela de dados */}
        <DataTable columns={transaciontColumns} data={transactions} />
      </div>
    </>
  );
};

export default TransactionsPages;
