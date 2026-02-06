import * as THREE from 'three'

/* ═══════════════════════════════════════════════════
   UTILIDADES DE DIBUJO
   ═══════════════════════════════════════════════════ */

const clamp = (v: number, lo: number, hi: number) =>
  v < lo ? lo : v > hi ? hi : v

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
}

function diamond(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x, y - size)
  ctx.lineTo(x + size * 0.6, y)
  ctx.lineTo(x, y + size)
  ctx.lineTo(x - size * 0.6, y)
  ctx.closePath()
  ctx.fill()
}

function divider(ctx: CanvasRenderingContext2D, cx: number, y: number, hw: number, color: string) {
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = 1.5

  // Línea izquierda
  ctx.beginPath()
  ctx.moveTo(cx - hw, y)
  ctx.lineTo(cx - 14, y)
  ctx.stroke()

  // Línea derecha
  ctx.beginPath()
  ctx.moveTo(cx + 14, y)
  ctx.lineTo(cx + hw, y)
  ctx.stroke()

  // Diamante central
  diamond(ctx, cx, y, 9, color)

  // Puntos finales
  dot(ctx, cx - hw, y, 3, color)
  dot(ctx, cx + hw, y, 3, color)

  // Diamantes pequeños
  diamond(ctx, cx - hw + 22, y, 4.5, color)
  diamond(ctx, cx + hw - 22, y, 4.5, color)
}

function cornerScroll(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  sx: number, sy: number,
  color: string,
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(sx, sy)

  ctx.strokeStyle = color
  ctx.fillStyle = color

  // ── Scroll horizontal ──
  ctx.lineWidth = 2.8
  ctx.beginPath()
  ctx.moveTo(3, 3)
  ctx.lineTo(55, 3)
  ctx.bezierCurveTo(72, 3, 80, 12, 72, 25)
  ctx.bezierCurveTo(66, 35, 50, 32, 52, 22)
  ctx.bezierCurveTo(54, 14, 62, 11, 60, 18)
  ctx.stroke()

  // Segundo curl horizontal
  ctx.lineWidth = 1.8
  ctx.beginPath()
  ctx.moveTo(30, 3)
  ctx.bezierCurveTo(35, 10, 42, 14, 38, 20)
  ctx.stroke()

  // ── Scroll vertical ──
  ctx.lineWidth = 2.8
  ctx.beginPath()
  ctx.moveTo(3, 3)
  ctx.lineTo(3, 55)
  ctx.bezierCurveTo(3, 72, 12, 80, 25, 72)
  ctx.bezierCurveTo(35, 66, 32, 50, 22, 52)
  ctx.bezierCurveTo(14, 54, 11, 62, 18, 60)
  ctx.stroke()

  // Segundo curl vertical
  ctx.lineWidth = 1.8
  ctx.beginPath()
  ctx.moveTo(3, 30)
  ctx.bezierCurveTo(10, 35, 14, 42, 20, 38)
  ctx.stroke()

  // ── Ornamentos en la esquina ──
  dot(ctx, 3, 3, 4.5, color)
  diamond(ctx, 18, 18, 6, color)
  dot(ctx, 30, 12, 2, color)
  dot(ctx, 12, 30, 2, color)

  ctx.restore()
}

/* ═══════════════════════════════════════════════════
   TEXTURA DE PERGAMINO (portada clara, estilo antiguo)
   ═══════════════════════════════════════════════════ */

export function createParchmentTextures(w: number, h: number) {
  const cCvs = document.createElement('canvas')
  cCvs.width = w
  cCvs.height = h
  const cc = cCvs.getContext('2d')!

  const grad = cc.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.65)
  grad.addColorStop(0, '#d4c4a8')
  grad.addColorStop(0.5, '#c4b090')
  grad.addColorStop(1, '#9a8a6a')
  cc.fillStyle = grad
  cc.fillRect(0, 0, w, h)

  const imgD = cc.getImageData(0, 0, w, h)
  const px = imgD.data
  for (let i = 0; i < px.length; i += 4) {
    const n = (Math.random() - 0.5) * 18
    px[i] = clamp(px[i] + n, 0, 255)
    px[i + 1] = clamp(px[i + 1] + n * 0.9, 0, 255)
    px[i + 2] = clamp(px[i + 2] + n * 0.6, 0, 255)
  }
  cc.putImageData(imgD, 0, 0)

  for (let i = 0; i < 400; i++) {
    const x = Math.random() * w
    const y = Math.random() * h
    const r = 0.5 + Math.random() * 3
    cc.fillStyle = `rgba(0,0,0,${0.02 + Math.random() * 0.04})`
    cc.beginPath()
    cc.arc(x, y, r, 0, Math.PI * 2)
    cc.fill()
  }

  const map = new THREE.CanvasTexture(cCvs)
  map.colorSpace = THREE.SRGBColorSpace

  const bCvs = document.createElement('canvas')
  bCvs.width = w
  bCvs.height = h
  const bc = bCvs.getContext('2d')!
  bc.fillStyle = '#888'
  bc.fillRect(0, 0, w, h)
  const bImgD = bc.getImageData(0, 0, w, h)
  const bPx = bImgD.data
  for (let i = 0; i < bPx.length; i += 4) {
    const n = 128 + (Math.random() - 0.5) * 40
    bPx[i] = bPx[i + 1] = bPx[i + 2] = clamp(n, 0, 255)
  }
  bc.putImageData(bImgD, 0, 0)
  const bumpMap = new THREE.CanvasTexture(bCvs)
  return { map, bumpMap }
}

