// Generates the space-themed SVGs used in README.md.
// Edit the data below, then run: node assets/build.js

const fs = require("fs");
const path = require("path");

const profile = {
  name: "ERIK JASHARI",
  subtitle: "Full-Stack Developer · CSE Student at UBT · Ferizaj, Kosovo",
  coords: "42.37°N · 21.15°E — FERIZAJ, KOSOVO",
  role: "Full-stack developer, currently in orbit",
  fields: [
    ["CALLSIGN", "Full-Stack Developer"],
    ["BASE", "Ferizaj, Kosovo"],
    ["ACADEMY", "UBT · Computer Science & Engineering"],
    ["COMMS", "Albanian · English"],
  ],
  status: "Open to internships",
  // level = filled cells out of 10
  systems: [
    { name: "Frontend", stack: "React · JavaScript · HTML · CSS", level: 8 },
    { name: "Backend", stack: "Node.js · Java · PHP", level: 7 },
    { name: "Databases", stack: "PostgreSQL · MySQL", level: 6 },
    { name: "Tools", stack: "Git · VS Code", level: 8 },
  ],
};

// status: "IN FLIGHT" (in progress) or "LANDED" (done)
// progress: 0..1, how far along the trajectory line the rocket is
const missions = [
  {
    name: "Sports Tournament Management System",
    description: "Manage tournaments, teams, fixtures and results.",
    status: "IN FLIGHT",
    progress: 0.6,
  },
];

const C = {
  bg0: "#05061a",
  bg1: "#0b0f2e",
  bg2: "#1a1145",
  panel: "#0f1238",
  line: "#312e81",
  cyan: "#7dd3fc",
  violet: "#a78bfa",
  amber: "#fbbf24",
  green: "#4ade80",
  text: "#f1f5f9",
  soft: "#cbd5e1",
  muted: "#94a3b8",
  dim: "#64748b",
};

const SANS = "'Segoe UI','Helvetica Neue',Arial,sans-serif";
const MONO = "'JetBrains Mono','Fira Code',Consolas,'Courier New',monospace";

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Seeded RNG so the starfield is stable between builds.
function rng(seed) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

function stars(w, h, count, seed, maxY = h) {
  const r = rng(seed);
  let out = "";
  for (let i = 0; i < count; i++) {
    const x = (r() * w).toFixed(1);
    const y = (r() * maxY).toFixed(1);
    const rad = (0.4 + r() * 1.2).toFixed(2);
    const op = (0.3 + r() * 0.7).toFixed(2);
    const twinkle = r() < 0.2;
    const delay = (r() * 3).toFixed(2);
    out += twinkle
      ? `<circle class="tw" style="animation-delay:${delay}s" cx="${x}" cy="${y}" r="${rad}" fill="#fff"/>`
      : `<circle cx="${x}" cy="${y}" r="${rad}" fill="#fff" opacity="${op}"/>`;
  }
  return out;
}

const baseStyle = `
  .tw{animation:tw 3s ease-in-out infinite}
  @keyframes tw{0%,100%{opacity:.15}50%{opacity:1}}
  .blink{animation:bl 1.4s steps(1) infinite}
  @keyframes bl{50%{opacity:0}}
  .pulse{animation:pu 2s ease-in-out infinite}
  @keyframes pu{0%,100%{opacity:1}50%{opacity:.35}}
  .spin{transform-box:fill-box;transform-origin:center;animation:sp 30s linear infinite}
  @keyframes sp{to{transform:rotate(360deg)}}
`;

