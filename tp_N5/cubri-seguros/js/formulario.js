// js/formulario.js — conecta un formulario con el estado y las validaciones
import { actualizar, solicitud } from './estado.js';
import { aNumero } from './validaciones.js';
import { formatearMoneda } from './cotizador.js';
import { render, mostrarError } from './render.js';

function aplicarMascara(el) {
  if (el.dataset.mascara === 'tarjeta') {
    el.value = el.value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
  } else if (el.dataset.mascara === 'vencimiento') {
    const digitos = el.value.replace(/\D/g, '').slice(0, 4);
    el.value = digitos.length > 2 ? `${digitos.slice(0, 2)}/${digitos.slice(2)}` : digitos;
  }
}

function leerControl(el) {
  if (el.type === 'checkbox') return el.checked;
  if (el.dataset.campo === 'equipo.valor') return aNumero(el.value);
  return el.value;
}

/**
 * @param {object}   cfg
 * @param {string}   cfg.form        selector del <form>
 * @param {string}   cfg.seccion     clave dentro de solicitud (equipo, titular, pago)
 * @param {object}   cfg.validadores { campo: (valor) => mensaje | null }
 * @param {Function} cfg.validarTodo (bloque) => { campo: mensaje }
 * @param {string}   [cfg.boton]     selector del botón que se habilita/deshabilita
 * @param {string}   [cfg.ayudaBoton] selector del texto que explica el botón deshabilitado
 * @param {Function} cfg.onValido    se ejecuta al enviar con todo válido
 */
export function conectarFormulario(cfg) {
  const form = document.querySelector(cfg.form);
  const boton = cfg.boton ? document.querySelector(cfg.boton) : null;
  const ayudaBoton = cfg.ayudaBoton ? document.querySelector(cfg.ayudaBoton) : null;
  const tocados = new Set();

  const controles = (campo) => form.querySelectorAll(`[data-campo="${cfg.seccion}.${campo}"]`);
  const contenedor = (campo) => controles(campo)[0]?.closest('.field');

  function validarCampo(campo) {
    const error = cfg.validadores[campo](solicitud[cfg.seccion][campo]);
    mostrarError(contenedor(campo), error);
    return error;
  }

  function actualizarBoton() {
    if (!boton) return;
    const valido = Object.keys(cfg.validarTodo(solicitud[cfg.seccion])).length === 0;
    boton.disabled = !valido;
    if (ayudaBoton) ayudaBoton.hidden = valido;
  }

  // Cada evento modifica solicitud y después llama a render()
  function alCambiar(evento) {
    const el = evento.target.closest('[data-campo]');
    if (!el || el.dataset.campo.split('.')[0] !== cfg.seccion) return;
    const campo = el.dataset.campo.split('.')[1];
    aplicarMascara(el);
    actualizar(cfg.seccion, { [campo]: leerControl(el) });
    // Radios, select y checkbox se validan al elegir; el resto al salir del campo (blur)
    if (['radio', 'checkbox', 'select-one'].includes(el.type)) tocados.add(campo);
    if (tocados.has(campo)) validarCampo(campo);
    actualizarBoton();
    render();
  }

  function alSalir(evento) {
    const el = evento.target.closest('[data-campo]');
    if (!el || el.type === 'radio' || el.dataset.campo.split('.')[0] !== cfg.seccion) return;
    const campo = el.dataset.campo.split('.')[1];
    tocados.add(campo);
    validarCampo(campo);
    if (campo === 'valor' && solicitud.equipo.valor > 0) el.value = formatearMoneda(solicitud.equipo.valor);
    actualizarBoton();
  }

  form.addEventListener('input', alCambiar);
  form.addEventListener('change', alCambiar);
  form.addEventListener('focusout', alSalir);

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    // Revalida todo al intentar avanzar y lleva el foco al primer campo con error
    let primerError = null;
    Object.keys(cfg.validadores).forEach((campo) => {
      tocados.add(campo);
      if (validarCampo(campo) && !primerError) primerError = controles(campo)[0];
    });
    if (primerError) {
      primerError.focus();
      return;
    }
    cfg.onValido();
  });

  render();
  actualizarBoton();
}
