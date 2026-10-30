// js/cotizador.js — única función de cálculo de cuota + carga de planes
import { aNumero } from './validaciones.js';

export const FACTORES = { 'menos-1': 1.0, '1-2': 1.1, 'mas-2': 1.25 };
export const ETIQUETAS_ANTIGUEDAD = { 'menos-1': 'Menos de 1 año', '1-2': '1 a 2 años', 'mas-2': '+2 años' };

let planes = [];

export async function cargarPlanes() {
  const respuesta = await fetch('data/planes.json');
  if (!respuesta.ok) throw new Error('No se pudieron cargar los planes');
  planes = await respuesta.json();
  return planes;
}

export function obtenerPlanes() {
  return planes;
}

export function buscarPlan(id) {
  return planes.find((p) => p.id === id) || null;
}

// cuota = Math.round(valor × tasaAnual / 12 × factorAntigüedad)
export function calcularCuota(valor, tasaAnual, antiguedad) {
  const factor = FACTORES[antiguedad] ?? 1;
  return Math.round((aNumero(valor) * tasaAnual) / 12 * factor);
}

export function cuotaDelPlan(plan, equipo) {
  return plan ? calcularCuota(equipo.valor, plan.tasaAnual, equipo.antiguedad) : 0;
}

const formatoMoneda = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export function formatearMoneda(n) {
  return formatoMoneda.format(n);
}
