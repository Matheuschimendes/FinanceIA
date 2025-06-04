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
  // Verifica se o usuário está autenticado
  const { userId } = await auth();
  // Se o usuário não estiver autenticado, redireciona para a tela de login
  if (!userId) {
    redirect("/login");
  }

  // Obtém o mês atual formatado como dois dígitos (ex: "03", "11")
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
  // Verifica se o mês fornecido é válido
  const monthIsInvalid = !month || !isMatch(month, "MM");
  // Se o mês for inválido, redireciona para o mês atual
  if (monthIsInvalid) {
    redirect(`?month=${currentMonth}`);
  }
  // Busca os dados do dashboard
  const dashboard = await getDashboard(month);
  // Verifica se o usuário pode adicionar transações
  const userCanAddTransaction = await canUserAddTransaction();
  // Busca os dados do usuário
  const user = await clerkClient().users.getUser(userId);

  return (
    <>
      <Navbar />
      {/* Conteúdo principal */}
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Botão de reporte AI */}
            <AiReportButton
              month={month}
              hasPremiumPlan={
                user.publicMetadata.subscriptionPlan === "premium"
              }
            />
            {/* Selecione o mês */}
            <TimeSelect />
          </div>
        </div>

        {/* Cartões de resumo */}
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
      <MobileMenu />
    </>
  );
};

export default Home;
