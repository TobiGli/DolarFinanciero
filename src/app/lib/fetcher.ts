import { Divisas } from './definitions';

export const fetcher = async (url: string): Promise<Divisas> => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Falló la solicitud');
  }

  const data = await res.json();
  return data;
};
