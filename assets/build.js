// Generates the retro pixel-style SVGs used in README.md.
// Edit the data below, then run: node assets/build.js
// All text is drawn with the pixel font defined further down (uppercase only).

const fs = require("fs");
const path = require("path");

const profile = {
  name: "ERIK JASHARI",
  role: "FULL-STACK DEVELOPER",
  tagline: "COMPUTER SCIENCE & ENGINEERING · UBT · FERIZAJ, KOSOVO",
  about: [
    ["ROLE", "FULL-STACK DEVELOPER"],
    ["STUDYING", "CS & ENGINEERING · UBT"],
    ["BASED IN", "FERIZAJ, KOSOVO"],
    ["LANGUAGES", "ALBANIAN, ENGLISH"],
    ["BUILDING", "QIRAPRO (CAR RENTALS)"],
  ],
  status: "OPEN TO INTERNSHIPS",
};

// area: FRONTEND | BACKEND | LANGUAGE | DATABASE | TOOLS (sets the accent color)
const stack = [
  { tech: "REACT", area: "FRONTEND" },
  { tech: "JAVASCRIPT", area: "LANGUAGE" },
  { tech: "HTML/CSS", area: "FRONTEND" },
  { tech: "NODE.JS", area: "BACKEND" },
  { tech: "JAVA", area: "LANGUAGE" },
  { tech: "PHP", area: "BACKEND" },
  { tech: "SQL", area: "DATABASE" },
  { tech: "GIT", area: "TOOLS" },
  { tech: "VS CODE", area: "TOOLS" },
];

// status: "IN DEVELOPMENT", "LIVE" or "COMPLETED" (sets the badge color).
// Optional: role, subtitle, tags, checklist ({ title, items: [text, done] }), note.
const projects = [
  {
    status: "IN DEVELOPMENT",
    role: "TEAM PROJECT",
    name: "QIRAPRO",
    subtitle: "CAR RENTAL AGGREGATOR FOR KOSOVO",
    description:
      "A TEAM PROJECT I'M HELPING BUILD: EVERY RENTAL COMPANY IN KOSOVO IN ONE PLACE. " +
      "SEARCH, COMPARE AND BOOK CARS, WITH A DEDICATED ADEM JASHARI AIRPORT SECTION. " +
      "ADMIN DASHBOARDS, LIVE AVAILABILITY OVER SSE AND IMAGES ON CLOUDFLARE R2.",
    tags: ["REACT", "NODE.JS", "EXPRESS", "POSTGRESQL", "SSE + REDIS", "CLOUDFLARE R2", "RAILWAY"],
    checklist: {
      title: "ROADMAP",
      items: [
        ["AUTH & BOOKING API", true],
        ["DEPLOYED ON RAILWAY", true],
        ["IMAGE STORAGE ON R2", true],
        ["ADMIN DASHBOARDS", false],
        ["REDIS LIVE UPDATES", false],
        ["MOBILE APP", false],
      ],
    },
    note: "🔒 PRIVATE REPO · IN ACTIVE DEVELOPMENT",
  },
  {
    status: "LIVE",
    name: "CUBERUSH",
    subtitle: "3D RUBIK'S CUBE SPEEDSOLVING GAME",
    description:
      "SOLVE SEEDED SCRAMBLES AGAINST THE CLOCK, EARN POINTS AND CLIMB THE LEADERBOARD. " +
      "EVERY SOLVE IS REPLAYED AND VERIFIED ON THE SERVER. " +
      "BUILT-IN LESSONS TEACH THE BEGINNER METHOD STEP BY STEP.",
    tags: ["TYPESCRIPT", "REACT", "THREE.JS", "FASTIFY", "SQLITE", "DOCKER", "FLY.IO"],
    checklist: {
      title: "HIGHLIGHTS",
      items: [
        ["3D DRAG-TO-TURN CUBE", true],
        ["VERIFIED SOLVES", true],
        ["5 GAME MODES", true],
        ["LEADERBOARDS", true],
        ["LESSONS & HINTS", true],
        ["SKINS & THEMES SHOP", true],
      ],
    },
    note: "LIVE AT CUBERUSH-ERIK.FLY.DEV",
  },
  {
    status: "COMPLETED",
    name: "SPORTS TOURNAMENT MANAGEMENT SYSTEM",
    description: "MANAGE TOURNAMENTS, TEAMS, FIXTURES AND RESULTS.",
    tags: ["REACT", "NODE.JS", "EXPRESS", "TAILWIND CSS", "POSTGRESQL"],
  },
];

