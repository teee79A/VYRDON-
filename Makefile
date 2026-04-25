.PHONY: verify

verify:
	@test -f LICENSE
	@test -f README.md
	@test -f AGENTS.md
	@test -f docs/validation-model.md
	@test -d docs/diagrams
	@echo "OK: required docs present"
