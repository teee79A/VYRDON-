# Certificate Flow

The certificate flow turns a public request into a verification output only when the request has a tracked evidence record.

## Flow

```text
public request
  -> evidence record
  -> certificate review
  -> issue or reject
  -> public verify lookup
```

## Public API

```text
POST /api/certify
GET  /api/verify/:id
```

## Rules

- No certificate is treated as valid without a verification ID.
- No verification output is treated as public proof without evidence linkage.
- No unsupported launch, revenue, or customer claims are made from certificate existence alone.

## Verify Response Intent

`GET /api/verify/:id` should return public-safe certificate status, evidence state, and any allowed public metadata. It must not expose private logs, secrets, internal hostnames, or operational control data.
