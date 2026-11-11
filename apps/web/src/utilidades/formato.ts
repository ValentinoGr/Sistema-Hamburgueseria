// Intl.NumberFormat es el formateador nativo del navegador: pone puntos de miles y el símbolo $.
const formateadorPesos = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

// formatearPrecio(8500) -> "$ 8.500"
export function formatearPrecio(pesos: number): string {
  return formateadorPesos.format(pesos)
}
