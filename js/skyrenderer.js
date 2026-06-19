/* ============================================================
   NÓS. — skyrenderer.js
   Renderiza o céu real de Maracanaú em canvas com visual premium
   ============================================================ */

let skyCanvas, skyCtx;
let skyAnimFrame;
let skyTime = 0;
let skyData = null;
let hoveredStar = null;
let tooltipVisible = false;

// Pré-calcula logo que o script carrega (para countVisibleStars antes do canvas)
skyData = computeSkyForMoment(SKY_CONFIG);

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */
function initSkyRenderer(canvasId) {
  skyCanvas = document.getElementById(canvasId);
  if (!skyCanvas) return;
  skyCtx = skyCanvas.getContext('2d');

  resizeSkyCanvas();
  window.addEventListener('resize', resizeSkyCanvas);

  // Calcula o céu (só se ainda não foi feito)
  if (!skyData) skyData = computeSkyForMoment(SKY_CONFIG);

  // Mouse hover para tooltips
  skyCanvas.addEventListener('mousemove', onSkyMouseMove);
  skyCanvas.addEventListener('touchstart', onSkyTouch, { passive: true });
  skyCanvas.addEventListener('click', onSkyClick);

  startSkyAnimation();
}

function resizeSkyCanvas() {
  if (!skyCanvas) return;
  skyCanvas.width  = skyCanvas.offsetWidth;
  skyCanvas.height = skyCanvas.offsetHeight;
}

/* ============================================================
   ANIMATION LOOP
   ============================================================ */
function startSkyAnimation() {
  cancelAnimationFrame(skyAnimFrame);
  function loop(t) {
    skyTime = t * 0.001;
    drawSky();
    skyAnimFrame = requestAnimationFrame(loop);
  }
  skyAnimFrame = requestAnimationFrame(loop);
}

function stopSkyAnimation() {
  cancelAnimationFrame(skyAnimFrame);
}

/* ============================================================
   DESENHO PRINCIPAL
   ============================================================ */
function drawSky() {
  if (!skyCtx || !skyData) return;

  const W = skyCanvas.width;
  const H = skyCanvas.height;
  const cx = W / 2;
  const cy = H / 2;
  const radius = Math.min(W, H) * 0.46;

  skyCtx.clearRect(0, 0, W, H);

  drawSkyBackground(W, H, cx, cy, radius);
  drawAtmosphericGlow(W, H, cx, cy, radius);
  drawDeepSkyObjects(cx, cy, radius);
  drawMilkyWay(cx, cy, radius);
  drawConstellationLines(cx, cy, radius);
  drawStars(cx, cy, radius);
  drawPlanets(cx, cy, radius);
  drawCardinalPoints(cx, cy, radius);
  drawHorizonRing(cx, cy, radius);
  drawZenith(cx, cy);

  if (hoveredStar) drawTooltip(hoveredStar, W, H);
}

/* ============================================================
   FUNDO DO CÉU
   ============================================================ */
function drawSkyBackground(W, H, cx, cy, radius) {
  // Fundo geral da tela
  skyCtx.fillStyle = '#010108';
  skyCtx.fillRect(0, 0, W, H);

  // Disco do céu com gradiente atmosférico
  const grad = skyCtx.createRadialGradient(cx, cy * 0.9, 0, cx, cy, radius);
  grad.addColorStop(0.0,  '#0d1030');  // Zênite - azul profundo
  grad.addColorStop(0.35, '#080820');
  grad.addColorStop(0.65, '#050515');
  grad.addColorStop(0.85, '#020210');
  grad.addColorStop(1.0,  '#010108');

  skyCtx.save();
  skyCtx.beginPath();
  skyCtx.arc(cx, cy, radius, 0, Math.PI * 2);
  skyCtx.fillStyle = grad;
  skyCtx.fill();
  skyCtx.restore();
}

/* ============================================================
   BRILHO ATMOSFÉRICO
   ============================================================ */
