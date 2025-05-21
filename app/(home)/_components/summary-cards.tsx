import {
  PiggyBankIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";
import SummaryCard from "./summary-card";
import { db } from "@/app/_lib/prisma";

interface SummaryCards {
  month: string; // Mês passado como parâmetro (ex: '01', '02', etc.)
}

const SummaryCards = async ({ month }: SummaryCards) => {
  // Validação do mês
  const parsedMonth = Number(month);
  if (isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
    throw new Error("Mês inválido");
  }

  // Obtendo o ano atual dinamicamente
  const currentYear = new Date().getFullYear();

  // Calculando as datas de início e fim do mês com base no ano e mês fornecido
  const startDate = new Date(currentYear, parsedMonth - 1, 1); // 1º dia do mês
  const endDate = new Date(currentYear, parsedMonth, 1);       // 1º dia do próximo mês

  // Definindo o filtro para o Prisma
  const where = {
    date: {
      gte: startDate,  // Maior ou igual ao 1º dia do mês
      lt: endDate,     // Menor que o 1º dia do próximo mês
    },
  };

  // Consultando as transações por tipo e somando os valores
  const depositsTotal = Number(
    (await db.transaction.aggregate({
      where: { ...where, type: "DEPOSIT" },
      _sum: { amount: true },
    }))?._sum?.amount || 0
  );

  const investimentsTotal = Number(
    (await db.transaction.aggregate({
      where: { ...where, type: "INVESTMENT" },
      _sum: { amount: true },
    }))?._sum?.amount || 0
  );

  const expensesTotal = Number(
    (await db.transaction.aggregate({
      where: { ...where, type: "EXPENSE" },
      _sum: { amount: true },
    }))?._sum?.amount || 0
  );

  // Calculando o saldo
  const balance = depositsTotal + investimentsTotal - expensesTotal;

  return (
    <div className="space-y-6 pt-5">
      {/* Card de Saldo */}
      <SummaryCard
        icon={<WalletIcon size={16} />}
        title="Saldo"
        amount={balance}
        size={"lage"}
      />
      <div className="grid grid-cols-3 gap-6">
        {/* Card de Investidos */}
        <SummaryCard
          icon={<PiggyBankIcon size={14} />}
          title="Investidos"
          amount={investimentsTotal}
          size={"small"}
        />
        {/* Card de Receita */}
        <SummaryCard
          icon={<TrendingUpIcon size={16} className="text-primary" />}
          title="Receita"
          amount={depositsTotal}
          size={"small"}
        />
        {/* Card de Despesas */}
        <SummaryCard
          icon={<TrendingDownIcon size={16} className="text-danger" />}
          title="Despesas"
          amount={expensesTotal}
          size={"small"}
        />
      </div>
    </div>
  );
};

export default SummaryCards;
