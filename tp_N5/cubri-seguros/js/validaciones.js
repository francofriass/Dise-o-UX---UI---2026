// js/validaciones.js — funciones puras: reciben un valor y devuelven un mensaje de error o null
export const VALOR_MIN = 100000;
export const VALOR_MAX = 2500000;
export const ANTIGUEDADES = ['menos-1', '1-2', 'mas-2'];

// "$ 600.000" -> 600000
export function aNumero(valor) {
  if (typeof valor === 'number') return valor;
  return Number(String(valor ?? '').replace(/\D/g, ''));
}

/* ---------- Paso 1 · Equipo ---------- */
export function validarMarca(valor) {
  return valor ? null : 'Elegí una marca';
}

export function validarModelo(valor) {
  const largo = String(valor ?? '').trim().length;
  return largo >= 2 && largo <= 40 ? null : 'Ingresá el modelo del equipo';
}

export function validarValor(valor) {
  const n = aNumero(valor);
  return n >= VALOR_MIN && n <= VALOR_MAX ? null : 'El valor debe estar entre $100.000 y $2.500.000';
}

export function validarAntiguedad(valor) {
  return ANTIGUEDADES.includes(valor) ? null : 'Indicá la antigüedad';
}

/* ---------- Paso 3 · Datos personales ---------- */
function contarLetras(texto) {
  return (String(texto ?? '').match(/\p{L}/gu) || []).length;
}

export function validarNombre(valor) {
  return contarLetras(valor) >= 2 ? null : 'Ingresá tu nombre';
}

export function validarApellido(valor) {
  return contarLetras(valor) >= 2 ? null : 'Ingresá tu apellido';
}

export function validarDni(valor) {
  return /^\d{7,8}$/.test(String(valor ?? '').trim()) ? null : 'El DNI debe tener 7 u 8 números';
}

// Formato dd/mm/aaaa
export function parsearFecha(texto) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(texto ?? '').trim());
  if (!m) return null;
  const [, d, mes, a] = m.map(Number);
  const fecha = new Date(a, mes - 1, d);
  const real = fecha.getFullYear() === a && fecha.getMonth() === mes - 1 && fecha.getDate() === d;
  return real ? fecha : null;
}

export function validarNacimiento(valor, hoy = new Date()) {
  const mensaje = 'Tenés que ser mayor de edad';
  const nacimiento = parsearFecha(valor);
  if (!nacimiento) return mensaje;
  const cumple18 = new Date(nacimiento.getFullYear() + 18, nacimiento.getMonth(), nacimiento.getDate());
  return cumple18 <= hoy ? null : mensaje;
}

export function validarEmail(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(valor ?? '').trim()) ? null : 'Ingresá un email válido';
}

// 10 dígitos, sin 0 ni 15 al inicio; se ignoran espacios y guiones
export function validarCelular(valor) {
  const limpio = String(valor ?? '').replace(/[\s-]/g, '');
  const ok = /^\d{10}$/.test(limpio) && !/^(0|15)/.test(limpio);
  return ok ? null : 'Ej.: 11 5555-1234';
}

export function validarTerminos(valor) {
  return valor === true ? null : 'Tenés que aceptar los términos';
}

/* ---------- Paso 4 · Pago ---------- */
export function validarTarjeta(valor) {
  return /^\d{16}$/.test(String(valor ?? '').replace(/\s/g, '')) ? null : 'Número de tarjeta inválido';
}

// MM/AA, mes 01–12 y fecha futura (la tarjeta vale hasta el fin del mes indicado)
export function validarVencimiento(valor, hoy = new Date()) {
  const mensaje = 'Vencimiento inválido';
  const m = /^(\d{2})\/(\d{2})$/.exec(String(valor ?? '').trim());
  if (!m) return mensaje;
  const mes = Number(m[1]);
  const anio = 2000 + Number(m[2]);
  if (mes < 1 || mes > 12) return mensaje;
  const finDeMes = new Date(anio, mes, 0, 23, 59, 59);
  return finDeMes >= hoy ? null : mensaje;
}

export function validarCvv(valor) {
  return /^\d{3}$/.test(String(valor ?? '').trim()) ? null : 'CVV inválido';
}

export function validarTitularTarjeta(valor) {
  return String(valor ?? '').trim() ? null : 'Ingresá el nombre del titular';
}

/* ---------- Validación por bloque: devuelve { campo: mensaje } solo con los errores ---------- */
function soloErrores(mapa) {
  return Object.fromEntries(Object.entries(mapa).filter(([, msg]) => msg));
}

export function validarEquipo(e) {
  return soloErrores({
    marca: validarMarca(e.marca),
    modelo: validarModelo(e.modelo),
    valor: validarValor(e.valor),
    antiguedad: validarAntiguedad(e.antiguedad),
  });
}

export function validarTitular(t) {
  return soloErrores({
    nombre: validarNombre(t.nombre),
    apellido: validarApellido(t.apellido),
    dni: validarDni(t.dni),
    nacimiento: validarNacimiento(t.nacimiento),
    email: validarEmail(t.email),
    celular: validarCelular(t.celular),
    terminos: validarTerminos(t.terminos),
  });
}

export function validarPago(p) {
  return soloErrores({
    tarjeta: validarTarjeta(p.tarjeta),
    vencimiento: validarVencimiento(p.vencimiento),
    cvv: validarCvv(p.cvv),
    titular: validarTitularTarjeta(p.titular),
  });
}
