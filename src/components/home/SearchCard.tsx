"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search } from "lucide-react";
import { destinations } from "@/lib/travel-content";

const places = destinations.map((place) => ({
  name: place.name,
  slug: place.slug,
  region: "region" in place ? place.region : place.slug === "jammu" || place.slug === "katra-vaishno-devi" ? "Jammu" : "Kashmir",
}));
const regions = ["Kashmir", "Jammu", "Himachal Pradesh"] as const;

export function SearchCard() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const matches = useMemo(() => places.filter((place) => `${place.name} ${place.region}`.toLowerCase().includes(query.trim().toLowerCase())), [query]);

  function openDestination(slug: string) {
    setFocused(false);
    router.push(`/destinations/${slug}`);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedQuery = query.trim().toLowerCase();
    const exactMatch = places.find((place) => place.name.toLowerCase() === normalizedQuery);
    if (exactMatch) openDestination(exactMatch.slug);
    else setFocused(true);
  }

  return <form onSubmit={submit} className="hero-search" role="search" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <label htmlFor="trip-search" className="mb-2 block text-sm font-bold text-ink">Where can we take you?</label>
    <div className="flex items-center gap-2 rounded-lg border border-ink/15 px-3"><Search aria-hidden="true" className="size-5 shrink-0 text-ink/50" /><input id="trip-search" type="search" autoComplete="off" aria-expanded={focused} aria-controls="destination-suggestions" aria-autocomplete="list" value={query} onChange={(event) => setQuery(event.target.value)} onFocus={() => setFocused(true)} placeholder="Choose a destination" className="min-h-12 min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink/45" /><button type="submit" className="hidden min-h-10 rounded-lg bg-sun px-4 text-sm font-bold text-ink sm:inline-flex sm:items-center">Go</button></div>
    {focused && <ul id="destination-suggestions" role="listbox" aria-label="Available destinations" className="hero-search-options absolute inset-x-3 max-h-[min(65vh,28rem)] overflow-y-auto rounded-xl border border-ink/10 bg-white p-2 shadow-2xl sm:inset-x-5">
      {matches.length ? regions.map((region) => {
        const regionPlaces = matches.filter((place) => place.region === region);
        if (!regionPlaces.length) return null;
        return <li key={region} role="presentation"><p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wider text-ink/50">{region} destinations</p><ul>{regionPlaces.map((place) => <li key={place.slug} role="option" aria-selected="false"><button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => openDestination(place.slug)} className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-left text-sm font-medium text-ink hover:bg-cream focus-visible:bg-cream"><MapPin aria-hidden="true" className="size-4 shrink-0 text-orange-deep" />{place.name}</button></li>)}</ul></li>;
      }) : <li className="px-3 py-3 text-sm text-ink/60">No destination found. Choose from the available places above.</li>}
    </ul>}
  </form>;
}
