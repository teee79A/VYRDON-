import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const evidenceDir = path.join(root, "evidence", "repo-public-surface");
const wikiPages = [
  "Home.md",
  "VYRDX-Runtime.md",
  "Certificate-Flow.md",
  "Evidence-and-Tracking.md",
  "API-Contract.md",
  "Operator-Runbook.md",
  "License-and-Open-Source.md"
];

const requiredReadmeTerms = [
  { label: "VYRDX", pattern: /VYRDX/ },
  { label: "certificate flow", pattern: /certificate flow/i },
  { label: "feedback API", pattern: /POST\s+\/api\/monitor\/feedback/ },
  { label: "try-us API", pattern: /POST\s+\/api\/try-us/ },
  { label: "certify API", pattern: /POST\s+\/api\/certify/ },
  { label: "verify API", pattern: /GET\s+\/api\/verify\/:id/ }
];

const privateRoomName = ["VYR", "DEN"].join("");

function pass(name, details = {}) {
  return { name, ok: true, details };
}

function fail(name, details = {}) {
  return { name, ok: false, details };
}

async function readText(file) {
  return readFile(path.join(root, file), "utf8");
}

async function main() {
  const checks = [];
  const readmeExists = existsSync(path.join(root, "README.md"));
  checks.push(readmeExists ? pass("README exists") : fail("README exists"));

  const missingWikiPages = wikiPages.filter((page) => !existsSync(path.join(root, "docs", "wiki", page)));
  checks.push(
    missingWikiPages.length === 0
      ? pass("docs/wiki pages exist", { pages: wikiPages })
      : fail("docs/wiki pages exist", { missing: missingWikiPages })
  );

  const readme = readmeExists ? await readText("README.md") : "";
  for (const term of requiredReadmeTerms) {
    checks.push(
      term.pattern.test(readme)
        ? pass(`README contains ${term.label}`)
        : fail(`README contains ${term.label}`)
    );
  }

  checks.push(
    new RegExp(privateRoomName, "i").test(readme)
      ? fail("README excludes private AI-room operations")
      : pass("README excludes private AI-room operations")
  );

  checks.push(
    new RegExp(`${privateRoomName}|AI\\s+Room|operator-only|control\\s+plane|KITTY|VXSTATION`, "i").test(readme)
      ? fail("README excludes private operation details")
      : pass("README excludes private operation details")
  );

  const licenseSurface = `${readme}\n${existsSync(path.join(root, "LICENSE")) ? await readText("LICENSE") : ""}`;
  checks.push(
    /Apache-2\.0/i.test(licenseSurface) && /\bMIT\b/i.test(licenseSurface)
      ? pass("License section mentions Apache-2.0 and MIT")
      : fail("License section mentions Apache-2.0 and MIT")
  );

  const filesToScan = [
    "README.md",
    ...wikiPages.map((page) => path.join("docs", "wiki", page)),
    "Makefile"
  ];
  const autoPostHits = [];
  for (const file of filesToScan) {
    if (!existsSync(path.join(root, file))) continue;
    const text = await readText(file);
    if (/\bAUTO_POST\b\s*[:=]\s*(1|true|enabled|yes)\b/i.test(text)) {
      autoPostHits.push(file);
    }
  }
  checks.push(
    autoPostHits.length === 0
      ? pass("AUTO_POST is not enabled")
      : fail("AUTO_POST is not enabled", { files: autoPostHits })
  );

  const ok = checks.every((check) => check.ok);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const output = {
    ok,
    timestamp,
    repository: "teee79A/VYRDON-",
    branch: "upgrade/repo-public-surface",
    checks
  };

  await mkdir(evidenceDir, { recursive: true });
  const evidencePath = path.join(evidenceDir, `${timestamp}.json`);
  await writeFile(evidencePath, `${JSON.stringify(output, null, 2)}\n`);

  console.log(JSON.stringify({ ok, evidence: path.relative(root, evidencePath), checks }, null, 2));
  if (!ok) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