// PICO-8 palette + a deep blue for frames
const P = {
  black: "#000000",
  bg: "#0a0a14",
  slot: "#111133",
  navy: "#1d2b53",
  plum: "#7e2553",
  brown: "#ab5236",
  dgrey: "#5f574f",
  lgrey: "#c2c3c7",
  white: "#fff1e8",
  red: "#ff004d",
  orange: "#ffa300",
  yellow: "#ffec27",
  green: "#00e436",
  blue: "#29adff",
  indigo: "#83769c",
  pink: "#ff77a8",
  peach: "#ffccaa",
  maze: "#2121de",
  empty: "#222244",
};

// ---------------------------------------------------------------- pixel font

const FONT = {
  A: [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  B: ["####.", "#...#", "#...#", "####.", "#...#", "#...#", "####."],
  C: [".###.", "#...#", "#....", "#....", "#....", "#...#", ".###."],
  D: ["####.", "#...#", "#...#", "#...#", "#...#", "#...#", "####."],
  E: ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
  F: ["#####", "#....", "#....", "####.", "#....", "#....", "#...."],
  G: [".###.", "#...#", "#....", "#.###", "#...#", "#...#", ".####"],
  H: ["#...#", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  I: [".###.", "..#..", "..#..", "..#..", "..#..", "..#..", ".###."],
  J: ["..###", "...#.", "...#.", "...#.", "...#.", "#..#.", ".##.."],
  K: ["#...#", "#..#.", "#.#..", "##...", "#.#..", "#..#.", "#...#"],
  L: ["#....", "#....", "#....", "#....", "#....", "#....", "#####"],
  M: ["#...#", "##.##", "#.#.#", "#.#.#", "#...#", "#...#", "#...#"],
  N: ["#...#", "#...#", "##..#", "#.#.#", "#..##", "#...#", "#...#"],
  O: [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  P: ["####.", "#...#", "#...#", "####.", "#....", "#....", "#...."],
  Q: [".###.", "#...#", "#...#", "#...#", "#.#.#", "#..#.", ".##.#"],
  R: ["####.", "#...#", "#...#", "####.", "#.#..", "#..#.", "#...#"],
  S: [".####", "#....", "#....", ".###.", "....#", "....#", "####."],
  T: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],
  U: ["#...#", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  V: ["#...#", "#...#", "#...#", "#...#", "#...#", ".#.#.", "..#.."],
  W: ["#...#", "#...#", "#...#", "#.#.#", "#.#.#", "#.#.#", ".#.#."],
  X: ["#...#", "#...#", ".#.#.", "..#..", ".#.#.", "#...#", "#...#"],
  Y: ["#...#", "#...#", ".#.#.", "..#..", "..#..", "..#..", "..#.."],
  Z: ["#####", "....#", "...#.", "..#..", ".#...", "#....", "#####"],
  0: [".###.", "#...#", "#..##", "#.#.#", "##..#", "#...#", ".###."],
  1: ["..#..", ".##..", "..#..", "..#..", "..#..", "..#..", ".###."],
  2: [".###.", "#...#", "....#", "...#.", "..#..", ".#...", "#####"],
  3: ["#####", "...#.", "..#..", "...#.", "....#", "#...#", ".###."],
  4: ["...#.", "..##.", ".#.#.", "#..#.", "#####", "...#.", "...#."],
  5: ["#####", "#....", "####.", "....#", "....#", "#...#", ".###."],
  6: ["..##.", ".#...", "#....", "####.", "#...#", "#...#", ".###."],
  7: ["#####", "....#", "...#.", "..#..", ".#...", ".#...", ".#..."],
  8: [".###.", "#...#", "#...#", ".###.", "#...#", "#...#", ".###."],
  9: [".###.", "#...#", "#...#", ".####", "....#", "...#.", ".##.."],
  " ": [".....", ".....", ".....", ".....", ".....", ".....", "....."],
  ".": [".....", ".....", ".....", ".....", ".....", ".##..", ".##.."],
  ",": [".....", ".....", ".....", ".....", ".##..", "..#..", ".#..."],
  ":": [".....", ".##..", ".##..", ".....", ".##..", ".##..", "....."],
  "!": ["..#..", "..#..", "..#..", "..#..", "..#..", ".....", "..#.."],
  "?": [".###.", "#...#", "....#", "...#.", "..#..", ".....", "..#.."],
  "-": [".....", ".....", ".....", ".###.", ".....", ".....", "....."],
  "+": [".....", "..#..", "..#..", "#####", "..#..", "..#..", "....."],
  "/": ["....#", "....#", "...#.", "..#..", ".#...", "#....", "#...."],
  "'": ["..#..", "..#..", ".#...", ".....", ".....", ".....", "....."],
  "(": ["...#.", "..#..", ".#...", ".#...", ".#...", "..#..", "...#."],
  ")": [".#...", "..#..", "...#.", "...#.", "...#.", "..#..", ".#..."],
  "%": ["##..#", "##..#", "...#.", "..#..", ".#...", "#..##", "#..##"],
  "#": [".#.#.", ".#.#.", "#####", ".#.#.", "#####", ".#.#.", ".#.#."],
  "&": [".##..", "#..#.", "#.#..", ".#...", "#.#.#", "#..#.", ".##.#"],
  "·": [".....", ".....", ".....", "..#..", ".....", ".....", "....."],
  "©": [".###.", "#...#", "#.###", "#.#.#", "#.###", "#...#", ".###."],
  "🔒": [".###.", "#...#", "#...#", "#####", "##.##", "##.##", "#####"],
  "▶": ["#....", "##...", "###..", "####.", "###..", "##...", "#...."],
  "✓": [".....", "....#", "...##", "#.##.", "###..", ".#...", "....."],
  "★": ["..#..", "..#..", "#####", ".###.", ".###.", ".#.#.", "#...#"],
  "♥": [".....", ".#.#.", "#####", "#####", ".###.", "..#..", "....."],
};

const missing = new Set();
const textW = (str, s) => [...str].length * 6 * s - s;

// Pixel text as a single <path>. Optional shadow, anchor and class.
function ptext(str, x, y, s, fill, o = {}) {
  str = String(str).toUpperCase();
  const w = textW(str, s);
  let x0 = o.anchor === "middle" ? x - w / 2 : o.anchor === "end" ? x - w : x;
  x0 = Math.round(x0);
  let d = "";
  [...str].forEach((ch, i) => {
    let g = FONT[ch];
    if (!g) {
      missing.add(ch);
      g = FONT["?"];
    }
    const cx = x0 + i * 6 * s;
    g.forEach((row, r) => {
      for (let c = 0; c < 5; ) {
        if (row[c] !== "#") { c++; continue; }
        let e = c;
        while (e < 5 && row[e] === "#") e++;
        d += `M${cx + c * s},${y + r * s}h${(e - c) * s}v${s}h${-(e - c) * s}z`;
        c = e;
      }
    });
  });
  const shadow = o.shadow
    ? `<path d="${d}" fill="${o.shadow}" transform="translate(${o.sd || s},${o.sd || s})"/>`
    : "";
  const attrs = (o.cls ? ` class="${o.cls}"` : "") + (o.style ? ` style="${o.style}"` : "");
  return `<g${attrs}>${shadow}<path d="${d}" fill="${fill}"/></g>`;
}

// Pixel sprite from rows of palette keys ("." = transparent).
function sprite(rows, pal, x, y, s, attrs = "") {
  const paths = {};
  rows.forEach((row, r) => {
    for (let c = 0; c < row.length; ) {
      const k = row[c];
      if (k === ".") { c++; continue; }
      let e = c;
      while (e < row.length && row[e] === k) e++;
      paths[k] = (paths[k] || "") + `M${x + c * s},${y + r * s}h${(e - c) * s}v${s}h${-(e - c) * s}z`;
      c = e;
    }
  });
  const body = Object.entries(paths).map(([k, d]) => `<path d="${d}" fill="${pal[k]}"/>`).join("");
  return `<g${attrs ? " " + attrs : ""}>${body}</g>`;
}

// Rectangle with pixel-notched corners.
const notch = (x, y, w, h, n) =>
  `M${x + n},${y}H${x + w - n}V${y + n}H${x + w}V${y + h - n}H${x + w - n}V${y + h}H${x + n}V${y + h - n}H${x}V${y + n}H${x + n}Z`;

function frame(x, y, w, h, p, border, fill) {
  return `<path d="${notch(x, y, w, h, p)}" fill="${border}"/><path d="${notch(x + p, y + p, w - 2 * p, h - 2 * p, p)}" fill="${fill}"/>`;
}

function rng(seed) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

// A full-width panel: blue notched frame with a dark inside.
function panel(W, H, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges">
<defs>
  <clipPath id="inner"><path d="${notch(4, 4, W - 8, H - 8, 4)}"/></clipPath>
</defs>
${frame(0, 0, W, H, 4, P.maze, P.bg)}
<g clip-path="url(#inner)">
${body}
</g>
</svg>
`;
}

function header(text, y, color = P.yellow) {
  return ptext(text, 450, y, 3, color, { anchor: "middle", shadow: P.plum, sd: 3 });
}

// ---------------------------------------------------------------- sprites

const AVATAR = [
  "...hhhhhh...",
  "..hhhhhhhh..",
  "..hsssssss..",
  "..skssssks..",
  "..ssssssss..",
  "..sssmmsss..",
  "...ssssss...",
  "....ssss....",
  ".bbbbbbbbbb.",
  "bbbbwbbwbbbb",
  "bbbbwbbwbbbb",
  "bsgggugggssb",
  "..gggggggg..",
  ".GGGGGGGGGG.",
];
const AVATAR_PAL = {
  h: "#3b2a1a", s: P.peach, k: P.black, m: P.plum, b: P.red,
  w: P.white, g: P.lgrey, G: P.dgrey, u: P.blue,
};

// ---------------------------------------------------------------- panels

function headerPanel() {
  const W = 900, H = 250, ground = 236;
  const r = rng(11);
  let stars = "";
  for (let i = 0; i < 40; i++) {
    const x = 8 + Math.floor(r() * 884), y = 10 + Math.floor(r() * 170);
    stars += `<rect x="${x}" y="${y}" width="2" height="2" fill="${P.lgrey}" opacity=".35"/>`;
  }
  let city = "";
  for (let x = 8; x < 892; ) {
    const bw = 30 + Math.floor(r() * 45), bh = 14 + Math.floor(r() * 36), top = ground - bh;
    city += `<rect x="${x}" y="${top}" width="${bw}" height="${bh}" fill="${P.navy}"/>`;
    for (let wy = top + 6; wy < ground - 6; wy += 10)
      for (let wx = x + 5; wx < x + bw - 6; wx += 9)
        if (r() < 0.25) city += `<rect x="${wx}" y="${wy}" width="4" height="4" fill="${P.yellow}" opacity=".6"/>`;
    x += bw + 2;
  }
  return panel(W, H, `
${stars}
${ptext(profile.name, 450, 40, 7, P.yellow, { anchor: "middle", shadow: P.plum, sd: 5 })}
${ptext(profile.role, 450, 114, 3, P.blue, { anchor: "middle" })}
${ptext(profile.tagline, 450, 150, 2, P.lgrey, { anchor: "middle" })}
${city}
<rect x="0" y="${ground}" width="${W}" height="2" fill="${P.maze}"/>
<rect x="0" y="${ground + 2}" width="${W}" height="${H}" fill="${P.black}"/>
`);
}

function aboutPanel() {
  const W = 900, H = 330;
  const rows = profile.about
    .map(([k, v], i) => ptext(k, 290, 96 + i * 34, 2, P.orange) + ptext(v, 440, 96 + i * 34, 2, P.white))
    .join("\n");
  const sy = 96 + profile.about.length * 34;
  const status =
    ptext("STATUS", 290, sy, 2, P.orange) +
    `<rect x="440" y="${sy + 2}" width="10" height="10" fill="${P.green}"/>` +
    ptext(profile.status, 460, sy, 2, P.green);
  return panel(W, H, `
${header("ABOUT ME", 26)}
${frame(50, 78, 200, 220, 4, P.maze, P.slot)}
${sprite(AVATAR, AVATAR_PAL, 78, 104, 12)}
${rows}
${status}
`);
}

const AREA_COLORS = {
  FRONTEND: P.blue, BACKEND: P.green, LANGUAGE: P.yellow, DATABASE: P.orange, TOOLS: P.pink,
};

function stackPanel() {
  const W = 900, cols = 3, sw = 270, sh = 70, gap = 15, top = 70;
  const nrows = Math.ceil(stack.length / cols);
  const H = top + nrows * (sh + gap) + 14;
  const slots = stack
    .map((it, i) => {
      const x = 30 + (i % cols) * (sw + gap), y = top + Math.floor(i / cols) * (sh + gap);
      const color = AREA_COLORS[it.area] || P.indigo;
      return frame(x, y, sw, sh, 3, P.maze, P.slot) +
        `<rect x="${x + 20}" y="${y + 27}" width="16" height="16" fill="${color}"/>` +
        ptext(it.tech, x + 52, y + 14, 3, P.white) +
        ptext(it.area, x + 52, y + 44, 2, P.lgrey);
    })
    .join("\n");
  return panel(W, H, `
${header("TECH STACK", 26)}
${slots}
`);
}

function wrap(text, max) {
  const lines = [];
  let line = "";
  for (const word of text.split(" ")) {
    if (line && (line + " " + word).length > max) {
      lines.push(line);
      line = word;
    } else line = line ? line + " " + word : word;
  }
  if (line) lines.push(line);
  return lines;
}

const STATUS_COLORS = { "IN DEVELOPMENT": P.orange, LIVE: P.green, COMPLETED: P.blue };

// One project card. Returns its svg and the height it used (card + optional note).
function projectCard(q, y) {
  const L = 50, R = 600;
  const maxW = q.checklist ? 520 : 800;
  let out = "";

  // status badge + role
  let cy = y + 20;
  const tagW = textW(q.status, 2) + 16;
  out += `<rect x="${L}" y="${cy}" width="${tagW}" height="24" fill="${STATUS_COLORS[q.status] || P.indigo}"/>` +
    ptext(q.status, L + 8, cy + 5, 2, P.bg);
  if (q.role) out += ptext("· " + q.role, L + tagW + 12, cy + 5, 2, P.lgrey);

  // name, subtitle, description
  cy += 42;
  out += ptext(q.name, L, cy, q.name.length <= 20 ? 4 : 3, P.white, { shadow: P.plum, sd: 2 });
  cy += q.name.length <= 20 ? 40 : 32;
  if (q.subtitle) {
    out += ptext(q.subtitle, L, cy, 2, P.pink);
    cy += 26;
  }
  for (const line of wrap(q.description, Math.floor((maxW + 2) / 12))) {
    out += ptext(line, L, cy, 2, P.lgrey);
    cy += 22;
  }

  // tech tags
  if (q.tags) {
    cy += 8;
    let x = L;
    for (const t of q.tags) {
      const w = textW(t, 2) + 16;
      if (x + w > L + maxW) { x = L; cy += 34; }
      out += frame(x, cy, w, 26, 2, P.indigo, P.bg) + ptext(t, x + 8, cy + 6, 2, P.white);
      x += w + 8;
    }
    cy += 26 + 22;
  }

  // checklist column
  let ry = y;
  if (q.checklist) {
    ry = y + 66;
    out += ptext(q.checklist.title, R, ry, 2, P.orange);
    ry += 30;
    for (const [text, ok] of q.checklist.items) {
      out += ok
        ? ptext("✓", R, ry, 2, P.green) + ptext(text, R + 22, ry, 2, P.white)
        : `<rect x="${R + 1}" y="${ry + 2}" width="10" height="10" fill="none" stroke="${P.dgrey}" stroke-width="2"/>` +
          ptext(text, R + 22, ry, 2, P.dgrey);
      ry += 28;
    }
    ry += 6;
  }

  const h = Math.max(cy, ry) - y;
  if (q.checklist) out += `<rect x="${R - 22}" y="${y + 60}" width="2" height="${h - 76}" fill="${P.empty}"/>`;
  let svg = frame(30, y, 840, h, 4, P.maze, P.slot) + out;
  let used = h;
  if (q.note) {
    svg += ptext(q.note, 450, y + h + 12, 2, P.dgrey, { anchor: "middle" });
    used += 34;
  }
  return { svg, h: used };
}

function projectsPanel() {
  const W = 900, gap = 16;
  let y = 70, cards = "";
  for (const q of projects) {
    const c = projectCard(q, y);
    cards += c.svg + "\n";
    y += c.h + gap;
  }
  const H = y - gap + 24;
  return panel(W, H, `
${header("PROJECTS", 26)}
${cards}
`);
}

// Small dark strip with a heading, used above third-party cards.
function strip(text) {
  const W = 900, H = 52;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges">
${frame(0, 0, W, H, 4, P.maze, P.bg)}
${header(text, 15)}
</svg>
`;
}

function button(label, color) {
  const W = 300, H = 60;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges">
${frame(0, 0, W, H, 4, color, P.slot)}
${ptext(label, W / 2, 20, 3, P.white, { anchor: "middle" })}
</svg>
`;
}

// ---------------------------------------------------------------- write

const files = {
  "header.svg": headerPanel(),
  "about.svg": aboutPanel(),
  "tech-stack.svg": stackPanel(),
  "projects.svg": projectsPanel(),
  "github-stats.svg": strip("GITHUB STATS"),
  "contact.svg": strip("GET IN TOUCH"),
  "btn-linkedin.svg": button("LINKEDIN", P.blue),
  "btn-email.svg": button("EMAIL", P.red),
};
for (const [name, svg] of Object.entries(files)) fs.writeFileSync(path.join(__dirname, name), svg);
console.log("Built " + Object.keys(files).join(", "));
if (missing.size) console.warn("Missing glyphs (drawn as ?): " + [...missing].join(" "));
