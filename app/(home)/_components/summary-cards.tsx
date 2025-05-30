import {
  PiggyBankIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";
import SummaryCard from "./summary-card";

interface SummaryCards {
  month: string; // Mês passado como parâmetro (ex: '01', '02', etc.)
  balance: number;
  despositsTotal: number;
  investimentsTotal: number;
  expensesTotal: number;
  userCanAddTransactions: boolean;
}

const SummaryCards = async ({ balance, despositsTotal, investimentsTotal, expensesTotal, userCanAddTransactions }: SummaryCards) => {

  return (
    <div className="space-y-6 pt-5">
      {/* Card de Saldo */}
      <SummaryCard
        icon={<WalletIcon size={16} />}
        title="Saldo"
        amount={balance}
        size={"large"}
        userCanAddTransactions={userCanAddTransactions}
      />
      <div className="grid grid-cols-3 gap-6">
        {/* Card de Investidos */}
        <SummaryCard
          icon={<PiggyBankIcon size={16} />}
          title="Investidos"
          amount={investimentsTotal}
          size={"small"}
          userCanAddTransactions={userCanAddTransactions}
        />
        {/* Card de Receita */}
        <SummaryCard
          icon={<TrendingUpIcon size={16} className="text-primary" />}
          title="Receita"
          amount={despositsTotal}
          size={"small"}
          userCanAddTransactions={userCanAddTransactions}
        />
        {/* Card de Despesas */}
        <SummaryCard
          icon={<TrendingDownIcon size={16} className="text-danger" />}
          title="Despesas"
          amount={expensesTotal}
          size={"small"}
          userCanAddTransactions={userCanAddTransactions}
        />
      </div>
    </div>
  );
};

export default SummaryCards;
