/* ==========================================================================
   DolarFinanciero — lógica de la aplicación
   Fuente de datos: dolarapi.com (Argentina)
   ========================================================================== */

const API_BASE = "https://dolarapi.com/v1";

const CASA_LABELS = {
  oficial: "Oficial",
  blue: "Blue",
  bolsa: "MEP (Bolsa)",
  contadoconliqui: "CCL (Contado con liqui)",
  mayorista: "Mayorista",
  tarjeta: "Tarjeta",
  cripto: "Cripto",
};

const MONEDAS = [
  { codigo: "eur", nombre: "Euro" },
  { codigo: "brl", nombre: "Real brasileño" },
  { codigo: "clp", nombre: "Peso chileno" },
  { codigo: "uyu", nombre: "Peso uruguayo" },
];

const REFRESH_MS = 60000;
const AGE_TICK_MS = 15000;

const money = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const relTime = new Intl.RelativeTimeFormat("es-AR", { numeric: "auto" });

const state = {
  dolares: [],
  prevDolares: {},
  monedas: [],
  prevMonedas: {},
};

// ---------- helpers ----------

function relativeTime(isoString) {
  const then = new Date(isoString).getTime();
  if (Number.isNaN(then)) return "sin datos";
  const diffSec = Math.round((then - Date.now()) / 1000);
  const abs = Math.abs(diffSec);
  if (abs < 60) return relTime.format(Math.round(diffSec), "second");
  if (abs < 3600) return relTime.format(Math.round(diffSec / 60), "minute");
  if (abs < 86400) return relTime.format(Math.round(diffSec / 3600), "hour");
  return relTime.format(Math.round(diffSec / 86400), "day");
}

function pctChange(prev, curr) {
  if (prev == null || !prev) return null;
  return ((curr - prev) / prev) * 100;
}

function deltaMarkup(prev, curr) {
  const pct = pctChange(prev, curr);
  if (pct === null || Math.abs(pct) < 0.01) return "";
  const dir = pct > 0 ? "up" : "down";
  const arrow = pct > 0 ? "▲" : "▼";
  return `<span class="board__delta ${dir}">${arrow} ${Math.abs(pct).toFixed(2)}%</span>`;
}

function setToday() {
  const el = document.getElementById("today");
  const fmt = new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  el.textContent = fmt.format(new Date());
}

async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ---------- fetching ----------

async function fetchDolares() {
  return getJSON(`${API_BASE}/dolares`);
}

async function fetchMoneda(codigo) {
  const data = await getJSON(`${API_BASE}/cotizaciones/${codigo}`);
  return data;
}

// ---------- rendering: featured board ----------

function renderPanel(panelId, casa, item) {
  const panel = document.getElementById(panelId);
  if (!item) {
    panel.querySelector(".board__figures").innerHTML = `
      <div class="state-message">
        No pudimos traer esta cotización.
        <button type="button" data-retry>Reintentar</button>
      </div>`;
    panel.querySelector("[data-retry]")?.addEventListener("click", fetchAll);
    return;
  }
  const prev = state.prevDolares[casa];
  panel.querySelector(".board__figures").innerHTML = `
    <div class="board__figure">
      <div class="board__value">${money.format(item.compra)}</div>
      <div class="board__label">Compra</div>
    </div>
    <div class="board__figure">
      <div class="board__value">${money.format(item.venta)} ${deltaMarkup(prev?.venta, item.venta)}</div>
      <div class="board__label">Venta · actualizado ${relativeTime(item.fechaActualizacion)}</div>
    </div>`;
}

// ---------- rendering: ledger of remaining dólares ----------

function renderLedgerDolares() {
  const body = document.getElementById("ledgerDolares");
  const oficial = state.dolares.find((d) => d.casa === "oficial");
  const resto = state.dolares
    .filter((d) => d.casa !== "oficial" && d.casa !== "blue")
    .sort((a, b) => a.venta - b.venta);

  if (!resto.length) {
    body.innerHTML = `<div class="state-message">No hay más cotizaciones disponibles por ahora.</div>`;
    return;
  }

  body.innerHTML = resto
    .map((item) => {
      const gap = oficial ? ((item.venta - oficial.venta) / oficial.venta) * 100 : null;
      const gapText = gap === null ? "—" : `${gap > 0 ? "+" : ""}${gap.toFixed(1)}%`;
      const gapClass =
        gap === null || Math.abs(gap) < 0.5 ? "flat" : gap > 0 ? "up" : "down";
      return `
        <div class="ledger__row">
          <span class="ledger__name">${CASA_LABELS[item.casa] || item.nombre}</span>
          <span class="ledger__num ledger__compra">${money.format(item.compra)}</span>
          <span class="ledger__num ledger__venta">${money.format(item.venta)}</span>
          <span class="ledger__gap ${gapClass}">${gapText}</span>
          <span class="ledger__age" data-updated="${item.fechaActualizacion}">${relativeTime(item.fechaActualizacion)}</span>
        </div>`;
    })
    .join("");
}

// ---------- rendering: other currencies ----------

