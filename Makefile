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
	@test -f wiki/Home.md
	@test -f wiki/Validation-Model.md
	@test -f wiki/Architecture.md
	@test -f wiki/Execution-Flow.md
	@test -f wiki/Technical-Stack.md
	@echo "OK: required docs present"
