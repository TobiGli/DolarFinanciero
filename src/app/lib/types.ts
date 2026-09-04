export interface DollarQuote {
  moneda: string;
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion: string;
}

export interface CurrencyQuote {
  moneda: string;
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion: string;
}

export interface UvaIndex {
  fecha: string;
  valor: number;
}

export interface DataResult<T> {
  data: T;
  error: string | null;
}
