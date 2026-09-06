/** Constantes de la geometria del simbolo, en un lienzo de 64 por 100. */
export interface Simbolo {
  /** Ancho del asta vertical en tinta. */
  asta: number
  /** Separacion entre el asta y el bucle. */
  hueco: number
  /** Ancho del bucle en cian. */
  anchoBucle: number
  /** Alto del bucle en cian. */
  altoBucle: number
  /** Grosor de cada pieza. */
  grosor: number
  /** Ancho total del lienzo. */
  ancho: number
  /** Alto total del lienzo, que es tambien la altura de la letra ele. */
  alto: number
  /** Coordenada y del borde superior del bucle. */
  topeBucle: number
  /** Coordenada x donde empieza el bucle. */
  xBucle: number
  /** Coordenada x de la pieza que cierra el bucle por la derecha. */
  xCierre: number
  /** Coordenada y de la pieza inferior del bucle. */
  yBase: number
}

export const SIMBOLO: Simbolo

export interface OpcionesSimbolo {
  /** Color del asta. Acepta un valor, `currentColor` o una variable CSS. */
  tinta: string
  /** Color de las tres piezas del bucle. */
  cian: string
  /**
   * Texto alternativo. Con titulo, el SVG sale como imagen con etiqueta;
   * sin el, sale oculto a lectores de pantalla.
   */
  titulo?: string
}

/** Devuelve el SVG del simbolo como cadena. */
export function svgSimbolo(opciones: OpcionesSimbolo): string
