import type { DollarQuote } from "../lib/types";
import { formatARS } from "../lib/format";

const labels: Record<string, string> = { oficial: "Oficial", blue: "Blue", bolsa: "MEP", contadoconliqui: "CCL", mayorista: "Mayorista", tarjeta: "Tarjeta", cripto: "Cripto" };

export function Ticker({ quotes }: { quotes: DollarQuote[] }) {
  const items = quotes.map((quote) => `${labels[quote.casa] ?? quote.nombre} ${formatARS(quote.venta)}`);
  const display = items.length ? items : ["Cargando cotizaciones..."];
  return <div className="ticker" aria-label="Cotizaciones en movimiento" aria-live="polite"><div className="ticker__track">{[...display, ...display].map((item, index) => <span className="ticker__item" key={`${item}-${index}`}>{item}</span>)}</div></div>;
}
