import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'

// Los valores se leen del fichero, no se copian aqui: una copia se queda
// desfasada y la prueba pasa a comprobar la copia.
const TOKENS = readFileSync(new URL('../tokens.css', import.meta.url), 'utf8')


describe('contraste de los acentos', () => {
  // El calculo de la WCAG, para que la regla no dependa de mirar a ojo.
  const lum = (hex) => {
    const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    const l = c.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2]
  }
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
    return (x + 0.05) / (y + 0.05)
  }
  const valor = (nombre) => {
    // El patron se construye con un literal normal y no con una plantilla:
    // dentro de una plantilla, \s se queda en una s suelta y el regex acaba
    // buscando "--bl-accent:s*", que no coincide con nada.
    const m = new RegExp('--' + nombre + ':\\s*(#[0-9A-Fa-f]{6})').exec(TOKENS)
    if (!m) throw new Error(`no existe el token --${nombre}`)
    return m[1]
  }

  it('el acento de texto cumple 4.5 sobre los dos fondos claros', () => {
    // Es el motivo de que exista: --bl-accent daba 3,14 y 3,51, y el texto
    // pequeño necesita 4,5. Lo canto Lighthouse en los enlaces del pie.
    for (const fondo of ['bl-bg', 'bl-surface']) {
      expect(ratio(valor('bl-accent-text'), valor(fondo)), fondo).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('el acento normal NO llega, y por eso no se usa para letras', () => {
    expect(ratio(valor('bl-accent'), valor('bl-bg'))).toBeLessThan(4.5)
  })

  it('el acento de texto sigue siendo el mismo tono, no otro color', () => {
    // Un acento accesible que no se parezca al de la marca seria un color
    // nuevo, y aqui hay dos tintas y no tres.
    const a = valor('bl-accent')
    const b = valor('bl-accent-text')
    const canal = (hex, i) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16)
    // Mismo orden de canales: poco rojo, verde alto, azul mas alto.
    expect(canal(b, 0)).toBeLessThan(canal(b, 1))
    expect(canal(b, 1)).toBeLessThan(canal(b, 2))
    for (let i = 0; i < 3; i++) expect(canal(b, i)).toBeLessThanOrEqual(canal(a, i))
  })

  it('el acento del panel cumple sobre el grafito', () => {
    expect(ratio(valor('bl-panel-accent'), valor('bl-panel-bg'))).toBeGreaterThanOrEqual(4.5)
  })
})
