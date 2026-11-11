interface Props {
  id: string
  etiqueta: string
  valor: string
  alCambiar: (valor: string) => void
  error?: string // si hay error, se marca el campo y se muestra el mensaje
  tipo?: 'text' | 'tel'
  placeholder?: string
  autoComplete?: string
}

// Un campo de formulario con su etiqueta y su mensaje de error.
// Es un "input controlado": lo que se ve en el campo siempre viene del estado (valor),
// y cada tecla avisa con alCambiar para actualizar ese estado.
export default function CampoTexto({ id, etiqueta, valor, alCambiar, error, tipo = 'text', placeholder, autoComplete }: Props) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-tinta">
        {etiqueta}
      </label>
      <input
        id={id}
        type={tipo}
        value={valor}
        onChange={(evento) => alCambiar(evento.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`min-h-12 w-full rounded-lg border bg-white px-3 text-tinta placeholder:text-stone-400 ${
          error ? 'border-red-600' : 'border-stone-300'
        }`}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}
