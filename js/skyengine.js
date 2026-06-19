/* ============================================================
   NÓS. — skyengine.js
   Cálculo astronômico real do céu de Maracanaú
   22 de Fevereiro de 2026 — ~20h00 (BRT, UTC-3)
   Lat: -3.867°  Lon: -38.626°
   ============================================================
   
   Algoritmos baseados em:
   - Jean Meeus, "Astronomical Algorithms" (2nd Ed.)
   - USNO Astronomical Almanac
   - Stellarium open-source calculations
   
   Sem dependências externas. Roda 100% no browser.
   ============================================================ */

const SKY_CONFIG = {
  lat:      -3.867,    // Maracanaú, CE
  lon:      -38.626,
  year:     2026,
  month:    2,
  day:      22,
  hour:     20,        // 20h00 BRT (horário que pediu em namoro)
  minute:   0,
  utcOffset: -3,       // BRT = UTC-3
};

/* ============================================================
   CATÁLOGO ESTELAR (Yale Bright Star Catalogue — seleção)
   Formato: [nome, AR_horas, DEC_graus, magnitude, cor_hex]
   ============================================================ */
const STAR_CATALOGUE = [
  // === CONSTELAÇÕES VISÍVEIS DO NORDESTE BR EM FEV ===

  // ÓRION — a constelação mais icônica de verão (hemisphere norte) / verão sul
  ["Rigel",        5.2423, -8.2017,   0.18, "#C8D8FF"],
  ["Betelgeuse",   5.9194, 7.4070,    0.42, "#FF8C00"],
  ["Bellatrix",    5.4188, 6.3497,    1.64, "#C8D8FF"],
  ["Alnilam",      5.6036, -1.2019,   1.65, "#D0DEFF"],
  ["Alnitak",      5.6796, -1.9428,   1.72, "#A0B8FF"],
  ["Mintaka",      5.5333, -0.2991,   2.25, "#B0C8FF"],
  ["Saiph",        5.7956, -9.6696,   2.07, "#A8C0FF"],
  ["Meissa",       5.5858, 9.9342,    3.39, "#D0DEFF"],
  ["Hatysa",       5.5914, -5.9097,   2.77, "#B0C0FF"],

  // CANIS MAIOR — Sírius (mais brilhante do céu!)
  ["Sirius",       6.7526, -16.7161,  -1.46, "#E0F0FF"],
  ["Adhara",       6.9771, -28.9721,  1.50,  "#A8C0FF"],
  ["Wezen",        7.1398, -26.3932,  1.82,  "#FFE8A0"],
  ["Aludra",       7.4017, -29.3031,  2.45,  "#B0C8FF"],
  ["Mirzam",       6.3783, -17.9559,  1.98,  "#C0D0FF"],
  ["Furud",        6.3388, -30.0633,  3.02,  "#D0DCFF"],
  ["Muliphein",    7.0628, -15.6333,  4.11,  "#C0DCFF"],

  // CANIS MENOR
  ["Procyon",      7.6552, 5.2250,    0.34,  "#FFFFD0"],
  ["Gomeisa",      7.4527, 8.2893,    2.90,  "#A8C0FF"],

  // GÊMEOS
  ["Pollux",       7.7553, 28.0262,   1.15,  "#FFB830"],
  ["Castor",       7.5768, 31.8883,   1.58,  "#E8F0FF"],
  ["Alhena",       6.6285, 16.3993,   1.93,  "#E0ECFF"],
  ["Wasat",        7.3354, 21.9823,   3.53,  "#FFFFC0"],
  ["Mebsuda",      6.7280, 25.1312,   3.06,  "#FFD080"],
  ["Propus",       6.2689, 22.5063,   3.31,  "#FF9030"],
  ["Tejat",        6.3823, 22.5138,   2.87,  "#FF8020"],

  // TOURO
  ["Aldebaran",    4.5987, 16.5093,   0.87,  "#FF6030"],
  ["Elnath",       5.4382, 28.6077,   1.65,  "#C8D8FF"],
  ["Alcyone",      3.7913, 24.1051,   2.85,  "#A0C0FF"],  // Plêiades líder
  ["Atlas",        3.8191, 24.0534,   3.62,  "#B8D0FF"],
  ["Electra",      3.7767, 24.1134,   3.70,  "#A0C0FF"],
  ["Maia",         3.7746, 24.3676,   3.88,  "#B0C8FF"],
  ["Merope",       3.7713, 23.9479,   4.14,  "#C0D0FF"],
  ["Taygeta",      3.7525, 24.4669,   4.29,  "#A8C0FF"],
  ["Pleione",      3.8185, 24.1364,   5.05,  "#B0D0FF"],

  // AURIGA
  ["Capella",      5.2776, 45.9980,   0.08,  "#FFE880"],
  ["Menkalinan",   5.9921, 44.9475,   1.90,  "#DDEEFF"],
  ["Hassaleh",     4.9498, 33.1661,   2.69,  "#FF8820"],
  ["Mahasim",      5.9952, 37.2126,   2.99,  "#FFFFC0"],
  ["Almaaz",       5.0362, 43.8233,   2.99,  "#F0F8FF"],

  // ERIDANUS
  ["Achernar",     1.6286, -57.2367,  0.46,  "#B8D0FF"],
  ["Cursa",        5.1314, -5.0864,   2.79,  "#E0ECFF"],
  ["Zaurak",       3.9674, -13.5085,  2.95,  "#FF9040"],
  ["Rana",         3.7206, -9.7633,   3.52,  "#FFD080"],

  // HIDRA
  ["Alphard",      9.4598, -8.6586,   1.98,  "#FF8820"],

  // LEÃO (nascendo no leste)
  ["Regulus",      10.1395, 11.9672,  1.36,  "#D0E0FF"],
  ["Denebola",     11.8177, 14.5720,  2.13,  "#DDEEFF"],
  ["Algieba",      10.3329, 19.8418,  2.61,  "#FF9850"],
  ["Zosma",        11.2352, 20.5237,  2.56,  "#FFFFC8"],
  ["Adhafera",     10.1229, 23.4174,  3.43,  "#FFFFC0"],

  // CANOPUS (sul - muito brilhante)
  ["Canopus",      6.3992, -52.6957,  -0.62, "#FFFFC0"],

  // CRUX / CRUZ DO SUL (começa a aparecer sul)
  ["Acrux",        12.4433, -63.0990, 0.77,  "#C0D8FF"],
  ["Gacrux",       12.5194, -57.1133, 1.59,  "#FF8060"],
  ["Mimosa",       12.7953, -59.6883, 1.25,  "#A8C0FF"],
  ["Imai",         12.2528, -58.7490, 2.79,  "#B0CCFF"],

  // CENTAURUS
  ["Rigil Kent",   14.6600, -60.8333, -0.27, "#FFE080"],
  ["Hadar",        14.0637, -60.3727, 0.61,  "#A8C0FF"],
  ["Menkent",      14.1114, -36.3700, 2.06,  "#FFD080"],

  // ESCORPIÃO (leste/sul)
  ["Antares",      16.4901, -26.4320, 1.06,  "#FF4820"],
  ["Shaula",       17.5601, -37.1033, 1.62,  "#A8C0FF"],
  ["Sargas",       17.6214, -42.9978, 1.86,  "#FFE0A0"],
  ["Dschubba",     16.0053, -22.6217, 2.29,  "#B0CCFF"],
  ["Graffias",     15.9483, -19.8058, 2.56,  "#B8D0FF"],
  ["Wei",          16.8355, -34.2930, 2.89,  "#FF9060"],
  ["Larawag",      17.2031, -43.2391, 2.69,  "#FFDCA0"],

  // VELA
  ["Suhail",       9.1333, -43.4330,  2.21,  "#FFE080"],
  ["Regor",        8.1587, -47.3366,  1.75,  "#B0C8FF"],
  ["Kappa Vel",    9.3694, -55.0107,  2.47,  "#FFFFC0"],

  // PUPPIS
  ["Naos",         7.8215, -40.0031,  2.21,  "#80B0FF"],
  ["Ahadi",        7.9563, -42.9965,  2.70,  "#FFD080"],

  // COLUMBA
  ["Phact",        5.6599, -34.0741,  2.65,  "#A8C0FF"],

  // LEPUS
  ["Arneb",        5.5454, -17.8222,  2.58,  "#FFE0A0"],
  ["Nihal",        5.4707, -20.7594,  2.84,  "#FF9040"],

  // PISCIS AUSTRINUS
  ["Fomalhaut",    22.9608, -29.6223, 1.17,  "#D0E0FF"],

  // AQUARIUS (poente)
  ["Sadalsuud",    21.5259, -5.5712,  2.89,  "#FFE080"],

  // PEGASUS (poente)
  ["Enif",         21.7364, 9.8750,   2.38,  "#FF9040"],

  // ESTRELAS ADICIONAIS para riqueza visual
  ["Mirach",       1.1622, 35.6201,   2.06,  "#FF9840"],
  ["Hamal",        2.1196, 23.4624,   2.01,  "#FF8820"],
  ["Menkar",       3.0382, 4.0897,    2.54,  "#FF9050"],
  ["Mira",         2.3226, -2.9779,   6.47,  "#FF8040"],
  ["Ain",          4.4769, 19.1802,   3.53,  "#FFE0A0"],
  ["Alnair",       22.1372, -46.9611, 1.73,  "#B0C8FF"],
  ["Peacock",      20.4274, -56.7350, 1.94,  "#B0C8FF"],
  ["Atria",        16.8113, -69.0277, 1.91,  "#FF9040"],
  ["Kaus Australis",18.4028,-34.3846, 1.79,  "#D0E8FF"],
  ["Nunki",        18.9211, -26.2967, 2.05,  "#B0C8FF"],
  ["Ascella",      19.0430, -29.8800, 2.59,  "#FFFFC0"],
  ["Vega",         18.6157, 38.7837,  0.03,  "#D0DCFF"],   // baixo no norte
  ["Altair",       19.8463, 8.8683,   0.77,  "#FFFFC8"],
  ["Deneb",        20.6905, 45.2803,  1.25,  "#DDEEFF"],
  ["Spica",        13.4199, -11.1613, 0.97,  "#A8C0FF"],
  ["Arcturus",     14.2612, 19.1822,  -0.05, "#FF8C00"],
  ["Rasalhague",   17.5822, 12.5600,  2.08,  "#FFFFC0"],
  ["Sabik",        17.1729, -15.7248, 2.43,  "#FFFFD0"],
  ["Yed Prior",    16.3040, -4.6924,  2.73,  "#FF8820"],
  ["Zubenelgenubi",14.8476, -16.0418, 2.75,  "#DDEEFF"],
  ["Zubeneschamali",15.2843,-9.3827,  2.61,  "#A0FF80"],
  ["Alphecca",     15.5782, 26.7148,  2.22,  "#D0DCFF"],
  ["Muphrid",      13.9108, 18.3977,  2.68,  "#FFEA80"],
  ["Cor Caroli",   12.9338, 38.3183,  2.89,  "#DDEEFF"],
];

