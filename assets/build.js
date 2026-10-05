// Generates the retro-arcade SVGs used in README.md.
// Edit the data below, then run: node assets/build.js
// All text is drawn with the pixel font defined further down (uppercase only).

const fs = require("fs");
const path = require("path");

const player = {
  name: "ERIK JASHARI",
  class: "FULL-STACK DEVELOPER",
  footer: "© 2026 ERIK JASHARI · FERIZAJ, KOSOVO",
  stats: [
    ["NAME:", "ERIK JASHARI"],
    ["CLASS:", "FULL-STACK DEV"],
    ["GUILD:", "UBT · CSE"],
    ["HOME WORLD:", "FERIZAJ, KOSOVO"],
    ["LANGUAGES:", "ALBANIAN, ENGLISH"],
    ["CO-OP QUEST:", "QIRAPRO (CAR RENTALS)"],
  ],
  status: "LOOKING FOR A PARTY",
  // [label, filled cells out of 16, value text, color]
  bars: [
    ["HP", 16, "MAX", "#00e436"],
    ["MP", 11, "70% COFFEE", "#29adff"],
    ["XP", 10, "LVL UP SOON", "#ffec27"],
  ],
};

// sprite: one of the keys in SPRITES below
const inventory = [
  { tech: "REACT", item: "COMPONENT SWORD", sprite: "sword" },
  { tech: "JAVASCRIPT", item: "SCRIPT SCROLL", sprite: "scroll" },
  { tech: "HTML/CSS", item: "STYLE HAMMER", sprite: "hammer" },
  { tech: "NODE.JS", item: "SERVER SHIELD", sprite: "shield" },
  { tech: "JAVA", item: "COFFEE POTION", sprite: "mug" },
  { tech: "PHP", item: "ELEPHANT STAFF", sprite: "staff" },
  { tech: "SQL", item: "DATA CHEST", sprite: "chest" },
  { tech: "GIT", item: "SAVE CRYSTAL", sprite: "crystal" },
  { tech: "VS CODE", item: "SPELLBOOK", sprite: "book" },
];

// type: "MAIN QUEST", "CO-OP QUEST" or "SIDE QUEST".
// progress: 0..1 (1 = QUEST COMPLETE). If left out, it's done objectives / all objectives.
// Optional: role, subtitle, tags, objectives ([text, done]), note.
const quests = [
  {
    type: "CO-OP QUEST",
    role: "PARTY MEMBER",
    name: "QIRAPRO",
    subtitle: "CAR RENTAL AGGREGATOR FOR KOSOVO",
    description:
      "A TEAM PROJECT I'M HELPING BUILD: EVERY RENTAL COMPANY IN KOSOVO IN ONE PLACE. " +
      "SEARCH, COMPARE AND BOOK CARS, WITH A DEDICATED ADEM JASHARI AIRPORT SECTION. " +
      "ADMIN DASHBOARDS, LIVE AVAILABILITY OVER SSE AND IMAGES ON CLOUDFLARE R2.",
    tags: ["REACT", "NODE.JS", "EXPRESS", "POSTGRESQL", "SSE + REDIS", "CLOUDFLARE R2", "RAILWAY"],
    objectives: [
      ["AUTH & BOOKING API", true],
      ["DEPLOYED ON RAILWAY", true],
      ["IMAGE STORAGE ON R2", true],
      ["ADMIN DASHBOARDS", false],
      ["REDIS LIVE UPDATES", false],
      ["MOBILE APP", false],
    ],
    note: "🔒 PRIVATE REPO · IN ACTIVE DEVELOPMENT",
  },
  {
    type: "MAIN QUEST",
    name: "CUBERUSH",
    subtitle: "3D RUBIK'S CUBE SPEEDSOLVING GAME",
    description:
      "SOLVE SEEDED SCRAMBLES AGAINST THE CLOCK, EARN POINTS AND CLIMB THE LEADERBOARD. " +
      "EVERY SOLVE IS REPLAYED AND VERIFIED ON THE SERVER. " +
      "BUILT-IN LESSONS TEACH THE BEGINNER METHOD STEP BY STEP.",
    tags: ["TYPESCRIPT", "REACT", "THREE.JS", "FASTIFY", "SQLITE", "DOCKER", "FLY.IO"],
    objectives: [
      ["3D DRAG-TO-TURN CUBE", true],
      ["VERIFIED SOLVES", true],
      ["5 GAME MODES", true],
      ["LEADERBOARDS", true],
      ["LESSONS & HINTS", true],
      ["SKINS & THEMES SHOP", true],
    ],
    note: "▶ LIVE AT CUBERUSH-ERIK.FLY.DEV",
  },
  {
    type: "MAIN QUEST",
    name: "SPORTS TOURNAMENT MANAGEMENT SYSTEM",
    description: "MANAGE TOURNAMENTS, TEAMS, FIXTURES AND RESULTS.",
    tags: ["REACT", "NODE.JS", "EXPRESS", "TAILWIND CSS", "POSTGRESQL"],
    progress: 1,
  },
];

