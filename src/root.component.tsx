import "./root.styles.css"
import BalanceCard from './app/screens/balance'
import { FiPlus } from "react-icons/fi";
import { useEffect, useState } from "react";
import { transactions as transactionService } from '@grupo21/shared-react';
import { TransactionRow } from "./app/screens/components/transaction-rows";

export default function Root(props) {
  const [transactions, setTransactions] = useState([])
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const { onTransationsByMonth } = transactionService;

  useEffect(() => {
    let unsub: (() => void) | undefined;

    onTransationsByMonth(y, m, setTransactions).then((unsubscribe) => {
      unsub = unsubscribe;
    });

    return () => {
      if (unsub) unsub();
    };
  }, [y, m]);

  return (
    <div className="p-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold leading-tight text-slate-900">
            Olá, nome!
          </h1>
          <p className="text-base text-slate-500 font-bold">
            Gerencie suas finanças de forma simples e eficiente
          </p>
        </div>
      </div>

      <BalanceCard />

      <section className="rounded-2xl border border-gray-200 p-5 my-5">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Nova Transação</h2>
            <p className="text-sm text-gray-600">
              Adicione uma nova transação à sua conta
            </p>
          </div>

          <div>
            <button className="w-full md:w-auto shrink-0 button-primary">
              <span className="inline-flex items-center justify-center gap-2">
                <FiPlus aria-hidden />
                Adicionar Transação
              </span>
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 p-5 my-5 w-full">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-1 w-full">
            <h2 className="text-lg font-semibold">Últimas transações</h2>
            {transactions.length === 0 ? (
              <p className="text-sm text-gray-600">
                (sem transações)
              </p>
            ) : (
              <ul>
                {transactions.map((t) => (
                  <TransactionRow t={t} key={t.id} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
