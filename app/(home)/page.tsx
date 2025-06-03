import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import SummaryCards from "./_components/summary-cards";
import TimeSelect from "./_components/time-select";
import TransactionsPieChart from "./_components/transactions-pie-chart";
import { getDashboard } from "../_data/get-dashboard";
import ExpensesPerCategory from "./_components/expenses-per-category";
import LastTransactions from "./_components/last-transactions";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";
import AiReportButton from "./_components/ai-report-button";

interface HomeProps {
  searchParams: {
    month?: string;
  };
}

export const dynamic = "force-dynamic"; // força renderização dinâmica

const Home = async ({ searchParams }: HomeProps) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login"); // garante redirecionamento seguro
  }

  // Mês atual com zero à esquerda
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");

  // Validação segura do parâmetro month
  const isValidMonth = searchParams.month && /^\d{2}$/.test(searchParams.month);
  const selectedMonth = isValidMonth ? searchParams.month! : currentMonth;

  try {
    const dashboard = await getDashboard(selectedMonth);
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
              <AiReportButton month={selectedMonth} hasPremiumPlan={hasPremiumPlan} />
              <TimeSelect />
            </div>
          </div>
          <div className="grid h-full grid-cols-[2fr,1fr] gap-6 overflow-hidden">
            <div className="flex flex-col gap-6 overflow-hidden">
              <SummaryCards
                despositsTotal={dashboard.depositsTotal}
                month={selectedMonth}
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
    console.error("Erro ao carregar o dashboard:", err);
    return (
      <p className="text-red-500 p-4">
        Erro ao carregar dados. Tente novamente mais tarde.
      </p>
    );
  }
};

export default Home;
