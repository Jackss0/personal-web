export interface MesData {
  numero: number
  titulo: string
  texto: string
  fecha: string
  /** Una sola foto (compatibilidad) */
  fotoUrl?: string
  /** Varias fotos por mes (rutas en public/photos/) */
  fotos?: string[]
}

/** Devuelve el array de fotos de un mes (fotos o [fotoUrl] o []) */
export function getFotos(mes: MesData): string[] {
  if (mes.fotos?.length) return mes.fotos
  if (mes.fotoUrl) return [mes.fotoUrl]
  return []
}

export const FECHA_INICIO = '2025-02-05'

export const MESES: MesData[] = [
  {
    numero: 1,
    titulo: 'El Comienzo',
    texto: 'Cuando me enamore de ti perdidamente, y te di tus primeras flores y nunca mas te solte',
    fecha: 'Febrero 2025',
    // Ejemplo con varias fotos: descomenta y pon tus rutas en public/photos/
    fotos: ['/photos/mes1-1.jpeg', '/photos/mes1-2.jpeg','/photos/mes1-3.jpeg','/photos/mes1-4.jpeg',],
  },
  {
    numero: 2,
    titulo: 'Descubriéndonos',
    texto: 'Cada detalle tuyo se convirtió en mi parte favorita del día.',
    fecha: 'Marzo 2025',
    fotos: ['/photos/mes2-1.jpeg', '/photos/mes2-2.jpeg','/photos/mes2-3.jpeg','/photos/mes2-4.jpeg',],
  },
  {
    numero: 3,
    titulo: 'Cuando fuimos al concierto de stray kids',
    texto: 'Aguantamos como guerreros y volvi sin dormir a trabajar xd',
    fecha: 'Abril 2025',
    fotos: ['/photos/mes3-1.jpeg', '/photos/mes3-2.jpeg', '/photos/mes3-3.jpeg',],
  },
  {
    numero: 4,
    titulo: 'El mes donde compramos nuestras sandalias de vaquita',
    texto: 'Vimos peliculas y comimos mucho :3',
    fecha: 'Mayo 2025',
    fotos: ['/photos/mes4-1.jpeg', '/photos/mes4-2.jpeg', '/photos/mes4-3.jpeg','/photos/mes4-4.jpeg',],
  },
  {
    numero: 5,
    titulo: 'Mas flores para mi princesa',
    texto: 'Aprendi mas sobre flores y cuales ser mas detallista',
    fecha: 'Junio 2025',
    fotos: ['/photos/mes5-1.jpeg', '/photos/mes5-2.jpeg','/photos/mes5-3.jpeg',],
  },
  {
    numero: 6,
    titulo: 'Medio año juntitos',
    texto: 'Medio año amándote pero sentia como si nos conocieramos desde hace mucho tiempo',
    fecha: 'Julio 2025',
    fotos: ['/photos/mes6-1.jpeg', '/photos/mes6-2.jpeg', '/photos/mes6-3.jpeg', '/photos/mes6-4.jpeg',],
  },
  {
    numero: 7,
    titulo: 'Nuestro viajecito y celebramos tu cumpleaños',
    texto: 'Fue nuestro primer viaje y nada menos que a cusco, nose porque no consegui las fotos de tu cumple :(',
    fecha: 'Agosto 2025',
    fotos: ['/photos/mes7-1.jpeg', '/photos/mes7-2.jpeg', '/photos/mes7-3.jpeg', '/photos/mes7-4.jpeg',],
  },
  {
    numero: 8,
    titulo: 'Nuestro primer fowo :3',
    texto: 'Rico, caro, pero muy rico :3 que se repita verdad?',
    fecha: 'Septiembre 2025',
    fotos: ['/photos/mes8-1.jpeg', '/photos/mes8-2.jpeg', '/photos/mes8-3.jpeg',],
  },
  {
    numero: 9,
    titulo: 'Hiciste tu primer cosplay y estabas demasiado hermosa',
    texto: 'Por cierto aqui ya habia caido en el vicio del carton conmigo :3 jejejejeje',
    fecha: 'Octubre 2025',
    fotos: ['/photos/mes9-1.jpeg', '/photos/mes9-2.jpeg', '/photos/mes9-3.jpeg',],
  },
  {
    numero: 10,
    titulo: 'Nuestro primer halloween',
    texto: 'Y como siempre hermosaaaaa',
    fecha: 'Noviembre 2025',
    fotos: ['/photos/mes10-1.jpeg', '/photos/mes10-2.jpeg', '/photos/mes10-3.jpeg', ],
  },
  {
    numero: 11,
    titulo: 'Nuestro fin de año',
    texto: 'Cerrando el año juntitos y haciendo las reales cabalas xd',
    fecha: 'Diciembre 2025',
    fotos: ['/photos/mes11-1.jpeg', '/photos/mes11-2.jpeg',],
  },
  {
    numero: 12,
    titulo: 'Nuevo capitulo',
    texto: 'Y de la nada, nos mudamos jajajajaj y me diste regalitos por mi cumple c:',
    fecha: 'Enero 2026',
    fotos: ['/photos/mes12-1.jpeg', '/photos/mes12-2.jpeg', '/photos/mes12-3.jpeg',],
  },
]
