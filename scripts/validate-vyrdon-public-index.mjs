import { existsSync, readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const site = "https://vyrdon.com";

const enRoutes = [
  "/",
  "/what-is-vyrdon",
  "/vyrdon-root-routing-law",
  "/vyrdon-system-map",
  "/vyrdx",
  "/vyrden",
  "/vxstation",
  "/consolelab"
];

const arRoutes = [
  "/ar/what-is-vyrdon",
  "/ar/vyrdon-root-routing-law",
  "/ar/vyrdon-system-map"
];

const requiredDocs = [
  "README.md",
  "README.ar.md",
  "docs/WHAT_IS_VYRDON.md",
  "docs/WHAT_IS_VYRDON.ar.md",
  "docs/VYRDON_ROOT_ROUTING_LAW.md",
  "docs/VYRDON_ROOT_ROUTING_LAW.ar.md",
  "docs/VYRDON_SYSTEM_MAP.md",
  "docs/VYRDON_SYSTEM_MAP.ar.md",
  "docs/VYRDON_PUBLIC_INDEX_PACKAGE.md",
  "docs/VYRDON_PUBLIC_INDEX_PACKAGE.ar.md",
  "docs/search/VYRDON_SEARCH_SUBMISSION_RUNBOOK.md"
];

function fileForRoute(route) {
  if (route === "/") return "public/index.html";
  if (route === "/ar/") return "public/ar/index.html";
  return path.join("public", route.replace(/^\//, ""), "index.html");
}

function read(rel) {
  return readFileSync(path.join(root, rel), "utf8");
}

function pass(name, details = {}) {
  return { name, ok: true, details };
}

function fail(name, details = {}) {
  return { name, ok: false, details };
}

async function walk(dir) {
  const out = [];
  if (!existsSync(path.join(root, dir))) return out;
  for (const entry of await readdir(path.join(root, dir), { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(rel));
    else out.push(rel);
  }
  return out;
}

async function main() {
  const checks = [];
  const routes = [...enRoutes, ...arRoutes];
  const routeFiles = routes.map((route) => fileForRoute(route));
  const missingRoutes = routeFiles.filter((file) => !existsSync(path.join(root, file)));
  checks.push(missingRoutes.length ? fail("route files exist", { missing: missingRoutes }) : pass("route files exist", { routes }));

  const missingDocs = requiredDocs.filter((file) => !existsSync(path.join(root, file)));
  checks.push(missingDocs.length ? fail("public docs exist", { missing: missingDocs }) : pass("public docs exist"));

  const arabicBad = arRoutes
    .map((route) => fileForRoute(route))
    .filter((file) => {
      if (!existsSync(path.join(root, file))) return true;
      const html = read(file);
      return !/<html lang="ar" dir="rtl">/.test(html);
    });
  checks.push(arabicBad.length ? fail("Arabic routes render RTL", { files: arabicBad }) : pass("Arabic routes render RTL"));

  const sitemap = read("public/sitemap.xml");
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const expectedUrls = routes.map((route) => `${site}${route}`);
  const missingSitemap = expectedUrls.filter((url) => !sitemapUrls.includes(url));
  const staleSitemap = sitemapUrls.filter((url) => !expectedUrls.includes(url) || !url.startsWith(site));
  checks.push(missingSitemap.length || staleSitemap.length
    ? fail("sitemap has canonical public URLs only", { missing: missingSitemap, stale: staleSitemap })
    : pass("sitemap has canonical public URLs only", { count: sitemapUrls.length }));
  checks.push(/^<\?xml version="1\.0" encoding="UTF-8"\?>/.test(sitemap)
    ? pass("sitemap XML UTF-8 header")
    : fail("sitemap XML UTF-8 header"));

  const robots = read("public/robots.txt");
  checks.push(robots.includes("Sitemap: https://vyrdon.com/sitemap.xml")
    ? pass("robots includes sitemap")
    : fail("robots includes sitemap"));

  const requiredHashFiles = ["ROOT_LAW_SHA256.txt", "RELEASE_MANIFEST_SHA256.txt", "PUBLIC_DOCS_SHA256.txt"];
  const missingHashFiles = requiredHashFiles.filter((file) => !existsSync(path.join(root, file)));
  checks.push(missingHashFiles.length ? fail("root-law hash files exist", { missing: missingHashFiles }) : pass("root-law hash files exist"));

  const publicTextFiles = [
    ...routeFiles,
    "public/robots.txt",
    "public/llms.txt",
    "public/llms-full.txt",
    "public/site.webmanifest",
    ...requiredDocs
  ];
  const text = publicTextFiles
    .filter((file) => existsSync(path.join(root, file)))
    .map((file) => `${file}\n${read(file)}`)
    .join("\n");
  const placeholderHits = [...text.matchAll(/\b(TODO|FIXME|lorem ipsum|placeholder)\b/gi)].map((m) => m[0]);
  checks.push(placeholderHits.length ? fail("no placeholders", { hits: placeholderHits }) : pass("no placeholders"));

  const pageText = routeFiles
    .filter((file) => existsSync(path.join(root, file)))
    .map((file) => read(file))
    .join("\n");
  checks.push(/\b(price|subscription|checkout)\b/i.test(pageText) ? fail("no commercial terms on public pages") : pass("no commercial terms on public pages"));

  const marketingPatterns = [
    /\bmarketing\b/i,
    /\blanding\s+page\b/i,
    /\bhero\b/i,
    /\bCTA\b/i,
    /\bcall\s+to\s+action\b/i,
    /\btrusted\b/i,
    /\bbest[-\s]?in[-\s]?class\b/i,
    /\brevolutionary\b/i,
    /\bunmatched\b/i,
    /\bworld[-\s]?class\b/i,
    /\bclean,\s*authoritative\b/i
  ];
  const marketingHits = marketingPatterns.filter((pattern) => pattern.test(text)).map(String);
  checks.push(marketingHits.length
    ? fail("no marketing language", { patterns: marketingHits })
    : pass("no marketing language"));

  const falseClaims = [
    /officially sponsored by/i,
    /government approved/i,
    /legally certified regulator/i,
    /guaranteed return/i,
    /custody of assets/i
  ].filter((pattern) => pattern.test(text)).map(String);
  checks.push(falseClaims.length ? fail("no false sponsorship/regulatory/guarantee claims", { patterns: falseClaims }) : pass("no false sponsorship/regulatory/guarantee claims"));

  const secretValuePatterns = [
    new RegExp("-----BEGIN [A-Z0-9 ]*PRIV" + "ATE KEY-----"),
    new RegExp("A" + "KIA[0-9A-Z]{16}"),
    /ASIA[0-9A-Z]{16}/,
    /gh[pousr]_[A-Za-z0-9_]{30,}/,
    new RegExp("xo" + "x[baprs]-[A-Za-z0-9-]{20,}"),
    /sk-(live|test|proj)-[A-Za-z0-9_-]{20,}/
  ];
  const secretHits = secretValuePatterns.filter((pattern) => pattern.test(text)).map(String);
  checks.push(secretHits.length ? fail("no secret scan findings", { patterns: secretHits }) : pass("no secret scan findings"));

  const publicFiles = await walk("public");
  const docsFiles = await walk("docs");
  const generatedFiles = [...publicFiles, ...docsFiles, "README.md", "README.ar.md"].filter((file) => existsSync(path.join(root, file)));
  checks.push(generatedFiles.length ? pass("generated public/search files enumerable", { count: generatedFiles.length }) : fail("generated public/search files enumerable"));

  const ok = checks.every((check) => check.ok);
  console.log(JSON.stringify({ ok, routes, checks }, null, 2));
  if (!ok) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
