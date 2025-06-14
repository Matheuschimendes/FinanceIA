import AddTransactionButton from "@/app/_components/add-transaction-button";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import type { ReactNode } from "react";

interface SummaryCardProps {
  icon: ReactNode;
  title: string;
  amount: number;
  size?: "small" | "large";
  userCanAddTransactions: boolean;
}

const SummaryCard = ({ icon, title, amount, size = "small", userCanAddTransactions }: SummaryCardProps) => {
  return (
    <>
      {/* Card */}
      <Card className={`${size === "small" ? "bg-white bg-opacity-5" : ""}`}>
        <CardHeader className="flex flex-row items-center gap-4 ">
          <div className="bg-white bg-opacity-[3%] rounded-lg p-2">
            {icon}
          </div>
          <p className={
            `${size === "small" ? "text-muted-foreground " : "text-white opacity-70"}`
          }>
            {title}
          </p>
        </CardHeader>

        <CardContent className="flex justify-between">
          <p className={
            `font-bold${size === "small" ? "text-2xl" : "text-4xl"
            }`
          }>
            {Intl.NumberFormat(
              "pt-BR",
              {
                style: "currency",
                currency: "BRL",
              }).format(
                Number(amount)
              )}
          </p>

          {size === "large" && (
            <AddTransactionButton userCanAddTransaction={userCanAddTransactions} />)}
        </CardContent>
      </Card>
    </>
  );
}

export default SummaryCard;