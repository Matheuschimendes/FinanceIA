"use server";

import { db } from "@/app/_lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Groq } from "groq-sdk";
import { genereteAiRepostSchema } from "./schema";

const getMonthName = (month: string) => {
  const monthIndex = parseInt(month.padStart(2, "0"), 10) - 1;
  const formatter = new Intl.DateTimeFormat("pt-BR", { month: "long" });
  return formatter.format(new Date(2024, monthIndex, 1));
};

export const genereteAiRepost = async ({ month }: genereteAiRepostSchema) => {
  genereteAiRepostSchema.parse({ month });

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Não autenticado");
  }

  const user = await clerkClient().users.getUser(userId);
  const hasPremiumPlan = user.publicMetadata.subscriptionPlan === "premium";

  if (!hasPremiumPlan) {
    throw new Error("Você precisa de um plano premium para gerar relatórios de IA");
  }

  const groqAi = new Groq({ apiKey: process.env.GROQAI_API_KEY! });

  const year = new Date().getFullYear();
  const monthFormatted = month.padStart(2, "0");
  const startDate = new Date(`${year}-${monthFormatted}-01`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  const transactions = await db.transaction.findMany({
    where: {
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
  });

  if (transactions.length === 0) {
    throw new Error("Nenhuma transação encontrada para o mês selecionado.");
  }

  const nomeMes = getMonthName(month);

  const content = `Gere um relatório com insights sobre as minhas finanças referentes ao mês de ${nomeMes} de ${year}, 
com dicas e orientações de como melhorar minha vida financeira. 
As transações estão divididas por ponto e vírgula. 
A estrutura de cada uma é {DATA}-R$VALOR-{TIPO}-{CATEGORIA}. São elas:
${transactions
    .map(
      (t) =>
        `${t.date.toLocaleDateString("pt-BR")}-R$${t.amount}-${t.type}-${t.category}`
    )
    .join(";")}`;

  const completion = await groqAi.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "Você é um especialista em gestão e organização de finanças pessoais. Você ajuda as pessoas a organizarem melhor suas finanças.",
      },
      {
        role: "user",
        content,
      },
    ],
  });

  return completion.choices[0]?.message.content ?? "Erro ao gerar relatório";
};
