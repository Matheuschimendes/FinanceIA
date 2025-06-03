import { db } from "@/app/_lib/prisma";
import { TransactionType } from "@prisma/client";
import type { TotalExpensePerCategory, TransactionPercentagePerType } from "./types";
import { auth } from "@clerk/nextjs/server";

export const getDashboard = async (month: string) => {

  // Verificar se o usuário está logado
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  } 
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
    // Filtrando apenas as transações do usuário logado
    userId,
    // Filtrando apenas as transações do mês atual
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
 
   // Calculando os investimentos
   const investimentsTotal = Number(
     (await db.transaction.aggregate({
       where: { ...where, type: "INVESTMENT" },
       _sum: { amount: true },
     }))?._sum?.amount || 0
   );

   // Calculando as despesas
   const expensesTotal = Number(
     (await db.transaction.aggregate({
       where: { ...where, type: "EXPENSE" },
       _sum: { amount: true },
     }))?._sum?.amount || 0
   );
 
   // Calculando o saldo
   const balance = depositsTotal + investimentsTotal - expensesTotal;
 
   // Calculando o total de transações
   const transactionTotal = Number(
    (await db.transaction.aggregate({
     where,
     _sum: { amount: true },
   }))._sum?.amount,
  );
 
   // Calculando a porcentagem de transações por tipo
   const typesPercentage: TransactionPercentagePerType = {
     [TransactionType.DEPOSIT]: Math.round(
       (Number(depositsTotal|| 0)) / Number(transactionTotal) * 100,
     ),
     [TransactionType.INVESTMENT]: Math.round(
       (Number(investimentsTotal || 0)) / Number(transactionTotal) * 100,
     ),
     [TransactionType.EXPENSE]: Math.round(
       (Number(expensesTotal|| 0)) / Number(transactionTotal) * 100,
     ),
    };

    // Calculando a porcentagem de despesas por categoria
    const totalExpensePerCategory: TotalExpensePerCategory[] = (
      await db.transaction.groupBy({
        by: ["category"],
        where: {
          ...where,
          type: TransactionType.EXPENSE,
        },
        _sum: {
          amount: true,
        },
      })
    ).map((category) => ({
      category: category.category,
      totalAmount: Number(category._sum.amount),
      percentageOfTotal: Math.round(
        (Number(category._sum.amount) / Number(expensesTotal)) * 100,
      ),
    }));

    // Obtendo as 10 transações mais recentes
    const lastTransaction = await db.transaction.findMany({
      where,
      orderBy: {
        date: "desc",
      },
      take: 10,
    });

    return {
     balance,
     depositsTotal,
     investimentsTotal,
     expensesTotal,
     typesPercentage,
     totalExpensePerCategory,
     lastTransaction: JSON.parse(JSON.stringify(lastTransaction)),
     
   }
  };