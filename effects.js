// ===================================================================
// EFFECTS
// The visual layer that comes in at the end of each lens clip.
// Each feeling carries a small counterweight:
//   angry — squares press in, sparks and cracks, warm light in the cracks
//   sad   — blue and purple drops fall and ring, one gold drop rises
//   happy — gold bubbles and shapes bounce and grow, one blue drop dances
// When the viewer takes the test again, each effect is reversed:
// the counterweight becomes the main thing and the movement turns around.
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
  const clamp01 = (value) => Math.min(1, Math.max(0, value));

  const GOLD = "rgba(255, 215, 120, 1)";
  const GOLD_GLOW = "rgba(255, 200, 90, 1)";
  const BLUE = "rgba(90, 140, 255, 1)";
  const BLUE_GLOW = "rgba(90, 140, 255, 0.9)";

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  // A teardrop centred on (x, y), pointing up (or down when flipped).
  function drop(x, y, size, color, glow, flipped) {
    ctx.save();
    ctx.translate(x, y);
    if (flipped) ctx.scale(1, -1);
    ctx.fillStyle = color;
    if (glow) { ctx.shadowColor = glow; ctx.shadowBlur = size * 3; }
    ctx.beginPath();
    ctx.moveTo(0, -size * 1.6);
    ctx.bezierCurveTo(size, -size * 0.4, size, size, 0, size);
    ctx.bezierCurveTo(-size, size, -size, -size * 0.4, 0, -size * 1.6);
    ctx.fill();
    ctx.restore();
  }

  // The one blue drop: bigger, glowing, with a sparkle trail, and it explodes.
  function makeBlueDrop() {
    const sparks = [];   // trail and explosion droplets
    const waves = [];    // shockwave rings
    let pulse = 0;

    function explode(x, y) {
      for (let i = 0; i < 26; i++) {
        const angle = (i / 26) * Math.PI * 2 + rand(-0.1, 0.1);
        const speed = rand(90, 220);
        sparks.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, size: rand(2, 4.5), life: rand(0.6, 1.1), drop: true });
      }
      waves.push({ x, y, r: 6, life: 1 });
    }

    function draw(dt, x, y, size, flipped) {
      pulse += dt;
      const beat = 1 + 0.12 * Math.sin(pulse * 7);

      // Trail of small blue sparkles
      if (size > 0) {
        sparks.push({ x: x + rand(-3, 3), y: y + rand(-3, 3), vx: rand(-15, 15), vy: rand(-15, 15), size: rand(1, 2.2), life: rand(0.3, 0.6), drop: false });
      }

      for (let i = waves.length - 1; i >= 0; i--) {
        const w = waves[i];
        w.life -= dt * 1.4;
        if (w.life <= 0) { waves.splice(i, 1); continue; }
        w.r += 160 * dt;
        ctx.save();
        ctx.globalAlpha *= w.life;
        ctx.strokeStyle = "rgba(140, 185, 255, 1)";
        ctx.shadowColor = BLUE_GLOW;
        ctx.shadowBlur = 16;
        ctx.lineWidth = 3 * w.life;
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life -= dt;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        s.vx *= 0.97;
        s.vy = s.vy * 0.97 + (s.drop ? 120 * dt : 0);
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        ctx.save();
        ctx.globalAlpha *= Math.min(1, s.life * 1.6);
        if (s.drop) {
          drop(s.x, s.y, s.size, "rgba(110, 160, 255, 1)", BLUE_GLOW);
        } else {
          ctx.fillStyle = "rgba(190, 215, 255, 1)";
          ctx.shadowColor = BLUE_GLOW;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (size <= 0) return;
      const r = size * beat;
      // Outer glow
      const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
      halo.addColorStop(0, "rgba(90, 140, 255, 0.55)");
      halo.addColorStop(1, "rgba(90, 140, 255, 0)");
      ctx.fillStyle = halo;
      ctx.fillRect(x - r * 4, y - r * 4, r * 8, r * 8);
      // The drop, with light inside it
      ctx.save();
      ctx.translate(x, y);
      if (flipped) ctx.scale(1, -1);
      const body = ctx.createRadialGradient(-r * 0.3, -r * 0.2, r * 0.1, 0, 0, r * 1.6);
      body.addColorStop(0, "rgba(220, 235, 255, 1)");
      body.addColorStop(0.35, "rgba(100, 155, 255, 1)");
      body.addColorStop(1, "rgba(30, 60, 200, 1)");
      ctx.fillStyle = body;
      ctx.shadowColor = BLUE_GLOW;
      ctx.shadowBlur = r * 2.5;
      ctx.beginPath();
      ctx.moveTo(0, -r * 1.6);
      ctx.bezierCurveTo(r, -r * 0.4, r, r, 0, r);
      ctx.bezierCurveTo(-r, r, -r, -r * 0.4, 0, -r * 1.6);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.beginPath();
      ctx.ellipse(-r * 0.35, -r * 0.2, r * 0.18, r * 0.3, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    return { draw, explode };
  }

  function ring(r) {
    ctx.save();
    ctx.globalAlpha *= r.life;
    ctx.strokeStyle = r.color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(r.x, r.y, r.r, r.r * 0.3, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function updateRings(rings, dt) {
    for (let i = rings.length - 1; i >= 0; i--) {
      const r = rings[i];
      r.life -= dt * 0.8;
      if (r.life <= 0) { rings.splice(i, 1); continue; }
      r.r += 30 * dt;
      ring(r);
    }
  }

  // ---------- Angry ----------
  // Forward: squares press in, cracks grow with sparks, a little warm light.
  // Reversed: squares pull back, cracks heal, the warm light fills the screen.
  function angry(reversed) {
    const squares = [];
    for (let i = 0; i < 10; i++) {
      squares.push({
        edge: i % 4, // 0 top, 1 right, 2 bottom, 3 left
        size: rand(28, 60),
        along: rand(0.1, 0.9),
        depth: rand(0.06, 0.2),
        angle: rand(-0.3, 0.3),
        t: -rand(0, 0.8),
      });
    }

    const cracks = [];
    for (let i = 0; i < 5; i++) {
      const fromLeft = Math.random() < 0.5;
      const start = { x: fromLeft ? rand(0, 0.15) * width : rand(0.85, 1) * width, y: rand(0.1, 0.9) * height };
      const crack = { points: [start], heading: Math.atan2(height / 2 - start.y, width / 2 - start.x), grow: rand(0.7, 1.2), delay: rand(0.2, 1.0) };
      if (reversed) while (crack.points.length < 14) growCrack(crack, null);
      cracks.push(crack);
    }
    const sparks = [];
    let time = 0;

    function growCrack(crack, sparkList) {
      const last = crack.points[crack.points.length - 1];
      crack.heading += rand(-0.6, 0.6);
      const step = rand(10, 22) * crack.grow;
      const next = { x: last.x + Math.cos(crack.heading) * step, y: last.y + Math.sin(crack.heading) * step };
      crack.points.push(next);
      if (sparkList) {
        for (let s = 0; s < 3; s++) {
          sparkList.push({ x: next.x, y: next.y, vx: rand(-90, 90), vy: rand(-120, 20), life: rand(0.3, 0.7) });
        }
      }
    }

    return (dt) => {
      time += dt;

      // Warm light behind everything
      const opening = clamp01((time - (reversed ? 0.2 : 0.6)) / 1.2);
      const pulse = 0.75 + 0.25 * Math.sin(time * 3);
      const strength = reversed ? 0.25 + 0.35 * opening : 0.22 * opening;
      const reach = reversed ? width * (0.8 + 0.6 * opening) : width * 0.8;
      const glow = ctx.createRadialGradient(width / 2, height * 0.55, 0, width / 2, height * 0.55, reach);
      glow.addColorStop(0, `rgba(255, 180, 110, ${strength * pulse})`);
      glow.addColorStop(1, "rgba(255, 180, 110, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      // Cracks: grow with sparks, or heal from the tip back to the edge
      for (const crack of cracks) {
        if (time > crack.delay) {
          if (!reversed && crack.points.length < 14) growCrack(crack, sparks);
          if (reversed && crack.points.length > 1 && Math.random() < 0.5) crack.points.pop();
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

      // Squares: press in and keep pushing, or start pressed in and pull back
      for (const sq of squares) {
        sq.t += dt;
        const ease = 1 - Math.pow(1 - clamp01(sq.t / (reversed ? 1.4 : 0.9)), 3);
        const amount = reversed ? 1 - ease : ease;
        const shake = reversed ? 0 : Math.sin(time * 9 + sq.along * 10) * 0.004;
        const push = amount * sq.depth + shake;
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
  // Forward: many blue and purple drops fall and ring, one gold drop rises.
  // Reversed: many gold drops rise and shine, one blue drop falls and rings.
  function sad(reversed) {
    const floor = height - 8;
    const many = [];
    for (let i = 0; i < 18; i++) {
      many.push({
        x: rand(0, width),
        y: rand(-height * 0.3, height * 0.7),
        speed: rand(35, 75),
        size: rand(2.5, 4.5),
        color: reversed ? GOLD : pick(["rgba(110, 150, 255, 0.75)", "rgba(165, 120, 255, 0.75)"]),
      });
    }
    if (reversed) for (const d of many) d.y = height - d.y;
    const one = { base: width * rand(0.35, 0.65), y: reversed ? -10 : height + 10 };
    const rings = [];
    let time = 0;

    return (dt) => {
      time += dt;

      for (const d of many) {
        if (reversed) {
          // Gold drops rise, swaying a little, and shine
          d.y -= d.speed * dt;
          if (d.y < -20) { d.x = rand(0, width); d.y = height + rand(10, 60); }
          drop(d.x + Math.sin(time * 1.4 + d.speed) * 4, d.y, d.size, d.color, GOLD_GLOW);
        } else {
          d.y += d.speed * dt;
          if (d.y >= floor) {
            rings.push({ x: d.x, y: floor, r: 0, life: 1, color: d.color });
            d.x = rand(0, width);
            d.y = rand(-60, -10);
          }
          drop(d.x, d.y, d.size, d.color);
        }
      }

      updateRings(rings, dt);

      // The one that goes the other way
      const x = one.base + Math.sin(time * 1.4) * 10;
      if (reversed) {
        one.y += 28 * dt;
        if (one.y >= floor) {
          rings.push({ x, y: floor, r: 0, life: 1, color: BLUE });
          one.y = -10;
          one.base = width * rand(0.35, 0.65);
        }
        drop(x, one.y, 5, BLUE, BLUE_GLOW);
      } else {
        one.y -= 28 * dt;
        if (one.y < -20) { one.y = height + 10; one.base = width * rand(0.35, 0.65); }
        drop(x, one.y, 5, GOLD, GOLD_GLOW);
      }
    };
  }

  // ---------- Happy ----------
  // Forward: gold bubbles and colourful shapes bounce and grow, one blue drop dances.
  // Reversed: blue drops bounce and grow, one gold bubble dances among them.
  function happy(reversed) {
    const colors = ["#ffd36b", "#ff7ab6", "#7af0c8", "#b58cff", "#ffa95b"];
    const shapes = [];
    for (let i = 0; i < 14; i++) {
      const angle = rand(0, Math.PI * 2);
      const speed = rand(60, 120);
      let kind, color;
      if (reversed) { kind = "drop"; color = pick([BLUE, "rgba(120, 165, 255, 1)", "rgba(70, 110, 230, 1)"]); }
      else if (i < 6) { kind = "bubble"; color = "#ffd36b"; }
      else { kind = pick(["circle", "triangle", "square"]); color = pick(colors); }
      shapes.push({
        kind, color,
        x: rand(30, width - 30), y: rand(30, height - 30),
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        r: rand(7, 14), spin: rand(-2, 2), angle: 0, touching: new Set(),
      });
    }
    const phase = rand(0, 10);
    const blueDrop = makeBlueDrop();
    const BLUE_CYCLE = 2.6;   // seconds from forming to exploding
    const BLUE_HIDDEN = 0.7;  // seconds gone after the explosion
    let blueClock = 0.6;      // first explosion comes a little sooner
    let time = 0;

    function bubble(x, y, r) {
      ctx.save();
      ctx.translate(x, y);
      ctx.strokeStyle = "#ffd36b";
      ctx.lineWidth = 1.5;
      ctx.fillStyle = "rgba(255, 211, 107, 0.18)";
      ctx.shadowColor = "rgba(255, 200, 90, 0.8)";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.beginPath();
      ctx.arc(-r * 0.35, -r * 0.35, r * 0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

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
        if (s.kind === "bubble") { bubble(s.x, s.y, s.r); continue; }
        if (s.kind === "drop") { drop(s.x, s.y, s.r * 0.55, s.color, BLUE_GLOW); continue; }
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.angle);
        ctx.fillStyle = s.color;
        ctx.globalAlpha *= 0.8;
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
        ctx.restore();
      }

      // The one that joins this dance
      const t = time + phase;
      const x = width / 2 + Math.sin(t * 1.3) * width * 0.32;
      const y = height / 2 + Math.sin(t * 2.1) * height * 0.3;
      if (reversed) {
        bubble(x, y, 12);
      } else {
        // The blue drop swells as it dances, then explodes and forms again
        blueClock += dt;
        if (blueClock >= BLUE_CYCLE + BLUE_HIDDEN) blueClock = 0;
        const wasVisible = blueClock - dt < BLUE_CYCLE;
        if (blueClock >= BLUE_CYCLE && wasVisible) blueDrop.explode(x, y);
        const growing = Math.min(1, blueClock / 0.4);
        const swell = 1 + 0.6 * Math.pow(Math.min(1, blueClock / BLUE_CYCLE), 3);
        const size = blueClock < BLUE_CYCLE ? 10 * growing * swell : 0;
        blueDrop.draw(dt, x, y, size);
      }
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
    // Start the effect for a lens clip (angry, sad or happy), forward or reversed.
    start(name, reversed) {
      if (!EFFECTS[name]) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      clear();
      resize();
      current = EFFECTS[name](reversed);
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
