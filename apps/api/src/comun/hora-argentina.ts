const ZONA_HORARIA = 'America/Argentina/Buenos_Aires';
const DIAS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export interface MomentoLocal {
  diaSemana: number; // 0 = domingo ... 6 = sábado
  minutos: number; // minutos desde la medianoche: 20:30 = 1230
}

export function momentoEnArgentina(fecha: Date = new Date()): MomentoLocal {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: ZONA_HORARIA,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(fecha);

  const valor = (tipo: Intl.DateTimeFormatPartTypes) =>
    partes.find((parte) => parte.type === tipo)?.value ?? '';

  return {
    diaSemana: DIAS.indexOf(valor('weekday')),
    minutos: Number(valor('hour')) * 60 + Number(valor('minute')),
  };
}