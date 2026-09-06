// Genera los SVG de marca compuesta: el simbolo mas la palabra "lozano" con
// las letras convertidas a trazados.
//
// Las letras van trazadas a proposito. Alinear un SVG junto a texto vivo
// depende de como cada navegador mide la fuente, y en las pruebas el simbolo
// se desplazaba unos pixeles segun la pantalla. Trazado, la alineacion es
// geometrica y sale igual en navegador, correo y PDF.
//
// El simbolo ES la letra "b", asi que la palabra escrita empieza en "lozano":
// el ojo lee "blozano" sin que la b este escrita dos veces.
//
// Uso: node scripts/generar-marca.mjs

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import opentype from 'opentype.js'
import { SIMBOLO, svgSimbolo } from './geometria.mjs'

const PALABRA = 'lozano'
const SEPARACION = 10 // hueco entre simbolo y palabra, en unidades del lienzo
const RUTA_FUENTE = new URL('../fuentes/IBMPlexMono-SemiBold.ttf', import.meta.url)

function cargarFuente(url) {
  const buf = readFileSync(url)
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
  return opentype.parse(ab)
}

// El `toPathData` de opentype.js 2.0.0 escupe NaN en algunas coordenadas de la
// ultima letra aunque los comandos del trazado sean todos finitos. Se comprobo
// con toPathData(0), (2) y (3): los tres fallan igual. Asi que se serializa a
// mano desde los comandos, que si son correctos, y se comprueba el resultado.
export function aPathData(comandos, decimales = 2) {
  const n = (v) => {
    if (!Number.isFinite(v)) throw new Error(`Coordenada no finita en el trazado: ${v}`)
    return String(Number(v.toFixed(decimales)))
  }
  const partes = []
  for (const c of comandos) {
    switch (c.type) {
      case 'M': partes.push(`M${n(c.x)} ${n(c.y)}`); break
      case 'L': partes.push(`L${n(c.x)} ${n(c.y)}`); break
      case 'C': partes.push(`C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`); break
      case 'Q': partes.push(`Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`); break
      case 'Z': partes.push('Z'); break
      default: throw new Error(`Comando de trazado desconocido: ${c.type}`)
    }
  }
  const d = partes.join('')
  if (d.includes('NaN') || d.includes('undefined')) {
    throw new Error('El trazado generado contiene NaN')
  }
  return d
}

let fuenteCache = null
function fuenteCargada() {
  if (!fuenteCache) fuenteCache = cargarFuente(RUTA_FUENTE)
  return fuenteCache
}

// La altura del simbolo tiene que ser la de la "l": son la misma letra en la
// lectura. Se busca el cuerpo al que la mancha de la "l" mide exactamente
// SIMBOLO.alto, y desde ahi se alinea todo.
function cuerpoParaAlturaDeL(objetivo) {
  const base = 1000
  const caja = fuenteCargada().getPath('l', 0, 0, base).getBoundingBox()
  return (objetivo / (caja.y2 - caja.y1)) * base
}

function generarMarca({ tinta, cian, sufijo }) {
  const cuerpo = cuerpoParaAlturaDeL(SIMBOLO.alto)
  const cajaL = fuenteCargada().getPath('l', 0, 0, cuerpo).getBoundingBox()

  // getPath dibuja con la linea de base en y=0 y la mancha hacia y negativo.
  // Bajando todo -y1, el tope de la "l" queda en y=0 y su pie en y=100,
  // que es justo el espacio que ocupa el simbolo.
  const lineaBase = -cajaL.y1
  const x0 = SIMBOLO.ancho + SEPARACION
  const trazo = fuenteCargada().getPath(PALABRA, x0, lineaBase, cuerpo)
  const cajaPalabra = trazo.getBoundingBox()

  // Las letras redondas rebasan un poco la linea de base, asi que el lienzo
  // se estira a la union de las dos manchas en lugar de cortar.
  const arriba = Math.min(0, cajaPalabra.y1)
  const abajo = Math.max(SIMBOLO.alto, cajaPalabra.y2)
  const ancho = Math.ceil(cajaPalabra.x2)
  const alto = Math.ceil(abajo - arriba)
  const desplazamiento = arriba < 0 ? ` transform="translate(0 ${(-arriba).toFixed(2)})"` : ''

  const piezas = svgSimbolo({ tinta, cian })
    .replace(/^<svg[^>]*>/, '')
    .replace(/<\/svg>$/, '')

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ancho} ${alto}" role="img" aria-label="Bray Lozano">`,
    `<g${desplazamiento}>`,
    piezas,
    `<path d="${aPathData(trazo.commands)}" fill="${tinta}"/>`,
    `</g>`,
    `</svg>`,
  ].join('')

  writeFileSync(new URL(`../svg/marca-${sufijo}.svg`, import.meta.url), svg)
  return {
    sufijo,
    ancho,
    alto,
    cuerpo: Math.round(cuerpo * 100) / 100,
    lineaBase: Math.round(lineaBase * 100) / 100,
  }
}

function main() {
  mkdirSync(new URL('../svg/', import.meta.url), { recursive: true })

  const marcas = [
    generarMarca({ tinta: '#0F161D', cian: '#0A8DAD', sufijo: 'claro' }),
    generarMarca({ tinta: '#E3E9EE', cian: '#22D3EE', sufijo: 'panel' }),
  ]

  const simbolos = {
    'simbolo.svg': svgSimbolo({ tinta: 'currentColor', cian: 'var(--bl-accent, #0A8DAD)' }),
    'simbolo-claro.svg': svgSimbolo({ tinta: '#0F161D', cian: '#0A8DAD', titulo: 'Bray Lozano' }),
    'simbolo-panel.svg': svgSimbolo({ tinta: '#E3E9EE', cian: '#22D3EE', titulo: 'Bray Lozano' }),
  }
  for (const [nombre, contenido] of Object.entries(simbolos)) {
    writeFileSync(new URL(`../svg/${nombre}`, import.meta.url), contenido)
  }

  console.log('marca:', marcas)
  console.log('simbolos:', Object.keys(simbolos).join(', '))
}

// Solo genera cuando se ejecuta a mano. Importarlo desde una prueba no debe
// reescribir los SVG del repo: la prueba verifica lo que hay commiteado.
// pathToFileURL en lugar de armar la cadena a mano, que en Windows falla por
// las barras invertidas de la ruta.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main()
