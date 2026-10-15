"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Eye, Heart, Share2 } from "lucide-react";

type Counts = { likes: number; views: number; shares: number };
const visitorStorageKey = "pmt-package-visitor-v1";

export function PackageEngagement({ slug, initialCounts }: { slug: string; initialCounts: Counts }) {
  const root = useRef<HTMLDivElement>(null);
  const [visitorId, setVisitorId] = useState("");
  const [counts, setCounts] = useState(initialCounts);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async (id: string) => {
    const response = await fetch(`/api/packages/interactions?slug=${encodeURIComponent(slug)}&visitorId=${encodeURIComponent(id)}`, { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    setCounts(data.counts);
    setLiked(data.liked);
  }, [slug]);

  useEffect(() => {
    let id = localStorage.getItem(visitorStorageKey);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(visitorStorageKey, id);
    }
    setVisitorId(id);
    void refresh(id);
    const poll = window.setInterval(() => void refresh(id!), 30000);
    return () => window.clearInterval(poll);
  }, [refresh]);

  useEffect(() => {
    if (!visitorId || !root.current) return;
    const target = root.current;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      void fetch("/api/packages/interactions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, visitorId, action: "view" }) })
        .then((response) => response.ok ? response.json() : null)
        .then((data) => { if (data?.counts) setCounts(data.counts); });
    }, { threshold: 0.5 });
    observer.observe(target);
    return () => observer.disconnect();
  }, [slug, visitorId]);

  async function like() {
    if (!visitorId || busy) return;
    setBusy(true);
    try {
      const response = await fetch("/api/packages/interactions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, visitorId, action: "like" }) });
      if (!response.ok) return;
      const data = await response.json();
      setCounts(data.counts);
      setLiked(data.liked);
    } finally { setBusy(false); }
  }

  async function share() {
    if (!visitorId || busy) return;
    setBusy(true);
    try {
      const url = `${window.location.origin}/packages/${slug}`;
      if (navigator.share) await navigator.share({ title: "Plan My Trip package", url });
      else await navigator.clipboard.writeText(url);
      const response = await fetch("/api/packages/interactions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, visitorId, action: "share" }) });
      if (response.ok) setCounts((await response.json()).counts);
    } catch { /* A cancelled or unavailable share should not increase the count. */ }
    finally { setBusy(false); }
  }

  return <div ref={root} className="package-engagement" aria-label="Package activity">
    <button type="button" onClick={like} disabled={!visitorId || busy} aria-pressed={liked} aria-label={`${liked ? "Unlike" : "Like"} this package`} className={`package-engagement-button ${liked ? "package-engagement-liked" : ""}`}><Heart className="size-4" fill={liked ? "currentColor" : "none"} /><span>{counts.likes} <span className="package-engagement-label">likes</span></span></button>
    <span className="package-engagement-stat" aria-label={`${counts.views} views`}><Eye className="size-4" /><span>{counts.views} <span className="package-engagement-label">views</span></span></span>
    <button type="button" onClick={share} disabled={!visitorId || busy} aria-label="Share this package" className="package-engagement-button"><Share2 className="size-4" /><span>{counts.shares} <span className="package-engagement-label">shares</span></span></button>
  </div>;
}
