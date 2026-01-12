"use client";

import { BiDollar, BiTrendingDown, BiTrendingUp } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import { transactions as transactionService } from '@grupo21/shared-react';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);

type CardType = "balance" | "monthlyIncome" | "monthlyExpenses";

type CardProps = {
  amount: number;
  type: CardType;
};

type BalanceCardProps = {};

export default function BalanceCard({ }: BalanceCardProps) {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;

  const { onTransationsByMonth } = transactionService;
  console.log('transactionService: ', transactionService)
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onTransationsByMonth(y, m, setTransactions);
    return () => unsub();
  }, [y, m]);

  const deposits = transactions.filter((t) => t.type === "deposito");
  const withdrawals = transactions.filter((t) => t.type === "saque");

  const totalDeposits = deposits.reduce((sum, t) => sum + t.value, 0);
  const totalWithdrawals = withdrawals.reduce((sum, t) => sum + t.value, 0);
  const balance = totalDeposits - totalWithdrawals;

  const currentMonth = new Date().getMonth();
  const monthlyIncome = deposits
    .filter((t) => new Date(t.date).getMonth() === currentMonth)
    .reduce((sum, t) => sum + t.value, 0);

  const totalIncome = deposits.reduce((sum, t) => sum + t.value, 0);

  const monthlyExpenses = withdrawals
    .filter((t) => new Date(t.date).getMonth() === currentMonth)
    .reduce((sum, t) => sum + t.value, 0);

  const totalExpenses = withdrawals.reduce((sum, t) => sum + t.value, 0);

  function Card({ amount, type }: CardProps) {
    const getCaption = (filterType: "deposito" | "saque") => {
      const count = transactions.filter(
        (t) =>
          t.type === filterType &&
          new Date(t.date).getMonth() === new Date().getMonth()
      ).length;
      return count === 1 ? "1 transação" : `${count} transações`;
    };

    const colorsByType = {
      balance: {
        bg: "bg-blue-100",
        text: "text-blue-500",
        icon: BiDollar,
        title: "Saldo Atual",
        caption: "Conta corrente",
      },
      monthlyIncome: {
        bg: "bg-green-100",
        text: "text-green-600",
        icon: BiTrendingUp,
        title: "Entradas do mês",
        caption: getCaption("deposito"),
      },
      monthlyExpenses: {
        bg: "bg-red-100",
        text: "text-red-500",
        icon: BiTrendingDown,
        title: "Saídas do mês",
        caption: getCaption("saque"),
      },
    };

    const { bg, text, icon: Icon, title, caption } = colorsByType[type];

    return (
      <section className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 w-full transition hover:shadow-md">
        <div className="flex flex-row justify-between items-center pb-3">
          <p className="text-sm text-gray-600 font-semibold">{title}</p>

          <div className={`rounded-2xl p-2 ${bg}`}>
            {/* <Icon className={`h-5 w-5 ${text}`} /> */}
            <Icon />
          </div>
        </div>

        <div className={`text-2xl font-bold ${type !== "balance" ? text : ""}`}>
          {formatCurrency(amount)}
        </div>

        <p className="text-xs text-gray-500 opacity-80 mt-2">{caption}</p>
      </section>
    );
  }

  console.log('transactions: ', transactions)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full mt-5">
      <>
        <Card type="balance" amount={balance} />
        <Card type="monthlyIncome" amount={monthlyIncome} />
        <Card type="monthlyExpenses" amount={monthlyExpenses} />
      </>
    </div>
  );
}
