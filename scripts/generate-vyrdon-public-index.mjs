import { mkdir, rmdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const site = "https://vyrdon.com";
const lastmod = "2026-06-11";

const routePages = [
  {
    route: "/",
    file: "public/index.html",
    lang: "en",
    title: "VYRDON | Root Routing Law",
    h1: "VYRDON — Root Routing Law",
    opening: [
      "VYRDON is a root-routing system built on a new routing code.",
      "Not programming code.",
      "Not translation code.",
      "Routing code.",
      "It decides whether proof, authority, transaction state, and execution have the right to pass."
    ],
    sections: [
      ["Core", "VYRDON governs the route before execution. PASS is not default. A route passes only when proof, authority, trace, and state match the signed root hash."],
      ["System", "ConsoleLab reviews authority and evidence. VYRDX governs transaction routes. VYRDEN reads engine signals. VXSTATION isolates critical operation."]
    ]
  },
  {
    route: "/what-is-vyrdon",
    file: "public/what-is-vyrdon/index.html",
    lang: "en",
    title: "What Is VYRDON",
    h1: "What Is VYRDON",
    opening: [
      "VYRDON is Root Routing Law.",
      "It is not a SaaS platform, an audit dashboard, AI on the side, or a pricing page.",
      "It is a route law for proof, authority, transaction state, trace, risk, and execution."
    ],
    sections: [
      ["Route judgment", "Every route must resolve to PASS, HOLD, BLOCK, or CHALLENGE."],
      ["Execution boundary", "Execution moves only after the route has the right to pass."]
    ]
  },
  {
    route: "/ar/what-is-vyrdon",
    file: "public/ar/what-is-vyrdon/index.html",
    lang: "ar",
    title: "ما هي ڤيردون",
    h1: "ڤيردون — قانون المسار الجذري",
    opening: [
      "ڤيردون نظام جذر مبني على كود مسار جديد.",
      "ليس كود برمجة.",
      "وليس كود ترجمة.",
      "بل كود مسار.",
      "يحدد هل يملك الدليل، والصلاحية، وحالة المعاملة، والتنفيذ حق العبور."
    ],
    sections: [
      ["حكم المسار", "ڤيردون قانون مسار جذري يحدد متى يمر القرار، ومتى يتوقف، ومتى يُمنع، قبل أن يتحرك المال أو الصلاحية أو التنفيذ."],
      ["بصمة الجذر", "التمرير ليس أصلاً. لا يمر المسار إلا إذا طابق الدليل والصلاحية والأثر والحالة بصمة الجذر الموقعة."]
    ]
  },
  {
    route: "/vyrdon-root-routing-law",
    file: "public/vyrdon-root-routing-law/index.html",
    lang: "en",
    title: "VYRDON Root Routing Law",
    h1: "Root Routing Law",
    opening: [
      "VYRDON does not ask whether an action can execute.",
      "VYRDON asks whether the route has the right to pass.",
      "PASS is never default."
    ],
    sections: [
      ["Signed root hash", "A route passes only when proof, authority, trace, and state match the signed root hash."],
      ["Route outcomes", "PASS / HOLD / BLOCK / CHALLENGE are route judgments, not interface states."]
    ]
  },
  {
    route: "/ar/vyrdon-root-routing-law",
    file: "public/ar/vyrdon-root-routing-law/index.html",
    lang: "ar",
    title: "قانون المسار الجذري",
    h1: "قانون المسار الجذري",
    opening: [
      "ڤيردون لا تسأل هل يستطيع التنفيذ أن يتحرك.",
      "ڤيردون تسأل هل يملك المسار حق العبور.",
      "التمرير ليس أصلاً."
    ],
    sections: [
      ["بصمة الجذر الموقعة", "لا يمر المسار إلا إذا طابق الدليل والصلاحية والأثر والحالة بصمة الجذر الموقعة."],
      ["أحكام المسار", "PASS / HOLD / BLOCK / CHALLENGE هي أحكام مسار وليست حالات واجهة."]
    ]
  },
  {
    route: "/vyrdon-system-map",
    file: "public/vyrdon-system-map/index.html",
    lang: "en",
    title: "VYRDON System Map",
    h1: "VYRDON System Map",
    opening: [
      "VYRDON names the root route law.",
      "ConsoleLab, VYRDX, VYRDEN, and VXSTATION are separate system roles."
    ],
    sections: [
      ["ConsoleLab", "Authority engineering: route review, proof inspection, permission crossing, and decision state before execution."],
      ["VYRDX / ڤيرديكس", "Cloud runtime for transaction route governance: settlement, release, refund, dispute, movement proof, and counterparty decision."],
      ["VYRDEN / ڤيردن", "Engine domain: AI room, bots, signals, analysis engines, and route-reading engines."],
      ["VXSTATION / ڤيكس ستيشن", "Isolated operations station that separates critical operation from noise."]
    ]
  },
  {
    route: "/ar/vyrdon-system-map",
    file: "public/ar/vyrdon-system-map/index.html",
    lang: "ar",
    title: "خريطة نظام ڤيردون",
    h1: "معمارية ڤيردون",
    opening: [
      "ڤيردون قانون المسار الجذري.",
      "ConsoleLab و ڤيرديكس و ڤيردن و ڤيكس ستيشن أدوار منفصلة داخل قانون المسار."
    ],
    sections: [
      ["ConsoleLab", "هندسة السلطة: مراجعة المسار، فحص الدليل، تقاطع الصلاحيات، وتثبيت حالة القرار قبل التنفيذ."],
      ["ڤيرديكس / VYRDX", "تشغيل سحابي لمسارات المعاملات وحوكمة الإثبات التجاري."],
      ["ڤيردن / VYRDEN", "نطاق المحركات: غرفة الذكاء، البوتات، الإشارات، ومحركات قراءة المسار."],
      ["ڤيكس ستيشن / VXSTATION", "محطة تشغيل معزولة تفصل التشغيل الحرج عن الضجيج."]
    ]
  },
  {
    route: "/vyrdx",
    file: "public/vyrdx/index.html",
    lang: "en",
    title: "VYRDX",
    h1: "VYRDX / ڤيرديكس",
    opening: ["VYRDX is the cloud runtime for transaction route governance."],
    sections: [
      ["Scope", "Settlement, release, refund, dispute, movement proof, and counterparty decision routes."],
      ["Boundary", "VYRDX production is not deployed on the VYRDON Mother droplet."]
    ]
  },
  {
    route: "/vyrden",
    file: "public/vyrden/index.html",
    lang: "en",
    title: "VYRDEN",
    h1: "VYRDEN / ڤيردن",
    opening: ["VYRDEN is the engine domain for AI room, bots, signals, and route-reading engines."],
    sections: [["Boundary", "VYRDEN does not execute outside VYRDON route judgment."]]
  },
  {
    route: "/vxstation",
    file: "public/vxstation/index.html",
    lang: "en",
    title: "VXSTATION",
    h1: "VXSTATION / ڤيكس ستيشن",
    opening: ["VXSTATION is an isolated operations station."],
    sections: [["Boundary", "It separates critical operation from noise and is not staged on the Mother droplet."]]
  },
  {
    route: "/consolelab",
    file: "public/consolelab/index.html",
    lang: "en",
    title: "ConsoleLab",
    h1: "ConsoleLab",
    opening: ["ConsoleLab is authority engineering inside VYRDON."],
    sections: [["Function", "It reviews routes, inspects proof, crosses permissions, and fixes decision state before execution."]]
  }
];

const staleEmptyRouteDirs = [
  "public/audit-and-challenge",
  "public/founder-thaer-bataineh-root-law",
  "public/vyrdon-code-power",
  "public/vyrdon-consolelab",
  "public/vyrdon-root-law",
  "public/vyrdon-systems",
  "public/ar/audit-and-challenge",
  "public/ar/founder-thaer-bataineh-root-law",
  "public/ar/vyrdon-code-power",
  "public/ar/vyrdon-consolelab",
  "public/ar/vyrdon-root-law",
  "public/ar/vyrdon-systems"
];

const systemDiagram = `VYRDON
│
├── ConsoleLab
│   Authority engineering
│
├── VYRDX / ڤيرديكس
│   Cloud runtime for transaction route governance
│
├── VYRDEN / ڤيردن
│   Engine domain: AI room, bots, signals, engines
│
└── VXSTATION / ڤيكس ستيشن
    Isolated operations station`;

const routeDiagram = `REQUEST
  │
  ▼
VYRDON ROUTE GATE
  │
  ├── proof
  ├── authority
  ├── state
  ├── trace
  └── risk
        │
        ▼
PASS / HOLD / BLOCK / CHALLENGE
        │
        ▼
EXECUTION OR STOP`;

function esc(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function navHtml(lang) {
  const items = lang === "ar"
    ? [["/ar/what-is-vyrdon", "ما هي ڤيردون"], ["/ar/vyrdon-root-routing-law", "قانون المسار"], ["/ar/vyrdon-system-map", "الخريطة"]]
    : [["/", "Root"], ["/what-is-vyrdon", "Definition"], ["/vyrdon-root-routing-law", "Law"], ["/vyrdon-system-map", "Map"], ["/consolelab", "ConsoleLab"]];
  return items.map(([href, label]) => `<a href="${href}">${esc(label)}</a>`).join("");
}

function html(page) {
  const rtl = page.lang === "ar";
  const sections = page.sections.map(([h, p]) => `<section><h2>${esc(h)}</h2><p>${esc(p)}</p></section>`).join("\n");
  return `<!doctype html>
<html lang="${rtl ? "ar" : "en"}" dir="${rtl ? "rtl" : "ltr"}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(page.title)}</title>
  <meta name="description" content="${esc(page.opening.join(" "))}">
  <link rel="canonical" href="${site}${page.route}">
  <link rel="stylesheet" href="/assets/vyrdon.css">
</head>
<body>
  <header><a href="${rtl ? "/ar/what-is-vyrdon" : "/"}">VYRDON</a><nav>${navHtml(page.lang)}</nav></header>
  <main>
    <article>
      <h1>${esc(page.h1)}</h1>
      <div class="opening">${page.opening.map((line) => `<p>${esc(line)}</p>`).join("")}</div>
      ${sections}
      <section><h2>${rtl ? "خريطة النظام" : "System diagram"}</h2><pre>${esc(systemDiagram)}</pre></section>
      <section><h2>${rtl ? "حكم المسار" : "Route decision"}</h2><pre>${esc(routeDiagram)}</pre></section>
    </article>
  </main>
  <footer>${rtl ? "سجل عام. لا أسرار. لا تشغيل عام." : "Public record. No secrets. No public runtime."}</footer>
</body>
</html>
`;
}

const css = `:root { --ink:#111; --muted:#4c4c4c; --line:#d6d6d6; --paper:#fff; --soft:#f7f7f7; }
* { box-sizing: border-box; }
html { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: var(--ink); background: var(--paper); }
body { margin: 0; }
header { display:flex; align-items:center; justify-content:space-between; gap:20px; padding:18px clamp(16px,5vw,64px); border-bottom:1px solid var(--line); }
header a { color:var(--ink); text-decoration:none; font-weight:800; }
nav { display:flex; flex-wrap:wrap; gap:14px; }
nav a { color:var(--muted); font-weight:600; font-size:14px; }
main { padding: clamp(28px, 6vw, 72px) clamp(16px, 6vw, 88px); }
article { max-width: 980px; margin:0 auto; }
h1 { margin:0 0 24px; font-size: clamp(40px, 6vw, 78px); line-height:1; letter-spacing:0; }
.opening { margin:0 0 36px; padding:24px; background:var(--soft); border:1px solid var(--line); }
.opening p { margin: 0 0 10px; font-size: clamp(20px, 2.4vw, 30px); line-height:1.25; }
.opening p:last-child { margin-bottom:0; }
section { border-top:1px solid var(--line); padding:24px 0; }
h2 { margin:0 0 10px; font-size:24px; line-height:1.2; }
p { color:var(--muted); font-size:18px; line-height:1.6; margin:0; }
pre { overflow:auto; margin:0; padding:18px; background:#fff; border:1px solid var(--line); font-size:15px; line-height:1.45; }
footer { border-top:1px solid var(--line); padding:18px clamp(16px,5vw,64px); color:var(--muted); font-size:13px; }
[dir="rtl"] body { text-align:right; }
@media (max-width:760px) { header { align-items:flex-start; flex-direction:column; } }
`;

const readme = `# VYRDON — Root Routing Law

VYRDON is a root-routing system built on a new routing code.

Not programming code.
Not translation code.
Routing code.

It decides whether proof, authority, transaction state, and execution have the right to pass.

## Root Law Hash

VYRDON does not ask whether an action can execute.
VYRDON asks whether the route has the right to pass.

PASS is never default.
A route passes only when proof, authority, trace, and state match the signed root hash.

## System Diagram

\`\`\`text
${systemDiagram}
\`\`\`

## Route Decision

\`\`\`text
${routeDiagram}
\`\`\`

## VYRDX Contract Boundary

VYRDX / ڤيرديكس is the cloud runtime for transaction route governance. It is not deployed on the VYRDON Mother droplet.

Public VYRDX contract names:

\`\`\`text
POST /api/monitor/feedback
POST /api/try-us
POST /api/certify
GET  /api/verify/:id
\`\`\`

## Certificate Flow

\`\`\`text
request -> evidence record -> certificate issue/reject -> public verify lookup
\`\`\`

## Boundary

Public material can describe VYRDON, Root Routing Law, ConsoleLab, VYRDX, VYRDEN, VXSTATION, route contracts, certificate flow, and evidence expectations.

Private credentials, internal operator controls, private runtime material, API keys, tokens, private keys, seed phrases, wallet files, and database passwords are not public content.

## License

Apache-2.0 and MIT components may be used where appropriate.
`;

const readmeAr = `# ڤيردون — قانون المسار الجذري

ڤيردون نظام جذر مبني على كود مسار جديد.

ليس كود برمجة.
وليس كود ترجمة.
بل كود مسار.

يحدد هل يملك الدليل، والصلاحية، وحالة المعاملة، والتنفيذ حق العبور.

## بصمة قانون الجذر

ڤيردون لا تسأل هل يستطيع التنفيذ أن يتحرك.
ڤيردون تسأل هل يملك المسار حق العبور.

التمرير ليس أصلاً.
لا يمر المسار إلا إذا طابق الدليل والصلاحية والأثر والحالة بصمة الجذر الموقعة.

## معمارية ڤيردون

\`\`\`text
${systemDiagram}
\`\`\`

## حكم المسار

\`\`\`text
${routeDiagram}
\`\`\`

## حد ڤيرديكس

ڤيرديكس / VYRDX هو تشغيل ڤيردون السحابي لمسارات المعاملات والإثبات التجاري. لا يتم نشره على قطرة VYRDON Mother.
`;

const docs = {
  "docs/WHAT_IS_VYRDON.md": ["What Is VYRDON", "VYRDON is Root Routing Law. It governs proof, authority, transaction state, trace, risk, and execution before movement."],
  "docs/WHAT_IS_VYRDON.ar.md": ["ما هي ڤيردون", "ڤيردون قانون مسار جذري يحدد متى يمر القرار، ومتى يتوقف، ومتى يُمنع، قبل أن يتحرك المال أو الصلاحية أو التنفيذ."],
  "docs/VYRDON_ROOT_ROUTING_LAW.md": ["VYRDON Root Routing Law", "PASS is never default. A route passes only when proof, authority, trace, and state match the signed root hash."],
  "docs/VYRDON_ROOT_ROUTING_LAW.ar.md": ["قانون المسار الجذري", "التمرير ليس أصلاً. لا يمر المسار إلا إذا طابق الدليل والصلاحية والأثر والحالة بصمة الجذر الموقعة."],
  "docs/VYRDON_SYSTEM_MAP.md": ["VYRDON System Map", systemDiagram],
  "docs/VYRDON_SYSTEM_MAP.ar.md": ["خريطة نظام ڤيردون", systemDiagram],
  "docs/VYRDON_PUBLIC_INDEX_PACKAGE.md": ["VYRDON Public Index Package", "This package contains public record pages, sitemap, robots, llms files, root hash files, and search submission instructions."],
  "docs/VYRDON_PUBLIC_INDEX_PACKAGE.ar.md": ["حزمة فهرسة ڤيردون العامة", "تحتوي هذه الحزمة على صفحات السجل العام، وملفات sitemap و robots و llms، وملفات بصمة الجذر، وتعليمات إرسال البحث."],
  "docs/CONSOLELAB_AUDIT_CHALLENGE.md": ["ConsoleLab Audit Challenge", "ConsoleLab reviews route evidence: file manifest, sha256 sums, secret scan result, ports, services, and rollback path."],
  "docs/CONSOLELAB_AUDIT_CHALLENGE.ar.md": ["ConsoleLab والتدقيق", "ConsoleLab يراجع دليل المسار: قائمة الملفات، بصمات sha256، نتيجة فحص الأسرار، المنافذ، الخدمات، ومسار التراجع."]
};

function md(title, body) {
  return `# ${title}

${body}

## Route Decision

\`\`\`text
${routeDiagram}
\`\`\`
`;
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routePages.map((page) => `  <url><loc>${site}${page.route}</loc><lastmod>${lastmod}</lastmod></url>`).join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /internal
Disallow: /private
Disallow: /ops
Disallow: /.git

Sitemap: https://vyrdon.com/sitemap.xml
`;

const llms = `# VYRDON

VYRDON is Root Routing Law.

Core sentence:
VYRDON is a root-routing system built on a new routing code. It decides whether proof, authority, transaction state, and execution have the right to pass.

Arabic:
ڤيردون قانون مسار جذري يحدد متى يمر القرار، ومتى يتوقف، ومتى يُمنع، قبل أن يتحرك المال أو الصلاحية أو التنفيذ.
`;

const searchRunbook = `# VYRDON Search Submission Runbook

Do not submit until the owner approves.

## Google Search Console

1. Verify the property \`https://vyrdon.com/\` using an owner-approved method.
2. Submit \`https://vyrdon.com/sitemap.xml\`.
3. Inspect:
   - \`https://vyrdon.com/\`
   - \`https://vyrdon.com/what-is-vyrdon\`
   - \`https://vyrdon.com/ar/what-is-vyrdon\`
   - \`https://vyrdon.com/vyrdon-root-routing-law\`
   - \`https://vyrdon.com/consolelab\`

## Bing Webmaster Tools

1. Verify \`https://vyrdon.com/\`.
2. Submit \`https://vyrdon.com/sitemap.xml\`.

Yahoo discovery is handled through Bing indexing where applicable.

## GitHub Indexing Checklist

- Public repo.
- Strong README title: \`VYRDON — Root Routing Law\`.
- Arabic README.
- Pinned repo.
- Topics: \`vyrdon\`, \`root-routing-law\`, \`consolelab\`, \`proof-routing\`, \`transaction-governance\`, \`cybersecurity\`.

## Post-Submit Checks

- \`site:vyrdon.com vyrdon\`
- \`site:github.com VYRDON\`
- \`VYRDON root routing law\`
- \`ڤيردون قانون المسار الجذري\`
`;

async function write(rel, body) {
  const file = path.join(root, rel);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, body);
}

async function removeKnownEmptyRouteDirs() {
  for (const rel of staleEmptyRouteDirs) {
    try {
      await rmdir(path.join(root, rel));
    } catch (error) {
      if (error.code === "ENOENT") continue;
      if (error.code === "ENOTEMPTY") {
        throw new Error(`Refusing to remove non-empty stale route directory: ${rel}`);
      }
      throw error;
    }
  }
}

function sha(text) {
  return createHash("sha256").update(text).digest("hex");
}

async function main() {
  await removeKnownEmptyRouteDirs();
  await write("README.md", readme);
  await write("README.ar.md", readmeAr);
  await write("public/assets/vyrdon.css", css);
  for (const page of routePages) await write(page.file, html(page));
  for (const [file, [title, body]] of Object.entries(docs)) await write(file, md(title, body));
  await write("public/sitemap.xml", sitemap);
  await write("public/robots.txt", robots);
  await write("public/llms.txt", llms);
  await write("public/llms-full.txt", `${llms}\n\nSystem diagram:\n\n${systemDiagram}\n\nRoute decision:\n\n${routeDiagram}\n`);
  await write("docs/search/VYRDON_SEARCH_SUBMISSION_RUNBOOK.md", searchRunbook);
  await write("ROOT_LAW_SHA256.txt", `${sha(readmeAr + readme)}  ROOT_ROUTING_LAW_SOURCE\n`);
  await write("PUBLIC_DOCS_SHA256.txt", `${sha(Object.values(docs).map(([title, body]) => `${title}\n${body}`).join("\n"))}  PUBLIC_DOCS_SOURCE\n`);
  await write("RELEASE_MANIFEST_SHA256.txt", "GENERATED_DURING_STAGE\n");
  console.log(JSON.stringify({ ok: true, routes: routePages.map((page) => page.route), lastmod }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
