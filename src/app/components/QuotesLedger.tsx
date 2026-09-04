import type { DollarQuote } from "../lib/types";
import { formatARS, relativeTime } from "../lib/format";

const labels: Record<string, string> = { oficial: "Oficial", blue: "Blue", bolsa: "MEP (Bolsa)", contadoconliqui: "CCL (Contado con liqui)", mayorista: "Mayorista", tarjeta: "Tarjeta", cripto: "Cripto" };

export function QuotesLedger({ quotes, error }: { quotes: DollarQuote[]; error: string | null }) {
  const official = quotes.find((quote) => quote.casa === "oficial");
  const others = quotes.filter((quote) => !["oficial", "blue"].includes(quote.casa)).sort((a, b) => a.venta - b.venta);
  return <section aria-labelledby="quotes-title"><h2 className="section-title" id="quotes-title">Otras cotizaciones del dólar</h2><div className="ledger"><div className="ledger__head"><span>Casa</span><span>Compra</span><span>Venta</span><span>Vs. oficial</span><span>Actualizado</span></div><div className="ledger__body">{others.length ? others.map((quote) => { const gap = official ? ((quote.venta - official.venta) / official.venta) * 100 : null; return <div className="ledger__row" key={quote.casa}><span className="ledger__name">{labels[quote.casa] ?? quote.nombre}</span><span className="ledger__num">{formatARS(quote.compra)}</span><span className="ledger__num">{formatARS(quote.venta)}</span><span className="ledger__gap">{gap == null ? "-" : `${gap >= 0 ? "+" : ""}${gap.toFixed(1)}%`}</span><span className="ledger__age">{relativeTime(quote.fechaActualizacion)}</span></div>; }) : <div className="state-message">{error ?? "No hay más cotizaciones disponibles por ahora."}</div>}</div></div></section>;
}
