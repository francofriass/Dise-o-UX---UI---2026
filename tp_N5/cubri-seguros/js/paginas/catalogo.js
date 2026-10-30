// Pantalla 01 · Inicio / Catálogo
import { irAPaso } from '../estado.js';

export function iniciar() {
  // El CTA lleva al Paso 1
  document.querySelector('[data-accion="cotizar"]').addEventListener('click', () => irAPaso(1));
}
