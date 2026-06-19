/* ============================================================
   NÓS. — carousel.js
   Core carousel / slide system
   ============================================================ */

let currentIndex = 0;
let totalSlides   = 0;
let isTransitioning = false;
let touchStartX  = 0;
let touchStartY  = 0;

/* ---------- BUILD SLIDES ---------- */
function buildCarousel() {
  const wrapper    = document.getElementById('slides-wrapper');
  const indicators = document.getElementById('indicators');
  if (!wrapper || !indicators) return;

  totalSlides = MEMORIES.length;

  document.getElementById('total-slides').textContent = totalSlides;

  wrapper.innerHTML    = '';
  indicators.innerHTML = '';

  MEMORIES.forEach((mem, i) => {
    /* Slide */
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.dataset.index = i;

    /* Background blurred image */
    const bg = document.createElement('div');
    bg.className = 'slide-bg';
    if (mem.image) bg.style.backgroundImage = `url('${mem.image}')`;

    /* Overlay */
    const overlay = document.createElement('div');
    overlay.className = 'slide-overlay';

    /* Photo container */
    const photoWrap = document.createElement('div');
    photoWrap.className = 'slide-photo-container';

    if (mem.image) {
      // ── Camada 1: fundo desfocado (cobre a tela inteira)
      const bgImg = document.createElement('img');
      bgImg.className = 'slide-photo-bg';
      bgImg.alt = '';
      bgImg.setAttribute('aria-hidden', 'true');
      bgImg.loading = i === 0 ? 'eager' : 'lazy';
      bgImg.onload = () => bgImg.classList.add('loaded');
      bgImg.src = mem.image;
      photoWrap.appendChild(bgImg);

      // ── Camada 2: foto principal centralizada e proporcional
      const img = document.createElement('img');
      img.className = 'slide-photo';
      img.alt = mem.title;
      img.loading = i === 0 ? 'eager' : 'lazy';

      img.onload = () => {
        img.classList.add('loaded');
        // Detecta orientação e aplica classe
        const ratio = img.naturalWidth / img.naturalHeight;
        if (ratio < 0.85)       img.classList.add('portrait');
        else if (ratio > 1.15)  img.classList.add('landscape');
        else                    img.classList.add('square');
      };

      img.onerror = () => {
        img.style.display = 'none';
        bgImg.style.display = 'none';
        photoWrap.appendChild(createPlaceholder(mem.title));
      };

      img.src = mem.image;
      photoWrap.appendChild(img);
    } else {
      photoWrap.appendChild(createPlaceholder(mem.title));
    }

    /* Tag (top center) */
    if (mem.tag) {
      const tag = document.createElement('div');
      tag.className = 'slide-tag';
      tag.textContent = mem.tag;
      slide.appendChild(tag);
    }

    /* Slide number (top right) */
    const num = document.createElement('div');
    num.className = 'slide-number';
    num.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(totalSlides).padStart(2, '0');
    slide.appendChild(num);

    /* Content (bottom) */
    const content = document.createElement('div');
    content.className = 'slide-content';

    if (mem.date) {
      const date = document.createElement('div');
      date.className = 'slide-date';
      date.textContent = mem.date;
      content.appendChild(date);
    }

    const divider = document.createElement('div');
    divider.className = 'slide-divider';
    content.appendChild(divider);

    const title = document.createElement('h2');
    title.className = 'slide-title';
    title.innerHTML = mem.title;
    content.appendChild(title);

    const msg = document.createElement('p');
    msg.className = 'slide-message';
    msg.textContent = mem.message;
    content.appendChild(msg);

    /* Assemble */
    slide.appendChild(bg);
    slide.appendChild(overlay);
    slide.appendChild(photoWrap);
    slide.appendChild(content);

    wrapper.appendChild(slide);

    /* Indicator dot */
    const dot = document.createElement('button');
    dot.className = 'indicator' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Foto ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    indicators.appendChild(dot);
  });

  /* Activate first slide */
  activateSlide(0, null);
}

function createPlaceholder(title) {
  const ph = document.createElement('div');
  ph.className = 'slide-photo-placeholder';
  ph.innerHTML = `
    <div class="ph-icon">📷</div>
    <div class="ph-text">Adicione uma foto</div>
    <div style="font-size:0.75rem;color:rgba(255,255,255,0.15);margin-top:0.5rem;font-family:Inter,sans-serif">${title || ''}</div>
  `;
  return ph;
}

