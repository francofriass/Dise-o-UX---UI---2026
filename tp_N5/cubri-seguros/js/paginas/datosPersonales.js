// Pantalla 04 · Datos personales (Paso 3)
import { irAPaso } from '../estado.js';
import { conectarFormulario } from '../formulario.js';
import {
  validarNombre, validarApellido, validarDni, validarNacimiento, validarEmail,
  validarCelular, validarTerminos, validarTitular,
} from '../validaciones.js';

export function iniciar() {
  document.querySelectorAll('[data-accion="volver"]').forEach((b) => b.addEventListener('click', () => irAPaso(2)));

  conectarFormulario({
    form: '#form-datos',
    seccion: 'titular',
    boton: '#btn-continuar',
    ayudaBoton: '#ayuda-boton',
    validarTodo: validarTitular,
    validadores: {
      nombre: validarNombre,
      apellido: validarApellido,
      dni: validarDni,
      nacimiento: validarNacimiento,
      email: validarEmail,
      celular: validarCelular,
      terminos: validarTerminos,
    },
    onValido: () => irAPaso(4),
  });
}