function drawAtmosphericGlow(W, H, cx, cy, radius) {
  // Leve brilho azul-violeta no zênite
  const zenithGlow = skyCtx.createRadialGradient(cx, cy - radius * 0.1, 0, cx, cy - radius * 0.1, radius * 0.6);
  zenithGlow.addColorStop(0, 'rgba(30,20,80,0.18)');
  zenithGlow.addColorStop(1, 'transparent');

  skyCtx.save();
  skyCtx.beginPath();
  skyCtx.arc(cx, cy, radius, 0, Math.PI * 2);
  skyCtx.clip();
  skyCtx.fillStyle = zenithGlow;
  skyCtx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  skyCtx.restore();

  // Brilho âmbar baixo no horizonte norte (luz da cidade, leste para noroeste)
  const horizonGlow = skyCtx.createRadialGradient(cx, cy + radius * 0.7, 0, cx, cy + radius * 0.7, radius * 0.9);
  horizonGlow.addColorStop(0, 'rgba(80,40,10,0.22)');
  horizonGlow.addColorStop(1, 'transparent');

  skyCtx.save();
  skyCtx.beginPath();
  skyCtx.arc(cx, cy, radius, 0, Math.PI * 2);
  skyCtx.clip();
  skyCtx.fillStyle = horizonGlow;
  skyCtx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  skyCtx.restore();
}

/* ============================================================
   VIA LÁCTEA — Banda aproximada para a região do nordeste
   ============================================================ */
function drawMilkyWay(cx, cy, radius) {
  // Via Láctea atravessa o céu de SW para NE em fevereiro no nordeste
  skyCtx.save();
  skyCtx.beginPath();
  skyCtx.arc(cx, cy, radius, 0, Math.PI * 2);
  skyCtx.clip();

  // Banda principal
  const angle = -35 * Math.PI / 180; // inclinação
  const bW = radius * 0.22;

  for (let pass = 0; pass < 3; pass++) {
    const alpha = [0.055, 0.035, 0.02][pass];
    const width = bW * [1, 1.6, 2.2][pass];

    const grad = skyCtx.createLinearGradient(
      cx - Math.cos(angle + Math.PI / 2) * width,
      cy - Math.sin(angle + Math.PI / 2) * width,
      cx + Math.cos(angle + Math.PI / 2) * width,
      cy + Math.sin(angle + Math.PI / 2) * width
    );
    grad.addColorStop(0,   'transparent');
    grad.addColorStop(0.3, `rgba(160,160,220,${alpha})`);
    grad.addColorStop(0.5, `rgba(200,200,255,${alpha * 1.5})`);
    grad.addColorStop(0.7, `rgba(160,160,220,${alpha})`);
    grad.addColorStop(1,   'transparent');

    skyCtx.save();
    skyCtx.translate(cx, cy);
    skyCtx.rotate(angle);
    skyCtx.fillStyle = grad;
    skyCtx.fillRect(-radius, -width, radius * 2, width * 2);
    skyCtx.restore();
  }

  // Núcleo galáctico — mais brilhante a sudeste
  const nucleusX = cx + radius * 0.15;
  const nucleusY = cy + radius * 0.25;
  const nucleus = skyCtx.createRadialGradient(nucleusX, nucleusY, 0, nucleusX, nucleusY, radius * 0.3);
  nucleus.addColorStop(0, 'rgba(255,220,150,0.06)');
  nucleus.addColorStop(0.4, 'rgba(200,180,220,0.04)');
  nucleus.addColorStop(1, 'transparent');
  skyCtx.fillStyle = nucleus;
  skyCtx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  skyCtx.restore();
}

/* ============================================================
   OBJETOS DE CÉU PROFUNDO
   ============================================================ */
function drawDeepSkyObjects(cx, cy, radius) {
  if (!skyData) return;

  for (const obj of skyData.deepSky) {
    const proj = projectStar(obj.alt, obj.az, cx, cy, radius);
    if (!proj) continue;

    const s = obj.size * (radius / 300);
    const col = obj.color || '#6688FF';
    const alpha = obj.alpha || 0.2;

    // Nebulosa: blob suave
    const pulse = 1 + Math.sin(skyTime * 0.5 + obj.AR) * 0.1;
    const grd = skyCtx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, s * pulse);
    grd.addColorStop(0, hexToRgba(col, alpha * 1.5));
    grd.addColorStop(0.5, hexToRgba(col, alpha * 0.7));
    grd.addColorStop(1, 'transparent');

    skyCtx.beginPath();
    skyCtx.arc(proj.x, proj.y, s * pulse, 0, Math.PI * 2);
    skyCtx.fillStyle = grd;
    skyCtx.fill();
  }
}

