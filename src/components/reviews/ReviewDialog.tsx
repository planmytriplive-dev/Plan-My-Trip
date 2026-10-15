"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { ReviewForm } from "@/components/reviews/ReviewForm";

export function ReviewDialog() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return <>
    <button type="button" onClick={() => setOpen(true)} className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-sun px-5 text-sm font-bold text-ink shadow-sm transition hover:bg-sun-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy">Write a review</button>
    <dialog ref={dialogRef} aria-labelledby="write-review-title" onClose={() => setOpen(false)} onClick={(event) => { if (event.target === dialogRef.current) setOpen(false); }} className="w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-2xl border-0 bg-cream p-0 text-ink shadow-2xl backdrop:bg-navy/60 backdrop:backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4 border-b border-navy/10 bg-white px-5 py-4 md:px-7">
        <div><span className="eyebrow">Traveller reviews</span><h2 id="write-review-title" className="mt-1 font-display text-2xl text-navy">Share your experience</h2><p className="mt-1 text-sm text-ink/60">Tell other travellers what your trip was like.</p></div>
        <button type="button" aria-label="Close review form" onClick={() => setOpen(false)} className="grid size-10 shrink-0 place-items-center rounded-full border border-navy/10 text-navy transition hover:bg-cream"><X className="size-5" /></button>
      </div>
      <div className="max-h-[calc(100dvh-7rem)] overflow-y-auto p-4 md:p-6"><ReviewForm /></div>
    </dialog>
  </>;
}
