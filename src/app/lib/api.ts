import type { CurrencyQuote, DataResult, DollarQuote, UvaIndex } from "./types";

const DOLLAR_API = process.env.NEXT_PUBLIC_DOLLAR_API_BASE ?? "https://dolarapi.com/v1";
const UVA_API = process.env.NEXT_PUBLIC_UVA_API_BASE ?? "https://api.argentinadatos.com/v1/finanzas/indices/uva";
const CURRENCIES = [
  { code: "eur", name: "Euro" },
  { code: "brl", name: "Real brasileño" },
  { code: "clp", name: "Peso chileno" },
  { code: "uyu", name: "Peso uruguayo" },
];

async function getJson<T>(url: string, revalidate: number): Promise<T> {
  const response = await fetch(url, { next: { revalidate }, signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json() as Promise<T>;
}

export async function getDollarQuotes(): Promise<DataResult<DollarQuote[]>> {
  try {
    return { data: await getJson<DollarQuote[]>(`${DOLLAR_API}/dolares`, 300), error: null };
  } catch {
    return { data: [], error: "No pudimos traer las cotizaciones del dólar." };
  }
}

export async function getCurrencies(): Promise<DataResult<Array<CurrencyQuote & { name: string }>>> {
  const results = await Promise.allSettled(
    CURRENCIES.map(async (currency) => ({ ...currency, ...(await getJson<CurrencyQuote>(`${DOLLAR_API}/cotizaciones/${currency.code}`, 300)) })),
  );
  const data = results.flatMap((result) => (result.status === "fulfilled" ? [result.value] : []));
  return { data, error: data.length ? null : "No pudimos traer otras monedas." };
}

// La fuente oficial primaria es el BCRA; ArgentinaDatos republica su serie historica diaria.
export async function getUvaHistory(): Promise<DataResult<UvaIndex[]>> {
  try {
    return { data: await getJson<UvaIndex[]>(UVA_API, 86400), error: null };
  } catch {
    return { data: [], error: "No pudimos traer el indice UVA." };
  }
}
