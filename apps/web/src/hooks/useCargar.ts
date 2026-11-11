import { useEffect, useState } from 'react'

interface EstadoCarga<T> {
  datos: T | null
  cargando: boolean
  error: boolean
}

// Hook para pedir datos al cargar una pantalla. Devuelve en qué estado está el pedido:
// cargando, con error o con los datos listos. Se reutiliza para la carta, las zonas, etc.
// La función que se pasa tiene que ser siempre la misma (una definida fuera del componente).
export function useCargar<T>(cargar: () => Promise<T>): EstadoCarga<T> {
  const [estado, setEstado] = useState<EstadoCarga<T>>({ datos: null, cargando: true, error: false })

  useEffect(() => {
    // Si el componente se cierra antes de que llegue la respuesta, la ignoramos.
    let vigente = true
    cargar()
      .then((datos) => {
        if (vigente) setEstado({ datos, cargando: false, error: false })
      })
      .catch(() => {
        if (vigente) setEstado({ datos: null, cargando: false, error: true })
      })
    return () => {
      vigente = false
    }
  }, [cargar])

  return estado
}
