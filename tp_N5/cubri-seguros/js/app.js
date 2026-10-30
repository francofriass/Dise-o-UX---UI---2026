// js/app.js — arranque: guardia de navegación, planes y carga del controlador de cada página
import { solicitud, guardar, irAPaso } from './estado.js';
import { cargarPlanes } from './cotizador.js';
import { validarEquipo, validarTitular } from './validaciones.js';

// Hasta qué paso se puede llegar con los datos cargados hasta ahora
function pasoMaximoPermitido() {
  if (Object.keys(validarEquipo(solicitud.equipo)).length) return 1;
  if (Object.keys(validarTitular(solicitud.titular)).length) return 3;
  return 4;
}

function guardiaDeNavegacion(paso) {
  if (paso === 5) return solicitud.poliza ? paso : pasoMaximoPermitido();
  if (paso === 6) return pasoMaximoPermitido() === 4 ? paso : pasoMaximoPermitido();
  return Math.min(paso, pasoMaximoPermitido());
}

function avisarErrorDeCarga() {
  document.body.insertAdjacentHTML(
    'afterbegin',
    '<div role="alert" class="alert m-4" data-variant="destructive"><section><p>No pudimos cargar los planes. ' +
      'Abrí el sitio desde un servidor local (Live Server o <code>npx serve</code>), no con doble click.</p></section></div>'
  );
}

// Los ítems del menú superior (desktop) son decorativos: el TP no define esas pantallas
document.querySelectorAll('[data-sin-destino]').forEach((el) => {
  el.addEventListener('click', (e) => e.preventDefault());
});

async function arrancar() {
  const { pagina, paso } = document.body.dataset;
  const pasoDePagina = Number(paso);

  const permitido = guardiaDeNavegacion(pasoDePagina);
  if (permitido !== pasoDePagina) {
    irAPaso(permitido);
    return;
  }
  solicitud.paso = pasoDePagina;
  guardar();

  if (pagina !== 'catalogo') {
    try {
      await cargarPlanes();
    } catch (e) {
      avisarErrorDeCarga();
      return;
    }
  }

  const controlador = await import(`./paginas/${pagina}.js`);
  controlador.iniciar();
}

// Si el navegador restaura la página desde su caché (botón atrás), se vuelve a leer el estado
window.addEventListener('pageshow', (e) => {
  if (e.persisted) window.location.reload();
});

arrancar();
