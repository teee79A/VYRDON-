# Introduction

VYRDON is engineered around **hard boundaries** and **fail-closed validation**. The goal is to ship real-market capability without accidentally exposing hidden control planes, internal AI lanes, or mutable operational surfaces to the public internet.

## What This Repo Is

This repository is the **documentation + validation gate** for the split:

- **VYRDx (Public)** — product surface only (commercial, evidence-public, billing, proof).
- **VYRDEN (AI Room)** — internal intelligence/agent lane; authenticated, default-deny.
- **KITTY / VXSTATION (Control Plane)** — operator tools + orchestration; not the public product.

If a change cannot be expressed as a validation step, it is not “done”.

## Core Operator Laws

1. **Fail closed**: missing truth must become `NOPASS`, not “best effort”.
2. **Default deny**: internal mutation routes require explicit auth (Cloudflare Access, session, or shared secret).
3. **Separate ingress**: public surfaces and hidden surfaces do not share a public entrypoint.
4. **Evidence-first**: every promotion is backed by verifiable commands and outputs.

## Where To Read

- `docs/validation-model.md`: the executable checklist (commands + expected outcomes).
- `wiki/Architecture.md`: service boundary model and trust zones.
- `wiki/Execution-Flow.md`: request paths and deployment flow.
- `CODE.md`: reference implementations (including the `apps/node-blood` bridge).

## How To Contribute

- Keep docs copy/paste friendly (exact commands, paths, and expected exit codes).
- Use diagrams when it reduces ambiguity (`docs/diagrams/` or `wiki/` pages).
- Redact secrets as `[REDACTED_SECRET]`. Prefer env-var names over values.