/* ============================================================
   OBJETOS DO SISTEMA SOLAR (cálculos simplificados para 22/02/2026)
   ============================================================ */
const SOLAR_SYSTEM = [
  // Saturno — visível a noite
  { name: "Saturno ♄",  AR: 22.4,  DEC: -11.5, mag: 0.8,  color: "#FFE8A0", size: 4 },
  // Marte
  { name: "Marte ♂",   AR: 7.2,   DEC: 26.5,  mag: 0.2,  color: "#FF6030", size: 3.5 },
  // Júpiter
  { name: "Júpiter ♃", AR: 2.9,   DEC: 14.8,  mag: -2.0, color: "#FFD0A0", size: 5 },
  // Vênus
  { name: "Vênus ♀",   AR: 23.8,  DEC: -5.2,  mag: -3.9, color: "#FFFFA0", size: 6 },
  // Mercúrio (perto do horizonte)
  { name: "Mercúrio ☿",AR: 22.1,  DEC: -12.0, mag: 0.3,  color: "#E8D8C0", size: 2 },
];

/* ============================================================
   NEBULOSAS / OBJETOS MESSIER VISÍVEIS
   ============================================================ */
const DEEP_SKY = [
  { name: "M42 — Nebulosa de Órion", AR: 5.5881, DEC: -5.3897, size: 8, color: "#4488FF", alpha: 0.3 },
  { name: "M45 — Plêiades",          AR: 3.7892, DEC: 24.1051, size: 10, color: "#8899FF", alpha: 0.25 },
  { name: "M44 — Presépio",          AR: 8.6703, DEC: 19.9833, size: 7, color: "#88BBFF", alpha: 0.2  },
  { name: "M7 — Cluster Ptolomeu",   AR: 17.8981,DEC:-34.7928, size: 9, color: "#FFEE88", alpha: 0.2  },
  { name: "M6 — Cluster Borboleta",  AR: 17.6678,DEC:-32.2097, size: 6, color: "#FFEE88", alpha: 0.18 },
  { name: "LMC",                      AR: 5.3917, DEC:-69.7561, size: 14, color: "#CC88FF", alpha: 0.15 },
  { name: "SMC",                      AR: 0.8750, DEC:-72.8000, size: 10, color: "#CC88FF", alpha: 0.12 },
];

