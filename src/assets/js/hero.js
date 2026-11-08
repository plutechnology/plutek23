/* PluTek — hero mark: the PluTek TP logo assembled from squares.
   The logo image is sampled into a grid; its scattered pixel squares are drawn in royal blue.
   Squares settle into the mark on load and step aside from the pointer or finger.
   Cost control: renders only while something is moving, pauses off-screen and in hidden tabs,
   DPR capped at 2, and draws the finished mark once (no loop) for reduced-motion users. */
(() => {
  const art = document.querySelector("[data-hero-art]");
  const canvas = art?.querySelector("canvas");
  const source = art?.querySelector(".hero__art-fallback img");
  if (!canvas || !canvas.getContext || !source) return;
  const ctx = canvas.getContext("2d", { alpha: true });
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const INK = [236, 239, 244];
  const ACCENT = [7, 102, 206];       // logo royal blue
  const ACCENT_SOFT = [0, 191, 255];  // original-site cyan
  // The logo's scattered pixels sit in its top-left corner (fractions of the source image).
  const CLUSTER = { x: 0.31, y: 0.30 };

  let w = 0, h = 0, dpr = 1, cell = 10, particles = [];
  const pointer = { x: -1e4, y: -1e4, active: false };
  let running = false, visible = true;

  const rgb = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;

  function build() {
    const rect = art.getBoundingClientRect();
    w = rect.width; h = rect.height;
    if (!w || !h) return false;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    canvas.style.width = w + "px"; canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Fit the logo inside the box with a margin, then sample one point per cell.
    const iw = source.naturalWidth, ih = source.naturalHeight;
    const fit = Math.min((w * 0.84) / iw, (h * 0.84) / ih);
    const dw = iw * fit, dh = ih * fit, ox = (w - dw) / 2, oy = (h - dh) / 2;
    cell = Math.max(4, Math.round(Math.min(dw, dh) / 58));

    const scratch = document.createElement("canvas");
    scratch.width = Math.ceil(w); scratch.height = Math.ceil(h);
    const s = scratch.getContext("2d", { willReadFrequently: true });
    s.drawImage(source, ox, oy, dw, dh);
    const data = s.getImageData(0, 0, scratch.width, scratch.height).data;

    const first = particles.length === 0;
    particles = [];
    for (let y = cell / 2; y < h; y += cell) {
      for (let x = cell / 2; x < w; x += cell) {
        const a = data[(Math.floor(y) * scratch.width + Math.floor(x)) * 4 + 3];
        if (a < 128) continue;
        const accent = (x - ox) / dw < CLUSTER.x && (y - oy) / dh < CLUSTER.y;
        let color, alpha;
        if (accent) { color = ACCENT; alpha = 1; }
        else {
          const roll = Math.random();
          color = roll < 0.03 ? ACCENT_SOFT : INK;
          alpha = roll < 0.03 ? 0.95 : 0.85 + Math.random() * 0.15;
        }
        const start = first && !reduceMotion ? scatter(x, y) : { x, y };
        particles.push({
          tx: x, ty: y, x: start.x, y: start.y, vx: 0, vy: 0,
          fill: rgb(color), alpha,
          size: cell * (accent ? 0.9 : 0.8),
          delay: first && !reduceMotion ? Math.random() * 420 + (y / h) * 380 : 0,
        });
      }
    }
    return true;
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
    const R = Math.max(70, cell * 9), R2 = R * R;
    let moving = false;

    for (const p of particles) {
      if (elapsed > p.delay) {
        let ax = (p.tx - p.x) * 0.06, ay = (p.ty - p.y) * 0.06;
        if (pointer.active) {
          const dx = p.x - pointer.x, dy = p.y - pointer.y, d2 = dx * dx + dy * dy;
          if (d2 < R2) { const f = (1 - d2 / R2) * 5.5 / (Math.sqrt(d2) + 1); ax += dx * f; ay += dy * f; }
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
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;

    if ((moving || pointer.active) && visible && !document.hidden) requestAnimationFrame(frame);
    else running = false;
  }

  function start() {
    if (running || !visible || document.hidden) return;
    running = true;
    requestAnimationFrame(frame);
  }

  function drawStatic() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      ctx.globalAlpha = p.alpha; ctx.fillStyle = p.fill;
      ctx.fillRect(p.tx - p.size / 2, p.ty - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }

  function init() {
    if (!build()) return;
    art.classList.add("is-live");
    if (reduceMotion) { drawStatic(); return; }
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

    // Rebuild on real width changes only (mobile URL-bar resizes change height, not this box's width).
    let lastW = art.clientWidth, rt = 0;
    new ResizeObserver(() => {
      if (Math.abs(art.clientWidth - lastW) < 2) return;
      lastW = art.clientWidth;
      clearTimeout(rt);
      rt = setTimeout(() => { build(); start(); }, 120);
    }).observe(art);
  }

  // The logo image doubles as the no-JS fallback; sample it once it has loaded.
  if (source.complete && source.naturalWidth) init();
  else source.addEventListener("load", init, { once: true });
})();
