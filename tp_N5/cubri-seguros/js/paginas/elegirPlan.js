// Pantalla 03 · Elegir plan (Paso 2)
import { solicitud, elegirPlan, irAPaso } from '../estado.js';
import { render } from '../render.js';
import { obtenerPlanes, cuotaDelPlan, formatearMoneda } from '../cotizador.js';

const ICONO_OK =
  '<svg viewBox="0 0 24 24" class="size-4 shrink-0 text-emerald-600" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
const ICONO_NO =
  '<svg viewBox="0 0 24 24" class="size-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';

// Desktop: lista completa de coberturas con ✓ / ✗ según el plan
function detalleDesktop(plan) {
  return plan.detalleDesktop
    .map((c) => c.incluido
      ? `<li class="flex items-center gap-2">${ICONO_OK}<span>${c.texto}</span></li>`
      : `<li class="flex items-center gap-2 text-slate-400">${ICONO_NO}<span>${c.texto}</span></li>`)
    .join('');
}

function tarjetaDePlan(plan) {
  const cuota = formatearMoneda(cuotaDelPlan(plan, solicitud.equipo));
  const incluye = plan.coberturas.map((c) => `<li class="flex items-center gap-2">${ICONO_OK}<span>${c}</span></li>`);
  const noIncluye = (plan.noIncluye || []).map(
    (c) => `<li class="flex items-center gap-2 text-slate-400">${ICONO_NO}<span>${c}</span></li>`
  );
  const badge = plan.recomendado ? '<span class="badge">Recomendado</span>' : '';

  return (
    `<label class="plan-card card">` +
    `<input type="radio" name="plan" value="${plan.id}" class="radio-dot plan-card__radio" aria-label="Plan ${plan.nombre}">` +
    `<div class="flex items-center gap-2"><h3 class="text-base font-bold">${plan.nombre}</h3>${badge}</div>` +
    `<p class="mt-2 flex items-baseline gap-1.5"><strong class="text-[28px] font-extrabold leading-none">${cuota}</strong>` +
    `<span class="t-help">/ mes</span></p>` +
    `<ul class="mt-3 grid gap-1.5 text-[13px] lg:hidden">${incluye.join('')}${noIncluye.join('')}</ul>` +
    `<div class="hidden border-t border-slate-200 lg:mt-3 lg:block"></div>` +
    `<ul class="hidden gap-2 text-[12px] lg:mt-3 lg:grid">${detalleDesktop(plan)}</ul>` +
    `</label>`
  );
}

export function iniciar() {
  const lista = document.getElementById('lista-planes');
  lista.innerHTML = obtenerPlanes().map(tarjetaDePlan).join('');

  // Mismo name="plan" en los tres radios: solo uno puede estar elegido
  lista.addEventListener('change', (e) => {
    if (e.target.name !== 'plan') return;
    elegirPlan(e.target.value);
    render();
  });
  lista.querySelectorAll('input[name="plan"]').forEach((r) => { r.checked = r.value === solicitud.plan; });

  document.querySelectorAll('[data-accion="volver"]').forEach((b) => b.addEventListener('click', () => irAPaso(1)));
  document.getElementById('form-plan').addEventListener('submit', (e) => {
    e.preventDefault();
    irAPaso(3);
  });
  render();
}