/* ============================================================
   CONSTELAÇÕES — linhas (AR1,DEC1 → AR2,DEC2)
   ============================================================ */
const CONSTELLATION_LINES = {
  "Órion": [
    [5.2423,-8.2017,  5.4188,6.3497],   // Rigel → Bellatrix
    [5.4188,6.3497,   5.5858,9.9342],   // Bellatrix → Meissa
    [5.5858,9.9342,   5.5333,-0.2991],  // Meissa → Mintaka
    [5.5333,-0.2991,  5.6036,-1.2019],  // Mintaka → Alnilam
    [5.6036,-1.2019,  5.6796,-1.9428],  // Alnilam → Alnitak
    [5.6796,-1.9428,  5.9194,7.4070],   // Alnitak → Betelgeuse
    [5.9194,7.4070,   5.5858,9.9342],   // Betelgeuse → Meissa
    [5.2423,-8.2017,  5.7956,-9.6696],  // Rigel → Saiph
    [5.7956,-9.6696,  5.6796,-1.9428],  // Saiph → Alnitak
    [5.5333,-0.2991,  5.5914,-5.9097],  // Mintaka → Hatysa (espada)
  ],
  "Canis Maior": [
    [6.7526,-16.7161, 6.9771,-28.9721], // Sírius → Adhara
    [6.7526,-16.7161, 7.1398,-26.3932], // Sírius → Wezen
    [7.1398,-26.3932, 7.4017,-29.3031], // Wezen → Aludra
    [6.7526,-16.7161, 6.3783,-17.9559], // Sírius → Mirzam
  ],
  "Gêmeos": [
    [7.7553,28.0262,  7.5768,31.8883],  // Pollux → Castor
    [7.7553,28.0262,  7.3354,21.9823],  // Pollux → Wasat
    [7.5768,31.8883,  6.7280,25.1312],  // Castor → Mebsuda
    [7.3354,21.9823,  6.6285,16.3993],  // Wasat → Alhena
    [6.7280,25.1312,  6.2689,22.5063],  // Mebsuda → Propus
    [6.2689,22.5063,  6.3823,22.5138],  // Propus → Tejat
  ],
  "Cruz do Sul": [
    [12.4433,-63.0990, 12.5194,-57.1133], // Acrux → Gacrux (eixo vertical)
    [12.7953,-59.6883, 12.2528,-58.7490], // Mimosa → Imai (eixo horizontal)
  ],
  "Escorpião": [
    [15.9483,-19.8058, 16.0053,-22.6217], // Graffias → Dschubba
    [16.0053,-22.6217, 16.4901,-26.4320], // Dschubba → Antares
    [16.4901,-26.4320, 16.8355,-34.2930], // Antares → Wei
    [16.8355,-34.2930, 17.2031,-43.2391], // Wei → Larawag
    [17.2031,-43.2391, 17.5601,-37.1033], // Larawag → Shaula
    [17.5601,-37.1033, 17.6214,-42.9978], // Shaula → Sargas
  ],
};

