/* ============================================================
   NÓS. — particles.js
   Stars intro + ambient particles
   ============================================================ */

/* ---------- INTRO STARS ---------- */
function initStarsCanvas() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let stars = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function createStars(n = 220) {
    stars = [];
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.3,
        alpha: Math.random(),
        speed: Math.random() * 0.008 + 0.003,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: Math.random() > 0.85 ? '#C9A84C' : Math.random() > 0.7 ? '#F4C2C2' : '#FFFFFF',
      });
    }
  }
  createStars();

  let frame;
  function drawStars(t) {
    ctx.clearRect(0, 0, W, H);
    const time = t * 0.001;

    for (const s of stars) {
      const twinkle = 0.4 + 0.6 * Math.sin(time * s.speed * 120 + s.twinkleOffset);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = twinkle * 0.95;
      ctx.fill();

      // Bigger stars get a soft glow
      if (s.r > 1.1) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3);
        g.addColorStop(0, s.color + '66');
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.globalAlpha = twinkle * 0.3;
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
    frame = requestAnimationFrame(drawStars);
  }
  frame = requestAnimationFrame(drawStars);

  window._stopIntroStars = () => cancelAnimationFrame(frame);
}

/* ---------- AMBIENT PARTICLES ---------- */
function initParticlesCanvas() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  let particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const PALETTE = ['#C9A84C', '#E8D49A', '#F4C2C2', '#D4788A', '#FFFFFF', '#F0E6C0'];

  function spawnParticle() {
    particles.push({
      x: Math.random() * W,
      y: H + 10,
      r: Math.random() * 2.5 + 0.8,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -(Math.random() * 0.7 + 0.3),
      alpha: 0,
      maxAlpha: Math.random() * 0.6 + 0.2,
      life: 0,
      maxLife: Math.random() * 200 + 120,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    });
  }

  let frame2;
  let spawnTimer = 0;

  function drawParticles(t) {
    ctx.clearRect(0, 0, W, H);

    spawnTimer++;
    if (spawnTimer % 4 === 0 && particles.length < 80) spawnParticle();

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life++;

      const lifeRatio = p.life / p.maxLife;
      if (lifeRatio < 0.1)      p.alpha = p.maxAlpha * (lifeRatio / 0.1);
      else if (lifeRatio > 0.8) p.alpha = p.maxAlpha * (1 - (lifeRatio - 0.8) / 0.2);
      else                      p.alpha = p.maxAlpha;

      if (p.life >= p.maxLife || p.y < -20) {
        particles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    frame2 = requestAnimationFrame(drawParticles);
  }
  frame2 = requestAnimationFrame(drawParticles);
}

/* ---------- FINAL SCREEN STARS ---------- */
function initFinalCanvas() {
  const canvas = document.getElementById('final-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, stars = [], frame3;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 300; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.3,
      alpha: Math.random(),
      t: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.005,
      color: Math.random() > 0.8 ? '#C9A84C' : Math.random() > 0.6 ? '#F4C2C2' : '#FFFFFF',
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      s.t += s.speed;
      const a = 0.3 + 0.7 * ((Math.sin(s.t) + 1) / 2);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = a;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    frame3 = requestAnimationFrame(draw);
  }
  frame3 = requestAnimationFrame(draw);
}
