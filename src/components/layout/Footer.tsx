import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { Linkedin, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const socialLinks = [
  { href: SITE_CONFIG.social.linkedin, label: "LinkedIn", icon: Linkedin },
  { href: SITE_CONFIG.social.instagram, label: "Instagram", icon: Instagram },
  { href: SITE_CONFIG.social.twitter, label: "Twitter", icon: Twitter },
].filter((link) => link.href);

export function Footer() {
  const hasAddress = Boolean(SITE_CONFIG.address.street);

  return (
    <footer className="bg-dark-950 border-t border-white/5">
      <div className="container-premium mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-6">
              <Image
                src="/logos/avyzor-logo.png"
                alt={`${SITE_CONFIG.name} Logo`}
                width={36}
                height={36}
                className="w-9 h-9 object-contain"
              />
              <span className="font-display text-lg font-bold tracking-[0.15em]">
                {SITE_CONFIG.name}
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Premium KI-Agentur für digitale Exzellenz. Wir transformieren
              Unternehmen mit modernster Technologie und erstklassigem Design.
            </p>
            {socialLinks.length > 0 && (
              <div className="flex gap-4">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/40 hover:text-gold-400 transition-colors"
                    aria-label={label}
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Navigation</h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/50 hover:text-gold-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Leistungen</h3>
            <ul className="space-y-3">
              {[
                "Premium-Websites",
                "KI-Chatbots",
                "KI-Automatisierungen",
                "Terminbuchung",
                "CRM-Integration",
                "SEO",
                "Wartung",
              ].map((service) => (
                <li key={service}>
                  <Link
                    href="/#leistungen"
                    className="text-white/50 hover:text-gold-400 transition-colors text-sm"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Kontakt</h3>
            <ul className="space-y-4">
              {hasAddress && (
                <li className="flex items-start gap-3 text-sm text-white/50">
                  <MapPin size={16} className="text-gold-500 mt-0.5 shrink-0" aria-hidden="true" />
                  <span>
                    {SITE_CONFIG.address.street}
                    <br />
                    {SITE_CONFIG.address.zip} {SITE_CONFIG.address.city}
                  </span>
                </li>
              )}
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="flex items-center gap-3 text-sm text-white/50 hover:text-gold-400 transition-colors"
                >
                  <Mail size={16} className="text-gold-500 shrink-0" aria-hidden="true" />
                  {SITE_CONFIG.email}
                </a>
              </li>
              {SITE_CONFIG.phone && (
                <li>
                  <a
                    href={`tel:${SITE_CONFIG.phoneHref}`}
                    className="flex items-center gap-3 text-sm text-white/50 hover:text-gold-400 transition-colors"
                  >
                    <Phone size={16} className="text-gold-500 shrink-0" aria-hidden="true" />
                    {SITE_CONFIG.phone}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} {SITE_CONFIG.name}. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-6">
            <Link
              href="/impressum"
              className="text-white/30 hover:text-gold-400 transition-colors text-sm"
            >
              Impressum
            </Link>
            <Link
              href="/datenschutz"
              className="text-white/30 hover:text-gold-400 transition-colors text-sm"
            >
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
