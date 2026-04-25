# VYRDON — Validation-Gated Execution System

VYRDON is built on one rule: **execution does not imply validity**. Operations are only accepted when they pass explicit validation laws and produce verifiable evidence.

## Start Here

- `INTRODUCTION.md` — intent, boundaries, and operator laws.
- `docs/validation-model.md` — executable checklist (commands + expected outcomes).
- `wiki/Home.md` — architecture, execution flow, stack, and validation pages.
- `CODE.md` — core gate logic + reference services (`apps/node-blood/server.js`).

## Core Principle

**Execution ≠ Acceptance.**  
If any validation condition fails: `ACCEPTANCE = FALSE`.  
No partial acceptance exists.

## System Model

```text
REQUEST
  ↓
VALIDATION GATE
  ↓
EXECUTION
  ↓
EVIDENCE
  ↓
STATE COMMIT
  ↓
INTEGRITY CHECK
  ↓
ACCEPT / REJECT
```

Execution may occur. Acceptance is conditional.

## Validation Law (High Level)

```text
ACCEPT = Authority AND Executor AND Evidence AND State AND Integrity
ANY FALSE = REJECT
```

## Boundary Model (Lanes)

```text
Internet → Cloudflare (Tunnel+Access)
  ├─ VYRDx (Public Product)    : public allowlist only
  ├─ VYRDEN (AI Room)          : authenticated, default-deny
  └─ KITTY / VXSTATION (Ops)   : operator-only control plane
```

The public product and hidden/control lanes must never share a public entrypoint.

## Quick Validation

```bash
make verify
```

## Security Notes

- Never commit secrets (tokens/keys). Use `[REDACTED_SECRET]`.
- Avoid publishing production IPs, tunnel IDs, or internal hostnames in public docs.
- JSON / YAML / TOML — configuration  

---

## 9. Evidence Model

Each operation produces:

- execution context  
- validation result  
- timestamp  
- integrity hash  

Stored as:

- append-only records  
- verifiable audit trail  

---

## 10. Boundary Definition

VYRDON does not replace execution systems.

It defines:

what is allowed to be accepted as true

---

## 11. Minimal Validation Engine (Reference Implementation)

```javascript
const http = require("http");

function validate(input) {
  const required = ["authority", "executor", "evidence", "state", "integrity"];

  for (const key of required) {
    if (!input[key]) {
      return { accepted: false, reason: key + " failed" };
    }
  }

  return { accepted: true };
}

http.createServer((req, res) => {
  if (req.method !== "POST") {
    res.writeHead(405);
    return res.end();
  }

  let body = "";

  req.on("data", chunk => body += chunk);
  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      const result = validate(data);

      res.writeHead(200, {"Content-Type": "application/json"});
      res.end(JSON.stringify(result));
    } catch {
      res.writeHead(400);
      res.end();
    }
  });
}).listen(3000);
12. Use Cases
financial transaction systems
escrow and settlement
API validation layers
CI/CD enforcement
audit-critical systems
13. Status

Active development.
System model defined.
Runtime under construction.

14. License

Apache License 2.0
Commercial licensing may be available separately.
