"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Instagram,
  Mail,
  MessageCircle,
  Phone,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SITE_CONFIG } from "@/lib/constants";
import { NAV_HREFS } from "@/lib/i18n/structures";
import { easeOutExpo, springTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { buildWhatsAppHref } from "@/lib/whatsapp-url";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.16 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.79 1.52V6.84a4.84 4.84 0 0 1-1.04-.15z" />
    </svg>
  );
}

type MenuAction = {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
  external?: boolean;
  internal?: boolean;
};

export function ContactMenu() {
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const whatsappUrl = buildWhatsAppHref(
    SITE_CONFIG.whatsapp,
    t("whatsapp.defaultMessage")
  );
  const phoneHref = SITE_CONFIG.phoneHref || SITE_CONFIG.phone;
  const bookHref = SITE_CONFIG.calendly || NAV_HREFS.contact;
  const bookExternal = Boolean(SITE_CONFIG.calendly);
  const instagramHref =
    SITE_CONFIG.social.instagram || "https://instagram.com/avyzor";
  const tiktokHref =
    SITE_CONFIG.social.tiktok || "https://www.tiktok.com/@avyzor";

  const actions: MenuAction[] = [
    {
      id: "call",
      label: t("contactMenu.call"),
      href: phoneHref ? `tel:${phoneHref}` : NAV_HREFS.contact,
      icon: <Phone size={18} strokeWidth={2.25} />,
      internal: !phoneHref,
    },
    {
      id: "whatsapp",
      label: t("contactMenu.whatsapp"),
      href: whatsappUrl || NAV_HREFS.contact,
      icon: <MessageCircle size={18} strokeWidth={2.25} />,
      external: Boolean(whatsappUrl),
      internal: !whatsappUrl,
    },
    {
      id: "instagram",
      label: t("contactMenu.instagram"),
      href: instagramHref,
      icon: <Instagram size={18} strokeWidth={2.25} />,
      external: true,
    },
    {
      id: "tiktok",
      label: t("contactMenu.tiktok"),
      href: tiktokHref,
      icon: <TikTokIcon className="h-[18px] w-[18px]" />,
      external: true,
    },
    {
      id: "email",
      label: t("contactMenu.email"),
      href: `mailto:${SITE_CONFIG.email}`,
      icon: <Mail size={18} strokeWidth={2.25} />,
    },
    {
      id: "book",
      label: t("contactMenu.book"),
      href: bookHref,
      icon: <Calendar size={18} strokeWidth={2.25} />,
      external: bookExternal,
      internal: !bookExternal,
    },
  ];

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      setOpen(false);
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const itemClassName = cn(
    "group flex items-center gap-3 rounded-full border border-gold-500/20 bg-dark-900/95 py-1.5 pl-4 pr-1.5 shadow-gold backdrop-blur-xl",
    "transition-[border-color,background-color] duration-300",
    "hover:border-gold-500/40 hover:bg-dark-800/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40"
  );

  function renderItemContent(action: MenuAction) {
    return (
      <>
        <span className="max-w-[10rem] truncate text-sm font-medium tracking-wide text-white/90 sm:max-w-none">
          {action.label}
        </span>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-500/30 bg-dark-800 text-gold-400 shadow-gold transition-colors group-hover:border-gold-500/50 group-hover:bg-dark-700 group-hover:text-gold-300">
          {action.icon}
        </span>
      </>
    );
  }

  return (
    <motion.div
      ref={rootRef}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 22 }}
      className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3"
      data-testid="contact-menu"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="menu"
            aria-label={t("contactMenu.menuAriaLabel")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: easeOutExpo }}
            className="flex max-h-[min(70vh,28rem)] flex-col-reverse items-end gap-2.5 overflow-y-auto overscroll-contain pb-1"
          >
            {actions.map((action, index) => {
              const motionProps = {
                initial: { opacity: 0, y: 12, scale: 0.92 },
                animate: { opacity: 1, y: 0, scale: 1 },
                exit: { opacity: 0, y: 8, scale: 0.94 },
                transition: {
                  duration: 0.28,
                  delay: index * 0.04,
                  ease: easeOutExpo,
                },
              };

              if (action.internal) {
                return (
                  <motion.div key={action.id} {...motionProps}>
                    <Link
                      href={action.href}
                      role="menuitem"
                      onClick={() => setOpen(false)}
                      className={itemClassName}
                    >
                      {renderItemContent(action)}
                    </Link>
                  </motion.div>
                );
              }

              return (
                <motion.a
                  key={action.id}
                  href={action.href}
                  role="menuitem"
                  target={action.external ? "_blank" : undefined}
                  rel={action.external ? "noopener noreferrer" : undefined}
                  onClick={() => setOpen(false)}
                  className={itemClassName}
                  {...motionProps}
                >
                  {renderItemContent(action)}
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((value) => !value)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-label={
          open ? t("contactMenu.closeAriaLabel") : t("contactMenu.openAriaLabel")
        }
        aria-expanded={open}
        aria-controls={menuId}
        className={cn(
          "relative flex h-14 w-14 items-center justify-center rounded-full transition-shadow duration-300",
          open
            ? "border border-gold-500/40 bg-dark-800 shadow-gold"
            : "bg-gold-gradient shadow-gold hover:shadow-gold-lg animate-pulse-gold"
        )}
      >
        <motion.div
          initial={false}
          animate={{ rotate: open ? 90 : 0 }}
          transition={springTransition}
        >
          {open ? (
            <X size={24} className="text-gold-400" />
          ) : (
            <Phone size={24} className="text-dark-900" strokeWidth={2.25} />
          )}
        </motion.div>
      </motion.button>
    </motion.div>
  );
}
