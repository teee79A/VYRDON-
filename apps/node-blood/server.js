/*
 * node-blood — VYRDON Node Bridge (reference service)
 * - dependency-free HTTP server
 * - fail-closed validation logic
 * - safe JSON parsing + small-body limit
 *
 * Run:
 *   node apps/node-blood/server.js
 */

const http = require("node:http");
const { randomUUID } = require("node:crypto");

const HOST = process.env.NODE_BLOOD_HOST || "127.0.0.1";
const PORT = Number.parseInt(process.env.NODE_BLOOD_PORT || "7070", 10);
const ENV = process.env.NODE_ENV || "development";
const MAX_BODY_BYTES = 32 * 1024;

function nowIso() {
  return new Date().toISOString();
}

function writeJson(res, statusCode, payload, extraHeaders = {}) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "referrer-policy": "no-referrer",
    ...extraHeaders,
  });
  res.end(body);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let raw = "";

    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error("body_too_large"), { code: "BODY_TOO_LARGE" }));
        req.destroy();
        return;
      }
      raw += chunk.toString("utf8");
    });

    req.on("end", () => {
      if (!raw.trim()) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(Object.assign(new Error("invalid_json"), { code: "INVALID_JSON" }));
      }
    });

    req.on("error", (err) => reject(err));
  });
}

function bool(value) {
  return value === true;
}

// FAIL-CLOSED FOUR-PILLAR LAW (DX Native)
function evaluateGate(input) {
  const rootTrue = bool(input.rootTrue ?? input.rootOk ?? input.rootLock);
  const vyrdxTrue = bool(input.vyrdxTrue ?? input.vyrdxOk ?? input.vyrdxCertified);

  const certifiedGate = bool(input.certifiedGate);
  const auditorOk = bool(input.auditorOk);
  const rootLock = bool(input.rootLock);
  const gateTrue = certifiedGate && auditorOk && rootLock;

  const validTrue = bool(input.validTrue ?? input.validOk);
  const coreTrue = rootTrue && vyrdxTrue && gateTrue && validTrue;

  const stealthRequested = bool(input.stealthRequested);
  const stealthTrue = coreTrue && stealthRequested;

  const reasons = [];
  if (!rootTrue) reasons.push("ROOT_FALSE");
  if (!vyrdxTrue) reasons.push("VYRDX_FALSE");
  if (!gateTrue) reasons.push("GATE_FALSE");
  if (!validTrue) reasons.push("VALID_FALSE");

  return {
    pass: coreTrue,
    nopass: !coreTrue,
    coreTrue,
    transaction: coreTrue ? "VERIFIED_ACTIVE" : "BLOCKED",
    wrapper: coreTrue ? "STEALTH_NATIVE" : "NONE",
    stealth: stealthTrue,
    gateVisible: true,
    pillars: {
      rootTrue,
      vyrdxTrue,
      gateTrue,
      validTrue,
    },
    gate: {
      certifiedGate,
      auditorOk,
      rootLock,
    },
    reasons,
  };
}

function route(req, res) {
  const requestId = randomUUID();
  const url = new URL(req.url || "/", "http://localhost");

  if (req.method === "GET" && url.pathname === "/health") {
    return writeJson(res, 200, { status: "ok", env: ENV, uptimeSec: Math.floor(process.uptime()), ts: nowIso() }, {
      "x-request-id": requestId,
    });
  }

  if (req.method === "GET" && url.pathname === "/status") {
    return writeJson(res, 200, {
      service: "node-blood",
      env: ENV,
      bind: { host: HOST, port: PORT },
      maxBodyBytes: MAX_BODY_BYTES,
      ts: nowIso(),
    }, { "x-request-id": requestId });
  }

  if (req.method === "POST" && url.pathname === "/validate") {
    return readJson(req)
      .then((body) => writeJson(res, 200, { requestId, ts: nowIso(), ...evaluateGate(body) }, { "x-request-id": requestId }))
      .catch((err) => {
        const code = err && typeof err === "object" ? err.code : undefined;
        if (code === "BODY_TOO_LARGE") {
          return writeJson(res, 413, { error: "BODY_TOO_LARGE", requestId, ts: nowIso() }, { "x-request-id": requestId });
        }
        if (code === "INVALID_JSON") {
          return writeJson(res, 400, { error: "INVALID_JSON", requestId, ts: nowIso() }, { "x-request-id": requestId });
        }
        return writeJson(res, 500, { error: "INTERNAL_ERROR", requestId, ts: nowIso() }, { "x-request-id": requestId });
      });
  }

  return writeJson(res, 404, { error: "NOT_FOUND", requestId, ts: nowIso() }, { "x-request-id": requestId });
}

const server = http.createServer(route);

server.listen(PORT, HOST, () => {
  // Keep startup line stable for operator logs.
  // eslint-disable-next-line no-console
  console.log(`[node-blood] listening on http://${HOST}:${PORT} env=${ENV}`);
});

const shutdown = (signal) => {
  // eslint-disable-next-line no-console
  console.log(`[node-blood] shutdown signal=${signal}`);
  server.close(() => process.exit(0));
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
