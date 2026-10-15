import type { Metadata } from "next";
import { MapPin, Phone, ArrowUpRight, Mail } from "lucide-react";
import { site, telHref, secondaryTelHref, whatsappHref } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export const metadata: Metadata = {
  title: "Contact Plan My Trip",
  description:
    "Talk to the Plan My Trip team in Katra about your Vaishno Devi yatra or Jammu and Kashmir holiday.",
};

export default function ContactPage() {
  const address = [
    site.address.street,
    site.address.locality,
    site.address.region,
    site.address.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <main className="min-h-[65vh] bg-white">
      <section className="px-5 pb-12 pt-12 md:px-8 md:pb-16 md:pt-20">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-[2rem] bg-[#fff8d9] px-6 py-10 sm:px-10 md:px-14 md:py-14">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#f2d66f] bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-[#755900]">
              <span className="size-2 rounded-full bg-[#e8b900]" />
              Local help from Katra
            </span>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-tight text-ink sm:text-5xl md:text-6xl">
              Let's plan your trip.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-ink/70 md:text-lg">
              Tell us when you're travelling and what you'd like to see. Our team
              can help you plan your Vaishno Devi yatra or Kashmir holiday.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-[1.15fr_.85fr]">
            <section className="rounded-[1.5rem] border border-[#f0e6bd] bg-white p-6 shadow-[0_12px_36px_rgba(50,40,10,.06)] sm:p-8">
              <span className="eyebrow">Speak with our team</span>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-ink sm:text-3xl">
                We're one call away.
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink/65 sm:text-base">
                Get straightforward help with dates, transport and your itinerary.
              </p>
              <a
                href={telHref}
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#ffd21f] px-5 font-bold text-ink transition-colors hover:bg-[#f2c400] sm:w-auto"
              >
                <Phone className="size-4" aria-hidden="true" />
                Call {site.phoneDisplay}
              </a>
              <a
                href={secondaryTelHref}
                className="mt-2 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#f0e6bd] px-5 font-bold text-ink transition-colors hover:bg-[#fff8d9] sm:ml-2 sm:mt-6 sm:w-auto"
              >
                <Phone className="size-4" aria-hidden="true" />
                Call {site.phoneSecondaryDisplay}
              </a>
              <div className="mt-5 flex items-center gap-3 border-t border-[#f1eddf] pt-5">
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#d9e8dc] bg-[#f4fbf5] px-4 font-semibold text-[#176b38] transition-colors hover:bg-[#e9f6eb]"
                >
                  <WhatsAppIcon className="size-5" />
                  Message on WhatsApp
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              </div>
              <a href={`mailto:${site.email}`} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink hover:text-orange">
                <Mail className="size-4" aria-hidden="true" />
                {site.email}
              </a>
            </section>

            <section className="flex flex-col justify-between rounded-[1.5rem] bg-[#fffdf5] p-6 sm:p-8">
              <div>
                <span className="eyebrow">Your local travel team</span>
                <h2 className="mt-2 font-display text-2xl font-extrabold text-ink sm:text-3xl">
                  {site.name}
                </h2>
                <p className="mt-2 text-sm leading-6 text-ink/65 sm:text-base">
                  Planning support for Vaishno Devi and Jammu, Kashmir &amp;
                  Himachal tours.
                </p>
              </div>
              <div className="mt-7 flex gap-3 border-t border-[#f1eddf] pt-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#fff0b2] text-[#755900]">
                  <MapPin className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-bold text-ink">Based in {site.address.locality}</p>
                  <p className="mt-1 text-sm leading-6 text-ink/65">{address}</p>
                  <p className="mt-2 text-xs leading-5 text-ink/50">
                    Call ahead and we'll confirm the best meeting point.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
