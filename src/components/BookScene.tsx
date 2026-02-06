import { Canvas } from '@react-three/fiber'
import { Sparkles, Environment } from '@react-three/drei'
import Book from './Book'
import FloatingParticles from './FloatingParticles'

interface BookSceneProps {
  isOpen: boolean
  onBookClick: () => void
}

export default function BookScene({ isOpen, onBookClick }: BookSceneProps) {
  return (
    <Canvas
      camera={{ position: [0.32, 0.18, 5.35], fov: 40 }}
      gl={{
        antialias: true,
        alpha: false,
        toneMapping: 3, /* ACESFilmicToneMapping */
        toneMappingExposure: 1.1,
      }}
      dpr={[1, 2]}
    >
      {/* ── Fondo ── */}
      <color attach="background" args={['#08081a']} />
      <fog attach="fog" args={['#08081a', 9, 22]} />

      {/* ── Iluminación basada en entorno (IBL) ── */}
      <Environment preset="apartment" environmentIntensity={0.3} />

      {/* ── Luces ── */}
      <ambientLight intensity={0.6} color="#d8d0f0" />

      {/* Principal: cálida frontal-derecha (brillo del cuero) */}
      <pointLight
        position={[3, 3, 5]}
        intensity={35}
        color="#ffe0b8"
        decay={2}
      />

      {/* Relleno: púrpura suave desde la izquierda */}
      <pointLight
        position={[-4, 2, 3]}
        intensity={12}
        color="#d4b0ff"
        decay={2}
      />

      {/* Contra: contorno trasero */}
      <pointLight
        position={[0, 4, -4]}
        intensity={8}
        color="#ffeedd"
        decay={2}
      />

      {/* Spot cenital: foco principal sobre el libro */}
      <spotLight
        position={[0, 7, 3]}
        intensity={25}
        angle={0.35}
        penumbra={0.85}
        color="#ffffff"
      />

      {/* Rim light inferior para definir la silueta */}
      <pointLight
        position={[0, -3, 2]}
        intensity={5}
        color="#d4a574"
        decay={2}
      />

      {/* ── Libro ── */}
      <Book isOpen={isOpen} onClick={onBookClick} />

      {/* ── Partículas doradas sobre portada y lomo ── */}
      <Sparkles
        count={130}
        size={2.2}
        scale={[2.6, 2, 2.6]}
        position={[0, 0, 0.25]}
        speed={0.06}
        opacity={0.7}
        color="#e8c858"
      />
      <Sparkles
        count={80}
        size={1.5}
        scale={[2.4, 1.8, 2.4]}
        position={[0, 0, 0.15]}
        speed={0.04}
        opacity={0.5}
        color="#fff0a0"
      />

      {/* ── Partículas de ambiente ── */}
      <Sparkles
        count={50}
        size={3}
        scale={[12, 8, 12]}
        speed={0.1}
        opacity={0.35}
        color="#d4a574"
      />

      {/* ── Partículas personalizadas ── */}
      <FloatingParticles />
    </Canvas>
  )
}
