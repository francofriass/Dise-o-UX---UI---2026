// js/pago.js — pago simulado y generación del número de póliza
const CLAVE_CONTADOR = 'cubri:contador';
const CONTADOR_INICIAL = 122; // la primera póliza generada es POL-AAAA-000123

export function simularPago(numero) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const limpio = numero.replace(/\s/g, '');
      resolve(
        limpio === '4000000000000002'
          ? { ok: false, motivo: 'Tarjeta rechazada' }
          : { ok: true }
      );
    }, 1500);
  });
}

function siguienteContador() {
  let actual = CONTADOR_INICIAL;
  try {
    actual = Number(localStorage.getItem(CLAVE_CONTADOR)) || CONTADOR_INICIAL;
    localStorage.setItem(CLAVE_CONTADOR, String(actual + 1));
  } catch (e) { /* sin storage: queda en el valor inicial */ }
  return actual + 1;
}

// Número de póliza: POL-AAAA-NNNNNN
export function generarPoliza() {
  const contador = siguienteContador();
  return `POL-${new Date().getFullYear()}-${String(contador).padStart(6, '0')}`;
}

// Fecha de hoy en formato dd/mm/aaaa
export function fechaDeHoy() {
  return new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date());
}