/* ═══════════════════════════════════════════════════
   TEXTURA DE CUERO (lomo oscuro)
   ═══════════════════════════════════════════════════ */

export function createLeatherTextures(w: number, h: number) {
  const cCvs = document.createElement('canvas')
  cCvs.width = w
  cCvs.height = h
  const cc = cCvs.getContext('2d')!

  const grad = cc.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.6)
  grad.addColorStop(0, '#7a5430')
  grad.addColorStop(0.4, '#5c3d22')
  grad.addColorStop(0.85, '#3d2818')
  grad.addColorStop(1, '#2a1a0e')
  cc.fillStyle = grad
  cc.fillRect(0, 0, w, h)

  // Ruido fino (grano del cuero)
  const imgD = cc.getImageData(0, 0, w, h)
  const px = imgD.data
  for (let i = 0; i < px.length; i += 4) {
    const n = (Math.random() - 0.5) * 22
    px[i] = clamp(px[i] + n, 0, 255)
    px[i + 1] = clamp(px[i + 1] + n * 0.5, 0, 255)
    px[i + 2] = clamp(px[i + 2] + n * 0.5, 0, 255)
  }
  cc.putImageData(imgD, 0, 0)

  // Poros oscuros
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * w
    const y = Math.random() * h
    const rx = 1 + Math.random() * 4
    const ry = rx * (0.3 + Math.random() * 1.4)
    cc.fillStyle = `rgba(0,0,0,${0.03 + Math.random() * 0.07})`
    cc.beginPath()
    cc.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2)
    cc.fill()
  }

  // Brillos sutiles (reflejos de cuero pulido)
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * w
    const y = Math.random() * h
    cc.strokeStyle = `rgba(255,200,150,${0.01 + Math.random() * 0.03})`
    cc.lineWidth = 0.5 + Math.random() * 2
    cc.beginPath()
    cc.moveTo(x, y)
    cc.lineTo(x + (Math.random() - 0.5) * 50, y + (Math.random() - 0.5) * 8)
    cc.stroke()
  }

  const map = new THREE.CanvasTexture(cCvs)
  map.colorSpace = THREE.SRGBColorSpace

  // ── Mapa de relieve ──
  const bCvs = document.createElement('canvas')
  bCvs.width = w
  bCvs.height = h
  const bc = bCvs.getContext('2d')!

  bc.fillStyle = '#808080'
  bc.fillRect(0, 0, w, h)

  const bImgD = bc.getImageData(0, 0, w, h)
  const bPx = bImgD.data
  for (let i = 0; i < bPx.length; i += 4) {
    const n = 128 + (Math.random() - 0.5) * 50
    bPx[i] = clamp(n, 0, 255)
    bPx[i + 1] = clamp(n, 0, 255)
    bPx[i + 2] = clamp(n, 0, 255)
  }
  bc.putImageData(bImgD, 0, 0)

  for (let i = 0; i < 250; i++) {
    const x = Math.random() * w
    const y = Math.random() * h
    const r = 2 + Math.random() * 6
    const v = Math.random() > 0.5 ? 155 : 100
    bc.fillStyle = `rgba(${v},${v},${v},0.18)`
    bc.beginPath()
    bc.arc(x, y, r, 0, Math.PI * 2)
    bc.fill()
  }

  const bumpMap = new THREE.CanvasTexture(bCvs)

  return { map, bumpMap }
}

/* ═══════════════════════════════════════════════════
   PORTADA: filigrana dorada solo en bordes (cuero visible al centro)
   ═══════════════════════════════════════════════════ */

