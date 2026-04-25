# Repository Guidelines

## Project Structure & Module Organization
- `README.md`: system overview + operator entrypoint.
- `docs/validation-model.md`: the hardening/validation gate (what must be true before “ship”).
- `docs/diagrams/`: topology diagrams (ASCII today; PNG optional later).
- `LICENSE`: licensing terms.

If/when runtime code lands here, keep it obvious and modular (example: `services/`, `scripts/`, `packages/`, `infra/`), and ensure every service has a matching validation command in `docs/validation-model.md`.

## Build, Test, and Development Commands
This repo is currently docs-first; validation is file- and checklist-driven:
- `make verify`: asserts required doc files/paths exist.
- `rg -n "TODO|FIXME" docs`: quick scan for unfinished operator notes.

## Coding Style & Naming Conventions
- Markdown: use `#`/`##` headings, short paragraphs, and copy-pastable commands.
- Diagrams: keep ASCII diagrams in `docs/diagrams/*.md` using fenced code blocks.
- Never commit secrets. Use placeholders like `[REDACTED_SECRET]` and env var names.

## Testing Guidelines
- There is no automated test suite in this repo yet.
- Every operational change should add or update a **validation step** in `docs/validation-model.md`.

## Commit & Pull Request Guidelines
- Git history is minimal; no conventions can be inferred yet.
- Use Conventional Commits for consistency: `docs: ...`, `chore: ...`, `feat: ...`.
- PRs must include: purpose, exact validation commands run, and links to updated docs/diagrams.

## Security & Configuration Tips
- Treat production IPs, tunnel IDs, Access policies, and service tokens as sensitive.
- Keep operator-only values in private runbooks or environment management, not in Git.
