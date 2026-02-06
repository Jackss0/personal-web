import { useState, useCallback } from 'react'
import BookScene from './components/BookScene'
import GalleryOverlay from './components/GalleryOverlay'
import DayCounter from './components/DayCounter'
import { FECHA_INICIO } from './data/meses'

type AppState = 'landing' | 'opening' | 'gallery'

export default function App() {
  const [state, setState] = useState<AppState>('landing')
  const [sceneOpacity, setSceneOpacity] = useState(1)

  const handleBookClick = useCallback(() => {
    if (state !== 'landing') return
    setState('opening')

    // Después de la animación 3D, mostrar la galería
    setTimeout(() => {
      setState('gallery')
    }, 3000)

    // Desvanecer el canvas suavemente
    setTimeout(() => {
      setSceneOpacity(0)
    }, 3400)
  }, [state])

  return (
    <div className="app">
      {/* ── Escena 3D ── */}
      <div
        className="canvas-container"
        style={{ opacity: sceneOpacity }}
      >
        <BookScene
          isOpen={state !== 'landing'}
          onBookClick={handleBookClick}
        />
      </div>

      {/* ── Overlay de aterrizaje ── */}
      {state === 'landing' && (
        <div className="landing-overlay">
          <DayCounter startDate={FECHA_INICIO} />
          <h1 className="landing-title">Nuestro Primer Año</h1>
          <p className="landing-subtitle">Un libro de amor escrito a dos</p>
          <p className="landing-hint">Haz clic en el libro para abrirlo</p>
        </div>
      )}

      {/* ── Galería ── */}
      {state === 'gallery' && <GalleryOverlay />}
    </div>
  )
}
