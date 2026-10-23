---
name: t-deck
description: Use when a message comes from the user's T-Deck, the pd-os handheld (it starts with $t-deck or carries a [T-Deck] reminder). How to reply for its 240 x 320 one-bit e-paper screen, and how to draw pictures for it.
---

# Replying to the T-Deck

The user is reading and typing on a T-Deck: a 240 x 320 one-bit e-paper handheld with a small keyboard, on Wi-Fi or mobile data. Turns marked `$t-deck` or `[T-Deck]` come from it; turns without the mark come from the user's computer, and are answered as usual.

## Text

- **One screen.** Aim for at most 400 characters. The device shows 33 characters a line, about 15 lines a page, in Departure Mono 11 px. Longer replies are paged, and paging an e-paper screen is slow.
- **Plain text.** No Markdown: no headings, bold, bullets with `*`, tables or code fences, unless the user asks for code. Line breaks are fine. Write in normal upper and lower case.
- **Lead with the answer.** Then the one thing that matters next. Skip preamble, recaps and offers of further help.
- **When you need the user,** end with one line: `Next: <what you need>`.
- **ASCII art is welcome** where it helps: the font is monospaced, and it has box drawing (`─│┌┐└┘├┤┬┴┼`), blocks (`░▒▓█▀▄▌▐`) and arrows (`←↑→↓`). Keep it within 33 columns.
- Do the work as you normally would: the short reply is only what the user reads on the device. If the work produced something long (a diff, a log), say where it is instead of pasting it.

## Pictures

When a picture tells it better than words (a layout, a status board, a diagram, a comparison), publish one with your HTML tool (`html_render` in T3 Code), as a **scene**: a small JSON list of drawing commands. The T-Deck draws the scene itself, pixel for pixel; a laptop draws it with the renderer. The page is exactly this, nothing else:

```html
<!doctype html>
<html>
  <body>
    <script type="application/x-pdos-scene">
      {"w": 240, "h": 272, "items": [
        ["text", 7, 4, 11, "BUILD STATUS"],
        ["fill", 0, 19, 240, 1],
        ["text", 6, 30, 22, "TESTS"],
        ["text", 7, 56, 11, "365 PASSING"]
      ]}
    </script>
    <script src="https://cdn.jsdelivr.net/gh/balazsbajorics/pd-os-agent@VERSION/renderer.js"></script>
  </body>
</html>
```

Replace `VERSION` with the commit in this skill's `VERSION` file. Never paste image data (base64, pixels): only the scene.

**The canvas** is 240 x 272 pixels, one bit: black on white, no grey. 0,0 is the top left. Every number is a whole pixel.

**Items**, at most 150 a scene, drawn in order:

| Item                             | Draws                                                                    |
| -------------------------------- | ------------------------------------------------------------------------ |
| `["fill", x, y, w, h]`           | a black rectangle; add `, 1` at the end for white (to cut into black)    |
| `["box", x, y, w, h]`            | a one-pixel black outline; `, 1` for white                               |
| `["text", x, y, size, "TEXT"]`   | Departure Mono at `size` 11 or 22; `, 1` at the end for white text        |

**Text** is set on a grid: at 11 px a character is 7 px wide and its line 14 px tall; at 22 px, 14 px wide and 28 px tall. `y` is the top of the line (capitals start 3 px below it at 11 px, 6 px at 22). A character's ink starts a pixel after its cell (two at 22 px), so text drawn at `x = 7` (11 px) or `x = 6` (22 px) has its ink at the 8 px margin. Text is not wrapped: 33 characters fit across at 11 px, 16 at 22 px. Right-align `n` characters at the margin with `x = 233 - 7 × n` (11 px) or `x = 234 - 14 × n` (22 px). Prefer capitals for labels.

**The house style** of the device: a title at 11 px at the top (`["text", 7, 4, 11, ...]`) with a rule under it (`["fill", 0, 19, 240, 1]`); content at 8 px margins; rows 48 px tall under one-pixel rules; an inverted (black) block for the one thing that matters; no ornaments. Check the picture before you publish it if your tools can preview HTML.

If a scene breaks these rules, the device shows `PICTURE CAN'T BE SHOWN` and the reason.

## Installing and updating

This skill lives at https://github.com/balazsbajorics/pd-os-agent. The T-Deck asks for a version (a commit) in its first message; if the installed `VERSION` differs, install that commit as the README says, then follow it.
