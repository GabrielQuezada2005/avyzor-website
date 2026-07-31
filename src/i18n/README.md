# AVYZOR Internationalisierung (i18n)

## Übersicht

Die Website nutzt [next-intl](https://next-intl-docs.vercel.app/) mit locale-präfixierten URLs:

| Locale | URL      | Sprache   |
|--------|----------|-----------|
| `de`   | `/de`    | Deutsch   |
| `en`   | `/en`    | Englisch  |
| `es`   | `/es`    | Spanisch  |
| `fr`   | `/fr`    | Französisch |
| `it`   | `/it`    | Italienisch |

Standard-Locale: **de** (Redirect von `/` → `/de`)

## Architektur

```
src/
├── i18n/
│   ├── routing.ts       # Locales, defaultLocale, BCP-47 Mapping
│   ├── request.ts       # Server: lädt Messages lazy pro Request
│   └── navigation.ts    # Typisierte Link/Router-Hooks mit Locale-Präfix
├── middleware.ts        # Locale-Erkennung, Cookie-Persistenz, Redirects
├── messages/
│   ├── index.ts         # getMessages(locale) – lazy Import
│   └── {locale}/        # 22 Namespaces pro Sprache
├── lib/i18n/
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

## KI-Assistent

- UI-Strings aus `assistant`-Namespace
- `locale` wird an `/api/assistant` übergeben
- `buildLocaleInstruction()` prepended zum System-Prompt
- Bei Sprachwechsel: Chat-Reset mit neuer Welcome-Message
- Voice/TTS synchronisiert über `localeToBcp47`

## Neue Sprache hinzufügen

1. Locale in `src/i18n/routing.ts` → `locales` Array ergänzen
2. Ordner `src/messages/{locale}/` mit allen 22 Namespace-Dateien anlegen (Struktur wie `de/`)
3. Loader in `src/messages/index.ts` registrieren
4. `localeToBcp47` und `localeToOg` in `routing.ts` ergänzen
5. Optional: `z.enum` in `assistant/validation.ts` erweitern

## SEO

- Canonical URLs: `/{locale}`
- `alternates.languages` in Metadata und Sitemap
- `<html lang={locale}>` dynamisch
- Sitemap generiert Einträge für alle Locales × statische Pfade

## Performance

- Lazy Import: nur die aktive Locale wird geladen
- Static Generation: `generateStaticParams()` für alle Locales
- Kein Bundle-Bloat: Messages sind separate Module
