# GitHub Actions – CI/CD Pipeline

Diese Pipeline stellt sicher, dass **kein Deployment ohne erfolgreiche Qualitätsprüfungen** stattfindet.

## Workflows

| Workflow | Datei | Trigger | Zweck |
| -------- | ----- | ------- | ----- |
| **CI** | `ci.yml` | Jeder Push, jeder Pull Request | Lint, Tests, Build, E2E |
| **Deploy** | `deploy.yml` | CI erfolgreich auf `main`/`master` | Production-Deploy nach Vercel |

## CI-Ablauf

```
Push / Pull Request
        │
        ▼
   ┌─────────┐     ┌─────────┐
   │  Lint   │     │  Test   │   (parallel)
   └────┬────┘     └────┬────┘
        └───────┬───────┘
                ▼
         ┌─────────────┐
         │    Build    │
         └──────┬──────┘
                ▼
         ┌─────────────┐
         │     E2E     │
         └─────────────┘
```

### Jobs im Detail

1. **Lint** – `npm run lint` (ESLint / Next.js)
2. **Unit & Integration Tests** – `npm run test` (Vitest)
3. **Production Build** – `npm run build` (Next.js)
4. **End-to-End Tests** – `npm run test:e2e` (Playwright, nutzt den Build-Artefakt)

Alle Jobs müssen grün sein, damit der CI-Workflow als **erfolgreich** gilt.

## Deployment-Gating

Deployments sind an CI gekoppelt:

1. **Deploy-Workflow** (`deploy.yml`) startet nur, wenn CI auf `main`/`master` mit Status `success` endet.
2. **Branch Protection** (empfohlen): Unter *Settings → Branches → Branch protection rules* für `main`:
   - ✅ Require status checks before merging
   - ✅ Require branches to be up to date
   - Status Checks auswählen: `Lint`, `Unit & Integration Tests`, `Production Build`, `End-to-End Tests`

3. **Vercel Git-Integration** (Alternative/Ergänzung):
   - Vercel Dashboard → Project → Settings → Git
   - „Wait for GitHub Actions checks" aktivieren
   - Production Branch: `main`

## Lokale Befehle (entspricht CI)

```bash
npm ci
npm run lint
npm run test
npm run build
npm run test:e2e
```

Alles in einem Schritt:

```bash
npm run test:all
```

## Secrets & Variablen für Deploy

| Name | Typ | Beschreibung |
| ---- | --- | ------------ |
| `VERCEL_TOKEN` | Secret | [Vercel Account Token](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Secret | Vercel Team ID (`.vercel/project.json` oder `vercel link`) |
| `VERCEL_PROJECT_ID` | Secret | Vercel Project ID |
| `NEXT_PUBLIC_SITE_URL` | Variable (optional) | Production-URL für Build im Deploy-Job |

## Artefakte

Bei fehlgeschlagenen Runs werden Testberichte als GitHub Actions Artifacts gespeichert:

- `vitest-reports` – JUnit XML
- `playwright-reports` – JUnit + HTML + Screenshots

## Node.js Version

CI und Deploy nutzen **Node.js 20** (identisch zu `DEPLOYMENT.md` und Vercel-Empfehlung).
