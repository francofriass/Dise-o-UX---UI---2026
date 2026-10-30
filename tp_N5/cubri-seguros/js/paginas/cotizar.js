// Pantalla 02 · Cotizar (Paso 1)
import { irAPaso } from '../estado.js';
import { conectarFormulario } from '../formulario.js';
import {
  validarMarca, validarModelo, validarValor, validarAntiguedad, validarEquipo,
} from '../validaciones.js';

export function iniciar() {
  document.querySelectorAll('[data-accion="volver"]').forEach((b) => b.addEventListener('click', () => irAPaso(0)));

  conectarFormulario({
    form: '#form-cotizar',
    seccion: 'equipo',
    boton: '#btn-continuar',
    validarTodo: validarEquipo,
    validadores: {
      marca: validarMarca,
      modelo: validarModelo,
      valor: validarValor,
      antiguedad: validarAntiguedad,
    },
    onValido: () => irAPaso(2),
  });
}
