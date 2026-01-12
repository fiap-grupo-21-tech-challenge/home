import { RiArrowRightDownLine, RiArrowRightUpLine } from "react-icons/ri";

export function TransactionRow({ t }: any) {
  const textColor =
    t?.type === "saque"
      ? "text-red-500"
      : t?.type === "deposito"
        ? "text-green-600"
        : "text-blue-500";

  const nfBRL = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <section
      key={t.id}
      // onClick={() => openView(t)}
      className="flex justify-between rounded-lg border border-gray-200 bg-white p-5  w-full transition hover:shadow-md mb-3 cursor-pointer"
    >
      <div className="flex items-center gap-2.5">
        {t?.type === "deposito" ? (
          <RiArrowRightUpLine className={textColor} />
        ) : (
          <RiArrowRightDownLine className={textColor} />
        )}

        <div>
          <p className="font-semibold">{t?.description}</p>
          <p className="opacity-60">
            {t.category} •{" "}
            {t.date.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
            })}
          </p>
        </div>
      </div>

      <div className="text-end">
        <h2 className={`font-bold ${textColor}`}>{nfBRL.format(t.value)}</h2>

        <div className="mt-1">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
            {t?.category}
          </span>
        </div>
      </div>
    </section>
  );
}