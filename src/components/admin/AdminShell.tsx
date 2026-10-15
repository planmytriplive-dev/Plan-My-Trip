"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/ui/LogoutButton";

const links = [
  { href: "/admin", label: "Overview", mark: "01" },
  { href: "/admin/packages", label: "Trip packages", mark: "02" },
  { href: "/admin/reviews", label: "Traveller reviews", mark: "03" },
  { href: "/admin/gallery", label: "Photo gallery", mark: "04" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="admin-shell min-h-dvh bg-amber-50 lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="admin-sidebar flex flex-col px-5 py-5 text-slate-900 lg:sticky lg:top-0 lg:h-dvh lg:px-6 lg:py-8">
        <Link href="/" className="admin-brand flex items-center gap-3" aria-label="Plan My Trip home">
          <Image src="/logo/logo.png" alt="Plan My Trip logo" width={120} height={114} priority className="h-12 w-12 shrink-0 rounded-xl bg-white object-contain p-1 shadow-sm" />
          <span><strong className="block font-display text-lg leading-tight">Plan My Trip</strong><small className="text-xs text-slate-600">Jammu &amp; Kashmir</small></span>
        </Link>
        <div className="mt-9 hidden text-[10px] font-bold uppercase tracking-[.2em] text-amber-800 lg:block">Workspace</div>
        <nav className="admin-nav mt-5 grid grid-cols-2 gap-2 lg:grid-cols-1" aria-label="Admin navigation">
          {links.map((link) => {
            const active = link.href === "/admin" ? pathname === link.href : pathname.startsWith(link.href);
            return <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={`admin-nav-link ${active ? "admin-nav-link-active" : ""}`}><span className="admin-nav-mark">{link.mark}</span><span>{link.label}</span></Link>;
          })}
        </nav>
        <div className="mt-6 hidden rounded-2xl border border-amber-200 bg-white/75 p-4 lg:block">
          <span className="admin-live-dot" />
          <strong className="ml-2 text-xs font-semibold">Your site is ready</strong>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">Updates here appear on your public travel website.</p>
        </div>
        <div className="mt-auto hidden pt-8 lg:block"><Link href="/" className="mb-3 block text-sm text-white/65 transition hover:text-white">← View public website</Link><LogoutButton /></div>
      </aside>
      <div className="min-w-0">
        <header className="admin-topbar flex items-center justify-between gap-4 border-b border-navy/10 bg-white px-5 py-3 sm:px-8 lg:px-10">
          <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-orange-deep">Plan My Trip · Admin</p><p className="mt-0.5 text-xs text-ink/55">Manage your travel website</p></div>
          <div className="flex items-center gap-3"><Link href="/" className="text-xs font-semibold text-navy hover:text-orange-deep">View website <span aria-hidden="true">↗</span></Link><span className="admin-avatar" aria-label="Administrator">A</span></div>
        </header>
        <div className="admin-content min-h-[calc(100dvh-57px)] px-4 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">{children}</div>
        <div className="flex items-center justify-between gap-3 border-t border-navy/10 px-5 py-4 text-xs text-ink/45 sm:px-8 lg:px-10"><span>Plan My Trip · Admin workspace</span><div className="flex gap-4 lg:hidden"><Link href="/" className="font-semibold text-navy">Website</Link><LogoutButton /></div><span className="hidden lg:inline">Made for journeys worth remembering</span></div>
      </div>
    </div>
  );
}
