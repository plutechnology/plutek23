/* PluTek — hero mark: the P assembled from the logo's pixel squares.
   Squares settle into the mark on load and step aside from the pointer or finger.
   Cost control: renders only while something is moving, pauses off-screen and in hidden tabs,
   DPR capped at 2, and draws the finished mark once (no loop) for reduced-motion users. */
(() => {
  const art = document.querySelector("[data-hero-art]");
  const canvas = art?.querySelector("canvas");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d", { alpha: true });
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const P_PATH = "M9 6h11a8 8 0 0 1 0 16h-5v5H9zm6 6v4h5a2 2 0 0 0 0-4z";
  const ACCENTS = [ // [x, y, w, h, alpha] in the 32-unit mark grid
    [3, 6, 3.5, 3.5, 1], [0, 11, 2.5, 2.5, 0.6], [4.5, 12, 2, 2, 0.35],
  ];
  const INK = [236, 237, 242];
  const VIOLET = [124, 58, 237];
  const VIOLET_SOFT = [185, 162, 246];

  let w = 0, h = 0, dpr = 1, cell = 12, particles = [];
  let pointer = { x: -1e4, y: -1e4, active: false };
  let running = false, visible = true, raf = 0;

  function build() {
    const rect = art.getBoundingClientRect();
    w = rect.width; h = rect.height;
    if (!w || !h) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    canvas.style.width = w + "px"; canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Fit the 32-unit mark (its drawn extent is ~0..28 x 2.5..27) into the box.
    const size = Math.min(w, h);
    cell = Math.max(7, Math.round(size / 38));
    const scale = (size * 0.86) / 30;
    const ox = (w - 28 * scale) / 2 - 0.5 * scale;
    const oy = (h - 24.5 * scale) / 2 - 3 * scale;

    // Rasterise the mark on a scratch canvas, then sample one point per cell.
    const scratch = document.createElement("canvas");
    scratch.width = Math.ceil(w); scratch.height = Math.ceil(h);
    const s = scratch.getContext("2d", { willReadFrequently: true });
    s.setTransform(scale, 0, 0, scale, ox, oy);
    s.fillStyle = "#f00";
    s.fill(new Path2D(P_PATH), "evenodd");
    ACCENTS.forEach(([x, y, aw, ah], i) => { s.fillStyle = `rgb(0,${255 - i * 60},0)`; s.fillRect(x, y, aw, ah); });
    const data = s.getImageData(0, 0, scratch.width, scratch.height).data;

    const old = particles;
    particles = [];
    for (let y = cell / 2; y < h; y += cell) {
      for (let x = cell / 2; x < w; x += cell) {
        const i = (Math.floor(y) * scratch.width + Math.floor(x)) * 4;
        const r = data[i], g = data[i + 1];
        if (r < 128 && g < 128) continue;
        const accent = g >= 128;
        let color, alpha;
        if (accent) {
          color = VIOLET;
          alpha = g > 230 ? 1 : g > 170 ? 0.65 : 0.4;
        } else {
          // Mostly white, with a few violet squares so the mark reads as built from parts.
          const roll = Math.random();
          color = roll < 0.06 ? VIOLET_SOFT : INK;
          alpha = roll < 0.06 ? 0.95 : 0.78 + Math.random() * 0.22;
        }
        const start = old.length ? null : scatter(x, y);
        particles.push({
          tx: x, ty: y,
          x: start ? start.x : x, y: start ? start.y : y,
          vx: 0, vy: 0,
          fill: `rgb(${color[0]},${color[1]},${color[2]})`, alpha,
          size: cell * (accent ? 0.86 : 0.74),
          delay: start ? Math.random() * 420 + (y / h) * 380 : 0,
        });
      }
    }
    if (reduceMotion) particles.forEach((p) => { p.x = p.tx; p.y = p.ty; p.delay = 0; });
  }

  function scatter(x, y) {
    // Start each square drifted down-left of its home, so the mark resolves along one direction.
    const d = 40 + Math.random() * 140;
    const a = Math.PI * 0.75 + (Math.random() - 0.5) * 0.9;
    return { x: x + Math.cos(a) * d, y: y + Math.sin(a) * -d * 0.6 + 60 };
  }

  let t0 = 0;
  function frame(now) {
    if (!t0) t0 = now;
    const elapsed = now - t0;
    ctx.clearRect(0, 0, w, h);
    const R = Math.max(70, cell * 7), R2 = R * R;
    let moving = false;

    for (const p of particles) {
      if (elapsed > p.delay) {
        let ax = (p.tx - p.x) * 0.06, ay = (p.ty - p.y) * 0.06;
        if (pointer.active) {
          const dx = p.x - pointer.x, dy = p.y - pointer.y, d2 = dx * dx + dy * dy;
          if (d2 < R2) {
            const f = (1 - d2 / R2) * 5.5 / (Math.sqrt(d2) + 1);
            ax += dx * f; ay += dy * f;
          }
        }
        p.vx = (p.vx + ax) * 0.78; p.vy = (p.vy + ay) * 0.78;
        p.x += p.vx; p.y += p.vy;
        if (Math.abs(p.vx) + Math.abs(p.vy) > 0.02 || Math.abs(p.tx - p.x) + Math.abs(p.ty - p.y) > 0.3) moving = true;
      } else {
        moving = true;
      }
      const fade = elapsed > p.delay ? Math.min(1, (elapsed - p.delay) / 300) : 0;
      if (!fade) continue;
      ctx.globalAlpha = p.alpha * fade;
      ctx.fillStyle = p.fill;
      const half = p.size / 2;
      ctx.fillRect(p.x - half, p.y - half, p.size, p.size);
    }
    ctx.globalAlpha = 1;

    if ((moving || pointer.active) && visible && !document.hidden) {
      raf = requestAnimationFrame(frame);
    } else {
      running = false;
    }
  }

  function start() {
    if (running || !visible || document.hidden) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }

  function drawStatic() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.fill;
      ctx.fillRect(p.tx - p.size / 2, p.ty - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }

  build();
  art.classList.add("is-live");
  if (reduceMotion) { drawStatic(); }
  else {
    start();
    const toLocal = (e) => { const r = canvas.getBoundingClientRect(); pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; };
    canvas.addEventListener("pointermove", (e) => { toLocal(e); pointer.active = true; start(); }, { passive: true });
    canvas.addEventListener("pointerdown", (e) => { toLocal(e); pointer.active = true; start(); }, { passive: true });
    const release = () => { pointer.active = false; pointer.x = pointer.y = -1e4; start(); };
    canvas.addEventListener("pointerleave", release, { passive: true });
    canvas.addEventListener("pointerup", (e) => { if (e.pointerType !== "mouse") release(); }, { passive: true });
    canvas.addEventListener("pointercancel", release, { passive: true });

    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) start(); }).observe(art);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) start(); });
  }

  // Rebuild on real size changes only (mobile URL-bar resizes change height, not this box's width).
  let lastW = art.clientWidth, rt = 0;
  new ResizeObserver(() => {
    if (Math.abs(art.clientWidth - lastW) < 2) return;
    lastW = art.clientWidth;
    clearTimeout(rt);
    rt = setTimeout(() => { build(); reduceMotion ? drawStatic() : (particles.forEach((p) => { p.x = p.tx; p.y = p.ty; p.delay = 0; }), start()); }, 120);
  }).observe(art);
})();