// trophy: gold | silver | bronze | purple
const achievements = [
  { name: "FIRST COMMIT", description: "PUSHED MY FIRST CODE", trophy: "gold" },
  { name: "HELLO WORLD", description: "PRINTED IT. IT WORKED.", trophy: "silver" },
  { name: "SURVIVED FINALS", description: "MADE IT THROUGH EXAM WEEK", trophy: "bronze" },
  { name: "NIGHT OWL", description: "COMMITTED AFTER 2 AM", trophy: "purple" },
];

// PICO-8 palette + arcade maze blue
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

const BASE_CSS = `
.blink{animation:bl 1s steps(1) infinite}
@keyframes bl{0%{opacity:1}50%{opacity:0}100%{opacity:0}}
.fa{animation:fa .8s steps(1) infinite}
@keyframes fa{0%{opacity:1}50%{opacity:0}100%{opacity:0}}
.fb{opacity:0;animation:fb .8s steps(1) infinite}
@keyframes fb{0%{opacity:0}50%{opacity:1}100%{opacity:1}}
.tw{animation:tw 2.4s steps(1) infinite}
@keyframes tw{0%{opacity:1}70%{opacity:.2}100%{opacity:.2}}
.bob{animation:bob 1s steps(1) infinite}
@keyframes bob{0%{transform:translateY(0)}50%{transform:translateY(-6px)}100%{transform:translateY(-6px)}}
`;