/* ============================================================
   CÁLCULO ASTRONÔMICO
   ============================================================ */

// Converte data/hora local para Julian Date
function toJulianDate(year, month, day, hour, min, utcOffset) {
  const utcH = hour - utcOffset + min / 60;
  let Y = year, M = month;
  const D = day + utcH / 24.0;
  if (M <= 2) { Y -= 1; M += 12; }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + B - 1524.5;
}

// Greenwich Sidereal Time (graus)
function gst(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  let theta = 280.46061837 + 360.98564736629 * (jd - 2451545.0)
    + T * T * 0.000387933 - T * T * T / 38710000;
  return ((theta % 360) + 360) % 360;
}

// Local Sidereal Time (graus)
function lst(jd, lon) {
  return ((gst(jd) + lon + 360) % 360);
}

// Ascensão Reta (horas) + Declinação (graus) → Altitude + Azimute
function equatorialToHorizontal(ra_h, dec_deg, lat_deg, lst_deg) {
  const HA = ((lst_deg - ra_h * 15) + 360) % 360; // Ângulo Horário em graus
  const haRad  = HA  * Math.PI / 180;
  const decRad = dec_deg * Math.PI / 180;
  const latRad = lat_deg * Math.PI / 180;

  const sinAlt = Math.sin(decRad) * Math.sin(latRad)
               + Math.cos(decRad) * Math.cos(latRad) * Math.cos(haRad);
  const alt = Math.asin(Math.max(-1, Math.min(1, sinAlt))) * 180 / Math.PI;

  const cosAz = (Math.sin(decRad) - Math.sin(alt * Math.PI / 180) * Math.sin(latRad))
              / (Math.cos(alt * Math.PI / 180) * Math.cos(latRad));
  let az = Math.acos(Math.max(-1, Math.min(1, cosAz))) * 180 / Math.PI;
  if (Math.sin(haRad) > 0) az = 360 - az;

  return { alt, az };
}

