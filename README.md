# @braylozano/brand

Tokens de color, logotipo y guía de marca de [Bray Lozano](https://braylozano.com). Paquete interno que consumen la web personal y los proyectos que cuelgan de ella, publicado en abierto porque no contiene nada que deba estar oculto y así los builds no necesitan credenciales.

La guía completa está en [`GUIA.md`](./GUIA.md): paleta, tipografía, geometría del símbolo, zona de respeto y lenguaje de movimiento.

## Uso

```bash
npm i github:Shotafry/braylozano-brand
```

```css
@import '@braylozano/brand/tokens.css';
@import '@braylozano/brand/preset.css';
```

El preset mapea los tokens a utilidades de Tailwind v4. También se exporta el módulo de geometría, con tipos:

```js
import { SIMBOLO, svgSimbolo } from '@braylozano/brand/geometria'
```

## Qué hay dentro

| Ruta | Qué es |
|---|---|
| `tokens.css` | Los quince colores y las dos familias tipográficas. Única fuente de color |
| `preset.css` | Bloque `@theme` de Tailwind v4 |
| `svg/simbolo.svg` | Símbolo tintable, con `currentColor` y una variable CSS |
| `svg/simbolo-claro.svg`, `svg/simbolo-panel.svg` | Símbolo con colores fijos, para favicon y correo |
| `svg/marca-claro.svg`, `svg/marca-panel.svg` | Marca compuesta, generada |
| `scripts/geometria.mjs` | La geometría del símbolo. De aquí salen todos los SVG |
| `scripts/generar-marca.mjs` | Genera los cinco SVG |
| `fuentes/` | IBM Plex Mono SemiBold y su licencia OFL |

## Regenerar

```bash
npm run generar && npm test
```

Las proporciones del símbolo están fijadas y no se cambian sin permiso de Bray. Viven en un solo módulo, así que cambiar un número regenera los cinco SVG y las pruebas avisan si algo deja de encajar.

## Licencia

El código y los diseños de este repositorio son propiedad de Bray Lozano y no se conceden derechos de uso. La fuente IBM Plex Mono incluida en `fuentes/` es de IBM y se distribuye bajo la SIL Open Font License, cuyo texto acompaña al fichero.
