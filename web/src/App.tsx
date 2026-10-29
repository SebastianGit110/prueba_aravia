import { useEffect, useState } from 'react'
import { apiUrl } from './api2'

type Estado =
  | { tipo: 'cargando' }
  | { tipo: 'ok'; mensaje: string }
  | { tipo: 'error'; mensaje: string }

function App() {
  const [estado, setEstado] = useState<Estado>({ tipo: 'cargando' })

  useEffect(() => {
    fetch(apiUrl('/'))
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`)
        return respuesta.text()
      })
      .then((mensaje) => setEstado({ tipo: 'ok', mensaje }))
      .catch((error: Error) => setEstado({ tipo: 'error', mensaje: error.message }))
  }, [])

  return (
    <main>
      <h1>Arranque de la prueba técnica</h1>
      <p>
        Esta pantalla existe solo para comprobar que el frontend le llega a la API.
        Bórrala y construye lo tuyo.
      </p>

      {estado.tipo === 'cargando' && <p>Consultando la API...</p>}
      {estado.tipo === 'ok' && <p>La API respondió: {estado.mensaje}</p>}
      {estado.tipo === 'error' && (
        <p>
          No se pudo hablar con la API ({estado.mensaje}). Revisa que esté
          corriendo en {apiUrl('')}.
        </p>
      )}
    </main>
  )
}

export default App