/* ============================================================
   LINHAS DAS CONSTELAÇÕES
   ============================================================ */
function drawConstellationLines(cx, cy, radius) {
  if (!skyData) return;

  skyCtx.save();
  skyCtx.beginPath();
  skyCtx.arc(cx, cy, radius, 0, Math.PI * 2);
  skyCtx.clip();

  for (const [cname, lines] of Object.entries(skyData.constellationLines)) {
    for (const line of lines) {
      if (!line.visible) continue;
      const p1 = projectStar(line.p1.alt, line.p1.az, cx, cy, radius);
      const p2 = projectStar(line.p2.alt, line.p2.az, cx, cy, radius);
      if (!p1 || !p2) continue;

      // Linha suave com gradiente
      const lineGrd = skyCtx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
      lineGrd.addColorStop(0, 'rgba(100,140,220,0.15)');
      lineGrd.addColorStop(0.5, 'rgba(130,170,255,0.22)');
      lineGrd.addColorStop(1, 'rgba(100,140,220,0.15)');

      skyCtx.beginPath();
      skyCtx.moveTo(p1.x, p1.y);
      skyCtx.lineTo(p2.x, p2.y);
      skyCtx.strokeStyle = lineGrd;
      skyCtx.lineWidth = 0.8;
      skyCtx.stroke();
    }
  }

  skyCtx.restore();
}

/* ============================================================
   ESTRELAS
   ============================================================ */
function drawStars(cx, cy, radius) {
  if (!skyData) return;

  skyCtx.save();
  skyCtx.beginPath();
  skyCtx.arc(cx, cy, radius, 0, Math.PI * 2);
  skyCtx.clip();

  // Ordenar por magnitude (mais fracas primeiro)
  const sorted = [...skyData.stars].sort((a, b) => b.mag - a.mag);

  for (const star of sorted) {
    const proj = projectStar(star.alt, star.az, cx, cy, radius);
    if (!proj) continue;

    // Tamanho baseado na magnitude: mag -2 = 6px, mag 6 = 0.5px
    const baseSize = Math.max(0.4, 3.8 - star.mag * 0.65);
    const scaleFactor = radius / 400;
    const starR = baseSize * scaleFactor * Math.max(0.8, 1 + Math.sin(skyTime * 1.2 + star.ra) * 0.08);

    const col = star.color || '#FFFFFF';
    const brightness = Math.max(0.3, 1 - star.mag / 7);

    // Halo externo (estrelas brilhantes)
    if (star.mag < 2.5) {
      const haloR = starR * (star.mag < 0 ? 6 : star.mag < 1 ? 4.5 : 3);
      const haloG = skyCtx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, haloR);
      haloG.addColorStop(0, hexToRgba(col, brightness * 0.18));
      haloG.addColorStop(1, 'transparent');
      skyCtx.beginPath();
      skyCtx.arc(proj.x, proj.y, haloR, 0, Math.PI * 2);
      skyCtx.fillStyle = haloG;
      skyCtx.fill();
    }

    // Difração (raios em X para estrelas muito brilhantes)
    if (star.mag < 1.0) {
      drawStarDiffraction(proj.x, proj.y, starR, col, brightness, star.mag);
    }

    // Núcleo da estrela
    const coreG = skyCtx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, starR);
    coreG.addColorStop(0, hexToRgba('#FFFFFF', Math.min(1, brightness * 1.2)));
    coreG.addColorStop(0.4, hexToRgba(col, brightness));
    coreG.addColorStop(1, hexToRgba(col, 0));
    skyCtx.beginPath();
    skyCtx.arc(proj.x, proj.y, starR, 0, Math.PI * 2);
    skyCtx.fillStyle = coreG;
    skyCtx.fill();
  }

  // Nomes das estrelas mais brilhantes (mag < 1.5)
  for (const star of sorted.filter(s => s.mag < 1.5)) {
    const proj = projectStar(star.alt, star.az, cx, cy, radius);
    if (!proj) continue;

    const starR = Math.max(0.6, (3.8 - star.mag * 0.65) * radius / 400);
    skyCtx.font = `${Math.round(radius * 0.028)}px Inter, sans-serif`;
    skyCtx.fillStyle = hexToRgba(star.color || '#FFFFFF', 0.5);
    skyCtx.fillText(star.name, proj.x + starR * 1.5 + 3, proj.y - 3);
  }

  skyCtx.restore();
}

