import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Ticker } from "../components/Ticker";
import { getDollarQuotes, getUvaHistory } from "../lib/api";
import { UvaCalculator } from "./UvaCalculator";

export default async function UvaPage() {
  const [result, dollars] = await Promise.all([getUvaHistory(), getDollarQuotes()]);
  return <><Ticker quotes={dollars.data} /><Header /><main className="wrap"><section className="uva-hero"><p className="eyebrow">Índice publicado por el BCRA</p><h1>Calculadora UVA</h1><p>Convertí pesos y UVAs usando el valor histórico diario para comparar créditos indexados.</p></section><UvaCalculator history={result.data} error={result.error} /></main><Footer /></>;
}
