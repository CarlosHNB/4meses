/* ============================================================
   NÓS. — app.js  (v5 — mobile-first, scroll fix)
   ============================================================ */

/* ---------- ANNIVERSARY COUNTER ---------- */
function updateCounter() {
  const start = CONFIG.anniversaryDate;
  const now   = new Date();
  const diffMs    = now - start;
  const diffDays  = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30.4375);

  const daysEl = document.getElementById('days-count');
  if (daysEl) animateNumber(daysEl, 0, diffDays + 1, 1200);

  const monthEl = document.getElementById('counter-months');
  if (monthEl) {
    // Exibe sempre "4 Meses" — mostrado no domingo antes de completar 4 meses
    monthEl.textContent = '4 Meses';
  }

  const detailEl = document.getElementById('counter-detail');
  if (detailEl) {
    detailEl.textContent = `${diffDays} dias juntos`;
  }
}

function animateNumber(el, from, to, duration) {
  const start = performance.now();
  function step(ts) {
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + (to - from) * ease);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ---------- SCROLL / TOUCH LOCK ---------- */
function lockBodyScroll() {
  // Impede qualquer scroll no body (exceto tela final)
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.width    = '100%';
  document.body.style.height   = '100dvh';
}

function unlockFinalScreenScroll() {
  // Libera apenas o scroll vertical da tela final
  const finalEl = document.getElementById('final-screen');
  if (!finalEl) return;
  finalEl.style.overflowY = 'auto';
  finalEl.style.webkitOverflowScrolling = 'touch';
  // Tela final: permite pan-y no touch
  finalEl.style.touchAction = 'pan-y';
}

/* Bloqueia touchmove no body, mas deixa passar se vier da tela final */
function bindScrollPrevention() {
  document.addEventListener('touchmove', (e) => {
    const finalEl = document.getElementById('final-screen');
    // Se a tela final está visível e o toque vem de dentro dela → permite
    if (finalEl && finalEl.classList.contains('visible') && finalEl.contains(e.target)) {
      return; // não bloqueia
    }
    e.preventDefault();
  }, { passive: false });
}

/* ---------- INTRO → EXPERIENCE ---------- */
function startExperience() {
  const intro = document.getElementById('intro-screen');
  const main  = document.getElementById('main-experience');

  intro.classList.add('exiting');

  setTimeout(() => {
    intro.classList.remove('active');
    intro.classList.add('hidden');

    main.classList.remove('hidden');
    main.classList.add('visible');

    buildCarousel();
    injectSkyButtons();
    bindCarouselEvents();
    bindParallax();
    initMusicPlayer();
    startPetals();
    scheduleButterflies();
    updateCounter();

    if (window._stopIntroStars) window._stopIntroStars();
    initParticlesCanvas();

    setTimeout(() => {
      if (window._tryAutoplay) window._tryAutoplay();
    }, 500);

  }, 1200);
}

/* ---------- FINAL SCREEN ---------- */
function showFinalScreen() {
  const finalEl = document.getElementById('final-screen');
  if (!finalEl) return;

  finalEl.classList.remove('hidden');
  finalEl.classList.add('visible');

  // Rola para o topo da tela final
  finalEl.scrollTop = 0;

  // Libera scroll vertical na tela final
  unlockFinalScreenScroll();

  // Anima as linhas sequencialmente
  const lines = finalEl.querySelectorAll('.final-line');
  lines.forEach((line, i) => {
    setTimeout(() => line.classList.add('visible'), 300 + i * 140);
  });

  // Efeitos finais
  setTimeout(() => {
    initFinalCanvas();
    finalFlowerBurst();
    floatingHeartsEffect();
    crescendoMusic();
    setFinalDate();
  }, 500);
}

function setFinalDate() {
  const el = document.getElementById('final-date');
  if (!el) return;
  el.textContent = new Date().toLocaleDateString('pt-BR', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

/* ---------- RESTART ---------- */
function restartExperience() {
  const finalEl = document.getElementById('final-screen');
  if (finalEl) {
    finalEl.classList.remove('visible');
    finalEl.classList.add('hidden');
    // Volta a bloquear scroll no touch
    finalEl.style.touchAction = '';
  }

  currentIndex = 0;
  isTransitioning = false;

  const slides = document.querySelectorAll('.slide');
  slides.forEach((s, i) => {
    s.classList.remove('active', 'enter-from-next', 'enter-from-prev', 'exit-to-prev', 'exit-to-next');
    if (i === 0) s.classList.add('active');
  });

  document.querySelectorAll('.indicator').forEach((dot, i) => {
    dot.classList.toggle('active', i === 0);
  });

  document.getElementById('current-slide').textContent = '1';
}

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  lockBodyScroll();
  bindScrollPrevention();

  addVignette();
  addFilmGrain();
  initCursorGlow();
  initStarsCanvas();

  document.getElementById('begin-btn')?.addEventListener('click', startExperience);
  document.getElementById('restart-btn')?.addEventListener('click', restartExperience);
});