function corners(x, y, w, h, len = 18, color = C.cyan) {
  const p = (d) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="2" opacity=".8"/>`;
  return (
    p(`M${x},${y + len} V${y} H${x + len}`) +
    p(`M${x + w - len},${y} H${x + w} V${y + len}`) +
    p(`M${x},${y + h - len} V${y + h} H${x + len}`) +
    p(`M${x + w - len},${y + h} H${x + w} V${y + h - len}`)
  );
}

function banner() {
  const W = 900, H = 280;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${C.bg0}"/><stop offset=".55" stop-color="${C.bg1}"/><stop offset="1" stop-color="${C.bg2}"/>
  </linearGradient>
  <radialGradient id="neb1"><stop offset="0" stop-color="${C.violet}" stop-opacity=".45"/><stop offset="1" stop-color="${C.violet}" stop-opacity="0"/></radialGradient>
  <radialGradient id="neb2"><stop offset="0" stop-color="${C.cyan}" stop-opacity=".25"/><stop offset="1" stop-color="${C.cyan}" stop-opacity="0"/></radialGradient>
  <radialGradient id="planet" cx=".35" cy=".35" r=".75">
    <stop offset="0" stop-color="#fde68a"/><stop offset=".5" stop-color="#f59e0b"/><stop offset="1" stop-color="#7c2d12"/>
  </radialGradient>
  <radialGradient id="glow"><stop offset="0" stop-color="#fbbf24" stop-opacity=".35"/><stop offset="1" stop-color="#fbbf24" stop-opacity="0"/></radialGradient>
  <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#1e1b4b"/><stop offset=".3" stop-color="${C.bg1}"/>
  </linearGradient>
  <linearGradient id="title" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#e0e7ff"/><stop offset="1" stop-color="#c4b5fd"/>
  </linearGradient>
  <linearGradient id="trail" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/>
  </linearGradient>
  <clipPath id="round"><rect width="${W}" height="${H}" rx="16"/></clipPath>
  <clipPath id="ringFront"><rect x="700" y="78" width="180" height="60"/></clipPath>
  <style>${baseStyle}
    .shoot{animation:sh 7s ease-in infinite}
    @keyframes sh{0%{transform:translate(0,0);opacity:0}3%{opacity:1}14%{transform:translate(260px,110px);opacity:0}100%{transform:translate(260px,110px);opacity:0}}
    .float{animation:fl 5s ease-in-out infinite}
    @keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    .flame{animation:fm .25s ease-in-out infinite alternate}
    @keyframes fm{from{opacity:.6}to{opacity:1}}
  </style>
</defs>
<g clip-path="url(#round)">
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <ellipse cx="260" cy="90" rx="260" ry="120" fill="url(#neb1)"/>
  <ellipse cx="640" cy="200" rx="240" ry="110" fill="url(#neb2)"/>
  ${stars(W, H, 150, 7, 250)}

  <g class="shoot"><line x1="120" y1="30" x2="190" y2="58" stroke="url(#trail)" stroke-width="2" stroke-linecap="round"/></g>

  <!-- moon -->
  <circle cx="92" cy="112" r="11" fill="#cbd5e1"/>
  <circle cx="88" cy="109" r="2.5" fill="#94a3b8"/><circle cx="96" cy="116" r="1.8" fill="#94a3b8"/>

  <!-- ringed planet -->
  <circle cx="790" cy="78" r="90" fill="url(#glow)"/>
  <g transform="rotate(-18 790 78)">
    <ellipse cx="790" cy="78" rx="72" ry="14" fill="none" stroke="#fcd34d" stroke-width="3" opacity=".45"/>
    <circle cx="790" cy="78" r="40" fill="url(#planet)"/>
    <path d="M752,70 Q790,62 828,70" fill="none" stroke="#7c2d12" stroke-width="3" opacity=".35"/>
    <path d="M755,90 Q790,84 826,92" fill="none" stroke="#7c2d12" stroke-width="2" opacity=".3"/>
    <ellipse cx="790" cy="78" rx="72" ry="14" fill="none" stroke="#fcd34d" stroke-width="3" opacity=".85" clip-path="url(#ringFront)"/>
  </g>

  <!-- horizon -->
  <ellipse cx="450" cy="520" rx="700" ry="280" fill="url(#ground)" stroke="${C.cyan}" stroke-width="1.5" stroke-opacity=".55"/>
  <ellipse cx="450" cy="520" rx="702" ry="283" fill="none" stroke="${C.violet}" stroke-width="6" stroke-opacity=".15"/>

  <!-- rocket -->
  <g transform="translate(150 196) rotate(40)">
    <g class="float">
      <path class="flame" d="M-4.5,14 Q0,34 4.5,14Z" fill="${C.amber}"/>
      <path d="M-2.5,14 Q0,26 2.5,14Z" fill="#fff"/>
      <path d="M-6,6 L-13,17 L-6,14Z" fill="${C.violet}"/>
      <path d="M6,6 L13,17 L6,14Z" fill="${C.violet}"/>
      <path d="M0,-22 C8,-14 8,6 6,14 L-6,14 C-8,6 -8,-14 0,-22Z" fill="#e2e8f0"/>
      <circle cx="0" cy="-5" r="3.6" fill="${C.cyan}" stroke="#334155" stroke-width="1.5"/>
    </g>
  </g>

  <!-- HUD -->
  <circle class="blink" cx="34" cy="32" r="4" fill="${C.green}"/>
  <text x="46" y="36" font-family="${MONO}" font-size="11" letter-spacing="2" fill="${C.cyan}">TRANSMISSION LIVE</text>

  <text x="450" y="86" text-anchor="middle" font-family="${MONO}" font-size="12" letter-spacing="6" fill="${C.violet}">COMMANDER</text>
  <text x="450" y="138" text-anchor="middle" font-family="${SANS}" font-size="56" font-weight="800" letter-spacing="10" fill="url(#title)">${esc(profile.name)}</text>
  <line x1="300" y1="160" x2="420" y2="160" stroke="${C.cyan}" stroke-opacity=".6"/>
  <line x1="480" y1="160" x2="600" y2="160" stroke="${C.cyan}" stroke-opacity=".6"/>
  <circle cx="450" cy="160" r="6" fill="none" stroke="${C.cyan}"/>
  <circle cx="450" cy="160" r="2" fill="${C.cyan}"/>
  <circle cx="432" cy="160" r="1.6" fill="${C.cyan}"/><circle cx="468" cy="160" r="1.6" fill="${C.cyan}"/>
  <text x="450" y="194" text-anchor="middle" font-family="${SANS}" font-size="17" fill="${C.soft}">${esc(profile.subtitle)}</text>

  <text x="46" y="54" font-family="${MONO}" font-size="10" letter-spacing="2" fill="${C.dim}">${esc(profile.coords)}</text>
  <text x="872" y="264" text-anchor="end" font-family="${MONO}" font-size="10" letter-spacing="2" fill="${C.dim}">ORBIT STABLE</text>
</g>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="16" fill="none" stroke="${C.line}"/>
</svg>
`;
}

