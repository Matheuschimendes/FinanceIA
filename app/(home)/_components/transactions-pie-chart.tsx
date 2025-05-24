"use client"

import { Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
} from "@/app/_components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/_components/ui/chart"
import { TransactionType } from "@prisma/client"
import type { TransactionPercentagePerType } from "@/app/_data/get-dashboard/type"
import { PiggyBankIcon, TrendingDownIcon, TrendingUpIcon, } from "lucide-react"
import ParcentageItem from "./parcentage-item"

const chartConfig = {
  [TransactionType.INVESTMENT]: {
    label: "Investimento",
    color: "#FFFFFF",
  },
  [TransactionType.DEPOSIT]: {
    label: "Receita",
    color: "#55B02E",
  },
  [TransactionType.EXPENSE]: {
    label: "Despesa",
    color: "#E93030",
  },
} satisfies ChartConfig

interface TransactionsPieChartProps {
  typesPercentage: TransactionPercentagePerType;
  depositsTotal: number;
  investimentsTotal: number;
  expensesTotal: number;

}

const TransactionsPieChart = ({ depositsTotal, investimentsTotal, expensesTotal, typesPercentage }: TransactionsPieChartProps) => {
  const chartData = [
    {
      type: TransactionType.DEPOSIT,
      amount: depositsTotal,
      fill: "#55B02E",
    },
    {
      type: TransactionType.EXPENSE,
      amount: expensesTotal,
      fill: "#E93030",
    },
    {
      type: TransactionType.INVESTMENT,
      amount: investimentsTotal,
      fill: "#FFFFFF",
    },

  ].filter((item) => item.amount > 0); // Remove valores 0

  return (
    <Card className="flex flex-col p-3">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[255px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="type"
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>
        <div className="space-y-2">
          <ParcentageItem
            icon={<TrendingUpIcon size={16} className="text-primary" />}
            title="Receitas"
            value={typesPercentage[TransactionType.DEPOSIT]}
          />
          <ParcentageItem
            icon={<PiggyBankIcon size={14} />}
            title="Investimentos"
            value={typesPercentage[TransactionType.INVESTMENT]}
          />
          <ParcentageItem
            icon={<TrendingDownIcon size={16} className="text-danger" />}
            title="Despesas"
            value={typesPercentage[TransactionType.EXPENSE]}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default TransactionsPieChart;
