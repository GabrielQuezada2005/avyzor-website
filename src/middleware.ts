/**
 * Internationalisierung – Middleware
 *
 * Leitet Besucher auf locale-präfixierte URLs um (/de, /en, …)
 * und persistiert die Sprachwahl via Cookie (next-intl).
 */

import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    "/",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
