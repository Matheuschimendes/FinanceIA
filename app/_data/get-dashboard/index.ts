import { db } from "@/app/_lib/prisma";
import { TransactionType } from "@prisma/client";
import type { TransactionPercentagePerType } from "./type";

export const getDashboard = async (month: string) => {
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
    }
    return {
     balance,
     depositsTotal,
     investimentsTotal,
     expensesTotal,
     transactionTotal,
     typesPercentage
   }
  };