/* Raios de difração estilo telescópio */
function drawStarDiffraction(x, y, r, color, brightness, mag) {
  const len = r * (mag < 0 ? 12 : mag < 0.5 ? 9 : 6);
  const alpha = brightness * 0.4;

  skyCtx.save();
  for (let angle = 0; angle < 360; angle += 45) {
    const rad = angle * Math.PI / 180;
    const grad = skyCtx.createLinearGradient(x, y, x + Math.cos(rad) * len, y + Math.sin(rad) * len);
    grad.addColorStop(0, hexToRgba(color, alpha));
    grad.addColorStop(1, 'transparent');

    skyCtx.beginPath();
    skyCtx.moveTo(x, y);
    skyCtx.lineTo(x + Math.cos(rad) * len, y + Math.sin(rad) * len);
    skyCtx.strokeStyle = grad;
    skyCtx.lineWidth = r * 0.5;
    skyCtx.stroke();
  }
  skyCtx.restore();
}

/* ============================================================
   PLANETAS
   ============================================================ */
function drawPlanets(cx, cy, radius) {
  if (!skyData) return;

  for (const planet of skyData.planets) {
    const proj = projectStar(planet.alt, planet.az, cx, cy, radius);
    if (!proj) continue;

    const r = planet.size * radius / 400;
    const pulse = 1 + Math.sin(skyTime * 0.7 + planet.AR) * 0.12;

    // Halo especial para planetas
    const haloR = r * 5;
    const haloG = skyCtx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, haloR);
    haloG.addColorStop(0, hexToRgba(planet.color, 0.25));
    haloG.addColorStop(1, 'transparent');
    skyCtx.beginPath();
    skyCtx.arc(proj.x, proj.y, haloR, 0, Math.PI * 2);
    skyCtx.fillStyle = haloG;
    skyCtx.fill();

    // Disco do planeta
    const pG = skyCtx.createRadialGradient(proj.x - r * 0.3, proj.y - r * 0.3, 0, proj.x, proj.y, r * pulse);
    pG.addColorStop(0, '#FFFFFF');
    pG.addColorStop(0.3, planet.color);
    pG.addColorStop(1, hexToRgba(planet.color, 0.7));
    skyCtx.beginPath();
    skyCtx.arc(proj.x, proj.y, r * pulse, 0, Math.PI * 2);
    skyCtx.fillStyle = pG;
    skyCtx.fill();

    // Label
    skyCtx.font = `bold ${Math.round(radius * 0.03)}px Inter, sans-serif`;
    skyCtx.fillStyle = hexToRgba(planet.color, 0.85);
    skyCtx.fillText(planet.name, proj.x + r * 2 + 3, proj.y + 4);
  }
}

/* ============================================================
   PONTOS CARDEAIS
   ============================================================ */
