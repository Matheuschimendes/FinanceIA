import { db } from "../_lib/prisma";
import { DataTable } from "../_components/ui/data-table";
import { transaciontColumns } from "./_columns";
import UpsertTransactionButton from "../_components/add-transaction-button";
import Navbar from "../_components/navbar";

const TransactionsPages = async () => {

  // acessar as transições do banco de dados
  const transactions = await db.transaction.findMany({})
  return (
    <>
      <Navbar />
      <div className="p-6 space-y-6">
        {/* TITULO DO BOTÃO */}
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Transação</h1>
          <UpsertTransactionButton />
        </div>
        <DataTable columns={transaciontColumns} data={transactions} />
      </div>
    </>

  );
}

export default TransactionsPages;