# AVYZOR Internationalisierung (i18n)

## Übersicht

Die Website nutzt [next-intl](https://next-intl-docs.vercel.app/) mit locale-präfixierten URLs.

**Zentrale Konfiguration:** `src/i18n/locale-config.ts`

| Locale | URL   | Sprache      |
|--------|-------|--------------|
| `de`   | `/de` | Deutsch      |
| `en`   | `/en` | Englisch     |
| `es`   | `/es` | Spanisch     |
| `fr`   | `/fr` | Französisch  |
| `it`   | `/it` | Italienisch  |

Standard-Locale: **de** (Redirect von `/` → `/de`)

Die Sprachwahl wird per Cookie (`NEXT_LOCALE`, 365 Tage) gespeichert.

## Architektur

```
src/
├── i18n/
│   ├── locale-config.ts # EINZIGE Quelle: Locales, Labels, BCP-47, OG, Intl
│   ├── routing.ts       # next-intl Routing (importiert locale-config)
│   ├── request.ts       # Server: lädt Messages lazy pro Request
│   └── navigation.ts    # Typisierte Link/Router-Hooks mit Locale-Präfix
├── middleware.ts        # Locale-Erkennung, Cookie-Persistenz, Redirects
├── messages/
│   ├── index.ts         # getMessages(locale) – lazy Import
│   └── {locale}/        # 22 Namespaces pro Sprache
├── lib/i18n/
│   ├── namespaces.ts    # Pflicht-Namespaces pro Locale
│   ├── form-schemas.client.ts # Client-Validierung mit übersetzten Meldungen
│   ├── structures.ts    # IDs, Icons, Hrefs (nicht übersetzt)
│   ├── pricing-data.ts  # Feste Preise in EUR
│   └── format.ts        # formatPrice, formatTime (Intl)
└── app/
    └── [locale]/        # Alle Seiten unter Locale-Segment
```

## Datenfluss

1. **Middleware** erkennt Locale aus URL, Cookie oder `Accept-Language`
2. **`[locale]/layout.tsx`** lädt Messages via `getMessages()` (nur aktive Sprache)
3. **`NextIntlClientProvider`** stellt Übersetzungen für Client-Komponenten bereit
4. **Server-Komponenten** nutzen `getTranslations()` aus `next-intl/server`
5. **`LanguageSwitcher`** liest Sprachen aus `LOCALE_DEFINITIONS` (locale-config)

## Namespaces

| Namespace      | Inhalt                                      |
|----------------|---------------------------------------------|
| `metadata`     | SEO-Titel, Description, Keywords            |
| `nav`          | Navigation                                  |
| `header`       | Header-CTAs, Aria-Labels                    |
| `footer`       | Footer-Texte                                |
| `hero`–`faq`   | Sektionen der Homepage                      |
| `forms`        | Formular-Labels, Fehler, Erfolg             |
| `assistant`    | KI-Chat UI                                  |
| `voice` / `tts`| Voice Mode & Vorlesefunktion                |
| `legal`        | Datenschutz, Impressum                      |
| `common`       | WhatsApp, Fehler, Sprachwähler              |

## Neue Sprache hinzufügen

1. Eintrag in `src/i18n/locale-config.ts` → `LOCALE_DEFINITIONS` ergänzen
2. Ordner `src/messages/{locale}/` mit allen 22 Namespace-Dateien anlegen (Struktur wie `de/`)
3. Fertig — Routing, Middleware, Sitemap, LanguageSwitcher und Message-Loader übernehmen die Sprache automatisch

Optional: Vorhandene Übersetzungen in `src/messages/{locale}/` (z. B. `ru`, `pt`) können reaktiviert werden, indem der Eintrag wieder in `LOCALE_DEFINITIONS` ergänzt wird.

## Validierung

```bash
npm run verify:i18n
```

Prüft für alle aktiven Locales, dass jede Namespace-Datei existiert und die Schlüssel mit der Referenz-Locale (`de`) übereinstimmen.

## SEO

- Canonical URLs: `/{locale}`
- `alternates.languages` in Metadata und Sitemap
- `<html lang={locale}>` dynamisch
- Sitemap generiert Einträge für alle Locales × statische Pfade

## Performance

- Lazy Import: nur die aktive Locale wird geladen
- Static Generation: `generateStaticParams()` für alle Locales
- Kein Bundle-Bloat: Messages sind separate Module
