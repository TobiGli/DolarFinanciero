"use client";

import { useMemo, useState } from "react";
import { ShareButton } from "../components/ShareButton";
import { formatARS, formatDate } from "../lib/format";
import type { UvaIndex } from "../lib/types";

export function UvaCalculator({ history, error }: { history: UvaIndex[]; error: string | null }) {
  const ordered = useMemo(() => [...history].sort((a, b) => a.fecha.localeCompare(b.fecha)), [history]);
  const latest = ordered.at(-1);
  const [date, setDate] = useState(latest?.fecha ?? "");
  const [ars, setArs] = useState(100000);
  const [uvas, setUvas] = useState(100);
  const selected = ordered.find((item) => item.fecha === date) ?? latest;
  const [reference, setReference] = useState(latest?.fecha ?? "");
  const referenceValue = ordered.find((item) => item.fecha === reference)?.valor;
  const variation = selected && referenceValue ? ((selected.valor - referenceValue) / referenceValue) * 100 : null;
  const invalidDate = Boolean(date) && !ordered.some((item) => item.fecha === date);
  const value = selected?.valor ?? 0;

  return (
    <section className="uva-layout">
      <div className="uva-value board__panel board__panel--oficial">
        <div className="board__title">
          <span>Valor UVA seleccionado</span>
          {selected ? <ShareButton title="Valor UVA" text={`Valor UVA del ${formatDate(selected.fecha)}: ${formatARS(value)}`} /> : null}
        </div>
        {selected ? <><div className="board__value">{formatARS(value)}</div><div className="board__label">{formatDate(selected.fecha)}</div></> : <div className="state-message">{error ?? "Sin datos disponibles."}</div>}
      </div>
      {error && !history.length ? <p className="state-message">{error}</p> : null}
      <div className="uva-card">
        <h2>Pesos ⇄ UVA</h2>
        <div className="converter__field">
          <label htmlFor="uva-date">Fecha de cotización</label>
          <input id="uva-date" type="date" value={date} min={ordered[0]?.fecha} max={latest?.fecha} onChange={(event) => setDate(event.target.value)} />
          {invalidDate ? <span className="field-error" role="alert">No hay un dato UVA para esa fecha.</span> : null}
        </div>
        <div className="uva-grid">
          <div className="converter__field"><label htmlFor="uva-ars">Monto en pesos</label><input id="uva-ars" type="number" inputMode="decimal" min="0" step="0.01" value={ars} onChange={(event) => setArs(Number(event.target.value))} /><strong>{value && Number.isFinite(ars) ? `${(ars / value).toFixed(2)} UVAs` : "-"}</strong></div>
          <div className="converter__field"><label htmlFor="uva-units">Cantidad de UVAs</label><input id="uva-units" type="number" inputMode="decimal" min="0" step="0.01" value={uvas} onChange={(event) => setUvas(Number(event.target.value))} /><strong>{value && Number.isFinite(uvas) ? formatARS(uvas * value) : "-"}</strong></div>
        </div>
      </div>
      <div className="uva-card">
        <h2>Cuota indexada</h2>
        <p className="card-caption">Calculá cuánto representa hoy una cuota fijada en una fecha de referencia.</p>
        <div className="uva-grid">
          <div className="converter__field"><label htmlFor="uva-reference">Fecha de referencia</label><input id="uva-reference" type="date" value={reference} min={ordered[0]?.fecha} max={latest?.fecha} onChange={(event) => setReference(event.target.value)} /></div>
          <div className="converter__field"><label htmlFor="uva-installment">Cuota original en UVAs</label><input id="uva-installment" type="number" inputMode="decimal" min="0" step="0.01" value={uvas} onChange={(event) => setUvas(Number(event.target.value))} /><strong>{selected && Number.isFinite(uvas) ? formatARS(uvas * selected.valor) : "-"}</strong></div>
        </div>
        <p className="variation">Variación acumulada: <strong>{variation == null ? "-" : `${variation >= 0 ? "+" : ""}${variation.toFixed(2)}%`}</strong></p>
      </div>
    </section>
  );
}
