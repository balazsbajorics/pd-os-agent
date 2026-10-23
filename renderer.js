// Draws pd-os scenes in a web page, as the T-Deck draws them: one bit, 240 × 272, Departure Mono
// at 11 and 22 px on whole pixels. Every <script type="application/x-pdos-scene"> on the page gets
// a canvas after it, shown at twice its size. The scene format is SCENE.md.
(() => {
  const FONT =
    'https://cdn.jsdelivr.net/gh/rektdeckard/departure-mono@75152a3f1e6dacdd248a6c397c97dbf27e33eea0/public/assets/DepartureMono-Regular.woff2';
  const WIDTH = 240;
  const HEIGHT = 272;
  const MOST_ITEMS = 150;

  // The reason a scene cannot be drawn, or null.
  function problem(scene) {
    if (!scene || scene.w !== WIDTH || scene.h !== HEIGHT) return `the scene must be ${WIDTH} x ${HEIGHT}`;
    if (!Array.isArray(scene.items)) return 'the scene has no items';
    if (scene.items.length > MOST_ITEMS) return `more than ${MOST_ITEMS} items`;
    for (const [index, item] of scene.items.entries()) {
      const [kind, x, y, a, b] = item;
      const whole = (...values) => values.every((v) => Number.isInteger(v));
      if (kind === 'fill' || kind === 'box') {
        if (!whole(x, y, a, b) || a < 1 || b < 1 || x < 0 || y < 0 || x + a > WIDTH || y + b > HEIGHT)
          return `item ${index}: a ${kind} must be whole pixels inside the screen`;
      } else if (kind === 'text') {
        if (!whole(x, y) || (a !== 11 && a !== 22) || typeof b !== 'string')
          return `item ${index}: text is x, y, 11 or 22, "text"`;
        if (x < 0 || y < 0 || y + (a === 11 ? 14 : 28) > HEIGHT) return `item ${index}: text outside the screen`;
      } else return `item ${index}: unknown kind "${kind}"`;
    }
    return null;
  }

  function draw(canvas, scene) {
    const g = canvas.getContext('2d');
    g.fillStyle = '#fff';
    g.fillRect(0, 0, WIDTH, HEIGHT);
    const reason = problem(scene);
    if (reason) {
      g.fillStyle = '#000';
      g.font = '11px "Departure Mono", monospace';
      g.fillText("PICTURE CAN'T BE SHOWN", 7, 16);
      g.fillText(reason.slice(0, 33), 7, 30);
      return;
    }
    for (const [kind, x, y, a, b, invert] of scene.items) {
      if (kind === 'fill') {
        g.fillStyle = invert ? '#fff' : '#000';
        g.fillRect(x, y, a, b);
      } else if (kind === 'box') {
        g.fillStyle = invert ? '#fff' : '#000';
        g.fillRect(x, y, a, 1);
        g.fillRect(x, y + b - 1, a, 1);
        g.fillRect(x, y, 1, b);
        g.fillRect(x + a - 1, y, 1, b);
      } else {
        // y is the top of the line; the baseline is 11 or 22 px below it.
        g.fillStyle = invert ? '#fff' : '#000';
        g.font = `${a}px "Departure Mono"`;
        g.textBaseline = 'alphabetic';
        g.fillText(b, x, y + a);
      }
    }
    // One bit, as the panel shows it.
    const image = g.getImageData(0, 0, WIDTH, HEIGHT);
    for (let i = 0; i < image.data.length; i += 4) {
      const v = image.data[i] + image.data[i + 1] + image.data[i + 2] < 384 ? 0 : 255;
      image.data[i] = image.data[i + 1] = image.data[i + 2] = v;
      image.data[i + 3] = 255;
    }
    g.putImageData(image, 0, 0);
  }

  function start() {
    const face = new FontFace('Departure Mono', `url(${FONT}) format("woff2")`);
    document.fonts.add(face);
    const ready = face.load().catch(() => null);
    for (const block of document.querySelectorAll('script[type="application/x-pdos-scene"]')) {
      const canvas = document.createElement('canvas');
      canvas.width = WIDTH;
      canvas.height = HEIGHT;
      canvas.style.cssText = `display:block;width:${WIDTH * 2}px;max-width:100%;image-rendering:pixelated;background:#fff;padding:16px;border-radius:8px;box-sizing:content-box`;
      block.after(canvas);
      let scene = null;
      try {
        scene = JSON.parse(block.textContent);
      } catch {
        scene = null;
      }
      ready.then(() => draw(canvas, scene));
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
