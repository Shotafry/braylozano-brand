# Guía de marca de Bray Lozano

Una página con lo que hay que saber para usar la marca sin desviarla. La dirección visual se llama Dos tintas: la página es gris claro y todo lo instrumental (terminales, código, tablas de datos) va en grafito, con el cian como único acento y como puente entre los dos mundos.

## Paleta

Estos quince valores son los únicos colores del ecosistema, y viven solo en `tokens.css`. Cualquier otro fichero los usa por variable. El hub tiene un comprobador que rompe el build si aparece un hexadecimal fuera de ahí.

| Token | Valor | Para qué |
|---|---|---|
| `--bl-bg` | `#E4E8EC` | Fondo de página |
| `--bl-surface` | `#F2F4F6` | Tarjetas y bloques elevados |
| `--bl-surface-2` | `#D6DCE2` | Rellenos secundarios, etiquetas |
| `--bl-border` | `#C3CCD4` | Filetes y separadores |
| `--bl-ink` | `#0F161D` | Texto principal |
| `--bl-ink-soft` | `#4E5B69` | Texto secundario |
| `--bl-accent` | `#0A8DAD` | Cian como tinta: enlaces, etiquetas, el bucle del símbolo |
| `--bl-accent-strong` | `#06B6D4` | Cian como relleno, para superficies pequeñas |
| `--bl-on-accent` | `#08202A` | Texto sobre un relleno cian |
| `--bl-panel-bg` | `#0F161D` | Fondo de panel |
| `--bl-panel-surface` | `#182129` | Bloques dentro de un panel |
| `--bl-panel-ink` | `#E3E9EE` | Texto sobre panel |
| `--bl-panel-ink-soft` | `#8C99A6` | Texto secundario sobre panel |
| `--bl-panel-border` | `#2A3644` | Filetes sobre panel |
| `--bl-panel-accent` | `#22D3EE` | Cian sobre panel, más claro para que aguante el contraste |

El cian cambia de valor según el suelo a propósito. El de tinta se apaga sobre fondo claro para no vibrar, y el de panel se aclara para no perderse en el grafito.

## Tipografía

Dos familias, ambas autohospedadas con `@fontsource`. **IBM Plex Mono** para títulos, etiquetas, fechas, datos y todo lo que huela a terminal: es la personalidad de la marca. **IBM Plex Sans** para el cuerpo de texto: es lo que hace que se pueda leer un artículo largo sin cansarse.

Salen de la misma familia, así que conviven sin choque. El texto en prosa se mantiene cerca de 65 caracteres de ancho, que es el token `--bl-medida`.

## Símbolo

El símbolo es una `b` minúscula: el asta en tinta a la izquierda, un hueco, y el bucle en cian formado por tres piezas. Ese bucle se lee además como un corchete de cierre, así que el símbolo dice `b` y dice código a la vez.

La geometría está fijada, en un lienzo de 64 por 100 unidades:

| Medida | Valor |
|---|---|
| Grosor de pieza | 14 |
| Hueco entre asta y bucle | 4 |
| Ancho del bucle | 46 |
| Alto del bucle | 56 |

Estos números los fijó Bray sobre un tablero de deslizadores el 6 de septiembre de 2026. **No se cambian sin su permiso.** Viven en `scripts/geometria.mjs`, que es de donde salen los cinco SVG del paquete, así que cambiar un número regenera todo y las pruebas avisan si algo deja de encajar.

Tres variantes publicadas. `simbolo.svg` es tintable: el asta usa `currentColor` y el bucle una variable CSS, así que hereda el color del contexto. `simbolo-claro.svg` y `simbolo-panel.svg` llevan los colores fijos, para favicon, correo y cualquier sitio donde no haya CSS.

## Marca compuesta

El símbolo **es** la letra, así que la palabra escrita empieza en `lozano`. El ojo lee `blozano` sin que la `b` aparezca dos veces. Escribir `blozano` completo al lado del símbolo repite la letra y es un error.

La `l` de `lozano` va en tinta, nunca en cian. El acento vive solo en el símbolo.

Las letras van convertidas a trazados y no como texto. Es una decisión técnica con motivo: alinear un SVG junto a texto vivo depende de cómo cada navegador mide la fuente, y en las pruebas el símbolo bailaba unos píxeles según la pantalla. Trazado, la alineación es geométrica y sale igual en navegador, correo y PDF.

El pie del símbolo cae exactamente sobre la línea de base de las letras, y su parte alta llega justo al alto de la `l`. El lienzo mide 555 por 102: los dos de más son el rebase de las letras redondas por debajo de la línea de base, que es como debe ser.

## Zona de respeto y tamaños

Alrededor de la marca queda libre, por cada lado, el ancho del asta: 14 unidades del lienzo, que a 26 píxeles de alto son unos 4 píxeles. Nada entra en ese margen.

Tamaños mínimos: 16 píxeles de alto para el símbolo, que es donde se convierte en favicon, y 90 píxeles de ancho para la marca compuesta. Por debajo de eso, se usa el símbolo solo.

## Movimiento

Tres gestos, siempre los mismos, para que todo se sienta de una pieza.

Texto que se escribe como en una terminal, una sola vez por página y solo en el titular. Un cursor que parpadea tras los títulos y tras la marca, que es la firma silenciosa. Y aparición por desplazamiento de doce píxeles con un fundido corto, sin rebotes ni escalas.

Todo se desactiva con `prefers-reduced-motion`. Lo que no hay en el hub es glitch, scanlines, partículas ni neón; eso se reserva para los subdominios de proyectos.

## Cómo se usa

```bash
npm i github:Shotafry/braylozano-brand
```

```css
@import '@braylozano/brand/tokens.css';
@import '@braylozano/brand/preset.css';
```

El preset mapea los tokens a utilidades de Tailwind v4, así que quedan disponibles como `bg-fondo`, `text-tinta`, `border-borde`, `text-acento`, `bg-panel` y sus equivalentes.

Para regenerar los SVG después de tocar la geometría:

```bash
npm run generar && npm test
```
