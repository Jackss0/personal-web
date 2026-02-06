import { useState, useRef, useCallback, useEffect } from 'react'
import gsap from 'gsap'
import { MESES, FECHA_INICIO, getFotos } from '../data/meses'
import DayCounter from './DayCounter'

const TOTAL_PAGES = MESES.length + 1

export default function GalleryOverlay() {
  const [currentPage, setCurrentPage] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([])
  const [musicPlaying, setMusicPlaying] = useState(false)

  const pageRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const base = import.meta.env.BASE_URL || '/'
    audioRef.current = new Audio(`${base}music/song.mp3`)
    audioRef.current.loop = true
    audioRef.current.volume = 0.4
    return () => {
      audioRef.current?.pause()
      audioRef.current = null
    }
  }, [])

  const toggleMusic = useCallback(() => {
    if (!audioRef.current) return
    if (musicPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {})
    }
    setMusicPlaying((p) => !p)
  }, [musicPlaying])

  const goToPage = useCallback(
    (index: number) => {
      if (isAnimating || index < 0 || index >= TOTAL_PAGES) return
      setIsAnimating(true)

      const el = pageRef.current
      if (!el) return

      gsap.to(el, {
        opacity: 0,
        y: 15,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setCurrentPage(index)
          gsap.fromTo(
            el,
            { opacity: 0, y: -15 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: 'power2.out',
              onComplete: () => setIsAnimating(false),
            },
          )
        },
      })
    },
    [isAnimating],
  )

  const spawnHearts = useCallback(() => {
    const newHearts = Array.from({ length: 25 }, (_, i) => ({
      id: Date.now() + i,
      x: 15 + Math.random() * 70,
      y: 70 + Math.random() * 20,
    }))
    setHearts(newHearts)
    setTimeout(() => setHearts([]), 3500)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToPage(currentPage + 1)
      if (e.key === 'ArrowLeft') goToPage(currentPage - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [currentPage, goToPage])

  const isLast = currentPage === MESES.length
  const mes = isLast ? null : MESES[currentPage]
  const fotos = mes ? getFotos(mes) : []

  const gridClass =
    fotos.length === 0
      ? ''
      : fotos.length === 1
        ? 'page-photos--1'
        : fotos.length === 2
          ? 'page-photos--2'
          : fotos.length === 3
            ? 'page-photos--3'
            : fotos.length === 4
              ? 'page-photos--4'
              : 'page-photos--many'

  return (
    <div className="gallery-overlay">
      <div className="gallery-header">
        <span className="gallery-title-small">Nuestro Primer Año</span>
        <button
          className="music-toggle"
          onClick={toggleMusic}
          title={musicPlaying ? 'Silenciar' : 'Reproducir música'}
        >
          {musicPlaying ? '🔊 Música' : '🔇 Música'}
        </button>
      </div>

      <div className="gallery-container">
        <div className="gallery-page" ref={pageRef}>
          {isLast ? (
            <div className="final-page final-page--carta">
              <div className="final-ornament">✦ ♥ ✦</div>
              <h2 className="carta-title">Una carta para ti</h2>
              <div className="carta-texto">
                <p>
                  Este viaje contigo está siendo esta siendo toda una aventura maravillosa.
                  Cada mes que pasamos juntos me recuerda por qué te elegí y por qué me elegiste:
                  a pesar de todas las dificultades, estamos aquí, juntos, eligiéndonos cada día, gracias por tenerme siempre paciencia.
                </p>
                <p>
                  Gracias por ser mi compañera, mi cómplice y mi hogar. Gracias por tus detalles tan bonitos, por regalarme esa sonrisa tuya tan linda. 
                  No hay nada que desee más que seguir escribiendo esta historia a tu lado, y espero que este regalo te guste mi princesa.
                </p>
                <p>
                  Aquí va por muchos capítulos más, siempre contigo.
                </p>
                <p className="carta-firma">
                  Con todo mi amor,<br />
                  <span className="carta-nombre">de tu chiquito Josue</span>
                </p>
              </div>
              <DayCounter startDate={FECHA_INICIO} />
              <button className="love-button" onClick={spawnHearts}>
                Te amo 💖
              </button>
            </div>
          ) : (
            <>
              {fotos.length > 0 ? (
                <div className={`page-photos ${gridClass}`}>
                  {fotos.map((src, i) => (
                    <div
                      key={`${currentPage}-${i}-${src}`}
                      className="page-photo-item"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    >
                      <div className="page-photo-item-inner">
                        <img src={src} alt={`Mes ${mes!.numero} - ${i + 1}`} loading="lazy" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="page-photo">
                  <div className="page-photo-inner">
                    <div className="photo-placeholder">
                      <span className="photo-month">Mes {mes!.numero}</span>
                      <span className="photo-hint">
                        Agrega fotos en data/meses.ts con fotos: ['/photos/mes1.jpg', ...]
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="page-content">
                <span className="page-month-badge">Mes {mes!.numero}</span>
                <h2 className="page-title">{mes!.titulo}</h2>
                <p className="page-date">{mes!.fecha}</p>
                <p className="page-text">"{mes!.texto}"</p>
              </div>
            </>
          )}
        </div>

        <div className="gallery-nav">
          <button
            className="nav-btn"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 0}
            aria-label="Página anterior"
          >
            ‹
          </button>
          <span className="page-indicator">
            {currentPage + 1} / {TOTAL_PAGES}
          </span>
          <button
            className="nav-btn"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === TOTAL_PAGES - 1}
            aria-label="Página siguiente"
          >
            ›
          </button>
        </div>
      </div>

      {hearts.length > 0 && (
        <div className="hearts-container">
          {hearts.map((h) => (
            <span
              key={h.id}
              className="floating-heart"
              style={{
                left: `${h.x}%`,
                top: `${h.y}%`,
                animationDelay: `${Math.random() * 0.6}s`,
                fontSize: `${1 + Math.random() * 1.5}rem`,
              }}
            >
              {['💖', '💕', '❤️', '💗', '✨'][Math.floor(Math.random() * 5)]}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
