# Scenes

A scene is a picture for the T-Deck's screen as drawing commands, in JSON, inside a page:

```html
<script type="application/x-pdos-scene">{"w": 240, "h": 272, "items": [...]}</script>
```

- `w` and `h` are 240 and 272: the screen above the device's bar. Pixels are whole, 0,0 at the top left, one bit: black on white.
- `items` are drawn in order; at most 150.

| Item                                   | Draws                                                                                        |
| -------------------------------------- | -------------------------------------------------------------------------------------------- |
| `["fill", x, y, w, h, white?]`         | A filled rectangle, black (or white when `white` is 1). Inside the screen, `w` and `h` ≥ 1. |
| `["box", x, y, w, h, white?]`          | A one-pixel outline of that rectangle.                                                        |
| `["text", x, y, size, "text", white?]` | Departure Mono at `size` 11 or 22, black (or white). `y` is the top of the line.             |

Text: at 11 px a character is 7 x 14 px (line), at 22 px 14 x 28 px, monospaced; the baseline is `size` px below `y`, capitals start 3 px (11) or 6 px (22) below `y`, and a character's ink starts 1 px (11) or 2 px (22) into its cell. Text is not wrapped or cut by the scene; what runs past the right edge is lost. The line must end inside the screen: `y + 14` (11) or `y + 28` (22) at most 272. The characters are Departure Mono's: Basic Latin, Latin-1 and Latin Extended-A at both sizes; at 11 px also box drawing, blocks, shades and arrows.

A scene that breaks a rule is not drawn: the device shows `PICTURE CAN'T BE SHOWN` and the reason, and so does the renderer.
