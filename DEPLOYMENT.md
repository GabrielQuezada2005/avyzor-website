# AVYZOR – Deployment-Checkliste (Live-Schaltung)

Schritt-für-Schritt-Anleitung für den Go-Live auf Vercel.

---

## Phase 1: Vorbereitung (lokal)

- [ ] Repository auf GitHub/GitLab gepusht
- [ ] `.env.local` aus `.env.example` erstellt und ausgefüllt
- [ ] Alle Verify-Scripts erfolgreich:
  ```bash
  npm run verify:production
  npm run verify:i18n
  npm run verify:seo
  npm run verify:payments
  npm run lint
  npm run build
  ```
- [ ] Supabase SQL-Schema aus `src/lib/supabase.ts` im SQL Editor ausgeführt

---

## Phase 2: Vercel-Projekt einrichten

- [ ] Neues Projekt in [vercel.com](https://vercel.com) importieren
- [ ] Framework: **Next.js** (automatisch erkannt)
- [ ] Region: **Frankfurt (fra1)** – konfiguriert in `vercel.json`
- [ ] Node.js Version: **20.x** (empfohlen, siehe CI)

---

## Phase 3: Environment Variables (Vercel Dashboard)

### Pflicht (Production)

| Variable | Beschreibung |
|----------|--------------|
| `NEXT_PUBLIC_SITE_URL` | Live-URL, z. B. `https://avyzor.de` |
| `NEXT_PUBLIC_SITE_NAME` | Markenname |
| `NEXT_PUBLIC_SITE_EMAIL` | Kontakt-E-Mail |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Projekt-URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role (geheim!) |
| `RESEND_API_KEY` | Resend API Key |
| `EMAIL_FROM` | Absender-Adresse (verifizierte Domain) |
| `EMAIL_TO` | Empfänger für Formular-Benachrichtigungen |
| `CRM_ADMIN_SECRET` | Starkes Passwort für Admin/CRM (min. 32 Zeichen) |
| `PORTAL_AUTH_SECRET` | JWT-Secret für Kundenportal (min. 32 Zeichen) |

### Site-Inhalte (PUBLIC)

| Variable | Beschreibung |
|----------|--------------|
| `NEXT_PUBLIC_SITE_PHONE` | Telefonnummer (Anzeige) |
| `NEXT_PUBLIC_SITE_PHONE_HREF` | Telefonnummer (tel:-Link) |
| `NEXT_PUBLIC_SITE_WHATSAPP` | WhatsApp-Nummer ohne + |
| `NEXT_PUBLIC_ADDRESS_*` | Adresse für Impressum/Footer |
| `NEXT_PUBLIC_LEGAL_*` | Impressum-Daten |
| `NEXT_PUBLIC_SOCIAL_*` | Social-Media-Links |

### Optional (Features)

| Variable | Feature |
|----------|---------|
| `STRIPE_SECRET_KEY` + Webhook + Prices | Online-Zahlungen |
| `OPENAI_API_KEY` | KI-Assistant (Chat) |
| `ELEVENLABS_API_KEY` | Premium-Sprachausgabe |
| `NEXT_PUBLIC_CALENDLY_URL` | Calendly-Integration |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` | Spam-Schutz |
| `SENTRY_DSN` | Error Monitoring |

> Vollständige Liste mit Kommentaren: `.env.example`

---

## Phase 4: Domain & DNS

- [ ] Custom Domain in Vercel hinzufügen (`avyzor.de`)
- [ ] DNS-Einträge beim Registrar setzen (A/CNAME laut Vercel-Anleitung)
- [ ] SSL-Zertifikat aktiv (automatisch via Vercel)
- [ ] `NEXT_PUBLIC_SITE_URL` auf finale Domain setzen
- [ ] Redirect www → non-www (oder umgekehrt) in Vercel konfigurieren

---

## Phase 5: Externe Dienste

### Supabase
- [ ] Tabellen erstellt (Schema in `src/lib/supabase.ts`)
- [ ] RLS-Policies aktiv (im Schema enthalten)
- [ ] Service Role Key nur serverseitig in Vercel

### Resend
- [ ] Domain verifiziert (`avyzor.de`)
- [ ] `EMAIL_FROM` nutzt verifizierte Domain
- [ ] Test-E-Mail nach Deploy senden

### Stripe (falls Zahlungen)
- [ ] Live-Keys (`sk_live_...`) in Vercel
- [ ] Webhook-Endpoint: `https://avyzor.de/api/stripe/webhook`
- [ ] Events: `checkout.session.completed`, `payment_intent.succeeded`
- [ ] Price-IDs für Starter/Professional/Enterprise gesetzt

### OpenAI / ElevenLabs (falls Assistant)
- [ ] API-Keys in Vercel (SERVER-only, kein NEXT_PUBLIC_)
- [ ] TTS testen: Assistant öffnen → Sprachausgabe

---

## Phase 6: Deploy & Smoke-Test

- [ ] Production Deploy auslösen
- [ ] Health-Check: `GET https://avyzor.de/api/health` → `"status": "ok"`
- [ ] Homepage in allen Sprachen: `/de`, `/en`, `/es`, `/fr`, `/it`
- [ ] SEO: `/sitemap.xml`, `/robots.txt` erreichbar
- [ ] Kontaktformular absenden → Lead in Supabase + E-Mail
- [ ] Newsletter-Anmeldung → Double-Opt-In E-Mail
- [ ] Terminbuchung → Slot laden + Buchung
- [ ] Angebotsanfrage → Lead gespeichert
- [ ] KI-Assistant: Chat + TTS (falls konfiguriert)
- [ ] Admin: `/admin` → Login → Dashboard KPIs
- [ ] CRM: `/admin/crm` → Leads laden
- [ ] Portal: `/portal/login` → Login/Register
- [ ] Stripe Checkout (falls konfiguriert)
- [ ] 404-Seite: unbekannte URL → professionelle Fehlerseite
- [ ] Security Headers prüfen (Browser DevTools → Network → Response Headers)

---

## Phase 7: Post-Launch

- [ ] Google Search Console: Sitemap einreichen
- [ ] Analytics einrichten (falls gewünscht)
- [ ] Monitoring aktivieren (Sentry o. Ä.)
- [ ] Rate Limiting auf Upstash Redis/KV upgraden (empfohlen für Production)
- [ ] Backup-Strategie für Supabase prüfen
- [ ] CI-Pipeline (`.github/workflows/ci.yml`) auf grün

---

## Bekannte manuelle Punkte

| Punkt | Status | Aktion |
|-------|--------|--------|
| Turnstile | Vorbereitet, nicht an Formulare gebunden | Nach Go-Live optional aktivieren |
| In-Memory Rate Limiting | Funktioniert auf Serverless eingeschränkt | Upstash für hohen Traffic |
| CRM-Token in sessionStorage | XSS-Risiko bei kompromittiertem Script | Langfristig HttpOnly-Cookie |
| Portal-Registrierung | Offen ohne Invite | Invite-Only falls gewünscht |
| Next.js 14.2.35 | Bekannte CVEs | Upgrade auf gepatchte Version planen |
| Sentry | Nur vorbereitet in `instrumentation.ts` | SDK einbinden + DSN setzen |

---

## Rollback

1. Vercel Dashboard → Deployments → vorheriges Deployment → **Promote to Production**
2. Env-Variablen auf vorherigen Stand zurücksetzen
3. Stripe-Webhook-URL prüfen

---

## Support-Kontakte

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Resend Docs: https://resend.com/docs
- Stripe Webhooks: https://stripe.com/docs/webhooks