function briefing() {
  const W = 900, H = 360;
  const fieldRows = [...profile.fields, ["STATUS", null]]
    .map(([label, value], i) => {
      const y = 186 + i * 34;
      const val =
        value === null
          ? `<circle class="blink" cx="166" cy="${y - 5}" r="4" fill="${C.green}"/>
             <text x="178" y="${y}" font-family="${SANS}" font-size="15" font-weight="600" fill="${C.green}">${esc(profile.status)}</text>`
          : `<text x="160" y="${y}" font-family="${SANS}" font-size="15" fill="#e2e8f0">${esc(value)}</text>`;
      return `<text x="40" y="${y}" font-family="${MONO}" font-size="11" letter-spacing="3" fill="${C.dim}">${label}</text>${val}
        <line x1="40" y1="${y + 12}" x2="440" y2="${y + 12}" stroke="#1e293b"/>`;
    })
    .join("\n");

  const systemRows = profile.systems
    .map((s, i) => {
      const y = 122 + i * 58;
      let cells = "";
      for (let c = 0; c < 10; c++) {
        const x = 500 + c * 36;
        const on = c < s.level;
        const cls = on && c === s.level - 1 ? ` class="pulse"` : "";
        cells += `<rect${cls} x="${x}" y="${y + 26}" width="30" height="8" rx="2" fill="${on ? "url(#cell)" : "#1e293b"}"/>`;
      }
      return `<text x="500" y="${y}" font-family="${SANS}" font-size="16" font-weight="700" fill="${C.text}">${esc(s.name)}</text>
        <text x="500" y="${y + 17}" font-family="${MONO}" font-size="11" fill="${C.muted}">${esc(s.stack)}</text>
        <text x="854" y="${y}" text-anchor="end" font-family="${MONO}" font-size="10" letter-spacing="2" fill="${C.green}">ONLINE</text>
        ${cells}`;
    })
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${C.bg1}"/><stop offset="1" stop-color="#120d33"/>
  </linearGradient>
  <linearGradient id="cell" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="${C.cyan}"/><stop offset="1" stop-color="${C.violet}"/>
  </linearGradient>
  <linearGradient id="visor" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${C.cyan}"/><stop offset="1" stop-color="#6d28d9"/>
  </linearGradient>
  <clipPath id="round"><rect width="${W}" height="${H}" rx="16"/></clipPath>
  <style>${baseStyle}</style>
</defs>
<g clip-path="url(#round)">
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${stars(W, H, 50, 21)}
</g>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="16" fill="none" stroke="${C.line}"/>
${corners(14, 14, W - 28, H - 28)}

<text x="450" y="46" text-anchor="middle" font-family="${MONO}" font-size="13" font-weight="700" letter-spacing="5" fill="${C.cyan}">— MISSION BRIEFING —</text>

<!-- helmet -->
<circle class="spin" cx="84" cy="106" r="46" fill="none" stroke="${C.violet}" stroke-dasharray="3 6" opacity=".6"/>
<line x1="84" y1="68" x2="84" y2="58" stroke="${C.soft}" stroke-width="2"/>
<circle class="blink" cx="84" cy="56" r="3" fill="${C.amber}"/>
<circle cx="84" cy="106" r="36" fill="#1e1b4b" stroke="${C.soft}" stroke-width="2.5"/>
<rect x="60" y="90" width="48" height="30" rx="14" fill="url(#visor)" opacity=".9"/>
<path d="M68,97 Q74,93 82,94" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>

<text x="146" y="104" font-family="${SANS}" font-size="30" font-weight="800" letter-spacing="3" fill="${C.text}">${esc(profile.name)}</text>
<text x="147" y="130" font-family="${SANS}" font-size="15" font-style="italic" fill="${C.violet}">${esc(profile.role)}</text>

${fieldRows}

<line x1="470" y1="76" x2="470" y2="330" stroke="${C.line}"/>
<text x="500" y="88" font-family="${MONO}" font-size="11" font-weight="700" letter-spacing="4" fill="${C.cyan}">SHIP SYSTEMS</text>
${systemRows}
</svg>
`;
}

function missionLog() {
  const W = 900;
  const rowH = 100, gap = 16, top = 70;
  const slotY = top + missions.length * (rowH + gap);
  const H = slotY + 44 + 30;

  const rows = missions
    .map((m, i) => {
      const y = top + i * (rowH + gap);
      const cy = y + 50;
      const done = m.status === "LANDED";
      const color = done ? C.green : C.amber;
      const x0 = 145, x1 = 680;
      const rx = x0 + (x1 - x0) * Math.max(0, Math.min(1, m.progress ?? (done ? 1 : 0.5)));
      const num = String(i + 1).padStart(2, "0");
      return `<rect x="30" y="${y}" width="840" height="${rowH}" rx="12" fill="${C.panel}" stroke="${C.line}"/>
  <circle class="spin" cx="90" cy="${cy}" r="38" fill="none" stroke="${color}" stroke-dasharray="2 5" opacity=".6"/>
  <circle cx="90" cy="${cy}" r="30" fill="#1e1b4b" stroke="${color}" stroke-width="2"/>
  <text x="90" y="${cy - 6}" text-anchor="middle" font-family="${MONO}" font-size="8" letter-spacing="2" fill="${C.muted}">MISSION</text>
  <text x="90" y="${cy + 13}" text-anchor="middle" font-family="${MONO}" font-size="18" font-weight="700" fill="${color}">${num}</text>
  <text x="${x0}" y="${y + 38}" font-family="${SANS}" font-size="17" font-weight="700" letter-spacing="1.5" fill="${C.text}">${esc(m.name.toUpperCase())}</text>
  <text x="${x0}" y="${y + 62}" font-family="${SANS}" font-size="14" fill="${C.muted}">${esc(m.description)}</text>
  <line x1="${x0}" y1="${y + 80}" x2="${x1}" y2="${y + 80}" stroke="${C.line}" stroke-width="2" stroke-dasharray="4 5"/>
  <line x1="${x0}" y1="${y + 80}" x2="${rx}" y2="${y + 80}" stroke="url(#traj)" stroke-width="2.5"/>
  <circle class="pulse" cx="${rx}" cy="${y + 80}" r="7" fill="${color}" opacity=".35"/>
  <circle cx="${rx}" cy="${y + 80}" r="3.5" fill="${color}"/>
  <circle cx="${x1}" cy="${y + 80}" r="4" fill="none" stroke="${C.muted}"/>
  <rect x="716" y="${cy - 14}" width="130" height="28" rx="14" fill="none" stroke="${color}"/>
  <circle class="${done ? "" : "blink"}" cx="738" cy="${cy}" r="4" fill="${color}"/>
  <text x="790" y="${cy + 4}" text-anchor="middle" font-family="${MONO}" font-size="11" font-weight="700" letter-spacing="2" fill="${color}">${esc(m.status)}</text>`;
    })
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${C.bg1}"/><stop offset="1" stop-color="#120d33"/>
  </linearGradient>
  <linearGradient id="traj" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="${C.violet}"/><stop offset="1" stop-color="${C.cyan}"/>
  </linearGradient>
  <clipPath id="round"><rect width="${W}" height="${H}" rx="16"/></clipPath>
  <style>${baseStyle}</style>
</defs>
<g clip-path="url(#round)">
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${stars(W, H, 40, 42)}
</g>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="16" fill="none" stroke="${C.line}"/>
${corners(14, 14, W - 28, H - 28)}

<text x="450" y="46" text-anchor="middle" font-family="${MONO}" font-size="13" font-weight="700" letter-spacing="5" fill="${C.cyan}">— MISSION LOG —</text>
${rows}
<rect x="30" y="${slotY}" width="840" height="44" rx="12" fill="none" stroke="${C.line}" stroke-dasharray="6 6"/>
<text x="450" y="${slotY + 27}" text-anchor="middle" font-family="${MONO}" font-size="12" letter-spacing="3" fill="${C.dim}">+ NEXT MISSION — AWAITING LAUNCH</text>
</svg>
`;
}

