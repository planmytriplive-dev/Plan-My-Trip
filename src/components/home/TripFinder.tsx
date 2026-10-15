"use client";

import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { site } from "@/lib/site";

export function TripFinder() {
  const [destination, setDestination] = useState("Kashmir");
  const [duration, setDuration] = useState("5–7 days");
  const [budget, setBudget] = useState("Any budget");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = `Hi Plan My Trip, I am planning a ${destination} trip for ${duration} with a budget of ${budget}. Please share suitable options.`;
    window.open(`https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  const field = "min-h-12 w-full rounded-xl border border-navy/10 bg-white px-3 text-sm font-medium text-ink outline-none focus:border-orange";
  return (
    <form onSubmit={submit} className="grid gap-3 rounded-2xl bg-white p-3 shadow-[0_16px_50px_rgba(7,27,61,.16)] md:grid-cols-[1.25fr_1fr_1fr_auto] md:items-end md:gap-2 md:p-2">
      <label className="block px-1 text-xs font-semibold uppercase tracking-[.12em] text-ink/55">Destination
        <select className={`${field} mt-1.5`} value={destination} onChange={(e) => setDestination(e.target.value)}>
          {["Kashmir", "Katra & Vaishno Devi", "Srinagar", "Gulmarg", "Pahalgam", "Sonamarg", "Himachal Pradesh", "Shimla", "Manali", "Dharamshala", "Dalhousie"].map((x) => <option key={x}>{x}</option>)}
        </select>
      </label>
      <label className="block px-1 text-xs font-semibold uppercase tracking-[.12em] text-ink/55">Duration
        <select className={`${field} mt-1.5`} value={duration} onChange={(e) => setDuration(e.target.value)}>
          {["2–3 days", "4–5 days", "5–7 days", "8+ days"].map((x) => <option key={x}>{x}</option>)}
        </select>
      </label>
      <label className="block px-1 text-xs font-semibold uppercase tracking-[.12em] text-ink/55">Budget per person
        <select className={`${field} mt-1.5`} value={budget} onChange={(e) => setBudget(e.target.value)}>
          {["Any budget", "Under ₹15,000", "₹15,000–₹30,000", "₹30,000+"].map((x) => <option key={x}>{x}</option>)}
        </select>
      </label>
      <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange px-5 font-semibold text-white transition-colors hover:bg-orange-deep active:scale-[.98]" type="submit"><Search className="size-4" />Find my trip</button>
    </form>
  );
}
