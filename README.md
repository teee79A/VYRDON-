# VYRDON — Root Routing Law

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

```text
VYRDON
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
    Isolated operations station
```

## Route Decision

```text
REQUEST
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
EXECUTION OR STOP
```

## VYRDX Contract Boundary

VYRDX / ڤيرديكس is the cloud runtime for transaction route governance. It is not deployed on the VYRDON Mother droplet.

Public VYRDX contract names:

```text
POST /api/monitor/feedback
POST /api/try-us
POST /api/certify
GET  /api/verify/:id
```

## Certificate Flow

```text
request -> evidence record -> certificate issue/reject -> public verify lookup
```

## Boundary

Public material can describe VYRDON, Root Routing Law, ConsoleLab, VYRDX, VYRDEN, VXSTATION, route contracts, certificate flow, and evidence expectations.

Private credentials, internal operator controls, private runtime material, API keys, tokens, private keys, seed phrases, wallet files, and database passwords are not public content.

## License

Apache-2.0 and MIT components may be used where appropriate.
