// ===================================================================
// EFFECTS
// The visual layer that comes in at the end of each lens clip.
// Each feeling carries a small counterweight:
//   angry — squares press in, sparks and cracks, warm light in the cracks
//   sad   — blue and purple drops fall and ring, one gold drop rises
//   happy — gold bubbles and shapes bounce and grow, one blue drop dances
// No one is only what you see and feel.
// ===================================================================

const Effects = (() => {
  let canvas, ctx, width, height;
  let current = null;   // the running effect
  let frame = null;     // requestAnimationFrame id
  let alpha = 0;        // fades the whole layer in and out
  let fadingOut = false;
  let lastTime = 0;

  const rand = (min, max) => min + Math.random() * (max - min);
  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  // A teardrop pointing up, centred on (x, y).
  function drop(x, y, size, color, glow) {
    ctx.save();
    ctx.fillStyle = color;
    if (glow) { ctx.shadowColor = glow; ctx.shadowBlur = size * 3; }
    ctx.beginPath();
    ctx.moveTo(x, y - size * 1.6);
    ctx.bezierCurveTo(x + size, y - size * 0.4, x + size, y + size, x, y + size);
    ctx.bezierCurveTo(x - size, y + size, x - size, y - size * 0.4, x, y - size * 1.6);
    ctx.fill();
    ctx.restore();
  }

  // ---------- Angry ----------
  function angry() {
    const squares = [];
    for (let i = 0; i < 10; i++) {
      const edge = i % 4; // 0 top, 1 right, 2 bottom, 3 left
      const size = rand(28, 60);
      const along = rand(0.1, 0.9);
      const depth = rand(0.06, 0.2);
      squares.push({ edge, size, along, depth, angle: rand(-0.3, 0.3), t: -rand(0, 0.8) });
    }
    const cracks = [];
    for (let i = 0; i < 5; i++) {
      const fromLeft = Math.random() < 0.5;
      const start = { x: fromLeft ? rand(0, 0.15) * width : rand(0.85, 1) * width, y: rand(0.1, 0.9) * height };
      cracks.push({ points: [start], heading: Math.atan2(height / 2 - start.y, width / 2 - start.x), grow: rand(0.7, 1.2), delay: rand(0.2, 1.0) });
    }
    const sparks = [];
    let time = 0;

    return (dt) => {
      time += dt;

      // Warm light: behind everything, it slowly opens up as the cracks grow
      const warmth = Math.min(1, Math.max(0, (time - 0.6) / 1.2)) * (0.75 + 0.25 * Math.sin(time * 3));
      const glow = ctx.createRadialGradient(width / 2, height * 0.55, 0, width / 2, height * 0.55, width * 0.8);
      glow.addColorStop(0, `rgba(255, 180, 110, ${0.22 * warmth})`);
      glow.addColorStop(1, "rgba(255, 180, 110, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      // Cracks grow in short jagged steps; warm light shows inside them
      for (const crack of cracks) {
        if (time > crack.delay && crack.points.length < 14) {
          const last = crack.points[crack.points.length - 1];
          crack.heading += rand(-0.6, 0.6);
          const step = rand(10, 22) * crack.grow;
          const next = { x: last.x + Math.cos(crack.heading) * step, y: last.y + Math.sin(crack.heading) * step };
          crack.points.push(next);
          for (let s = 0; s < 3; s++) {
            sparks.push({ x: next.x, y: next.y, vx: rand(-90, 90), vy: rand(-120, 20), life: rand(0.3, 0.7) });
          }
        }
        if (crack.points.length < 2) continue;
        ctx.save();
        ctx.lineJoin = "miter";
        ctx.beginPath();
        crack.points.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
        ctx.strokeStyle = "rgba(255, 190, 120, 0.45)";
        ctx.shadowColor = "rgba(255, 170, 90, 0.9)";
        ctx.shadowBlur = 14;
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(255, 245, 230, 0.9)";
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      }

      // Sparks: small, fast, gone quickly
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life -= dt;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        s.vy += 260 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        ctx.fillStyle = `rgba(255, ${Math.round(140 + 100 * s.life)}, 60, ${Math.min(1, s.life * 2)})`;
        ctx.fillRect(s.x, s.y, 2, 2);
      }

      // Squares press in from the edges and keep pushing
      for (const sq of squares) {
        sq.t += dt;
        const ease = Math.min(1, Math.max(0, sq.t / 0.9));
        const push = (1 - Math.pow(1 - ease, 3)) * sq.depth + Math.sin(time * 9 + sq.along * 10) * 0.004;
        let x, y;
        if (sq.edge === 0) { x = sq.along * width; y = -sq.size + push * height + sq.size / 2; }
        if (sq.edge === 2) { x = sq.along * width; y = height + sq.size - push * height - sq.size / 2; }
        if (sq.edge === 1) { x = width + sq.size - push * width - sq.size / 2; y = sq.along * height; }
        if (sq.edge === 3) { x = -sq.size + push * width + sq.size / 2; y = sq.along * height; }
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(sq.angle);
        ctx.fillStyle = "rgba(24, 8, 14, 0.85)";
        ctx.fillRect(-sq.size / 2, -sq.size / 2, sq.size, sq.size);
        ctx.strokeStyle = "rgba(230, 60, 50, 0.9)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-sq.size / 2, -sq.size / 2, sq.size, sq.size);
        ctx.restore();
      }
    };
  }

  // ---------- Sad ----------
  function sad() {
    const drops = [];
    for (let i = 0; i < 18; i++) {
      drops.push({ x: rand(0, width), y: rand(-height * 0.3, height * 0.7), speed: rand(35, 75), size: rand(2.5, 4.5), color: pick(["rgba(110, 150, 255, 0.75)", "rgba(165, 120, 255, 0.75)"]) });
    }
    const rings = [];
    const gold = { x: width * rand(0.35, 0.65), y: height + 10, base: 0 };
    gold.base = gold.x;
    let time = 0;

    return (dt) => {
      time += dt;
      const floor = height - 8;

      for (const d of drops) {
        d.y += d.speed * dt;
        if (d.y >= floor) {
          rings.push({ x: d.x, y: floor, r: 0, life: 1, color: d.color });
          d.x = rand(0, width);
          d.y = rand(-60, -10);
        }
        drop(d.x, d.y, d.size, d.color);
      }

      // Small rings where the drops land
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        ring.life -= dt * 0.8;
        if (ring.life <= 0) { rings.splice(i, 1); continue; }
        ring.r += 30 * dt;
        ctx.save();
        ctx.globalAlpha = ring.life;
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(ring.x, ring.y, ring.r, ring.r * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // One gold drop floats upward and shines: hope in the heavy
      gold.y -= 28 * dt;
      gold.x = gold.base + Math.sin(time * 1.4) * 10;
      if (gold.y < -20) { gold.y = height + 10; gold.base = width * rand(0.35, 0.65); }
      drop(gold.x, gold.y, 5, "rgba(255, 215, 120, 1)", "rgba(255, 200, 90, 1)");
    };
  }

  // ---------- Happy ----------
  function happy() {
    const colors = ["#ffd36b", "#ff7ab6", "#7af0c8", "#b58cff", "#ffa95b"];
    const shapes = [];
    for (let i = 0; i < 14; i++) {
      const bubble = i < 6;
      const angle = rand(0, Math.PI * 2);
      const speed = rand(60, 120);
      shapes.push({
        kind: bubble ? "bubble" : pick(["circle", "triangle", "square"]),
        color: bubble ? "#ffd36b" : pick(colors),
        x: rand(30, width - 30), y: rand(30, height - 30),
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        r: rand(7, 14), spin: rand(-2, 2), angle: 0, touching: new Set(),
      });
    }
    const blue = { phase: rand(0, 10) };
    let time = 0;

    return (dt) => {
      time += dt;

      for (const s of shapes) {
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.angle += s.spin * dt;
        if (s.x < s.r) { s.x = s.r; s.vx = Math.abs(s.vx); }
        if (s.x > width - s.r) { s.x = width - s.r; s.vx = -Math.abs(s.vx); }
        if (s.y < s.r) { s.y = s.r; s.vy = Math.abs(s.vy); }
        if (s.y > height - s.r) { s.y = height - s.r; s.vy = -Math.abs(s.vy); }
      }

      // When two meet, they bounce and both grow a little
      for (let i = 0; i < shapes.length; i++) {
        for (let j = i + 1; j < shapes.length; j++) {
          const a = shapes[i], b = shapes[j];
          const meeting = Math.hypot(a.x - b.x, a.y - b.y) < a.r + b.r;
          if (meeting && !a.touching.has(b)) {
            a.touching.add(b); b.touching.add(a);
            a.r = Math.min(a.r * 1.12, 34);
            b.r = Math.min(b.r * 1.12, 34);
            [a.vx, b.vx] = [b.vx, a.vx];
            [a.vy, b.vy] = [b.vy, a.vy];
          } else if (!meeting) {
            a.touching.delete(b); b.touching.delete(a);
          }
        }
      }

      for (const s of shapes) {
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.angle);
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 1.5;
        if (s.kind === "bubble") {
          ctx.fillStyle = "rgba(255, 211, 107, 0.18)";
          ctx.shadowColor = "rgba(255, 200, 90, 0.8)";
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(0, 0, s.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
          ctx.beginPath();
          ctx.arc(-s.r * 0.35, -s.r * 0.35, s.r * 0.18, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = s.color;
          ctx.globalAlpha = 0.8;
          ctx.beginPath();
          if (s.kind === "circle") ctx.arc(0, 0, s.r * 0.8, 0, Math.PI * 2);
          if (s.kind === "square") ctx.rect(-s.r * 0.7, -s.r * 0.7, s.r * 1.4, s.r * 1.4);
          if (s.kind === "triangle") {
            ctx.moveTo(0, -s.r);
            ctx.lineTo(s.r * 0.87, s.r * 0.5);
            ctx.lineTo(-s.r * 0.87, s.r * 0.5);
            ctx.closePath();
          }
          ctx.fill();
        }
        ctx.restore();
      }

      // One blue drop joins this dance: joy doesn't mean everything is light
      const t = time + blue.phase;
      const bx = width / 2 + Math.sin(t * 1.3) * width * 0.32;
      const by = height / 2 + Math.sin(t * 2.1) * height * 0.3;
      drop(bx, by, 6, "rgba(90, 140, 255, 1)", "rgba(90, 140, 255, 0.9)");
    };
  }

  const EFFECTS = { angry, sad, happy };

  function loop(now) {
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    alpha = fadingOut ? Math.max(0, alpha - dt / 0.3) : Math.min(1, alpha + dt / 0.6);
    ctx.clearRect(0, 0, width, height);
    if (fadingOut && alpha === 0) { clear(); return; }
    ctx.globalAlpha = alpha;
    current(dt);
    ctx.globalAlpha = 1;
    frame = requestAnimationFrame(loop);
  }

  function clear() {
    cancelAnimationFrame(frame);
    frame = null;
    current = null;
    fadingOut = false;
    alpha = 0;
    if (ctx) ctx.clearRect(0, 0, width, height);
  }

  return {
    init(element) {
      canvas = element;
      ctx = canvas.getContext("2d");
      window.addEventListener("resize", () => { if (current) resize(); });
    },
    // Start the effect for a lens clip (angry, sad or happy).
    start(name) {
      if (!EFFECTS[name]) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      clear();
      resize();
      current = EFFECTS[name]();
      lastTime = performance.now();
      frame = requestAnimationFrame(loop);
    },
    // Fade the effect out.
    stop() {
      if (current) fadingOut = true;
    },
    isRunning() {
      return current !== null && !fadingOut;
    },
  };
})();