/* ---------- NAVIGATION ---------- */
function goToSlide(nextIndex, direction) {
  if (isTransitioning) return;
  if (nextIndex === currentIndex) return;

  if (nextIndex >= totalSlides) {
    showFinalScreen();
    return;
  }
  if (nextIndex < 0) return;

  const dir = direction !== undefined ? direction : (nextIndex > currentIndex ? 'next' : 'prev');
  isTransitioning = true;

  const slides = document.querySelectorAll('.slide');
  const oldSlide = slides[currentIndex];
  const newSlide = slides[nextIndex];

  /* Prep new slide (off-screen) */
  newSlide.classList.remove('active', 'exit-to-prev', 'exit-to-next', 'enter-from-next', 'enter-from-prev');
  newSlide.classList.add(dir === 'next' ? 'enter-from-next' : 'enter-from-prev');

  /* Force reflow */
  void newSlide.offsetWidth;

  /* Exit old slide */
  oldSlide.classList.remove('active');
  oldSlide.classList.add(dir === 'next' ? 'exit-to-prev' : 'exit-to-next');

  /* Enter new slide */
  newSlide.classList.remove('enter-from-next', 'enter-from-prev');
  newSlide.classList.add('active');

  /* Update counter */
  document.getElementById('current-slide').textContent = nextIndex + 1;

  /* Update indicators */
  document.querySelectorAll('.indicator').forEach((dot, i) => {
    dot.classList.toggle('active', i === nextIndex);
  });

  currentIndex = nextIndex;

  /* Preload next image */
  const nextNext = MEMORIES[currentIndex + 1];
  if (nextNext && nextNext.image) {
    const preload = new Image();
    preload.src = nextNext.image;
  }

  /* Cleanup after transition */
  setTimeout(() => {
    oldSlide.classList.remove('exit-to-prev', 'exit-to-next', 'active');
    isTransitioning = false;
  }, 950);

  /* Sparkle burst */
  spawnTransitionSparkles();
}

function activateSlide(index, direction) {
  const slides = document.querySelectorAll('.slide');
  slides.forEach((s, i) => {
    s.classList.toggle('active', i === index);
  });
  document.getElementById('current-slide').textContent = index + 1;
}

function nextSlide() {
  const next = currentIndex + 1;
  if (next >= totalSlides) {
    showFinalScreen();
  } else {
    goToSlide(next, 'next');
  }
}

function prevSlide() {
  if (currentIndex > 0) goToSlide(currentIndex - 1, 'prev');
}

/* ---------- KEYBOARD / TOUCH / WHEEL ---------- */
function bindCarouselEvents() {
  document.addEventListener('keydown', e => {
    if (!document.getElementById('main-experience')?.classList.contains('visible')) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextSlide();
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   prevSlide();
  });

  /* Touch swipe */
  const carousel = document.getElementById('carousel');
  if (!carousel) return;

  carousel.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  carousel.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) {
      if (dx < 0) nextSlide();
      else         prevSlide();
    }
  });

  /* Mouse wheel */
  let wheelCooldown = false;
  carousel.addEventListener('wheel', e => {
    e.preventDefault();
    if (wheelCooldown) return;
    wheelCooldown = true;
    if (e.deltaY > 0 || e.deltaX > 0) nextSlide();
    else prevSlide();
    setTimeout(() => { wheelCooldown = false; }, 1000);
  }, { passive: false });

  /* Buttons */
  document.getElementById('nav-next')?.addEventListener('click', nextSlide);
  document.getElementById('nav-prev')?.addEventListener('click', prevSlide);
}

/* ---------- PARALLAX ON MOUSE ---------- */
function bindParallax() {
  if (!CONFIG.parallaxEnabled) return;
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch

  window.addEventListener('mousemove', e => {
    const rx = (e.clientX / window.innerWidth  - 0.5) * 12;
    const ry = (e.clientY / window.innerHeight - 0.5) * 8;

    const activeSlide = document.querySelector('.slide.active');
    if (!activeSlide) return;

    const bg = activeSlide.querySelector('.slide-bg');
    if (bg) {
      bg.style.transform = `scale(1.06) translate(${rx * 0.3}px, ${ry * 0.2}px)`;
    }
  });
}

/* ---------- TRANSITION SPARKLES ---------- */
function spawnTransitionSparkles() {
  const layer = document.getElementById('petals-layer');
  if (!layer) return;

  const emojis = ['✨', '⭐', '🌟', '💫'];
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.style.cssText = `
        position:absolute;
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        font-size:${Math.random() * 1 + 0.7}rem;
        pointer-events:none;
        animation: sparkleAnim ${Math.random() * 0.8 + 0.8}s ease forwards;
        z-index:60;
      `;
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      layer.appendChild(el);
      setTimeout(() => el.remove(), 1800);
    }, i * 60);
  }
}
