import { ArrowDownUpIcon } from "lucide-react";
import { Button } from "../_components/ui/button";
import { db } from "../_lib/prisma";
import { DataTable } from "../_components/ui/data-table";
import { transaciontColumns } from "./_columns";

const TransactionsPages = async () => {

  // acessar as transições do banco de dados
  const transactions = await db.transaction.findMany({})
  return (
    <div className="p-6 space-y-6">
      {/* TITULO DO BOTÃO */}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Transação</h1>
        <Button className=" text-cyan-50 rounded-full font-bold">
          Adicionar transação
          <ArrowDownUpIcon />
        </Button>
      </div>
      <DataTable columns={transaciontColumns} data={transactions} />
    </div>
  );
}

export default TransactionsPages;