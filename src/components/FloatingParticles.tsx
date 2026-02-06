import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 120

/**
 * Partículas lentas y sutiles que flotan alrededor de la escena
 * complementando a las Sparkles de drei.
 */
export default function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null!)

  /* Posiciones y velocidades iniciales */
  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const spd = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      pos[i3] = (Math.random() - 0.5) * 14
      pos[i3 + 1] = (Math.random() - 0.5) * 10
      pos[i3 + 2] = (Math.random() - 0.5) * 14
      spd[i] = 0.02 + Math.random() * 0.04
    }
    return { positions: pos, speeds: spd }
  }, [])

  /* Geometría creada imperativamente para evitar problemas con bufferAttribute */
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [positions])

  /* Animación: movimiento vertical lento + ondulación */
  useFrame((state) => {
    if (!pointsRef.current) return
    const posArr = pointsRef.current.geometry.attributes.position
      .array as Float32Array
    const t = state.clock.elapsedTime

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      posArr[i3 + 1] += speeds[i] * 0.3
      posArr[i3] += Math.sin(t * 0.2 + i * 0.5) * 0.001
      posArr[i3 + 2] += Math.cos(t * 0.15 + i * 0.3) * 0.001

      if (posArr[i3 + 1] > 6) {
        posArr[i3 + 1] = -6
        posArr[i3] = (Math.random() - 0.5) * 14
        posArr[i3 + 2] = (Math.random() - 0.5) * 14
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.03}
        color="#d4a574"
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