// Projeção estereográfica (alt/az → x,y na tela)
// Centro = zênite, bordas = horizonte
function projectStar(alt, az, cx, cy, radius) {
  if (alt < -5) return null; // abaixo do horizonte

  // Distância do zênite: 0 (zênite) → radius (horizonte)
  const r = radius * (90 - alt) / 90;
  const azRad = az * Math.PI / 180;

  // Norte embaixo (visão de dentro da esfera, olhando para cima)
  const x = cx + r * Math.sin(azRad);
  const y = cy - r * Math.cos(azRad);

  return { x, y, r_proj: r };
}

/* ============================================================
   CALCULA POSIÇÕES PARA HORA ESPECÍFICA
   ============================================================ */
function computeSkyForMoment(cfg) {
  const { lat, lon, year, month, day, hour, minute, utcOffset } = cfg;

  const jd = toJulianDate(year, month, day, hour, minute, utcOffset);
  const lstDeg = lst(jd, lon);

  const stars = STAR_CATALOGUE.map(([name, ra, dec, mag, color]) => {
    const pos = equatorialToHorizontal(ra, dec, lat, lstDeg);
    return { name, ra, dec, mag, color, alt: pos.alt, az: pos.az };
  }).filter(s => s.alt > -3);

  const planets = SOLAR_SYSTEM.map(p => {
    const pos = equatorialToHorizontal(p.AR, p.DEC, lat, lstDeg);
    return { ...p, alt: pos.alt, az: pos.az };
  }).filter(p => p.alt > 0);

  const deepSky = DEEP_SKY.map(d => {
    const pos = equatorialToHorizontal(d.AR, d.DEC, lat, lstDeg);
    return { ...d, alt: pos.alt, az: pos.az };
  }).filter(d => d.alt > 0);

  // Linhas das constelações
  const constellationLines = {};
  for (const [cname, lines] of Object.entries(CONSTELLATION_LINES)) {
    constellationLines[cname] = lines.map(([ra1, dec1, ra2, dec2]) => {
      const p1 = equatorialToHorizontal(ra1, dec1, lat, lstDeg);
      const p2 = equatorialToHorizontal(ra2, dec2, lat, lstDeg);
      return { p1, p2, visible: p1.alt > -5 && p2.alt > -5 };
    });
  }

  return { stars, planets, deepSky, constellationLines, jd, lstDeg };
}