function renderLedgerMonedas() {
  const body = document.getElementById("ledgerMonedas");
  const ok = state.monedas.filter((m) => m.data);

  if (!ok.length) {
    body.innerHTML = `
      <div class="state-message">
        No pudimos traer estas cotizaciones.
        <button type="button" data-retry>Reintentar</button>
      </div>`;
    body.querySelector("[data-retry]")?.addEventListener("click", fetchAll);
    return;
  }

  body.innerHTML = state.monedas
    .map((m) => {
      if (!m.data) {
        return `
          <div class="ledger__row">
            <span class="ledger__name">${m.nombre}</span>
            <span class="ledger__num ledger__compra">—</span>
            <span class="ledger__num ledger__venta">—</span>
            <span class="ledger__age">no disponible</span>
          </div>`;
      }
      const { compra, venta, fechaActualizacion } = m.data;
      return `
        <div class="ledger__row">
          <span class="ledger__name">${m.nombre}</span>
          <span class="ledger__num ledger__compra">${money.format(compra)}</span>
          <span class="ledger__num ledger__venta">${money.format(venta)}</span>
          <span class="ledger__age" data-updated="${fechaActualizacion}">${relativeTime(fechaActualizacion)}</span>
        </div>`;
    })
    .join("");
}

// ---------- rendering: ticker ----------

function renderTicker() {
  const track = document.getElementById("tickerTrack");
  if (!state.dolares.length) return;

  const items = state.dolares
    .map((item) => {
      const prev = state.prevDolares[item.casa];
      const pct = pctChange(prev?.venta, item.venta);
      let cls = "";
      let arrow = "";
      if (pct !== null && Math.abs(pct) >= 0.01) {
        cls = pct > 0 ? "up" : "down";
        arrow = pct > 0 ? " ▲" : " ▼";
      }
      const label = CASA_LABELS[item.casa] || item.nombre;
      return `<span class="ticker__item">${label} <b class="${cls}">${money.format(item.venta)}${arrow}</b></span>`;
    })
    .join("");

  track.innerHTML = items + items;
}

// ---------- converter ----------

function populateConverterOptions() {
  const select = document.getElementById("convCasa");
  const previous = select.value;
  select.innerHTML = state.dolares
    .map((item) => `<option value="${item.casa}">${CASA_LABELS[item.casa] || item.nombre}</option>`)
    .join("");
  if (previous && state.dolares.some((d) => d.casa === previous)) {
    select.value = previous;
  }
}

function updateConverter() {
  const amountInput = document.getElementById("convAmount");
  const select = document.getElementById("convCasa");
  const result = document.getElementById("convResult");
  const amount = Number(amountInput.value) || 0;
  const item = state.dolares.find((d) => d.casa === select.value);

  if (!item) {
    result.innerHTML = `<div class="amount">—</div><div class="caption">Esperando cotizaciones</div>`;
    return;
  }

  result.innerHTML = `
    <div class="row">
      <div class="amount">${money.format(amount * item.compra)}</div>
      <div class="caption">recibís si vendés esos dólares (compra)</div>
    </div>
    <div class="row">
      <div class="amount">${money.format(amount * item.venta)}</div>
      <div class="caption">necesitás para comprarlos (venta)</div>
    </div>`;
}

// ---------- age ticking (no network) ----------

function tickAges() {
  document.querySelectorAll("[data-updated]").forEach((el) => {
    el.textContent = relativeTime(el.dataset.updated);
  });
}

// ---------- orchestration ----------

async function fetchAll() {
  const btn = document.getElementById("refreshBtn");
  btn.classList.add("is-loading");

  const [dolaresResult, monedasResults] = await Promise.allSettled([
    fetchDolares(),
    Promise.allSettled(MONEDAS.map((m) => fetchMoneda(m.codigo))),
  ]);

  if (dolaresResult.status === "fulfilled") {
    const nextPrev = {};
    state.dolares.forEach((d) => (nextPrev[d.casa] = d));
    state.prevDolares = nextPrev;
    state.dolares = dolaresResult.value;
  } else {
    state.dolares = [];
  }

  if (monedasResults.status === "fulfilled") {
    state.monedas = MONEDAS.map((m, i) => ({
      ...m,
      data: monedasResults.value[i].status === "fulfilled" ? monedasResults.value[i].value : null,
    }));
  } else {
    state.monedas = MONEDAS.map((m) => ({ ...m, data: null }));
  }

  const oficial = state.dolares.find((d) => d.casa === "oficial");
  const blue = state.dolares.find((d) => d.casa === "blue");
  renderPanel("panelOficial", "oficial", oficial);
  renderPanel("panelBlue", "blue", blue);
  renderLedgerDolares();
  renderLedgerMonedas();
  renderTicker();
  populateConverterOptions();
  updateConverter();

  btn.classList.remove("is-loading");
}

function init() {
  setToday();
  document.getElementById("refreshBtn").addEventListener("click", fetchAll);
  document.getElementById("convAmount").addEventListener("input", updateConverter);
  document.getElementById("convCasa").addEventListener("change", updateConverter);

  fetchAll();
  setInterval(fetchAll, REFRESH_MS);
  setInterval(tickAges, AGE_TICK_MS);
}

document.addEventListener("DOMContentLoaded", init);
