/**
 * Internationalisierung – typisierte Navigation
 *
 * Link, redirect und Router mit automatischem Locale-Präfix.
 */

import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