// A full-width arcade panel: blue notched frame, dark inside, CRT scanlines on top.
function panel(W, H, body, css = "") {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges">
<defs>
  <pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1" fill="#000" opacity=".35"/></pattern>
  <clipPath id="inner"><path d="${notch(4, 4, W - 8, H - 8, 4)}"/></clipPath>
  <clipPath id="outer"><path d="${notch(0, 0, W, H, 4)}"/></clipPath>
  <style>${BASE_CSS}${css}</style>
</defs>
${frame(0, 0, W, H, 4, P.maze, P.bg)}
<g clip-path="url(#inner)">
${body}
</g>
<rect width="${W}" height="${H}" fill="url(#scan)" clip-path="url(#outer)"/>
</svg>
`;
}

function header(text, y, color = P.yellow) {
  return ptext(text, 450, y, 3, color, { anchor: "middle", shadow: P.plum, sd: 3 });
}

// ---------------------------------------------------------------- sprites

const INVADER_A = [
  "..g.....g..",
  "...g...g...",
  "..ggggggg..",
  ".gg.ggg.gg.",
  "ggggggggggg",
  "g.ggggggg.g",
  "g.g.....g.g",
  "...gg.gg...",
];
const INVADER_B = [
  "..g.....g..",
  "g..g...g..g",
  "g.ggggggg.g",
  "ggg.ggg.ggg",
  "ggggggggggg",
  ".ggggggggg.",
  "..g.....g..",
  ".g.......g.",
];

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

const SPRITES = {
  sword: [["......cw", ".....cw.", "....cw..", ".y.cw...", "..yy....", ".byy....", "bb..y...", "b......."],
    { c: P.blue, w: P.white, y: P.yellow, b: P.brown }],
  scroll: [["........", ".oooooo.", ".pppppp.", ".pkkkkp.", ".pppppp.", ".pkkkpp.", ".pppppp.", ".oooooo."],
    { o: P.brown, p: P.peach, k: P.dgrey }],
  hammer: [[".ggggg..", "gggggg..", ".ggggg..", "...bb...", "...bb...", "...bb...", "...bb...", "...bb..."],
    { g: P.lgrey, b: P.orange }],
  shield: [[".dddddd.", "dnnnnnnd", "dnnwwnnd", "dnwwwwnd", "dnnwwnnd", ".dnnnnd.", "..dnnd..", "...dd..."],
    { d: "#008751", n: P.green, w: P.white }],
  mug: [[".w..w...", "..w..w..", "........", "mmmmmm..", "mccccmmm", "mmmmmm.m", "mmmmmmm.", ".mmmm..."],
    { w: P.lgrey, m: P.brown, c: "#3b2a1a" }],
  staff: [["....ppp.", "....ppp.", ".....i..", "....i...", "...i....", "..i.....", ".i......", "i......."],
    { p: P.pink, i: P.indigo }],
  chest: [["........", ".bbbbbb.", "bbbbbbbb", "yyyyyyyy", "bbbyybbb", "bbbyybbb", "bbbbbbbb", "........"],
    { b: P.brown, y: P.yellow }],
  crystal: [["...rr...", "..rppr..", ".rpwppr.", "rppwpppr", ".rppppr.", "..rppr..", "...rr...", "........"],
    { r: P.red, p: P.pink, w: P.white }],
  book: [[".DDDDDD.", ".DuuuuDw", ".DuyyuDw", ".DuyyuDw", ".DuuuuDw", ".DuuuuDw", ".DDDDDDw", "..wwwww."],
    { D: P.navy, u: P.blue, y: P.yellow, w: P.white }],
};

const TROPHY = ["y.yyyy.y", "yyyyyyyy", "y.yyyy.y", "..yyyy..", "...yy...", "...yy...", "..oooo..", ".oooooo."];
const TROPHY_PAL = {
  gold: { y: P.yellow, o: P.brown },
  silver: { y: P.lgrey, o: P.dgrey },
  bronze: { y: P.orange, o: P.brown },
  purple: { y: P.pink, o: P.plum },
};

const CHOMP_OPEN = ["..yyy..", ".yyyyy.", "yyyy...", "yyy....", "yyyy...", ".yyyyy.", "..yyy.."];
const CHOMP_SHUT = ["..yyy..", ".yyyyy.", "yyyyyyy", "yyyyyyy", "yyyyyyy", ".yyyyy.", "..yyy.."];
const GHOST = ["..rrr..", ".rrrrr.", "rwbrwbr", "rrrrrrr", "rrrrrrr", "rrrrrrr", "r.r.r.r"];

// ---------------------------------------------------------------- panels

function titleScreen() {
  const W = 900, H = 330;
  const r = rng(11);
  let stars = "";
  for (let i = 0; i < 70; i++) {
    const x = 8 + Math.floor(r() * 884), y = 56 + Math.floor(r() * 170);
    const tw = r() < 0.3 ? ` class="tw" style="animation-delay:${(r() * 2.4).toFixed(2)}s"` : "";
    stars += `<rect${tw} x="${x}" y="${y}" width="2" height="2" fill="${r() < 0.5 ? P.lgrey : P.white}" opacity=".7"/>`;
  }
  let city = "";
  for (let x = 8; x < 892; ) {
    const bw = 30 + Math.floor(r() * 45), bh = 20 + Math.floor(r() * 50), top = 300 - bh;
    city += `<rect x="${x}" y="${top}" width="${bw}" height="${bh}" fill="${P.navy}"/>`;
    for (let wy = top + 6; wy < 294; wy += 10)
      for (let wx = x + 5; wx < x + bw - 6; wx += 9)
        if (r() < 0.35) {
          const fl = r() < 0.12 ? ` class="tw" style="animation-delay:${(r() * 2.4).toFixed(2)}s"` : "";
          city += `<rect${fl} x="${wx}" y="${wy}" width="4" height="4" fill="${P.yellow}" opacity=".85"/>`;
        }
    x += bw + 2;
  }
  const inv = (x, color) =>
    sprite(INVADER_A, { g: color }, x, 104, 5, `class="fa"`) + sprite(INVADER_B, { g: color }, x, 104, 5, `class="fb"`);

  return panel(W, H, `
${stars}
${ptext("1UP", 60, 18, 2, P.red)}${ptext("002026", 60, 38, 2, P.white)}
${ptext("HI-SCORE", 450, 18, 2, P.red, { anchor: "middle" })}${ptext("999999", 450, 38, 2, P.white, { anchor: "middle" })}
${ptext("CREDIT", 840, 18, 2, P.red, { anchor: "end" })}${ptext("01", 840, 38, 2, P.white, { anchor: "end" })}
${ptext("UBT STUDIOS PRESENTS", 450, 72, 2, P.lgrey, { anchor: "middle" })}
${inv(60, P.green)}${inv(785, P.pink)}
${ptext(player.name, 450, 98, 7, P.yellow, { anchor: "middle", shadow: P.red, sd: 5 })}
${ptext(player.class, 450, 172, 3, P.blue, { anchor: "middle" })}
${ptext("▶ PRESS START", 450, 210, 3, P.white, { anchor: "middle", cls: "blink" })}
${city}
<rect x="0" y="300" width="${W}" height="2" fill="${P.maze}"/>
<rect x="0" y="302" width="${W}" height="${H}" fill="${P.black}"/>
${ptext(player.footer, 450, 309, 2, P.dgrey, { anchor: "middle" })}
`);
}

function playerSelect() {
  const W = 900, H = 410;
  const rows = player.stats
    .map(([k, v], i) => ptext(k, 290, 84 + i * 30, 2, P.orange) + ptext(v, 456, 84 + i * 30, 2, P.white))
    .join("\n");
  const sy = 84 + player.stats.length * 30;
  const status =
    ptext("STATUS:", 290, sy, 2, P.orange) +
    `<rect class="blink" x="456" y="${sy + 2}" width="10" height="10" fill="${P.green}"/>` +
    ptext(player.status, 476, sy, 2, P.green);
  const bars = player.bars
    .map(([label, n, val, color], i) => {
      const y = 304 + i * 30;
      let cells = "";
      for (let c = 0; c < 16; c++)
        cells += `<rect x="${340 + c * 20}" y="${y}" width="16" height="14" fill="${c < n ? color : P.empty}"/>`;
      return ptext(label, 290, y, 2, color) + cells + ptext(val, 680, y, 2, P.lgrey);
    })
    .join("\n");

  return panel(W, H, `
${header("PLAYER SELECT", 26)}
${frame(50, 78, 200, 220, 4, P.maze, P.slot)}
${sprite(AVATAR, AVATAR_PAL, 78, 106, 12, `class="bob"`)}
${ptext("▶", 92, 316, 3, P.red, { cls: "blink" })}
${ptext("P1 ERIK", 160, 316, 3, P.white, { anchor: "middle" })}
${rows}
${status}
${bars}
`);
}

function inventoryPanel() {
  const W = 900, cols = 3, sw = 270, sh = 84, gap = 15, top = 70;
  const nrows = Math.ceil(inventory.length / cols);
  const H = top + nrows * (sh + gap) + 14;
  const slots = inventory
    .map((it, i) => {
      const x = 30 + (i % cols) * (sw + gap), y = top + Math.floor(i / cols) * (sh + gap);
      const [rows, pal] = SPRITES[it.sprite];
      const cursor = i === 0
        ? `<rect class="blink" x="${x - 3}" y="${y - 3}" width="${sw + 6}" height="${sh + 6}" fill="none" stroke="${P.yellow}" stroke-width="3"/>`
        : "";
      return frame(x, y, sw, sh, 3, P.maze, P.slot) + cursor +
        sprite(rows, pal, x + 18, y + 18, 6) +
        ptext(it.tech, x + 84, y + 18, 3, P.white) +
        ptext(it.item, x + 84, y + 52, 2, P.orange);
    })
    .join("\n");
  return panel(W, H, `
${header("INVENTORY", 26)}
${slots}
`);
}

// Greedy word wrap to a max number of characters per line.
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

const QUEST_COLORS = { "MAIN QUEST": P.red, "CO-OP QUEST": P.blue, "SIDE QUEST": P.indigo };

// One quest card. Returns its svg and the height it used (card + optional note).
function questCard(q, y) {
  const L = 50, R = 600;
  const maxW = q.objectives ? 520 : 800;
  const progress = q.progress ??
    (q.objectives ? q.objectives.filter(([, d]) => d).length / q.objectives.length : 0);
  const done = progress >= 1;
  let out = "";

  // tag + role + status
  let cy = y + 20;
  const tagW = textW(q.type, 2) + 16;
  out += `<rect x="${L}" y="${cy}" width="${tagW}" height="24" fill="${QUEST_COLORS[q.type] || P.indigo}"/>` +
    ptext(q.type, L + 8, cy + 5, 2, P.white);
  if (q.role) out += ptext("· " + q.role, L + tagW + 12, cy + 5, 2, P.lgrey);
  out += done
    ? ptext("✓ QUEST COMPLETE", 850, cy + 5, 2, P.green, { anchor: "end" })
    : ptext("▶ IN PROGRESS", 850, cy + 5, 2, P.yellow, { anchor: "end", cls: "blink" });

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
    cy += 26 + 16;
  }

  // progress bar
  const n = Math.floor((L + maxW - 70 - 170) / 18);
  const filled = Math.round(Math.max(0, Math.min(1, progress)) * n);
  out += ptext("PROGRESS", L, cy, 2, P.orange);
  for (let c = 0; c < n; c++)
    out += `<rect x="${170 + c * 18}" y="${cy}" width="14" height="14" fill="${c < filled ? (done ? P.green : P.yellow) : P.empty}"/>`;
  out += ptext(`${Math.round(progress * 100)}%`, 170 + n * 18 + 10, cy, 2, P.white);
  cy += 14 + 20;

  // objectives column
  let ry = y;
  if (q.objectives) {
    ry = y + 66;
    out += ptext("OBJECTIVES", R, ry, 2, P.orange);
    ry += 30;
    for (const [text, ok] of q.objectives) {
      out += ok
        ? ptext("✓", R, ry, 2, P.green) + ptext(text, R + 22, ry, 2, P.white)
        : `<rect x="${R + 1}" y="${ry + 2}" width="10" height="10" fill="none" stroke="${P.dgrey}" stroke-width="2"/>` +
          ptext(text, R + 22, ry, 2, P.dgrey);
      ry += 28;
    }
    ry += 6;
  }

  const h = Math.max(cy, ry) - y;
  if (q.objectives) out += `<rect x="${R - 22}" y="${y + 60}" width="2" height="${h - 76}" fill="${P.empty}"/>`;
  let svg = frame(30, y, 840, h, 4, P.maze, P.slot) + out;
  let used = h;
  if (q.note) {
    svg += ptext(q.note, 450, y + h + 12, 2, P.dgrey, { anchor: "middle" });
    used += 34;
  }
  return { svg, h: used };
}

function questLog() {
  const W = 900, gap = 16;
  let y = 70, cards = "";
  for (const q of quests) {
    const c = questCard(q, y);
    cards += c.svg + "\n";
    y += c.h + gap;
  }
  const slotY = y;
  const H = slotY + 50 + 24;
  return panel(W, H, `
${header("QUEST LOG", 26)}
${cards}
${frame(30, slotY, 840, 50, 4, P.dgrey, P.bg)}
${ptext("? SIDE QUEST - NEW QUEST UNLOCKS SOON", 450, slotY + 18, 2, P.dgrey, { anchor: "middle" })}
`);
}

function achievementsPanel() {
  const W = 900, sw = 412, sh = 90, gap = 16, top = 70;
  const H = top + Math.ceil(achievements.length / 2) * (sh + gap) + 14;
  const slots = achievements
    .map((a, i) => {
      const x = 30 + (i % 2) * (sw + gap), y = top + Math.floor(i / 2) * (sh + gap);
      return frame(x, y, sw, sh, 3, P.maze, P.slot) +
        sprite(TROPHY, TROPHY_PAL[a.trophy], x + 18, y + 17, 7) +
        `<rect class="tw" style="animation-delay:${(i * 0.6).toFixed(1)}s" x="${x + 70}" y="${y + 14}" width="4" height="4" fill="${P.white}"/>` +
        ptext(a.name, x + 92, y + 22, 3, P.yellow) +
        ptext(a.description, x + 92, y + 56, 2, P.lgrey);
    })
    .join("\n");
  return panel(W, H, `
${header("ACHIEVEMENTS", 26)}
${ptext(`${achievements.length}/${achievements.length} UNLOCKED`, 862, 32, 2, P.green, { anchor: "end" })}
${slots}
`);
}

function gameOver() {
  const W = 900, H = 190;
  const lead = "CONTINUE? ";
  const x0 = Math.round(450 - textW(lead + "9", 3) / 2);
  let digits = "";
  for (let n = 9; n >= 0; n--)
    digits += ptext(String(n), x0 + lead.length * 18, 76, 3, P.red, { cls: "cd", style: `animation-delay:${9 - n}s` });
  return panel(W, H, `
${ptext("THANKS FOR PLAYING!", 450, 26, 4, P.yellow, { anchor: "middle", shadow: P.red, sd: 3 })}
${ptext(lead, x0, 76, 3, P.white)}${digits}
${ptext("▶ YES", 380, 116, 3, P.white, { anchor: "middle", cls: "blink" })}
${ptext("NO", 530, 116, 3, P.dgrey, { anchor: "middle" })}
${ptext("INSERT COIN · PRESS ★ TO STAR A REPO", 450, 156, 2, P.lgrey, { anchor: "middle" })}
`, `.cd{opacity:0;animation:cd 10s steps(1) infinite}
@keyframes cd{0%{opacity:1}10%{opacity:0}100%{opacity:0}}`);
}

// Small dark strip with a heading, used above third-party cards.
function strip(text) {
  const W = 900, H = 52;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges">
<defs><style>${BASE_CSS}</style></defs>
${frame(0, 0, W, H, 4, P.maze, P.bg)}
${header(text, 15)}
</svg>
`;
}

