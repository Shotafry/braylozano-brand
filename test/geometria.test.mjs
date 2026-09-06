import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { SIMBOLO, svgSimbolo } from '../scripts/geometria.mjs'
import { aPathData } from '../scripts/generar-marca.mjs'

describe('geometria del simbolo', () => {
  it('mide 64 por 100 y sale de las constantes', () => {
    expect(SIMBOLO.asta).toBe(14)
    expect(SIMBOLO.hueco).toBe(4)
    expect(SIMBOLO.anchoBucle).toBe(46)
    expect(SIMBOLO.altoBucle).toBe(56)
    expect(SIMBOLO.grosor).toBe(14)
    expect(SIMBOLO.ancho).toBe(64)
    expect(SIMBOLO.alto).toBe(100)
  })

  it('el bucle apoya en la linea de base y abre a la izquierda', () => {
    expect(SIMBOLO.topeBucle).toBe(44)
    expect(SIMBOLO.xBucle).toBe(18)
    expect(SIMBOLO.xCierre).toBe(50)
  })

  it('emite un SVG con las cuatro piezas y los colores pedidos', () => {
    const svg = svgSimbolo({ tinta: '#0F161D', cian: '#0A8DAD' })
    expect(svg).toContain('viewBox="0 0 64 100"')
    expect(svg).toContain('<rect x="0" y="0" width="14" height="100" fill="#0F161D"/>')
    expect(svg).toContain('<rect x="18" y="44" width="46" height="14" fill="#0A8DAD"/>')
    expect(svg).toContain('<rect x="50" y="44" width="14" height="56" fill="#0A8DAD"/>')
    expect(svg).toContain('<rect x="18" y="86" width="46" height="14" fill="#0A8DAD"/>')
  })

  it('acepta currentColor y variable CSS para la version tintable', () => {
    const svg = svgSimbolo({ tinta: 'currentColor', cian: 'var(--bl-accent, #0A8DAD)' })
    expect(svg).toContain('fill="currentColor"')
    expect(svg).toContain('fill="var(--bl-accent, #0A8DAD)"')
  })
})

describe('svg publicados', () => {
  const ficheros = [
    'svg/simbolo.svg', 'svg/simbolo-claro.svg', 'svg/simbolo-panel.svg',
    'svg/marca-claro.svg', 'svg/marca-panel.svg',
  ]

  it('existen los cinco', () => {
    for (const f of ficheros) {
      expect(existsSync(new URL(`../${f}`, import.meta.url)), f).toBe(true)
    }
  })

  it('el simbolo publicado coincide con la geometria', () => {
    const enDisco = readFileSync(new URL('../svg/simbolo-claro.svg', import.meta.url), 'utf8')
    expect(enDisco).toBe(svgSimbolo({ tinta: '#0F161D', cian: '#0A8DAD', titulo: 'Bray Lozano' }))
  })

  it('la marca compuesta lleva la palabra trazada y la l en tinta', () => {
    const marca = readFileSync(new URL('../svg/marca-claro.svg', import.meta.url), 'utf8')
    expect(marca).toMatch(/<path d="[^"]{100,}" fill="#0F161D"\/>/)
    expect(marca).not.toContain('<text')
  })

  // El serializador de opentype.js 2.0.0 metia NaN en la ultima letra.
  // Estas dos pruebas existen para que no vuelva a pasar sin avisar.
  it('ningun svg publicado contiene NaN', () => {
    for (const f of ficheros) {
      const contenido = readFileSync(new URL(`../${f}`, import.meta.url), 'utf8')
      expect(contenido, f).not.toContain('NaN')
      expect(contenido, f).not.toContain('undefined')
    }
  })

  it('la palabra apoya en la linea de base del simbolo', () => {
    const marca = readFileSync(new URL('../svg/marca-claro.svg', import.meta.url), 'utf8')
    // El asta mide 100 y la "l" tiene que medir lo mismo: su trazado empieza
    // arriba en y=0 y baja hasta y=100.
    expect(marca).toContain('M83.73 100L83.73 86.35')
    expect(marca).toMatch(/viewBox="0 0 \d+ 102"/)
  })
})

describe('serializador de trazados', () => {
  it('emite los cuatro tipos de comando', () => {
    const d = aPathData([
      { type: 'M', x: 1, y: 2 },
      { type: 'L', x: 3, y: 4 },
      { type: 'C', x1: 1, y1: 1, x2: 2, y2: 2, x: 3, y: 3 },
      { type: 'Q', x1: 1, y1: 1, x: 2, y: 2 },
      { type: 'Z' },
    ])
    expect(d).toBe('M1 2L3 4C1 1 2 2 3 3Q1 1 2 2Z')
  })

  it('redondea a dos decimales', () => {
    expect(aPathData([{ type: 'M', x: 1.239, y: 2.001 }])).toBe('M1.24 2')
  })

  it('lanza error ante una coordenada no finita, en lugar de emitir NaN', () => {
    expect(() => aPathData([{ type: 'M', x: NaN, y: 0 }])).toThrow(/no finita/)
  })

  it('lanza error ante un comando desconocido', () => {
    expect(() => aPathData([{ type: 'X' }])).toThrow(/desconocido/)
  })
})
