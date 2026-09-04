import type { DollarQuote } from "../lib/types";
import { formatARS, relativeTime } from "../lib/format";
import { ShareButton } from "./ShareButton";

function Panel({ quote, name, tone }: { quote?: DollarQuote; name: string; tone: "oficial" | "blue" }) {
  return <article className={`board__panel board__panel--${tone}`}><div className="board__title"><span>{name}</span>{quote ? <ShareButton title={`${name} hoy`} text={`${name}: compra ${formatARS(quote.compra)} / venta ${formatARS(quote.venta)}`} /> : null}</div>{quote ? <div className="board__figures"><div className="board__figure"><div className="board__value">{formatARS(quote.compra)}</div><div className="board__label">Compra</div></div><div className="board__figure"><div className="board__value">{formatARS(quote.venta)}</div><div className="board__label">Venta · {relativeTime(quote.fechaActualizacion)}</div></div></div> : <div className="state-message">No pudimos traer esta cotización.</div>}</article>;
}

export function DollarBoard({ quotes, error }: { quotes: DollarQuote[]; error: string | null }) {
  return <section className="board" aria-label="Cotizaciones principales"><Panel quote={quotes.find((quote) => quote.casa === "oficial")} name="Dólar oficial" tone="oficial" /><Panel quote={quotes.find((quote) => quote.casa === "blue")} name="Dólar blue" tone="blue" />{error && !quotes.length ? <p className="state-message">{error}</p> : null}</section>;
}
