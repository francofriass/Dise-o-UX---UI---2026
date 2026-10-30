// Pantalla 05 · Pago (Paso 4)
import { solicitud, irAPaso, guardar } from '../estado.js';
import { conectarFormulario } from '../formulario.js';
import { simularPago, generarPoliza, fechaDeHoy } from '../pago.js';
import {
  validarTarjeta, validarVencimiento, validarCvv, validarTitularTarjeta, validarPago,
} from '../validaciones.js';

const ICONO_CARGA =
  '<svg viewBox="0 0 24 24" class="size-4 animate-spin" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.2-8.56"/></svg>';

export function iniciar() {
  document.querySelectorAll('[data-accion="volver"]').forEach((b) => b.addEventListener('click', () => irAPaso(3)));
  const boton = document.getElementById('btn-pagar');
  let procesando = false;

  async function pagar() {
    if (procesando) return; // evita el doble click
    procesando = true;
    boton.disabled = true;
    boton.setAttribute('aria-busy', 'true');
    boton.innerHTML = `${ICONO_CARGA}<span class="ml-2">Procesando…</span>`;

    const resultado = await simularPago(solicitud.pago.tarjeta);
    if (resultado.ok) {
      solicitud.poliza = { numero: generarPoliza(), vigencia: fechaDeHoy() };
      guardar();
      irAPaso(5);
    } else {
      irAPaso(6);
    }
  }

  conectarFormulario({
    form: '#form-pago',
    seccion: 'pago',
    validarTodo: validarPago,
    validadores: {
      metodo: () => null,
      tarjeta: validarTarjeta,
      vencimiento: validarVencimiento,
      cvv: validarCvv,
      titular: validarTitularTarjeta,
    },
    onValido: pagar,
  });

  // "Cambiar medio de pago" llega con #metodo: el foco va al medio elegido
  if (window.location.hash === '#metodo') {
    document.querySelector('input[name="metodo"]:checked')?.focus();
  }
}
