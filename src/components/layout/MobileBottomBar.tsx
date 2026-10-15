"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bot, ChevronDown, Menu, Phone, X } from "lucide-react";
import { navLinks, site, telHref, whatsappHref } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export function MobileBottomBar() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const track = (event: string) => {
    (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event });
  };

  return (
    <>
      <nav
        aria-label="Quick actions"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-navy/10 bg-white/95 backdrop-blur lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="mx-auto grid max-w-lg grid-cols-4 items-end px-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
            className="flex min-h-14 flex-col items-center justify-center gap-0.5 text-navy"
          >
            <Menu className="size-6" aria-hidden="true" />
            <span className="text-xs font-semibold">Menu</span>
          </button>

          <Link href="/trip-saathi" aria-label="Ask Katra Trip Saathi" className="flex min-h-14 flex-col items-center justify-center gap-0.5 text-navy">
            <Bot className="size-6" aria-hidden="true" />
            <span className="text-[10px] font-semibold">Trip Saathi</span>
          </Link>

          <a
            href={telHref}
            onClick={() => track("call_click")}
            aria-label={`Call ${site.phoneDisplay}`}
            className="-mt-6 mb-1 flex size-16 items-center justify-center justify-self-center rounded-full bg-orange text-white shadow-lg ring-4 ring-white active:scale-95"
          >
            <Phone className="size-6" aria-hidden="true" />
          </a>

          <a
            href={whatsappHref()}
            onClick={() => track("whatsapp_click")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="flex min-h-14 flex-col items-center justify-center gap-0.5 text-whatsapp"
          >
            <WhatsAppIcon className="size-6" />
            <span className="text-xs font-semibold">WhatsApp</span>
          </a>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Site menu">
            <motion.button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-navy-deep/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-3xl bg-white px-5 pt-5"
              style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}
              initial={reduce ? { opacity: 0 } : { y: "100%" }}
              animate={reduce ? { opacity: 1 } : { y: 0 }}
              exit={reduce ? { opacity: 0 } : { y: "100%" }}
              transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}
            >
              <div className="flex items-center justify-between">
                <p className="font-display text-xl text-navy">{site.name}</p>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="flex size-11 items-center justify-center rounded-full bg-mist text-navy">
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>
              <ul className="mt-3 divide-y divide-navy/10">
                {navLinks.map((l) => l.label === "Packages" ? (
                  <li key={l.href}>
                    <details className="py-2">
                      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-lg font-medium text-navy">
                        Packages <ChevronDown className="mr-1 size-4" aria-hidden="true" />
                      </summary>
                      <div className="grid gap-1 pb-2 pl-3">
                        <Link href="/packages/customize" onClick={() => setOpen(false)} className="flex min-h-11 items-center text-base font-semibold text-navy">Custom trip planner</Link>
                        <Link href="/packages" onClick={() => setOpen(false)} className="flex min-h-11 items-center text-base font-semibold text-navy">Curated packages</Link>
                      </div>
                    </details>
                  </li>
                ) : (
                  <li key={l.href}>
                    <Link href={l.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center text-lg font-medium text-navy">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-ink/70">
                Call or WhatsApp: <a href={telHref} className="font-semibold text-navy">{site.phoneDisplay}</a>
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
