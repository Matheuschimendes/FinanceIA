import { db } from "../_lib/prisma";
import { DataTable } from "../_components/ui/data-table";
import { transactionColumns } from "./_columns";
import UpsertTransactionButton from "../_components/add-transaction-button";
import Navbar from "../_components/navbar";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";
import MobileMenu from "../_components/mobile-menu";

const TransactionsPages = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const transactions = await db.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  const userCanAddTransaction = await canUserAddTransaction();

  return (
    <>
      {/* Navbar fixa no topo */}
      <div className="">
        <Navbar />
      </div>

      {/* Conteúdo com padding para navbar e menu móvel */}
      <div className="pb-20 h-screen overflow-y-auto">
        <div className="p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-xl sm:text-2xl font-bold">Transações</h1>
            <UpsertTransactionButton userCanAddTransaction={userCanAddTransaction} />
          </div>

          {/* Tabela com scroll horizontal no mobile */}
          <div className="overflow-x-auto w-full">
            <DataTable
              columns={transactionColumns}
              data={JSON.parse(JSON.stringify(transactions))}
            />
          </div>
        </div>
      </div>

      {/* MobileMenu fixo no rodapé */}
      <div className="fixed bottom-0 left-0 w-full z-50">
        <MobileMenu />
      </div>
    </>
  );
};

export default TransactionsPages;
