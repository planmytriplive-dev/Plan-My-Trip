import { LogoutButton } from "@/components/ui/LogoutButton";
import Link from "next/link";

export default function AdminHome() {
  return (
    <main className="mx-auto max-w-6xl">
      <section className="admin-welcome relative overflow-hidden rounded-[1.6rem] p-6 text-slate-900 sm:p-9 lg:p-11">
        <div className="admin-welcome-orbit" aria-hidden="true" />
        <p className="eyebrow !text-amber-800">Your travel business, at a glance</p>
        <h1 className="mt-3 max-w-xl font-display text-3xl leading-tight text-slate-950 sm:text-4xl">Welcome to your <span className="text-amber-700">admin workspace.</span></h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-700 sm:text-base">Keep your journeys up to date. Changes you publish here are shown to travellers on your website.</p>
        <Link href="/" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-sun px-5 text-sm font-bold text-navy transition hover:bg-sun-hover">Visit public website <span aria-hidden="true">↗</span></Link>
      </section>

      <section className="mt-9" aria-labelledby="manage-heading">
        <div className="section-heading"><div><p className="eyebrow">Manage your content</p><h2 id="manage-heading" className="mt-1 font-display text-2xl text-navy sm:text-3xl">What would you like to update?</h2></div><p className="max-w-sm text-sm leading-relaxed text-ink/60">Choose a section to add, edit, publish or remove content.</p></div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Link href="/admin/packages" className="admin-module-card group"><span className="admin-module-icon">✳</span><span className="admin-module-kicker">Trips &amp; experiences</span><h3>Tour packages</h3><p>Create packages and update what travellers see on the home page.</p><span className="admin-module-action">Manage packages <span aria-hidden="true">→</span></span></Link>
          <Link href="/admin/reviews" className="admin-module-card group"><span className="admin-module-icon admin-module-icon-orange">★</span><span className="admin-module-kicker">Traveller stories</span><h3>Reviews</h3><p>Review submissions, publish traveller feedback or remove content.</p><span className="admin-module-action">Manage reviews <span aria-hidden="true">→</span></span></Link>
          <Link href="/admin/gallery" className="admin-module-card group"><span className="admin-module-icon admin-module-icon-blue">▧</span><span className="admin-module-kicker">Destination moments</span><h3>Photo gallery</h3><p>Upload destination photos and keep the public gallery fresh.</p><span className="admin-module-action">Manage gallery <span aria-hidden="true">→</span></span></Link>
        </div>
      </section>

      <section className="admin-tip mt-7 flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-orange-deep">A little inspiration</p><h2 className="mt-1 font-display text-xl text-navy">Every great trip starts with a story.</h2><p className="mt-1 text-sm text-ink/60">Invite a traveller to share their experience with your community.</p></div><Link href="/reviews#review-form" className="action-primary shrink-0">Open reviews page <span aria-hidden="true">↗</span></Link></section>
      <div className="mt-8 lg:hidden"><LogoutButton /></div>
    </main>
  );
}
