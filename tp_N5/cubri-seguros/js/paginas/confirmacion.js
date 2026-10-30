// Pantalla 06 · Confirmación (éxito)
import { solicitud, reiniciar, irAPaso } from '../estado.js';
import { buscarPlan, cuotaDelPlan, formatearMoneda } from '../cotizador.js';

function descargarPoliza(datos) {
  const lineas = [
    'CUBRÍ SEGUROS — PÓLIZA',
    `Número de póliza: ${datos.numero}`,
    `Titular: ${datos.titular}`,
    `Email: ${datos.email}`,
    `Equipo: ${datos.equipo}`,
    `Plan: ${datos.plan}`,
    `Vigencia desde: ${datos.vigencia}`,
    `Cuota mensual: ${datos.cuota}`,
  ];
  const blob = new Blob([lineas.join('\n')], { type: 'text/plain;charset=utf-8' });
  const enlace = document.createElement('a');
  enlace.href = URL.createObjectURL(blob);
  enlace.download = `${datos.numero}.txt`;
  enlace.click();
  URL.revokeObjectURL(enlace.href);
}

export function iniciar() {
  const plan = buscarPlan(solicitud.plan);
  const datos = {
    numero: solicitud.poliza.numero,
    vigencia: solicitud.poliza.vigencia,
    titular: `${solicitud.titular.nombre} ${solicitud.titular.apellido}`,
    email: solicitud.titular.email,
    equipo: `${solicitud.equipo.marca} ${solicitud.equipo.modelo}`,
    plan: plan.nombre,
    cuota: formatearMoneda(cuotaDelPlan(plan, solicitud.equipo)),
  };

  document.getElementById('nombre-titular').textContent = solicitud.titular.nombre;
  document.getElementById('email-titular').textContent = datos.email;
  document.getElementById('numero-poliza').textContent = datos.numero;
  document.getElementById('detalle-plan').textContent = datos.plan;
  document.getElementById('detalle-equipo').textContent = datos.equipo;
  document.getElementById('detalle-vigencia').textContent = datos.vigencia;
  document.getElementById('detalle-cuota').textContent = datos.cuota;

  document.querySelector('[data-accion="descargar"]').addEventListener('click', () => descargarPoliza(datos));
  // "Volver al inicio" reinicia la solicitud
  document.querySelector('[data-accion="inicio"]').addEventListener('click', () => {
    reiniciar();
    irAPaso(0);
  });
}
