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

interface HomeProps {
  searchParams: {
    month: string;
  };
}

export const dynamic = "force-dynamic"; // <- adicionado aqui

const Home = async ({ searchParams: { month } }: HomeProps) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      redirect("/login");
    }

    const monthIsInvalid = !month || !isMatch(month, "MM");
    if (monthIsInvalid) {
      redirect(`?month=0${new Date().getMonth() + 1}`);
    }

    const dashboard = await getDashboard(month);
    const userCanAddTransaction = await canUserAddTransaction();

    let hasPremiumPlan = false;

    try {
      const user = await clerkClient().users.getUser(userId);
      hasPremiumPlan = user.publicMetadata.subscriptionPlan === "premium";
    } catch (err) {
      console.error("Erro ao buscar dados do usuário via Clerk:", err);
    }

    return (
      <>
        <Navbar />
        <div className="p-8 overflow-hidden flex flex-col">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex items-center gap-6">
              <AiReportButton month={month} hasPremiumPlan={hasPremiumPlan} />
              <TimeSelect />
            </div>
          </div>
          <div className="grid h-full grid-cols-[2fr,1fr] gap-6 overflow-hidden">
            <div className="flex flex-col gap-6 overflow-hidden">
              <SummaryCards
                despositsTotal={dashboard.depositsTotal}
                month={month}
                {...dashboard}
                userCanAddTransactions={userCanAddTransaction}
              />
              <div className="grid h-full grid-cols-3 grid-rows-1 gap-6 overflow-hidden">
                <TransactionsPieChart {...dashboard} />
                <ExpensesPerCategory
                  expensesPerCategory={dashboard.totalExpensePerCategory}
                />
              </div>
            </div>
            <LastTransactions lastTransactions={dashboard.lastTransaction} />
          </div>
        </div>
      </>
    );
  } catch (err) {
    console.error("Erro ao carregar página Home:", err);
    redirect("/login");
  }
};

export default Home;
