import { useParams } from 'react-router-dom'

export default function PaginaSeguimiento() {
  // useParams lee el valor dinámico de la URL: /seguimiento/:token
  const { token } = useParams()
  return <h1 className="p-4 text-2xl font-bold">Seguimiento del pedido {token}</h1>
}
