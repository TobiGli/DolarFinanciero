import { getCurrencies, getDollarQuotes } from "./lib/api";
import { CurrencyLedger } from "./components/CurrencyLedger";
import { Converter } from "./components/Converter";
import { DollarBoard } from "./components/DollarBoard";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { QuotesLedger } from "./components/QuotesLedger";
import { Ticker } from "./components/Ticker";

export default async function Home() {
  const [dollars, currencies] = await Promise.all([getDollarQuotes(), getCurrencies()]);

  return (
    <>
      <Ticker quotes={dollars.data} />
      <Header />
      <main className="wrap">
        <DollarBoard quotes={dollars.data} error={dollars.error} />
        <QuotesLedger quotes={dollars.data} error={dollars.error} />
        <Converter quotes={dollars.data} />
        <CurrencyLedger currencies={currencies.data} error={currencies.error} />
      </main>
      <Footer />
    </>
  );
}