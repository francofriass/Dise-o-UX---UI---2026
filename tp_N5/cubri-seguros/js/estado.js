// js/estado.js — único objeto de estado + funciones para modificarlo
const CLAVE = 'cubri:solicitud';

// Orden de pantallas: 0 inicio, 1..4 checkout, 5 éxito, 6 error
export const PAGINAS = [
  'catalogo.html',
  'cotizar.html',
  'elegirPlan.html',
  'datosPersonales.html',
  'pago.html',
  'confirmacion.html',
  'errorDePago.html',
];

function crearInicial() {
  return {
    paso: 0,
    equipo: { marca: '', modelo: '', valor: 0, antiguedad: '' },
    plan: 'plus',
    titular: { nombre: '', apellido: '', dni: '', nacimiento: '', email: '', celular: '', terminos: false },
    pago: { metodo: 'credito', tarjeta: '', vencimiento: '', cvv: '', titular: '' },
    poliza: null,
  };
}

// Como cada paso es una página HTML distinta, el objeto se guarda en
// sessionStorage y se vuelve a leer al cargar cada página.
function leer() {
  const base = crearInicial();
  try {
    const guardado = JSON.parse(sessionStorage.getItem(CLAVE));
    if (guardado) {
      return {
        ...base,
        ...guardado,
        equipo: { ...base.equipo, ...guardado.equipo },
        titular: { ...base.titular, ...guardado.titular },
        pago: { ...base.pago, ...guardado.pago },
      };
    }
  } catch (e) { /* sin storage: se trabaja en memoria */ }
  return base;
}

export const solicitud = leer();

export function guardar() {
  try { sessionStorage.setItem(CLAVE, JSON.stringify(solicitud)); } catch (e) { /* ignorar */ }
}

export function actualizar(seccion, datos) {
  Object.assign(solicitud[seccion], datos);
  guardar();
}

export function elegirPlan(id) {
  solicitud.plan = id;
  guardar();
}

export function reiniciar() {
  Object.keys(solicitud).forEach((k) => delete solicitud[k]);
  Object.assign(solicitud, crearInicial());
  guardar();
}

// Cambia el paso y navega a la página correspondiente.
export function irAPaso(n) {
  solicitud.paso = n;
  guardar();
  window.location.href = PAGINAS[n];
}
