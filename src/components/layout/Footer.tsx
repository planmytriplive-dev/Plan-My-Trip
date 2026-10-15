import Image from "next/image";
import Link from "next/link";
import { navLinks, site, telHref, secondaryTelHref, whatsappHref } from "@/lib/site";

const destinations = [
  { href: "/destinations/katra-vaishno-devi", label: "Katra & Vaishno Devi" },
  { href: "/destinations/srinagar", label: "Srinagar" },
  { href: "/destinations/gulmarg", label: "Gulmarg" },
  { href: "/destinations/pahalgam", label: "Pahalgam" },
  { href: "/destinations/sonamarg", label: "Sonamarg" },
  { href: "/destinations/jammu", label: "Jammu" },
  { href: "/destinations#himachal-pradesh", label: "Himachal Pradesh" },
  { href: "/destinations/shimla", label: "Shimla" },
  { href: "/destinations/manali", label: "Manali" },
  { href: "/destinations/spiti-valley", label: "Spiti Valley" },
];

// Cache Components forbids reading the clock during prerender; "use cache" is the sanctioned fix.
async function CopyrightYear() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  const a = site.address;
  return (
    <footer className="bg-white text-navy-deep">
      <div className="mx-auto grid max-w-7xl gap-9 px-4 py-12 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        <div>
          <Link href="/" aria-label={`${site.name} home`} className="inline-flex rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange">
            <Image src="/logo/logo.png" alt={site.name} width={120} height={114} className="h-14 w-auto object-contain object-left" />
          </Link>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-navy-deep/75">Travel agency in {a.locality} for Vaishno Devi yatra, Jammu and Kashmir tours, and Himachal holidays.</p>
          <address className="mt-4 text-sm not-italic leading-relaxed text-navy-deep/80">
            {[a.street, a.locality, a.region, a.postalCode].filter(Boolean).join(", ")}
            <br />
            Phone: <a href={telHref} className="font-semibold text-navy-deep hover:text-orange">{site.phoneDisplay}</a>
            <br />
            Phone: <a href={secondaryTelHref} className="font-semibold text-navy-deep hover:text-orange">{site.phoneSecondaryDisplay}</a>
            <br />
            {site.email && <>Email: <a href={`mailto:${site.email}`} className="underline hover:text-orange">{site.email}</a></>}
          </address>
          <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-orange px-5 font-semibold text-white hover:bg-orange-deep">
            Talk to a travel expert
          </a>
        </div>
        <nav aria-label="Footer">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-navy-deep">Explore</p>
          <ul className="mt-3 space-y-1 text-navy-deep/75">
            {navLinks.map((l) => (
              <li key={l.href}><Link href={l.href} className="inline-flex min-h-9 items-center text-sm hover:text-orange">{l.label}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Destinations">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-navy-deep">Destinations</p>
          <ul className="mt-3 space-y-1 text-navy-deep/75">
            {destinations.map((d) => (
              <li key={d.href}><Link href={d.href} className="inline-flex min-h-9 items-center text-sm hover:text-orange">{d.label}</Link></li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-navy-deep">Plan your trip</p>
          <p className="mt-3 text-sm leading-relaxed text-navy-deep/75">Speak with our team to plan your Vaishno Devi yatra or Kashmir holiday.</p>
          <a href={telHref} className="mt-3 inline-flex min-h-11 items-center font-display text-xl font-semibold text-navy-deep hover:text-orange">{site.phoneDisplay}</a>
          <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-orange hover:text-orange-deep">Chat with us on WhatsApp <span aria-hidden="true" className="ml-1">↗</span></a>
        </div>
      </div>
      <div className="bg-sun px-4 py-5 text-navy-deep">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between md:px-2">
          <p>© <CopyrightYear /> {site.name}. <Link href="/privacy-policy" className="underline underline-offset-2">Privacy</Link> · <Link href="/terms" className="underline underline-offset-2">Terms</Link></p>
          <p>Website developed by <a href="https://www.snipercoders.in/" target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2 hover:text-orange-deep">SniperCoders</a></p>
        </div>
      </div>
    </footer>
  );
}
