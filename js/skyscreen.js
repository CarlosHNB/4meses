/* ============================================================
   NÓS. — skyscreen.js
   Controla a abertura/fechamento da tela do céu
   + injeta o botão em cada slide
   + contador de estrelas visíveis
   ============================================================ */

let skyScreenOpen = false;

/* ============================================================
   INJETAR BOTÃO "VER O CÉU" EM CADA SLIDE
   Chamado após buildCarousel()
   ============================================================ */
function injectSkyButtons() {
  const slides = document.querySelectorAll('.slide');
  slides.forEach((slide) => {
    // Não duplica
    if (slide.querySelector('.sky-trigger-btn')) return;

    const btn = document.createElement('button');
    btn.className = 'sky-trigger-btn';
    btn.innerHTML = `
      <span class="sky-trigger-icon">✦</span>
      <span>O céu naquela noite</span>
    `;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openSkyScreen();
    });

    // Injeta dentro do .slide-content, após o último elemento de texto
    const content = slide.querySelector('.slide-content');
    if (content) {
      content.appendChild(btn);
    } else {
      // fallback: adiciona no slide diretamente (não deve acontecer)
      slide.appendChild(btn);
    }
  });
}

/* ============================================================
   CRIAR ESTRUTURA DA TELA DO CÉU (uma vez)
   ============================================================ */
