# Validation Model

This page defines the **PASS / NOPASS** model for promoting VYRDON into real-market execution. The model is intentionally strict: **unknown becomes false**.

## Fail-Closed Four-Pillar Law (Primary)

```txt
ROOT.FALSE  -> PASS.FALSE
VYRDX.FALSE -> PASS.FALSE
GATE.FALSE  -> PASS.FALSE
VALID.FALSE -> PASS.FALSE

ROOT.TRUE + VYRDX.TRUE + GATE.TRUE + VALID.TRUE -> PASS.TRUE
```

Practical meaning:
- If any pillar is missing or not proven, the system result is `NOPASS`.
- “Looks green” is not proof. Evidence must be validated with commands and outputs.

Reference implementation: `apps/node-blood/server.js` (`POST /validate`).

## Operator Checklist (Executable)

For the full checklist and commands, use: `docs/validation-model.md`.

## DX Native Logic Codes (Source Record)

Date: 2026-03-15

### 1) ROOT_RULE (switched)
```txt
if ROOT_OK == true and CERTIFIED_GATE == true:
  VYRDX_PASS = true
  VYRDX_NOPASS = false
else:
  VYRDX_PASS = false
  VYRDX_NOPASS = true
```

### 9) GATE_POLICY_WRAPPER
```txt
ROOT_PASS = TRUE and TRUE
GATE_OK   = CERTIFIED_GATE and AUDITOR_OK and ROOT_LOCK

if ROOT_PASS and GATE_OK:
  PASS = true
else:
  PASS = false
```

### 10) TRANSACTION_KICKOFF_WRAPPER
```txt
ROOT_PASS    = TRUE and TRUE
GATE_OK      = CERTIFIED_GATE and AUDITOR_OK and ROOT_LOCK
GATE_VISIBLE = true

if ROOT_PASS and GATE_OK:
  TRANSACTION = VERIFIED_ACTIVE
  WRAPPER     = STEALTH_NATIVE
  RESULT      = PASS
else:
  TRANSACTION = BLOCKED
  RESULT      = FALSE
```

### 17) Hard Rule
```txt
if ROOT == false:
  PASS = false
```

## Tight Laws (Operational Form)

Date: 2026-03-18

### 20) FAIL-CLOSED FOUR-PILLAR LAW
```txt
ROOT.FALSE  -> PASS.FALSE
VYRDX.FALSE -> PASS.FALSE
GATE.FALSE  -> PASS.FALSE
VALID.FALSE -> PASS.FALSE

ROOT.TRUE + VYRDX.TRUE + GATE.TRUE + VALID.TRUE -> PASS.TRUE
```

### 21) PASS / NOPASS COMPLEMENT LAW
```txt
PASS.FALSE := NOT PASS.TRUE
NOPASS     := PASS.FALSE
```

### 22) COLOR IS NOT TRUTH LAW
```txt
COLOR_ZONE := FALSE
RED        := NOPASS
YELLOW     := NOPASS
GREEN      := NOPASS
```
