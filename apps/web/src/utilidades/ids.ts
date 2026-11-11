// Genera un identificador único para uso interno del front.
// No usamos crypto.randomUUID porque no existe en http (por ejemplo al probar desde el celular por la red local).
export function generarId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}