function buildSkyScreen() {
  if (document.getElementById('sky-screen')) return;

  const totalStars = countVisibleStars();
  const totalPlanets = countVisiblePlanets();

  const screen = document.createElement('div');
  screen.id = 'sky-screen';
  screen.innerHTML = `
    <!-- Header -->
    <div class="sky-header">
      <div class="sky-header-left">
        <div class="sky-title-main">O Céu de Maracanaú</div>
        <div class="sky-title-sub">22 de Fevereiro de 2026 · 20h00 · North Shopping</div>
      </div>

      <div class="sky-meta">
        <div class="sky-meta-item">
          <span class="sky-meta-label">Latitude</span>
          <span class="sky-meta-value">3°52′S</span>
        </div>
        <div class="sky-meta-item">
          <span class="sky-meta-label">Longitude</span>
          <span class="sky-meta-value">38°37′W</span>
        </div>
        <div class="sky-meta-item">
          <span class="sky-meta-label">Estrelas</span>
          <span class="sky-meta-value">${totalStars}+</span>
        </div>
      </div>

      <button class="sky-close-btn" id="sky-close-btn" title="Voltar para as fotos">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
      </button>
    </div>

    <!-- Canvas Area -->
    <div class="sky-canvas-area">
      <canvas id="sky-canvas"></canvas>
      <div class="sky-vignette"></div>

      <!-- Legenda lateral (desktop) -->
      <div class="sky-legend">
        <div class="sky-legend-title">Legenda</div>
        <div class="sky-legend-item">
          <div class="legend-dot" style="background:#E0F0FF; box-shadow:0 0 4px #E0F0FF"></div>
          <span>Estrela azul-branca</span>
        </div>
        <div class="sky-legend-item">
          <div class="legend-dot" style="background:#FFFFD0; box-shadow:0 0 4px #FFFFD0"></div>
          <span>Estrela amarela</span>
        </div>
        <div class="sky-legend-item">
          <div class="legend-dot" style="background:#FF8820; box-shadow:0 0 4px #FF8820"></div>
          <span>Gigante laranja</span>
        </div>
        <div class="sky-legend-item">
          <div class="legend-dot" style="background:#FF5020; box-shadow:0 0 4px #FF5020"></div>
          <span>Supergigante vermelha</span>
        </div>
        <div class="sky-legend-item">
          <div class="legend-dot" style="background:#FFD0A0; width:10px;height:10px; box-shadow:0 0 6px #FFD0A0"></div>
          <span>Planeta</span>
        </div>
        <div class="sky-legend-item">
          <div class="legend-line" style="background: linear-gradient(90deg, #6080CC, #8090DD)"></div>
          <span>Constelação</span>
        </div>
        <div class="sky-legend-item">
          <div class="legend-dot" style="background:#4488FF; opacity:0.5; border-radius:3px"></div>
          <span>Nebulosa / Aglomerado</span>
        </div>
      </div>

      <!-- Dica hover -->
      <div class="sky-hover-hint">✦ Passe o mouse sobre as estrelas</div>
    </div>

    <!-- Painel Inferior -->
    <div class="sky-info-panel">
      <div class="sky-love-message">
        <div class="sky-love-date">✦ 22 de Fevereiro de 2026 · Maracanaú, CE ✦</div>
        <p class="sky-love-quote">
          Esse foi o céu que nos viu começar.<br>
          Cada estrela ali foi testemunha do momento<br>
          em que eu te pedi pra namorar comigo,
          <em>Elen Ambrosio Souza.</em>
        </p>
        <div class="sky-stats">
          <div class="sky-stat">
            <span class="sky-stat-number">${totalStars}</span>
            <span class="sky-stat-label">estrelas visíveis</span>
          </div>
          <div class="sky-stat">
            <span class="sky-stat-number">${totalPlanets}</span>
            <span class="sky-stat-label">planetas no céu</span>
          </div>
          <div class="sky-stat">
            <span class="sky-stat-number">20:00</span>
            <span class="sky-stat-label">horário BRT</span>
          </div>
          <div class="sky-stat">
            <span class="sky-stat-number" id="sky-temp">~28°C</span>
            <span class="sky-stat-label">temperatura típica</span>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(screen);

  // Botão fechar
  document.getElementById('sky-close-btn').addEventListener('click', closeSkyScreen);

  // Fechar com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && skyScreenOpen) closeSkyScreen();
  });

  // Inicializa o renderer
  initSkyRenderer('sky-canvas');
}

/* ============================================================
   ABRIR / FECHAR
   ============================================================ */
function openSkyScreen() {
  buildSkyScreen();

  const screen = document.getElementById('sky-screen');
  if (!screen) return;

  skyScreenOpen = true;

  // Pausa o carrossel e efeitos
  document.getElementById('carousel').style.pointerEvents = 'none';

  // Mostra com animação
  requestAnimationFrame(() => {
    screen.classList.add('visible');
  });

  // Retoma renderer
  if (typeof startSkyAnimation === 'function') startSkyAnimation();

  // Partículas de entrada
  spawnSkyEntryParticles();
}

function closeSkyScreen() {
  const screen = document.getElementById('sky-screen');
  if (!screen) return;

  skyScreenOpen = false;
  screen.classList.remove('visible');

  // Restaura carrossel
  setTimeout(() => {
    document.getElementById('carousel').style.pointerEvents = '';
  }, 900);

  // Pausa renderer pra economizar recursos
  if (typeof stopSkyAnimation === 'function') {
    setTimeout(stopSkyAnimation, 900);
  }
}

/* ============================================================
   CONTADORES
   ============================================================ */
function countVisibleStars() {
  if (!skyData) {
    // Calcula rápido sem armazenar
    const tmp = computeSkyForMoment(SKY_CONFIG);
    return tmp.stars.length;
  }
  return skyData.stars.length;
}

function countVisiblePlanets() {
  if (!skyData) {
    const tmp = computeSkyForMoment(SKY_CONFIG);
    return tmp.planets.length;
  }
  return skyData.planets.length;
}

/* ============================================================
   PARTÍCULAS DE ENTRADA
   ============================================================ */
function spawnSkyEntryParticles() {
  const layer = document.getElementById('petals-layer');
  if (!layer) return;

  const sparks = ['✦', '✧', '⋆', '·', '★'];
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        font-size: ${Math.random() * 0.8 + 0.5}rem;
        color: rgba(${Math.random() > 0.5 ? '180,210,255' : '200,180,255'},${Math.random() * 0.6 + 0.3});
        pointer-events: none;
        animation: sparkleAnim ${Math.random() * 1 + 0.8}s ease forwards;
        z-index: 850;
      `;
      el.textContent = sparks[Math.floor(Math.random() * sparks.length)];
      layer.appendChild(el);
      setTimeout(() => el.remove(), 2000);
    }, i * 80);
  }
}
