/* ============================================================
   NÓS. — music.js
   Music player: play/pause, file change, visualizer wave
   ============================================================ */

let audioEl     = null;
let isPlaying   = false;
let hasInteracted = false;

function initMusicPlayer() {
  audioEl = document.getElementById('audio-player');
  if (!audioEl) return;

  const toggleBtn  = document.getElementById('music-toggle');
  const playIcon   = document.getElementById('play-icon');
  const pauseIcon  = document.getElementById('pause-icon');
  const changeBtn  = document.getElementById('music-change');
  const fileInput  = document.getElementById('music-file');
  const titleEl    = document.getElementById('music-title');
  const playerEl   = document.getElementById('music-player');

  /* Load default music if exists */
  if (CONFIG.defaultMusic) {
    audioEl.src = CONFIG.defaultMusic;
    if (titleEl) titleEl.textContent = CONFIG.defaultMusicTitle || 'Música';
  }

  /* Play/Pause toggle */
  function setPlaying(state) {
    isPlaying = state;
    if (state) {
      audioEl.play().catch(() => { isPlaying = false; });
      playIcon.style.display  = 'none';
      pauseIcon.style.display = 'block';
      playerEl?.classList.remove('paused');
    } else {
      audioEl.pause();
      playIcon.style.display  = 'block';
      pauseIcon.style.display = 'none';
      playerEl?.classList.add('paused');
    }
  }

  toggleBtn?.addEventListener('click', () => {
    hasInteracted = true;
    setPlaying(!isPlaying);
  });

  /* Change music button → trigger file input */
  changeBtn?.addEventListener('click', () => fileInput?.click());

  /* File input: load local file */
  fileInput?.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    audioEl.src = url;

    const name = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    if (titleEl) titleEl.textContent = name;

    setPlaying(true);
    fileInput.value = '';
  });

  /* Auto-resume on next song event */
  audioEl.addEventListener('ended', () => {
    if (audioEl.loop) return;
    audioEl.currentTime = 0;
    audioEl.play().catch(() => {});
  });

  /* Try to auto-play after user starts the experience */
  window._tryAutoplay = function() {
    if (!hasInteracted && CONFIG.defaultMusic) {
      audioEl.volume = 0;
      audioEl.play()
        .then(() => {
          fadeVolume(0, 0.45, 3000);
          isPlaying = true;
          if (playIcon)  playIcon.style.display  = 'none';
          if (pauseIcon) pauseIcon.style.display  = 'block';
          playerEl?.classList.remove('paused');
        })
        .catch(() => {
          /* Autoplay blocked — wait for user click */
          playerEl?.classList.add('paused');
        });
    }
  };
}

/* Smooth volume fade */
function fadeVolume(from, to, durationMs) {
  if (!audioEl) return;
  const steps = 60;
  const stepTime = durationMs / steps;
  const diff = (to - from) / steps;
  let current = from;
  audioEl.volume = from;

  const iv = setInterval(() => {
    current = Math.min(Math.max(current + diff, 0), 1);
    audioEl.volume = current;
    if ((diff > 0 && current >= to) || (diff < 0 && current <= to)) {
      clearInterval(iv);
    }
  }, stepTime);
}

/* Called when final screen appears — boost volume slightly */
function crescendoMusic() {
  if (!audioEl || !isPlaying) return;
  const current = audioEl.volume;
  fadeVolume(current, Math.min(current + 0.2, 1.0), 2500);
}
