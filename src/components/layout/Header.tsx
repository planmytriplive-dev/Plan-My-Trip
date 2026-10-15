// //src/app/components/layout/Header.tsx


// import Image from "next/image";
// import Link from "next/link";
// import { Phone } from "lucide-react";
// import { navLinks, site, telHref, whatsappHref } from "@/lib/site";

// export function Header() {
//   return (
//     <header className="sticky top-0 z-40 border-b border-navy/10 bg-white/85 backdrop-blur-md supports-[backdrop-filter]:bg-white/75">
//       <div className="flex h-16 w-full items-center justify-between gap-4 px-4 md:h-20 md:px-6">
//         <Link href="/" className="flex min-w-0 flex-1 items-center gap-3 lg:flex-none" aria-label={`${site.name} home`}>
//           <Image src={site.logo} alt={`${site.name} logo`} width={120} height={114} priority className="h-11 w-auto md:h-14" />
//           <span className="header-brand-name md:hidden"><span>Plan</span><span>My</span><span>Trip</span></span>
//         </Link>

//         <nav aria-label="Main" className="hidden items-center gap-3 lg:flex xl:gap-4">
//           {navLinks.map((l) => (
//             <Link key={l.href} href={l.href} className="whitespace-nowrap text-sm font-semibold text-navy hover:text-orange-deep xl:text-[15px]">
//               {l.label}
//             </Link>
//           ))}
//         </nav>

//         <div className="hidden items-center gap-2 lg:flex">
//         <a href={telHref} className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap text-sm font-semibold text-navy hover:text-orange-deep">
//           <Phone className="size-4" aria-hidden="true" />
//           {site.phoneDisplay}
//         </a>
//         <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center whitespace-nowrap rounded-lg bg-sun px-3 text-sm font-bold text-ink hover:bg-sun-hover">Enquire on WhatsApp</a>
//         </div>
//       </div>
//     </header>
//   );
// }












// src/components/layout/Header.tsx
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Phone } from "lucide-react";
import { navLinks, site, telHref, whatsappHref } from "@/lib/site";
import { TripSaathi } from "@/components/layout/TripSaathi";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-navy/10 bg-white/85 backdrop-blur-md supports-[backdrop-filter]:bg-white/75">
      <div className="flex h-16 w-full items-center justify-between gap-4 px-4 md:h-20 md:px-6">
        <Link href="/" className="flex min-w-0 flex-1 items-center gap-3 lg:flex-none" aria-label={`${site.name} home`}>
          <Image
            src={site.logo}
            alt={`${site.name} logo`}
            width={120}
            height={114}
            priority
            className="h-11 w-auto shrink-0 md:h-14"
          />

          {/* Phones and tablets only: brand name fills the space to the right edge */}
          <span
            aria-hidden="true"
          
          >
            <span className="whitespace-nowrap font-display font-black uppercase leading-none tracking-tight text-sun [font-size:min(11cqw,2rem)]">
              Plan My Trip
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="desktop-main-nav hidden items-center gap-1 rounded-full border border-navy/10 bg-white/90 p-1 lg:flex">
          {navLinks.filter((link) => ["Home", "Packages", "Destinations", "Gallery", "Contact"].includes(link.label)).map((l) => l.label === "Packages" ? (
            <details key={l.href} className="desktop-nav-more relative">
              <summary className="desktop-nav-link flex min-h-10 cursor-pointer list-none items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-semibold text-navy transition-colors xl:px-3.5 xl:text-sm">
                Packages <ChevronDown className="size-3.5" aria-hidden="true" />
              </summary>
              <div className="absolute left-0 top-full z-50 mt-2 grid min-w-60 gap-1 rounded-2xl border border-amber-100 bg-white p-2 shadow-xl">
                <Link href="/packages/customize" className="rounded-xl px-3 py-2.5 hover:bg-amber-50">
                  <span className="block text-sm font-semibold text-navy">Custom trip planner</span>
                  <span className="mt-0.5 block text-xs text-ink/55">Build a trip around your needs</span>
                </Link>
                <Link href="/packages" className="rounded-xl px-3 py-2.5 hover:bg-amber-50">
                  <span className="block text-sm font-semibold text-navy">Curated packages</span>
                  <span className="mt-0.5 block text-xs text-ink/55">Explore our ready-to-book trip ideas</span>
                </Link>
              </div>
            </details>
          ) : (
            <Link key={l.href} href={l.href} className="desktop-nav-link whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-semibold text-navy transition-colors xl:px-3.5 xl:text-sm">
              {l.label}
            </Link>
          ))}
          <details className="desktop-nav-more relative">
            <summary className="flex min-h-10 cursor-pointer list-none items-center gap-1 rounded-full px-3 text-[13px] font-semibold text-navy hover:bg-amber-50 xl:text-sm">Explore <ChevronDown className="size-3.5" /></summary>
            <div className="absolute right-0 top-full z-50 mt-2 grid min-w-44 gap-1 rounded-2xl border border-amber-100 bg-white p-2 shadow-xl">
              {navLinks.filter((link) => ["Services", "Reviews", "Blog", "About"].includes(link.label)).map((l) => <Link key={l.href} href={l.href} className="rounded-xl px-3 py-2 text-sm font-semibold text-navy hover:bg-amber-50">{l.label}</Link>)}
            </div>
          </details>
          <TripSaathi />
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <a href={telHref} className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap text-sm font-semibold text-navy hover:text-orange-deep">
            <Phone className="size-4" aria-hidden="true" />
            {site.phoneDisplay}
          </a>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full bg-sun px-4 text-sm font-bold text-ink shadow-sm transition hover:bg-sun-hover hover:shadow-md"
          >
            Enquire on WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
