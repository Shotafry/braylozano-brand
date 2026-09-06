// Geometria del simbolo de marca de Bray Lozano.
//
// El simbolo es una "b": el asta en tinta a la izquierda, un hueco, y el bucle
// en cian formado por tres piezas que ademas se lee como un corchete de cierre.
//
// Proporciones fijadas por Bray el 2026-09-06 sobre un tablero de deslizadores:
// ancho de bucle 46, alto de bucle 56. No se cambian sin su permiso.
// Todo lo que dibuja el simbolo sale de aqui, para que no haya dos verdades.

const asta = 14
const hueco = 4
const anchoBucle = 46
const altoBucle = 56
const grosor = 14
const alto = 100
const ancho = asta + hueco + anchoBucle // 64
const topeBucle = alto - altoBucle // 44
const xBucle = asta + hueco // 18
const xCierre = ancho - grosor // 50
const yBase = alto - grosor // 86

export const SIMBOLO = {
  asta, hueco, anchoBucle, altoBucle, grosor,
  ancho, alto, topeBucle, xBucle, xCierre, yBase,
}

export function svgSimbolo({ tinta, cian, titulo }) {
  const etiqueta = titulo
    ? `role="img" aria-label="${titulo}"`
    : 'aria-hidden="true" focusable="false"'
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ancho} ${alto}" ${etiqueta}>`,
    `<rect x="0" y="0" width="${asta}" height="${alto}" fill="${tinta}"/>`,
    `<rect x="${xBucle}" y="${topeBucle}" width="${anchoBucle}" height="${grosor}" fill="${cian}"/>`,
    `<rect x="${xCierre}" y="${topeBucle}" width="${grosor}" height="${altoBucle}" fill="${cian}"/>`,
    `<rect x="${xBucle}" y="${yBase}" width="${anchoBucle}" height="${grosor}" fill="${cian}"/>`,
    `</svg>`,
  ].join('')
}
