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
	@test -f scripts/validate-vyrdon-public-index.mjs
	@test -f scripts/generate-vyrdon-public-index.mjs
	@test -f README.ar.md
	@test -f public/index.html
	@test -f public/ar/what-is-vyrdon/index.html
	@test -f public/vyrdon-root-routing-law/index.html
	@test -f public/ar/vyrdon-root-routing-law/index.html
	@test -f public/vyrdon-system-map/index.html
	@test -f public/ar/vyrdon-system-map/index.html
	@test -f public/consolelab/index.html
	@test -f public/sitemap.xml
	@test -f public/robots.txt
	@test -f public/llms.txt
	@test -f public/llms-full.txt
	@test -f public/site.webmanifest
	@test -f ROOT_LAW_SHA256.txt
	@test -f RELEASE_MANIFEST_SHA256.txt
	@test -f PUBLIC_DOCS_SHA256.txt
	@test -f docs/search/VYRDON_SEARCH_SUBMISSION_RUNBOOK.md
	@test -f docs/droplet/VYRDON_MOTHER_DROPLET_STAGING_PLAN.md
	@test -f docs/droplet/VYRDON_MOTHER_FILE_MANIFEST.md
	@test -f docs/droplet/VYRDON_MOTHER_SECRETS_EXCLUSION_POLICY.md
	@test -f docs/droplet/VYRDON_MOTHER_ROLLBACK.md
	@test -f ops/droplet/preflight-vyrdon-mother-droplet.sh
	@test -f ops/droplet/package-vyrdon-mother.sh
	@test -f ops/droplet/stage-vyrdon-mother.sh
	@test -f ops/droplet/verify-vyrdon-mother-staging.sh
	@bash -n ops/droplet/preflight-vyrdon-mother-droplet.sh
	@bash -n ops/droplet/package-vyrdon-mother.sh
	@bash -n ops/droplet/stage-vyrdon-mother.sh
	@bash -n ops/droplet/verify-vyrdon-mother-staging.sh
	@test -f wiki/Home.md
	@test -f wiki/Validation-Model.md
	@test -f wiki/Architecture.md
	@test -f wiki/Execution-Flow.md
	@test -f wiki/Technical-Stack.md
	@node scripts/validate-public-surface.mjs
	@node scripts/validate-vyrdon-public-index.mjs
	@echo "OK: required docs present"
