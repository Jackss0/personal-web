import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import {
  createLeatherTextures,
  createCoverDesign,
  createSpineDesign,
  createPageEdgeTexture,
  createGlowTexture,
} from './bookTextures'

interface BookProps {
  isOpen: boolean
  onClick: () => void
}

/* ─────────────────────────────────────────
   Dimensiones: libro más grueso y con volumen
   ───────────────────────────────────────── */
const BOOK_W = 2.0
const BOOK_H = 2.8
const COVER_T = 0.07
const PAGES_T = 0.28
const SPINE_W = 0.18
const HALF_W = BOOK_W / 2
const TOTAL_T = PAGES_T + COVER_T * 2

const COVER_TEX_W = 1024
const COVER_TEX_H = Math.round(COVER_TEX_W * (BOOK_H / BOOK_W))
const SPINE_TEX_W = 128
const SPINE_TEX_H = COVER_TEX_H

const NUM_PAGE_LAYERS = 10
const PAGE_LAYER_THICKNESS = 0.012

export default function Book({ isOpen, onClick }: BookProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const frontPivotRef = useRef<THREE.Group>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)
  const { camera } = useThree()

  const [hovered, setHovered] = useState(false)
  const hasOpened = useRef(false)
  const isFloating = useRef(true)

  const leatherTex = useMemo(
    () => createLeatherTextures(512, Math.round(512 * (BOOK_H / BOOK_W))),
    [],
  )
  const coverDesign = useMemo(
    () => createCoverDesign(COVER_TEX_W, COVER_TEX_H),
    [],
  )
  const spineDesign = useMemo(
    () => createSpineDesign(SPINE_TEX_W, SPINE_TEX_H),
    [],
  )
  const pageEdgeTex = useMemo(
    () => createPageEdgeTexture(80, 560),
    [],
  )
  const glowTex = useMemo(() => createGlowTexture(512), [])

  const coverMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: leatherTex.map,
        bumpMap: leatherTex.bumpMap,
        bumpScale: 0.32,
        roughness: 0.55,
        metalness: 0.03,
        clearcoat: 0.28,
        clearcoatRoughness: 0.45,
        emissive: new THREE.Color('#1a1208'),
        emissiveIntensity: 0.12,
        color: '#6b4420',
      }),
    [leatherTex],
  )

  const spineMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: leatherTex.map,
        bumpMap: leatherTex.bumpMap,
        bumpScale: 0.3,
        roughness: 0.55,
        metalness: 0.02,
        clearcoat: 0.25,
        clearcoatRoughness: 0.5,
        emissive: new THREE.Color('#150d06'),
        emissiveIntensity: 0.1,
        color: '#4a3018',
      }),
    [leatherTex],
  )

  const pageMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: pageEdgeTex,
        color: '#d4a84c',
        roughness: 0.3,
        metalness: 0.75,
        emissive: new THREE.Color('#e8c050'),
        emissiveIntensity: 0.35,
      }),
    [pageEdgeTex],
  )

  const goldOverlayMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: coverDesign,
        emissiveMap: coverDesign,
        emissive: new THREE.Color('#D4A853'),
        emissiveIntensity: 0.4,
        transparent: true,
        alphaTest: 0.06,
        depthWrite: false,
        side: THREE.FrontSide,
      }),
    [coverDesign],
  )

  const spineOverlayMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: spineDesign,
        emissiveMap: spineDesign,
        emissive: new THREE.Color('#ffffff'),
        emissiveIntensity: 0.25,
        transparent: true,
        alphaTest: 0.05,
        depthWrite: false,
      }),
    [spineDesign],
  )

  const goldBandMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e8b84a',
        roughness: 0.2,
        metalness: 0.85,
        emissive: new THREE.Color('#D4A853'),
        emissiveIntensity: 0.25,
      }),
    [],
  )

  useFrame((state) => {
    if (!isFloating.current || !groupRef.current) return
    const t = state.clock.elapsedTime

    groupRef.current.position.y = Math.sin(t * 0.55) * 0.15
    groupRef.current.rotation.z = Math.sin(t * 0.38) * 0.018

    const restAngle = 0.1
    const baseY = Math.sin(t * 0.18) * 0.05
    const hoverExtra = hovered ? 0.08 : 0
    groupRef.current.rotation.y +=
      (restAngle + baseY + hoverExtra - groupRef.current.rotation.y) * 0.06

    if (glowRef.current) {
      const scale = 1 + Math.sin(t * 0.5) * 0.06
      glowRef.current.scale.set(scale, scale, 1)
    }
  })

  useFrame(() => {
    const glowTarget = hovered && isFloating.current ? 0.55 : 0.3
    goldOverlayMat.emissiveIntensity +=
      (glowTarget - goldOverlayMat.emissiveIntensity) * 0.08

    const clearTarget = hovered && isFloating.current ? 0.55 : 0.35
    coverMat.clearcoat += (clearTarget - coverMat.clearcoat) * 0.06

    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial
      const opTarget = hovered && isFloating.current ? 0.8 : 0.5
      mat.opacity += (opTarget - mat.opacity) * 0.06
    }
  })

  useEffect(() => {
    if (!isOpen || hasOpened.current) return
    hasOpened.current = true
    isFloating.current = false

    const tl = gsap.timeline()

    tl.to(groupRef.current.position, {
      x: 0, y: 0, z: 0,
      duration: 0.7,
      ease: 'power2.out',
    })
    tl.to(
      groupRef.current.rotation,
      { x: -0.35, y: 0, z: 0, duration: 0.7, ease: 'power2.out' },
      '<',
    )

    if (glowRef.current) {
      tl.to(
        (glowRef.current.material as THREE.MeshBasicMaterial),
        { opacity: 0, duration: 0.8, ease: 'power1.in' },
        '<',
      )
    }

    tl.to(
      frontPivotRef.current.rotation,
      { y: -Math.PI * 0.92, duration: 1.6, ease: 'power3.inOut' },
      '+=0.15',
    )

    tl.to(
      camera.position,
      {
        x: 0, y: 1.8, z: 3.2,
        duration: 1.6,
        ease: 'power2.inOut',
        onUpdate: () => camera.lookAt(0, 0, 0),
      },
      '-=1.3',
    )

    return () => { tl.kill() }
  }, [isOpen, camera])

  const FRONT_Z = PAGES_T / 2 + COVER_T / 2
  const OVERLAY_Z = PAGES_T / 2 + COVER_T + 0.004

  const spineBandY = useMemo(
    () => [-1.05, -0.5, 0, 0.5, 1.05],
    [],
  )

  return (
    <group
      ref={groupRef}
      onPointerDown={() => { if (!isOpen) onClick() }}
      onPointerOver={() => {
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'default'
      }}
    >
      {/* ════ HALO ════ */}
      <mesh ref={glowRef} position={[0, 0, -1.4]} renderOrder={-1}>
        <planeGeometry args={[6, 5.5]} />
        <meshBasicMaterial
          map={glowTex}
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ════ TAPA TRASERA (más gruesa) ════ */}
      <RoundedBox
        args={[BOOK_W, BOOK_H, COVER_T]}
        radius={0.022}
        smoothness={4}
        position={[0, 0, -(PAGES_T / 2 + COVER_T / 2)]}
        material={coverMat}
      />

      {/* ════ BLOQUE PRINCIPAL DE PÁGINAS (más grueso) ════ */}
      <mesh position={[0.05, 0, 0]} material={pageMat}>
        <boxGeometry args={[BOOK_W - 0.16, BOOK_H - 0.12, PAGES_T]} />
      </mesh>

      {/* ════ CAPAS DE PÁGINAS VISIBLES (canto derecho) ── cada capa un poco más adelante ── */}
      {Array.from({ length: NUM_PAGE_LAYERS }, (_, i) => {
        const zOffset = PAGES_T / 2 - PAGE_LAYER_THICKNESS / 2 - i * PAGE_LAYER_THICKNESS - 0.002 * i
        return (
          <mesh
            key={i}
            position={[HALF_W - 0.06 + i * 0.002, 0, zOffset]}
            material={pageMat}
          >
            <boxGeometry
              args={[PAGE_LAYER_THICKNESS, BOOK_H - 0.14, PAGE_LAYER_THICKNESS * 1.2]}
            />
          </mesh>
        )
      })}

      {/* ════ TAPA FRONTAL ════ */}
      <group ref={frontPivotRef} position={[-HALF_W, 0, 0]}>
        <RoundedBox
          args={[BOOK_W, BOOK_H, COVER_T]}
          radius={0.022}
          smoothness={4}
          position={[HALF_W, 0, FRONT_Z]}
          material={coverMat}
        />
        <mesh position={[HALF_W, 0, OVERLAY_Z]}>
          <planeGeometry args={[BOOK_W - 0.05, BOOK_H - 0.05]} />
          <primitive object={goldOverlayMat} attach="material" />
        </mesh>
      </group>

      {/* ════ LOMO PRINCIPAL ════ */}
      <mesh
        position={[-(HALF_W + SPINE_W / 2), 0, 0]}
        material={spineMat}
      >
        <boxGeometry args={[SPINE_W, BOOK_H, TOTAL_T]} />
      </mesh>

      {/* ════ BANDAS DORADAS EN RELIEVE (3D) ════ */}
      {spineBandY.map((y) => (
        <mesh
          key={y}
          position={[-(HALF_W + SPINE_W / 2) - 0.018, y, 0]}
          material={goldBandMat}
        >
          <boxGeometry
            args={[0.035, 0.08, TOTAL_T + 0.02]}
          />
        </mesh>
      ))}

      {/* Overlay de diseño del lomo (textura) */}
      <mesh
        position={[-(HALF_W + SPINE_W + 0.002), 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <planeGeometry args={[TOTAL_T - 0.02, BOOK_H - 0.08]} />
        <primitive object={spineOverlayMat} attach="material" />
      </mesh>

      {/* ════ TAPAS DEL LOMO (cabeza y pie) ── pequeños rebordes ════ */}
      <mesh
        position={[-(HALF_W + SPINE_W / 2), BOOK_H / 2 + 0.028, 0]}
        material={spineMat}
      >
        <boxGeometry args={[SPINE_W + 0.02, 0.04, TOTAL_T + 0.02]} />
      </mesh>
      <mesh
        position={[-(HALF_W + SPINE_W / 2), -BOOK_H / 2 - 0.028, 0]}
        material={spineMat}
      >
        <boxGeometry args={[SPINE_W + 0.02, 0.04, TOTAL_T + 0.02]} />
      </mesh>

      {/* ════ MARCAPÁGINAS ════ */}
      <mesh
        position={[0.18, BOOK_H / 2 + 0.24, 0]}
        rotation={[0, 0, 0.06]}
      >
        <planeGeometry args={[0.08, 0.55]} />
        <meshStandardMaterial
          color="#D4A853"
          emissive="#D4A853"
          emissiveIntensity={0.2}
          side={THREE.DoubleSide}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh position={[0.2, BOOK_H / 2 + 0.54, 0]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial
          color="#D4A853"
          emissive="#D4A853"
          emissiveIntensity={0.2}
        />
      </mesh>

      <pointLight
        position={[0, 0.5, 2]}
        intensity={6}
        color="#ffe8d0"
        decay={2}
      />

      {/* Luz suave en el canto de las páginas (brillo dorado) */}
      <pointLight
        position={[HALF_W + 0.35, 0, 0]}
        intensity={12}
        color="#ffe4a0"
        decay={2}
        distance={3}
      />
    </group>
  )
}
