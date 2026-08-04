/** Builds a wa.me href from a phone number or an existing WhatsApp URL. */
export function buildWhatsAppHref(
  config: string,
  defaultMessage?: string
): string | null {
  const raw = config.trim();
  if (!raw) return null;

  if (/^https?:\/\//i.test(raw)) {
    try {
      const url = new URL(raw);
      if (defaultMessage && !url.searchParams.has("text")) {
        url.searchParams.set("text", defaultMessage);
      }
      return url.toString();
    } catch {
      return null;
    }
  }

  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;

  const base = `https://wa.me/${digits}`;
  if (!defaultMessage) return base;
  return `${base}?text=${encodeURIComponent(defaultMessage)}`;
}