export function createCoverDesign(w: number, h: number): THREE.CanvasTexture {
  const cvs = document.createElement('canvas')
  cvs.width = w
  cvs.height = h
  const ctx = cvs.getContext('2d')!
  const cx = w / 2
  const cy = h / 2

  ctx.clearRect(0, 0, w, h)

  const gold = '#D4A853'
  const goldLight = '#e8c870'
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  // ── Triple borde dorado concéntrico ──
  ctx.strokeStyle = gold
  ctx.lineWidth = 4
  roundRect(ctx, 30, 30, w - 60, h - 60, 8)
  ctx.stroke()
  ctx.lineWidth = 6
  roundRect(ctx, 50, 50, w - 100, h - 100, 6)
  ctx.stroke()
  ctx.lineWidth = 2.5
  roundRect(ctx, 72, 72, w - 144, h - 144, 5)
  ctx.stroke()

  // ── Puntos decorativos entre bordes ──
  const sp = 14
  for (let x = 85; x < w - 85; x += sp) {
    dot(ctx, x, 42, 2, gold)
    dot(ctx, x, h - 42, 2, gold)
  }
  for (let y = 85; y < h - 85; y += sp) {
    dot(ctx, 42, y, 2, gold)
    dot(ctx, w - 42, y, 2, gold)
  }

  // ── Filigrana dorada en las 4 esquinas ──
  cornerScroll(ctx, 74, 74, 1, 1, gold)
  cornerScroll(ctx, w - 74, 74, -1, 1, gold)
  cornerScroll(ctx, 74, h - 74, 1, -1, gold)
  cornerScroll(ctx, w - 74, h - 74, -1, -1, gold)

  // ── Diamantes en puntos medios de los bordes ──
  diamond(ctx, cx, 54, 10, goldLight)
  diamond(ctx, cx, h - 54, 10, goldLight)
  diamond(ctx, 54, cy, 10, goldLight)
  diamond(ctx, w - 54, cy, 10, goldLight)

  const tex = new THREE.CanvasTexture(cvs)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/* ═══════════════════════════════════════════════════
   DISEÑO DEL LOMO (dorado sobre transparente)
   ═══════════════════════════════════════════════════ */

export function createSpineDesign(w: number, h: number): THREE.CanvasTexture {
  const cvs = document.createElement('canvas')
  cvs.width = w
  cvs.height = h
  const ctx = cvs.getContext('2d')!
  const cx = w / 2
  const cy = h / 2

  ctx.clearRect(0, 0, w, h)

  const gold = '#D4A853'

  // ── Bandas horizontales ──
  const bands = [-0.38, -0.18, 0, 0.18, 0.38]
  bands.forEach((pct) => {
    const y = cy + h * pct
    ctx.strokeStyle = gold
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(8, y)
    ctx.lineTo(w - 8, y)
    ctx.stroke()

    // Líneas delgadas a los lados
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(8, y - 6)
    ctx.lineTo(w - 8, y - 6)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(8, y + 6)
    ctx.lineTo(w - 8, y + 6)
    ctx.stroke()

    // Diamante central
    diamond(ctx, cx, y, 5, gold)
  })

  // ── Título vertical ──
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(-Math.PI / 2)
  ctx.fillStyle = gold
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `600 ${Math.floor(w * 0.35)}px Georgia, "Times New Roman", serif`
  ctx.fillText('NUESTRO PRIMER AÑO', 0, 2)
  ctx.restore()

  // ── Estrellitas arriba y abajo ──
  ctx.fillStyle = gold
  ctx.font = `${Math.floor(w * 0.25)}px serif`
  ctx.textAlign = 'center'
  ctx.fillText('✦', cx, 25)
  ctx.fillText('✦', cx, h - 20)

  const tex = new THREE.CanvasTexture(cvs)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/* ═══════════════════════════════════════════════════
   CANTOS DORADOS (gilding)
   ═══════════════════════════════════════════════════ */

export function createPageEdgeTexture(w: number, h: number): THREE.CanvasTexture {
  const cvs = document.createElement('canvas')
  cvs.width = w
  cvs.height = h
  const ctx = cvs.getContext('2d')!

  const grad = ctx.createLinearGradient(0, 0, w, 0)
  grad.addColorStop(0, '#8a7028')
  grad.addColorStop(0.2, '#c9a84c')
  grad.addColorStop(0.5, '#e8d070')
  grad.addColorStop(0.8, '#c9a84c')
  grad.addColorStop(1, '#7a6020')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  for (let y = 0; y < h; y += 1) {
    const v = 0.85 + Math.random() * 0.2
    ctx.fillStyle = `rgba(200, 170, 80, ${v})`
    ctx.fillRect(0, y, w, 1)
  }

  for (let i = 0; i < 30; i++) {
    const x = Math.random() * w
    const y = Math.random() * h
    const r = 2 + Math.random() * 8
    const shine = ctx.createRadialGradient(x, y, 0, x, y, r)
    shine.addColorStop(0, 'rgba(255, 240, 180, 0.25)')
    shine.addColorStop(1, 'rgba(255, 240, 180, 0)')
    ctx.fillStyle = shine
    ctx.fillRect(x - r, y - r, r * 2, r * 2)
  }

  const tex = new THREE.CanvasTexture(cvs)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/* ═══════════════════════════════════════════════════
   HALO MÁGICO (resplandor detrás del libro)
   ═══════════════════════════════════════════════════ */

export function createGlowTexture(size: number): THREE.CanvasTexture {
  const cvs = document.createElement('canvas')
  cvs.width = size
  cvs.height = size
  const ctx = cvs.getContext('2d')!

  const c = size / 2
  const grad = ctx.createRadialGradient(c, c, 0, c, c, c)
  grad.addColorStop(0, 'rgba(230, 200, 120, 0.12)')
  grad.addColorStop(0.4, 'rgba(200, 170, 90, 0.06)')
  grad.addColorStop(0.7, 'rgba(180, 140, 60, 0.02)')
  grad.addColorStop(1, 'rgba(160, 120, 50, 0)')

  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)

  const tex = new THREE.CanvasTexture(cvs)
  return tex
}