function drawCardinalPoints(cx, cy, radius) {
  const points = [
    { label: 'N', az: 0   },
    { label: 'L', az: 90  },
    { label: 'S', az: 180 },
    { label: 'O', az: 270 },
  ];

  const edgeR = radius * 0.94;
  const fontSize = Math.round(radius * 0.042);

  skyCtx.font = `300 ${fontSize}px Inter, sans-serif`;
  skyCtx.textAlign = 'center';
  skyCtx.textBaseline = 'middle';

  for (const pt of points) {
    const azRad = pt.az * Math.PI / 180;
    const x = cx + edgeR * Math.sin(azRad);
    const y = cy - edgeR * Math.cos(azRad);

    // Brilho suave atrás da letra
    const bg = skyCtx.createRadialGradient(x, y, 0, x, y, fontSize * 1.2);
    bg.addColorStop(0, 'rgba(10,15,40,0.7)');
    bg.addColorStop(1, 'transparent');
    skyCtx.fillStyle = bg;
    skyCtx.beginPath();
    skyCtx.arc(x, y, fontSize * 1.2, 0, Math.PI * 2);
    skyCtx.fill();

    skyCtx.fillStyle = pt.label === 'N' ? 'rgba(180,220,255,0.9)' : 'rgba(140,160,200,0.6)';
    skyCtx.fillText(pt.label, x, y);
  }

  skyCtx.textAlign = 'left';
  skyCtx.textBaseline = 'alphabetic';
}

/* ============================================================
   ANEL DO HORIZONTE
   ============================================================ */
function drawHorizonRing(cx, cy, radius) {
  // Brilho suave no horizonte
  const grd = skyCtx.createRadialGradient(cx, cy, radius * 0.75, cx, cy, radius);
  grd.addColorStop(0, 'transparent');
  grd.addColorStop(0.85, 'rgba(40,60,120,0.06)');
  grd.addColorStop(1, 'rgba(80,120,200,0.12)');

  skyCtx.beginPath();
  skyCtx.arc(cx, cy, radius, 0, Math.PI * 2);
  skyCtx.fillStyle = grd;
  skyCtx.fill();

  // Anel exterior
  skyCtx.beginPath();
  skyCtx.arc(cx, cy, radius, 0, Math.PI * 2);
  skyCtx.strokeStyle = 'rgba(80,110,200,0.3)';
  skyCtx.lineWidth = 1.5;
  skyCtx.stroke();

  // Anel exterior decorativo
  skyCtx.beginPath();
  skyCtx.arc(cx, cy, radius + 3, 0, Math.PI * 2);
  skyCtx.strokeStyle = 'rgba(50,70,140,0.15)';
  skyCtx.lineWidth = 1;
  skyCtx.stroke();
}

/* ============================================================
   ZÊNITE
   ============================================================ */
function drawZenith(cx, cy) {
  const pulse = 1 + Math.sin(skyTime * 1.5) * 0.2;
  const r = 3 * pulse;

  const g = skyCtx.createRadialGradient(cx, cy, 0, cx, cy, r * 3);
  g.addColorStop(0, 'rgba(180,200,255,0.4)');
  g.addColorStop(1, 'transparent');
  skyCtx.beginPath();
  skyCtx.arc(cx, cy, r * 3, 0, Math.PI * 2);
  skyCtx.fillStyle = g;
  skyCtx.fill();

  skyCtx.beginPath();
  skyCtx.arc(cx, cy, r, 0, Math.PI * 2);
  skyCtx.fillStyle = 'rgba(180,200,255,0.6)';
  skyCtx.fill();

  // Crosshair
  skyCtx.strokeStyle = 'rgba(180,200,255,0.2)';
  skyCtx.lineWidth = 0.8;
  skyCtx.setLineDash([3, 5]);
  skyCtx.beginPath();
  skyCtx.moveTo(cx - 14, cy); skyCtx.lineTo(cx - 6, cy);
  skyCtx.moveTo(cx + 6, cy);  skyCtx.lineTo(cx + 14, cy);
  skyCtx.moveTo(cx, cy - 14); skyCtx.lineTo(cx, cy - 6);
  skyCtx.moveTo(cx, cy + 6);  skyCtx.lineTo(cx, cy + 14);
  skyCtx.stroke();
  skyCtx.setLineDash([]);
}

/* ============================================================
   TOOLTIP AO PASSAR O MOUSE
   ============================================================ */
function onSkyMouseMove(e) {
  const rect = skyCanvas.getBoundingClientRect();
  const mx = (e.clientX - rect.left) * (skyCanvas.width / rect.width);
  const my = (e.clientY - rect.top)  * (skyCanvas.height / rect.height);

  checkHoverStar(mx, my);
}

