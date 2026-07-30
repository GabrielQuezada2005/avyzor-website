# AVYZOR – Premium KI-Agentur Website

Premium-Website für AVYZOR, entwickelt mit Next.js 14, TypeScript, Tailwind CSS und Framer Motion.

## Features

- **Premium Design** – Schwarz-Gold Luxus-Design mit dynamischen Lichteffekten
- **Vollständige Sektionen** – Hero, Leistungen, Preise, Portfolio, FAQ, Kontakt und mehr
- **Automatisierungen** – Lead-Speicherung, E-Mail-Bestätigungen, Terminbuchung
- **Integrationen** – Supabase, Resend, Stripe, Calendly, WhatsApp
- **SEO-optimiert** – Meta-Tags, Sitemap, Robots, JSON-LD Schema
- **Performance** – Next.js Image Optimization, Font Display Swap

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase (Lead-Datenbank)
- Resend (E-Mail)
- Stripe (Zahlungen)
- Zod (Validierung)

## Setup

```bash
# Dependencies installieren
npm install

# Environment Variables konfigurieren
cp .env.example .env.local
# .env.local mit Ihren API-Keys ausfüllen

# Supabase Tabellen erstellen (SQL in src/lib/supabase.ts)

# Development Server starten
npm run dev
```

## Supabase Setup

Führen Sie das SQL-Schema aus `src/lib/supabase.ts` in Ihrem Supabase SQL Editor aus, um die benötigten Tabellen zu erstellen:

- `leads` – Kontaktformular-Leads
- `newsletter_subscribers` – Newsletter-Abonnenten
- `quote_requests` – Angebotsanfragen
- `bookings` – Terminbuchungen

## Deployment (Vercel)

1. Repository auf GitHub pushen
2. In Vercel importieren
3. Environment Variables aus `.env.example` setzen
4. Deploy

## Projektstruktur

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── impressum/         # Impressum Seite
│   ├── datenschutz/       # Datenschutz Seite
│   ├── layout.tsx         # Root Layout
│   └── page.tsx           # Homepage
├── components/
│   ├── forms/             # Formular-Komponenten
│   ├── layout/            # Header, Footer, WhatsApp
│   ├── sections/          # Seiten-Sektionen
│   └── ui/                # UI-Komponenten
├── lib/                   # Utilities, Config, Services
└── types/                 # TypeScript Types
```

## Lizenz

Proprietär – © AVYZOR
