# AVYZOR – Premium KI-Agentur Website

Production-ready Next.js Website für AVYZOR mit mehrsprachiger Homepage, KI-Assistant, CRM, Kundenportal, Terminbuchung und Stripe-Zahlungen.

## Features

- **Premium Design** – Schwarz-Gold Luxus-Design (unverändert)
- **5 Sprachen** – DE, EN, ES, FR, IT (next-intl)
- **KI-Assistant** – Chat + Cloud-TTS (ElevenLabs/OpenAI)
- **Formulare** – Kontakt, Angebot, Newsletter, Terminbuchung
- **CRM** – Lead-Management, Angebote, E-Mails, Zahlungen
- **Admin-Dashboard** – KPIs, Termine, Zahlungen, Einstellungen
- **Kundenportal** – Login, Dashboard, Angebote, Rechnungen
- **Stripe** – Checkout (Karte, PayPal, Klarna, Apple/Google Pay)
- **SEO & Performance** – Sitemap, robots.txt, JSON-LD, optimierte Fonts/Bilder
- **Security** – CSP, Rate Limiting, Input-Validierung, Health-Check

## Tech Stack

| Bereich | Technologie |
|---------|-------------|
| Framework | Next.js 14 (App Router) |
| Sprache | TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| i18n | next-intl |
| Datenbank | Supabase |
| E-Mail | Resend |
| Zahlungen | Stripe |
| Validierung | Zod |
| Deployment | Vercel (Region: fra1) |

---

## Lokaler Start

### Voraussetzungen

- Node.js 20+
- npm
- Supabase-Projekt (optional für volle Funktion)
- API-Keys siehe `.env.example`

### Installation

```bash
# Repository klonen
git clone <repo-url>
cd Premium-Agentur

# Dependencies installieren
npm install

# Environment Variables anlegen
cp .env.example .env.local
# .env.local mit echten Werten ausfüllen

# Supabase Tabellen erstellen (SQL in src/lib/supabase.ts)

# Development Server starten
npm run dev
```