function onSkyTouch(e) {
  const rect = skyCanvas.getBoundingClientRect();
  const touch = e.touches[0];
  const mx = (touch.clientX - rect.left) * (skyCanvas.width / rect.width);
  const my = (touch.clientY - rect.top)  * (skyCanvas.height / rect.height);
  checkHoverStar(mx, my);
}

function onSkyClick(e) {
  const rect = skyCanvas.getBoundingClientRect();
  const mx = (e.clientX - rect.left) * (skyCanvas.width / rect.width);
  const my = (e.clientY - rect.top)  * (skyCanvas.height / rect.height);
  checkHoverStar(mx, my);
}

function checkHoverStar(mx, my) {
  if (!skyData) return;

  const W = skyCanvas.width, H = skyCanvas.height;
  const cx = W / 2, cy = H / 2;
  const radius = Math.min(W, H) * 0.46;

  let closest = null;
  let minDist = 20;

  const allObjects = [
    ...skyData.stars.map(s => ({ ...s, type: 'star' })),
    ...skyData.planets.map(p => ({ ...p, type: 'planet' })),
    ...skyData.deepSky.map(d => ({ ...d, type: 'nebula', ra: d.AR, dec: d.DEC, mag: 99 })),
  ];

  for (const obj of allObjects) {
    const proj = projectStar(obj.alt, obj.az, cx, cy, radius);
    if (!proj) continue;
    const d = Math.hypot(proj.x - mx, proj.y - my);
    if (d < minDist) { minDist = d; closest = { ...obj, px: proj.x, py: proj.y }; }
  }

  hoveredStar = closest;
  skyCanvas.style.cursor = closest ? 'pointer' : 'default';
}

function drawTooltip(star, W, H) {
  const padding = 12;
  const lineH = 18;
  const fontSize = Math.max(11, Math.round(skyCanvas.height * 0.022));

  skyCtx.font = `${fontSize}px Inter, sans-serif`;

  const lines = [];
  if (star.type === 'planet') {
    lines.push(star.name);
    lines.push(`Altitude: ${star.alt.toFixed(1)}°`);
    lines.push(`Azimute: ${star.az.toFixed(1)}°`);
  } else if (star.type === 'nebula') {
    lines.push(star.name);
    lines.push(`Altitude: ${star.alt.toFixed(1)}°`);
  } else {
    lines.push(star.name || 'Estrela');
    lines.push(`Magnitude: ${star.mag.toFixed(2)}`);
    lines.push(`Alt: ${star.alt.toFixed(1)}°  Az: ${star.az.toFixed(1)}°`);
  }

  const maxW = Math.max(...lines.map(l => skyCtx.measureText(l).width));
  const boxW = maxW + padding * 2;
  const boxH = lines.length * lineH + padding * 1.5;

  let tx = star.px + 15;
  let ty = star.py - boxH / 2;
  if (tx + boxW > W - 10) tx = star.px - boxW - 15;
  if (ty < 10) ty = 10;
  if (ty + boxH > H - 10) ty = H - boxH - 10;

  // Background glassmorphism
  skyCtx.save();
  roundRect(skyCtx, tx, ty, boxW, boxH, 8);
  skyCtx.fillStyle = 'rgba(5,10,30,0.85)';
  skyCtx.fill();
  skyCtx.strokeStyle = 'rgba(100,140,220,0.4)';
  skyCtx.lineWidth = 1;
  skyCtx.stroke();

  // Texto
  skyCtx.fillStyle = '#DDEEFF';
  skyCtx.font = `500 ${fontSize}px Inter, sans-serif`;
  skyCtx.fillText(lines[0], tx + padding, ty + padding + lineH * 0.7);

  skyCtx.fillStyle = 'rgba(160,190,240,0.8)';
  skyCtx.font = `300 ${Math.round(fontSize * 0.88)}px Inter, sans-serif`;
  for (let i = 1; i < lines.length; i++) {
    skyCtx.fillText(lines[i], tx + padding, ty + padding + lineH * (i + 0.7));
  }

  skyCtx.restore();
}

/* ============================================================
   UTILITÁRIOS
   ============================================================ */
function hexToRgba(hex, alpha) {
  if (!hex || hex[0] !== '#') return `rgba(255,255,255,${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
