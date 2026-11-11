// Espera un rato. Se usa para simular lo que tarda un servidor en responder.
export function esperar(milisegundos: number): Promise<void> {
  return new Promise((resolver) => setTimeout(resolver, milisegundos))
}
