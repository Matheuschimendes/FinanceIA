import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import SummaryCards from "./_components/summary-cards";
import TimeSelect from "./_components/time-select";
import { isMatch } from "date-fns";
import TransactionsPieChart from "./_components/transactions-pie-chart";
import { getDashboard } from "../_data/get-dashboard";
import ExpensesPerCategory from "./_components/expenses-per-category";
import LastTransactions from "./_components/last-transactions";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";
import AiReportButton from "./_components/ai-report-button";
import MobileMenu from "../_components/mobile-menu";

interface HomeProps {
  searchParams: {
    month: string;
  };
}

const Home = async ({ searchParams: { month } }: HomeProps) => {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");

  if (!month || !isMatch(month, "MM")) {
    redirect(`?month=${currentMonth}`);
  }

  const dashboard = await getDashboard(month);
  const userCanAddTransaction = await canUserAddTransaction();
  const user = await clerkClient().users.getUser(userId);

  return (
    <>
      {/* Navbar fixa no topo */}
      <div className="">
        <Navbar />
      </div>

      {/* Conteúdo com padding para compensar Navbar e MobileMenu */}
      <div className=" pb-20 ">
        <div className="space-y-6 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <AiReportButton
                month={month}
                hasPremiumPlan={
                  user.publicMetadata.subscriptionPlan === "premium"
                }
              />
              <TimeSelect />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[2fr,1fr] gap-6">
            <div className="flex flex-col gap-6">
              <SummaryCards
                despositsTotal={dashboard.depositsTotal}
                month={month}
                {...dashboard}
                userCanAddTransactions={userCanAddTransaction}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <TransactionsPieChart {...dashboard} />
                <ExpensesPerCategory
                  expensesPerCategory={dashboard.totalExpensePerCategory}
                />
              </div>
            </div>
            <LastTransactions lastTransactions={dashboard.lastTransaction} />
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

export default Home;
