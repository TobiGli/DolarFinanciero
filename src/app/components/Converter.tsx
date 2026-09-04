"use client";

import { useState } from "react";
import { ShareButton } from "./ShareButton";
import type { DollarQuote } from "../lib/types";
import { formatARS } from "../lib/format";

export function Converter({ quotes }: { quotes: DollarQuote[] }) {
  const [amount, setAmount] = useState("100");
  const [house, setHouse] = useState(quotes.find((quote) => quote.casa === "blue")?.casa ?? quotes[0]?.casa ?? "");
  const value = Number(amount);
  const quote = quotes.find((item) => item.casa === house);
  return <section aria-labelledby="converter-title"><h2 className="section-title" id="converter-title">Conversor rápido</h2><div className="converter__card"><div className="converter__field"><label htmlFor="convAmount">Monto en dólares</label><input id="convAmount" type="number" inputMode="decimal" min="0" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} /></div><div className="converter__field"><label htmlFor="convHouse">Cotización a usar</label><select id="convHouse" value={house} onChange={(event) => setHouse(event.target.value)}>{quotes.map((item) => <option value={item.casa} key={item.casa}>{item.nombre}</option>)}</select></div><div className="converter__result"><div className="amount">{quote && Number.isFinite(value) ? formatARS(value * quote.compra) : "-"}</div><div className="caption">recibís si vendés esos dólares</div><div className="amount">{quote && Number.isFinite(value) ? formatARS(value * quote.venta) : "-"}</div><div className="caption">necesitás para comprarlos</div>{quote && Number.isFinite(value) ? <ShareButton title="Conversión de dólares" text={`${amount} USD en ${quote.nombre}: recibís ${formatARS(value * quote.compra)} o necesitás ${formatARS(value * quote.venta)}`} /> : null}</div></div></section>;
}