Die Website ist unter [http://localhost:3000](http://localhost:3000) erreichbar (Redirect auf `/de`).

### Verfügbare Scripts

| Script | Beschreibung |
|--------|--------------|
| `npm run dev` | Development Server |
| `npm run build` | Production Build |
| `npm run start` | Production Server (nach Build) |
| `npm run lint` | ESLint |
| `npm run verify:production` | Production-Readiness prüfen |
| `npm run verify:i18n` | Übersetzungs-Parität prüfen |
| `npm run verify:seo` | SEO & Performance prüfen |
| `npm run verify:payments` | Zahlungslogik prüfen |
| `npm run clean` | `.next` Cache löschen |

---

## Environment Variables

Alle Variablen sind in [`.env.example`](.env.example) dokumentiert.

**Pflicht für Production:**

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO`
- `CRM_ADMIN_SECRET`, `PORTAL_AUTH_SECRET`

**Optional:** Stripe, OpenAI, ElevenLabs, Turnstile, Calendly, Sentry

> Server-only Secrets (`CRM_ADMIN_SECRET`, `OPENAI_API_KEY`, etc.) niemals mit `NEXT_PUBLIC_` prefixen.

---

## Deployment (Vercel)

Detaillierte Schritt-für-Schritt-Anleitung: **[DEPLOYMENT.md](DEPLOYMENT.md)**

### Kurzfassung

1. Repository auf GitHub pushen
2. In Vercel importieren (Framework: Next.js)
3. Environment Variables aus `.env.example` setzen
4. Supabase SQL-Schema ausführen
5. Deploy → Smoke-Test via `/api/health`
6. Domain verbinden + `NEXT_PUBLIC_SITE_URL` anpassen
7. Stripe-Webhook auf `/api/stripe/webhook` registrieren (falls Zahlungen)

`vercel.json` ist vorkonfiguriert (Region `fra1`, Health-Cache-Header).

---

## Projektstruktur

```
src/
├── app/
│   ├── [locale]/          # Öffentliche Website (5 Sprachen)
│   ├── admin/             # Admin-Dashboard
│   ├── portal/            # Kundenportal
│   ├── api/               # API Routes (28 Endpunkte)
│   ├── error.tsx          # 500-Fehlerseite
│   ├── not-found.tsx      # 404-Fehlerseite
│   ├── sitemap.ts         # Dynamische Sitemap
│   └── robots.ts          # robots.txt
├── components/
│   ├── admin/             # Admin UI
│   ├── assistant/         # KI-Assistant Widget
│   ├── crm/               # CRM UI
│   ├── forms/             # Formular-Komponenten
│   ├── layout/            # Header, Footer, LanguageSwitcher
│   ├── portal/            # Portal UI
│   ├── sections/          # Homepage-Sektionen
│   └── ui/                # Shared UI
├── i18n/                  # Locale-Konfiguration, Routing
├── lib/
│   ├── api/               # Rate Limiting, Security
│   ├── assistant/         # OpenAI, TTS
│   ├── booking/           # Terminbuchung
│   ├── crm/               # CRM Backend
│   ├── env.ts             # Server Env (Secrets)
│   ├── env.public.ts      # Client-safe Env
│   ├── env.server.ts      # Server-only Helpers
│   ├── logging/           # Strukturiertes Logging
│   ├── payments/          # Stripe Integration
│   ├── portal/            # Portal Auth & Data
│   ├── seo/               # Metadata, JSON-LD
│   └── supabase.ts        # DB Schema & Client
└── messages/              # i18n Übersetzungen (de, en, es, fr, it)
```

---

## API-Routen (Übersicht)

| Route | Methode | Schutz | Rate Limit |
|-------|---------|--------|------------|
| `/api/health` | GET | Öffentlich | – |
| `/api/contact` | POST | Öffentlich | default |
| `/api/quote` | POST | Öffentlich | default |
| `/api/newsletter` | POST | Öffentlich | default |
| `/api/newsletter/confirm` | GET | Öffentlich | – |
| `/api/booking` | POST | Öffentlich | default |
| `/api/booking/availability` | GET | Öffentlich | default |
| `/api/assistant` | POST | Öffentlich | default |
| `/api/assistant/tts` | POST | Öffentlich | default |
| `/api/assistant/tts/debug` | POST | Debug-Gate | strict |
| `/api/stripe/checkout` | POST | Öffentlich | default |
| `/api/stripe/webhook` | POST | Stripe-Signatur | – |
| `/api/crm/auth` | POST | Öffentlich | auth |
| `/api/crm/leads/*` | * | CRM-Token | – |
| `/api/admin/*` | GET | CRM-Token | – |
| `/api/portal/auth/login` | POST | Öffentlich | auth |
| `/api/portal/auth/register` | POST | Öffentlich | auth |
| `/api/portal/auth/logout` | POST | Session | – |
| `/api/portal/dashboard` | GET | Session | – |

---

## Supabase Setup

SQL-Schema in `src/lib/supabase.ts` im Supabase SQL Editor ausführen. Erstellt:

- `leads`, `newsletter_subscribers`, `quote_requests`, `bookings`
- `crm_leads`, `crm_quotes`, `crm_email_logs`, `crm_appointments`, `crm_payments`
- `portal_users`
- Row Level Security (kein öffentlicher DB-Zugriff)

---

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) bei Push/PR:

1. `verify:production`
2. `verify:i18n`
3. `verify:seo`
4. `lint`
5. `build`

---

## Health-Check

```bash
curl https://avyzor.de/api/health
```

Antwort bei korrekter Konfiguration: `"status": "ok"` mit Service-Checks für Supabase, Forms, CRM, Portal.

---

## Lizenz

Proprietär – © AVYZOR