function button(label, color) {
  const W = 300, H = 60;
  const full = "▶ " + label;
  const x0 = Math.round(W / 2 - textW(full, 3) / 2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges">
<defs><style>${BASE_CSS}</style></defs>
${frame(0, 0, W, H, 4, color, P.slot)}
${ptext("▶", x0, 20, 3, P.yellow, { cls: "blink" })}
${ptext(label, x0 + 36, 20, 3, P.white)}
</svg>
`;
}

// Row of pac-dots that a chomper eats while a ghost chases it.
function divider() {
  const W = 900, H = 32, dur = 8, start = -80, end = 960;
  let dots = "";
  for (let x = 30; x <= 870; x += 30) {
    const f = (x - 10 - start) / (end - start);
    dots += `<rect class="eat" style="animation-delay:${(-(1 - f) * dur).toFixed(2)}s" x="${x - 3}" y="13" width="6" height="6" fill="${P.peach}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges">
<defs><style>${BASE_CSS}
.run{animation:run ${dur}s linear infinite}
@keyframes run{from{transform:translateX(${start}px)}to{transform:translateX(${end}px)}}
.eat{animation:eat ${dur}s steps(1) infinite}
@keyframes eat{0%{opacity:0}50%{opacity:1}100%{opacity:1}}
.fa,.fb{animation-duration:.3s}
</style></defs>
<rect width="${W}" height="${H}" fill="${P.black}"/>
${dots}
<g class="run">
  ${sprite(CHOMP_OPEN, { y: P.yellow }, 0, 5, 3, `class="fa"`)}${sprite(CHOMP_SHUT, { y: P.yellow }, 0, 5, 3, `class="fb"`)}
  ${sprite(GHOST, { r: P.red, w: P.white, b: P.maze }, -50, 5, 3)}
</g>
</svg>
`;
}

// ---------------------------------------------------------------- write

const files = {
  "title-screen.svg": titleScreen(),
  "player-select.svg": playerSelect(),
  "inventory.svg": inventoryPanel(),
  "quest-log.svg": questLog(),
  "achievements.svg": achievementsPanel(),
  "high-scores.svg": strip("HIGH SCORES"),
  "player-2.svg": strip("PLAYER 2 - PRESS TO JOIN"),
  "btn-linkedin.svg": button("LINKEDIN", P.blue),
  "btn-email.svg": button("EMAIL", P.red),
  "divider.svg": divider(),
  "game-over.svg": gameOver(),
};
for (const [name, svg] of Object.entries(files)) fs.writeFileSync(path.join(__dirname, name), svg);
console.log("Built " + Object.keys(files).join(", "));
if (missing.size) console.warn("Missing glyphs (drawn as ?): " + [...missing].join(" "));
