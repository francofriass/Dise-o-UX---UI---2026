// Pantalla 07 · Error de pago
import { solicitud, guardar, irAPaso } from '../estado.js';

export function iniciar() {
  // Ambos botones vuelven al Paso 4 conservando todos los datos cargados
  document.querySelector('[data-accion="reintentar"]').addEventListener('click', () => irAPaso(4));
  document.querySelector('[data-accion="cambiar-medio"]').addEventListener('click', () => {
    solicitud.paso = 4;
    guardar();
    window.location.href = 'pago.html#metodo';
  });
}
