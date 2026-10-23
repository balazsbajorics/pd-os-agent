# pd-os-agent

What an AI agent needs to talk to a T-Deck running pd-os (a JavaScript platform for the LilyGO T-Deck MAX): the `t-deck` skill (how to reply for a 240 x 320 one-bit e-paper handheld) and the renderer that draws its pictures on a laptop.

The T-Deck's T3 app talks to [T3 Code](https://t3.codes) over its MCP endpoint. Its first message in a thread names this skill and a version (a commit of this repository); the agent installs that version if it has not.

| Path                     | What                                                                  |
| ------------------------ | --------------------------------------------------------------------- |
| `skills/t-deck/SKILL.md` | The skill: replies, ASCII art and pictures for the T-Deck             |
| `SCENE.md`               | The scene format: the pictures, as drawing commands                   |
| `renderer.js`            | Draws scenes in a web page, as the T-Deck does                        |
| `examples/`              | Scenes, and pages that draw them                                      |

## Installing the skill (for agents)

Install the commit the T-Deck asked for (`<commit>` below), for Claude Code and for Codex, and record it:

```sh
rm -rf /tmp/pd-os-agent
git clone https://github.com/balazsbajorics/pd-os-agent /tmp/pd-os-agent
git -C /tmp/pd-os-agent checkout --quiet <commit>
for skills in ~/.claude/skills ~/.codex/skills; do
  mkdir -p "$skills"
  rm -rf "$skills/t-deck"
  cp -R /tmp/pd-os-agent/skills/t-deck "$skills/t-deck"
  echo <commit> > "$skills/t-deck/VERSION"
done
rm -rf /tmp/pd-os-agent
```

Then read `~/.claude/skills/t-deck/SKILL.md` (or the Codex copy) and follow it. A skill already installed at that commit (its `VERSION` file says so) needs nothing.

## Pictures

A picture is an HTML page holding a scene and this repository's renderer, at the same commit:

```html
<script type="application/x-pdos-scene">{"w": 240, "h": 272, "items": [["text", 7, 4, 11, "HELLO"]]}</script>
<script src="https://cdn.jsdelivr.net/gh/balazsbajorics/pd-os-agent@<commit>/renderer.js"></script>
```

The T-Deck reads the scene and draws it in its own fonts; a browser draws it with the renderer, which loads [Departure Mono](https://departuremono.com) (Helena Zhang, OFL) from jsDelivr. Nothing here copies the font.

## License

MIT
