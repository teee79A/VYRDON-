# VYRDON Wiki

This wiki documents the **hardened split** of the VYRDON system and the **validation model** that decides whether a change is allowed to ship to real market.

## Start Here

- `Validation-Model.md` — PASS/NOPASS laws and operator validation checklist.
- `Architecture.md` — service boundaries, trust zones, and what must never share ingress.
- `Execution-Flow.md` — request paths, deployment flow, and runtime cut lines.
- `Technical-Stack.md` — reference stack for the split.

## One-Sentence Mission

**Ship VYRDON into reality without leaking hidden control planes.**

## Core Rules (Non-Negotiable)

1. **Fail closed**: missing truth must become `NOPASS`.
2. **Default deny**: internal mutation routes require explicit auth.
3. **Separate ingress**: public product and hidden lanes never share a public entrypoint.
4. **Evidence-first**: promotion requires commands + outputs (not “it looks fine”).

## Repo Links

- Validation checklist: `docs/validation-model.md`
- Reference bridge service: `apps/node-blood/server.js`
