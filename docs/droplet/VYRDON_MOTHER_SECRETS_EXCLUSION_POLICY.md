# VYRDON Mother Secrets Exclusion Policy

## Rule

No raw secrets may enter the VYRDON Mother artifact or the staged release.

## Blocked File Classes

The package must exclude:

- `.env` and `.env.*`
- API keys and token files
- private keys and SSH private keys
- seed phrases and wallet files
- database passwords and database dumps
- AWS keys and Cloudflare tokens
- Ledger, Safe, or contract private material
- logs that may contain credentials
- dependency directories such as `node_modules`
- Git metadata

## Path Guard

`ops/droplet/package-vyrdon-mother.sh` fails if any allowlisted path matches a blocked secret path pattern.

## Content Guard

The package script scans included files for high-confidence raw secret markers, including:

- private key blocks
- AWS access key IDs
- GitHub access tokens
- Slack tokens
- Stripe live or test keys
- OpenAI project or secret keys
- assignment-style password, token, or secret values

Policy text that names secret classes is allowed. Raw secret values are not.

## Artifact Guard

The staging script copies only the generated artifact and its sidecars:

```text
MANIFEST.files
MANIFEST.sha256
ARTIFACT_SHA256
DEPLOYED_COMMIT
README_RUNTIME.md
ROLLBACK.md
SECRETS_EXCLUSION_REPORT.txt
```

The verify script checks the active release again after unpacking.

## Failure Rule

If a suspected raw secret is found, stop. Do not stage. Fix the manifest or remove the secret from the source before creating a new artifact.
