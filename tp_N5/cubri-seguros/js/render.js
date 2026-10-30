// js/render.js — pinta cada paso a partir del estado (el DOM solo muestra lo que dice el estado)
import { solicitud } from './estado.js';
import { buscarPlan, cuotaDelPlan, formatearMoneda } from './cotizador.js';

const ICONO_CHECK =
  '<svg viewBox="0 0 24 24" class="size-3" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

const PASOS = ['Cotizar', 'Plan', 'Datos', 'Pago'];

/* ---------- Stepper: recibe el paso actual y pinta 3 estados (completo / activo / pendiente) ---------- */
export function renderStepper() {
  const nav = document.getElementById('stepper');
  if (!nav) return;
  const actual = solicitud.paso;

  const items = PASOS.map((nombre, i) => {
    const n = i + 1;
    const estado = n < actual ? 'completo' : n === actual ? 'activo' : 'pendiente';
    const circulo = estado === 'completo' ? ICONO_CHECK : String(n);
    const conector =
      n < PASOS.length
        ? `<li class="stepper__linea" data-estado="${n < actual ? 'completo' : 'pendiente'}" aria-hidden="true"></li>`
        : '';
    return (
      `<li class="stepper__paso" data-estado="${estado}"${estado === 'activo' ? ' aria-current="step"' : ''}>` +
      `<span class="stepper__circulo">${circulo}</span><span class="stepper__texto">${nombre}</span></li>` +
      conector
    );
  });

  nav.innerHTML = `<ol class="stepper">${items.join('')}</ol>`;
}

/* ---------- Resumen: se genera UNA sola vez desde el estado (mismo elemento en mobile y desktop) ---------- */
const ICONO_ESCUDO =
  '<svg viewBox="0 0 24 24" class="size-3.5 shrink-0 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>';

function datosDelResumen() {
  const { equipo, titular, plan: idPlan, paso } = solicitud;
  const plan = buscarPlan(idPlan);
  const conPlan = paso >= 2 && plan;
  const cuota = conPlan ? cuotaDelPlan(plan, equipo) : 0;
  return {
    seguro: conPlan ? `Celular · Plan ${plan.nombre}` : 'Celular',
    equipo: `${equipo.marca} ${equipo.modelo}`.trim() || '—',
    modelo: equipo.modelo.trim() || '—',
    valor: equipo.valor > 0 ? formatearMoneda(equipo.valor) : '—',
    titular: `${titular.nombre} ${titular.apellido}`.trim() || '—',
    plan: conPlan ? `Plan ${plan.nombre}` : '',
    nombrePlan: conPlan ? plan.nombre : '—',
    total: cuota > 0 ? formatearMoneda(cuota) : '—',
    cuota,
  };
}

// Card lateral de desktop (Figma D02–D05): las filas dependen del paso
function resumenDesktop(d) {
  const paso = solicitud.paso;
  const fila = (etiqueta, valor) =>
    `<div class="flex items-baseline justify-between gap-4"><dt class="text-slate-500">${etiqueta}</dt>` +
    `<dd class="text-right font-semibold">${valor}</dd></div>`;

  let filas = fila('Seguro', 'Celular') + fila('Equipo', d.equipo);
  if (paso === 1) filas += fila('Valor', d.valor);
  if (paso >= 2) filas += fila('Plan', d.nombrePlan);
  if (paso >= 4) filas += fila('Titular', d.titular);
  if (paso >= 2) {
    filas +=
      `<div class="mt-1 flex items-baseline justify-between gap-4 border-t border-slate-200 pt-3">` +
      `<dt class="text-[13px] text-slate-500">Total mensual</dt><dd class="text-lg font-extrabold">${d.total}</dd></div>`;
  }
  const nota = paso === 1
    ? `<p class="mt-4 text-[11px] text-slate-500">Completá los datos del equipo para ver el precio.</p>`
    : '';

  return (
    `<div class="hidden p-5 lg:block"><h2 class="text-[15px] font-bold">Resumen</h2>` +
    `<dl class="mt-3 grid gap-2 text-[12px]">${filas}</dl>${nota}` +
    `<p class="mt-3 flex items-center gap-2 text-[11px] text-slate-500">${ICONO_ESCUDO}` +
    `<span>Contratación 100% online · cancelás cuando quieras</span></p></div>`
  );
}

export function renderResumen() {
  const aside = document.getElementById('resumen');
  if (!aside) return;
  const d = datosDelResumen();

  if (aside.dataset.variante === 'barra') {
    // Mobile: barra fija sobre el botón
    const cuota = d.cuota > 0 ? `${formatearMoneda(d.cuota)}/mes` : '—';
    aside.innerHTML =
      `<div class="flex items-center justify-between gap-4 text-[13px] lg:hidden">` +
      `<span class="text-muted">${d.plan} · ${d.modelo}</span><strong class="text-[15px] font-extrabold">${cuota}</strong></div>` +
      resumenDesktop(d);
    return;
  }

  // Mobile: card del paso de pago (Seguro / Equipo / Titular / Total)
  const fila = (etiqueta, valor) =>
    `<div class="flex items-baseline justify-between gap-4"><dt class="text-muted">${etiqueta}</dt>` +
    `<dd class="text-right font-semibold">${valor}</dd></div>`;
  aside.innerHTML =
    `<section class="px-5 py-4 lg:hidden"><dl class="grid gap-2 text-[13px]">` +
    fila('Seguro', d.seguro) +
    fila('Equipo', d.equipo) +
    fila('Titular', d.titular) +
    `<div class="mt-1 flex items-baseline justify-between gap-4 border-t border-indigo-200 pt-3">` +
    `<dt class="text-muted">Total mensual</dt><dd class="text-base font-extrabold">${d.total}</dd></div>` +
    `</dl></section>` +
    resumenDesktop(d);
}

/* ---------- Campos: rellena los inputs desde el estado (así "Volver" conserva los datos) ---------- */
function leerEstado(ruta) {
  const [seccion, campo] = ruta.split('.');
  return solicitud[seccion]?.[campo];
}

export function renderCampos() {
  document.querySelectorAll('[data-campo]').forEach((el) => {
    if (el === document.activeElement) return; // no pisar lo que la persona está escribiendo
    const valor = leerEstado(el.dataset.campo);
    if (el.type === 'checkbox') {
      el.checked = Boolean(valor);
    } else if (el.type === 'radio') {
      el.checked = el.value === valor;
    } else if (el.dataset.campo === 'equipo.valor') {
      el.value = valor > 0 ? formatearMoneda(valor) : '';
    } else {
      el.value = valor ?? '';
    }
  });
}

export function render() {
  renderCampos();
  renderStepper();
  renderResumen();
}

/* ---------- Errores en línea (aria-invalid + role="alert") ---------- */
export function mostrarError(campoEl, mensaje) {
  if (!campoEl) return;
  const alerta = campoEl.querySelector('[role="alert"]');
  const ayuda = campoEl.querySelector('[data-ayuda]');
  const controles = campoEl.querySelectorAll('input, select');
  if (mensaje) {
    campoEl.setAttribute('data-invalid', '');
    controles.forEach((c) => c.setAttribute('aria-invalid', 'true'));
    alerta.textContent = mensaje;
    alerta.hidden = false;
    if (ayuda) ayuda.hidden = true;
  } else {
    campoEl.removeAttribute('data-invalid');
    controles.forEach((c) => c.removeAttribute('aria-invalid'));
    alerta.textContent = '';
    alerta.hidden = true;
    if (ayuda) ayuda.hidden = false;
  }
}
