import type { CurrencyQuote } from "../lib/types";
import { formatARS, relativeTime } from "../lib/format";

export function CurrencyLedger({ currencies, error }: { currencies: Array<CurrencyQuote & { name: string }>; error: string | null }) {
  return <section aria-labelledby="currencies-title"><h2 className="section-title" id="currencies-title">Otras monedas de interés</h2><div className="ledger ledger--monedas"><div className="ledger__head"><span>Moneda</span><span>Compra</span><span>Venta</span><span>Actualizado</span></div><div className="ledger__body">{currencies.length ? currencies.map((currency) => <div className="ledger__row" key={currency.moneda}><span className="ledger__name">{currency.name}</span><span className="ledger__num">{formatARS(currency.compra)}</span><span className="ledger__num">{formatARS(currency.venta)}</span><span className="ledger__age">{relativeTime(currency.fechaActualizacion)}</span></div>) : <div className="state-message">{error ?? "Cargando cotizaciones..."}</div>}</div></div></section>;
}
