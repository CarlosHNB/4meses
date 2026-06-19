/* ============================================================
   NÓS. — effects.js
   Petals, butterflies, cursor glow, floating hearts
   ============================================================ */

/* ---------- PETALS ---------- */
const PETALS  = ['🌸', '🌺', '🌹', '🌼', '🌷', '💮'];
const SPARKS  = ['✨', '⭐', '🌟', '💫', '✦'];
const BUTTERFLIES = ['🦋'];

let petalsActive = false;

function startPetals() {
  if (petalsActive) return;
  petalsActive = true;
  dropPetals();
}

function dropPetals() {
  if (!petalsActive) return;
  const layer = document.getElementById('petals-layer');
  if (!layer) return;

  const petal = document.createElement('div');
  petal.className = 'petal';
  petal.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];

  const size = Math.random() * 0.8 + 0.65;
  const left = Math.random() * 110 - 5;
  const duration = Math.random() * 6 + 6;
  const drift = (Math.random() - 0.5) * 120;
  const delay = Math.random() * 1.5;

  petal.style.cssText = `
    left: ${left}%;
    font-size: ${size}rem;
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
    --drift: ${drift}px;
  `;

  layer.appendChild(petal);

  setTimeout(() => petal.remove(), (duration + delay + 0.5) * 1000);

  const nextDelay = Math.random() * 1200 + 500;
  setTimeout(dropPetals, nextDelay);
}

/* ---------- BUTTERFLIES ---------- */
function spawnButterfly() {
  const layer = document.getElementById('butterflies-layer');
  if (!layer) return;

  const bf = document.createElement('div');
  bf.className = 'butterfly';
  bf.textContent = BUTTERFLIES[0];

  const startX = Math.random() > 0.5 ? -60 : window.innerWidth + 60;
  const startY = Math.random() * window.innerHeight * 0.7 + 80;
  const endX = startX < 0 ? (window.innerWidth * 0.6 + Math.random() * 200) : -(window.innerWidth * 0.4 + Math.random() * 200);
  const endY = startY + (Math.random() - 0.5) * 200;
  const midX = (startX + endX) / 2 + (Math.random() - 0.5) * 150;
  const midY = startY - Math.random() * 150 - 50;
  const duration = Math.random() * 8 + 7;
  const size = Math.random() * 0.5 + 0.9;

  bf.style.cssText = `
    left: ${startX}px;
    top: ${startY}px;
    font-size: ${size}rem;
    animation-duration: ${duration}s;
    --bx: ${(midX - startX)}px;
    --by: ${(midY - startY)}px;
    --br: ${(Math.random() - 0.5) * 30}deg;
    --bx2: ${(endX - startX)}px;
    --by2: ${(endY - startY)}px;
    --br2: ${(Math.random() - 0.5) * 20}deg;
  `;

  layer.appendChild(bf);
  setTimeout(() => bf.remove(), duration * 1100);
}

function scheduleButterflies() {
  const delay = Math.random() * 14000 + 8000;
  setTimeout(() => {
    spawnButterfly();
    scheduleButterflies();
  }, delay);
}

/* ---------- CURSOR GLOW (desktop) ---------- */
function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  window.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}

/* ---------- FLOATING HEARTS on final screen ---------- */
function floatingHeartsEffect() {
  const layer = document.getElementById('petals-layer');
  if (!layer) return;

  const heartsEmoji = ['❤', '🧡', '💛', '💚', '💙', '💜', '🤍', '❤'];
  let count = 0;
  const interval = setInterval(() => {
    for (let i = 0; i < 3; i++) {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.textContent = heartsEmoji[Math.floor(Math.random() * heartsEmoji.length)];
      const size = Math.random() * 1.2 + 0.7;
      const left = Math.random() * 100;
      const duration = Math.random() * 4 + 4;
      const rot = (Math.random() - 0.5) * 30;
      heart.style.cssText = `
        left: ${left}%;
        bottom: -10px;
        --fh-size: ${size}rem;
        --fh-rot: ${rot}deg;
        animation-duration: ${duration}s;
      `;
      layer.appendChild(heart);
      setTimeout(() => heart.remove(), duration * 1000 + 200);
    }

    count++;
    if (count > 30) clearInterval(interval);
  }, 300);
}

/* ---------- VIGNETTE overlay ---------- */
function addVignette() {
  const v = document.createElement('div');
  v.className = 'vignette';
  document.body.appendChild(v);
}

/* ---------- FILM GRAIN ---------- */
function addFilmGrain() {
  const grain = document.createElement('div');
  grain.className = 'film-grain';
  document.body.appendChild(grain);
}

/* ---------- FINAL SCREEN flower burst ---------- */
function finalFlowerBurst() {
  const layer = document.getElementById('petals-layer');
  if (!layer) return;
  const flowers = ['🌸', '🌺', '🌹', '🌷', '🌼', '💮', '🌸'];

  for (let i = 0; i < 25; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'petal';
      el.textContent = flowers[Math.floor(Math.random() * flowers.length)];
      const size = Math.random() * 1 + 0.8;
      const left = Math.random() * 110 - 5;
      const duration = Math.random() * 5 + 5;
      const drift = (Math.random() - 0.5) * 160;
      el.style.cssText = `
        left: ${left}%;
        font-size: ${size}rem;
        animation-duration: ${duration}s;
        --drift: ${drift}px;
      `;
      layer.appendChild(el);
      setTimeout(() => el.remove(), (duration + 1) * 1000);
    }, i * 180);
  }
}