function divider() {
  const W = 900, H = 40;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <linearGradient id="fadeL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.violet}" stop-opacity="0"/><stop offset="1" stop-color="${C.violet}" stop-opacity=".8"/></linearGradient>
  <linearGradient id="fadeR" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.violet}" stop-opacity=".8"/><stop offset="1" stop-color="${C.violet}" stop-opacity="0"/></linearGradient>
</defs>
<line x1="120" y1="20" x2="420" y2="20" stroke="url(#fadeL)"/>
<line x1="480" y1="20" x2="780" y2="20" stroke="url(#fadeR)"/>
<circle cx="404" cy="20" r="2" fill="${C.cyan}"/><circle cx="496" cy="20" r="2" fill="${C.cyan}"/>
<ellipse cx="450" cy="20" rx="22" ry="5" fill="none" stroke="${C.amber}" stroke-width="1.5" transform="rotate(-15 450 20)" opacity=".8"/>
<circle cx="450" cy="20" r="8" fill="#f59e0b"/>
</svg>
`;
}

const out = __dirname;
fs.writeFileSync(path.join(out, "banner.svg"), banner());
fs.writeFileSync(path.join(out, "mission-briefing.svg"), briefing());
fs.writeFileSync(path.join(out, "mission-log.svg"), missionLog());
fs.writeFileSync(path.join(out, "divider.svg"), divider());
console.log("Built banner.svg, mission-briefing.svg, mission-log.svg, divider.svg");
