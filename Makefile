.PHONY: verify

verify:
	@test -f LICENSE
	@test -f README.md
	@test -f INTRODUCTION.md
	@test -f CODE.md
	@test -f AGENTS.md
	@test -f docs/validation-model.md
	@test -d docs/diagrams
	@test -f apps/node-blood/server.js
	@test -f docs/wiki/Home.md
	@test -f docs/wiki/VYRDX-Runtime.md
	@test -f docs/wiki/Certificate-Flow.md
	@test -f docs/wiki/Evidence-and-Tracking.md
	@test -f docs/wiki/API-Contract.md
	@test -f docs/wiki/Operator-Runbook.md
	@test -f docs/wiki/License-and-Open-Source.md
	@test -f scripts/validate-public-surface.mjs
	@test -f wiki/Home.md
	@test -f wiki/Validation-Model.md
	@test -f wiki/Architecture.md
	@test -f wiki/Execution-Flow.md
	@test -f wiki/Technical-Stack.md
	@node scripts/validate-public-surface.mjs
	@echo "OK: required docs present"
