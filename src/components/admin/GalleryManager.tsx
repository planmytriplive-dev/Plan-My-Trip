"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";

type GalleryEntry = { _id: string; url: string; caption: string; destination: string; createdAt: string };

export function GalleryManager() {
  const [images, setImages] = useState<GalleryEntry[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function load() {
    const response = await fetch("/api/admin/gallery");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not load gallery.");
    setImages(data.images);
  }
  useEffect(() => { load().catch((error) => setMessage(error.message)); }, []);

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage("");
    const form = event.currentTarget;
    const fields = new FormData(form);
    const file = fields.get("image");
    if (!(file instanceof File) || !file.size) { setBusy(false); setMessage("Choose an image first."); return; }
    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) { setBusy(false); setMessage("Choose an image file up to 10 MB."); return; }
    try {
      const signResponse = await fetch("/api/admin/gallery/sign", { method: "POST" });
      const sign = await signResponse.json();
      if (!signResponse.ok) throw new Error(sign.error || "Could not prepare upload.");
      const uploadBody = new FormData();
      uploadBody.set("file", file);
      uploadBody.set("api_key", sign.apiKey);
      uploadBody.set("timestamp", String(sign.timestamp));
      uploadBody.set("folder", sign.folder);
      uploadBody.set("signature", sign.signature);
      const cloudResponse = await fetch(`https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`, { method: "POST", body: uploadBody });
      const cloud = await cloudResponse.json();
      if (!cloudResponse.ok) throw new Error(cloud.error?.message || "Image upload failed.");
      const saveResponse = await fetch("/api/admin/gallery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: cloud.secure_url, publicId: cloud.public_id, caption: fields.get("caption"), destination: fields.get("destination") }) });
      const saved = await saveResponse.json();
      if (!saveResponse.ok) throw new Error(saved.error || "Could not save image details.");
      form.reset(); await load(); setMessage("Image added to the gallery.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Upload failed. Please try again."); }
    finally { setBusy(false); }
  }
  async function remove(id: string) {
    const response = await fetch("/api/admin/gallery", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    const data = await response.json();
    if (!response.ok) { setMessage(data.error || "Could not remove image."); return; }
    setImages((items) => items.filter((image) => image._id !== id));
  }

  return <>
    <form onSubmit={upload} className="mt-6 grid gap-4 rounded-2xl border border-navy/10 bg-white p-5 md:grid-cols-2">
      <label className="grid gap-1.5 text-sm font-semibold text-navy md:col-span-2">Image (up to 10 MB)<input name="image" type="file" accept="image/*" required className="rounded-lg border border-navy/15 p-3 font-normal" /></label>
      <label className="grid gap-1.5 text-sm font-semibold text-navy">Caption<input name="caption" maxLength={160} className="min-h-11 rounded-lg border border-navy/15 px-3 font-normal" /></label>
      <label className="grid gap-1.5 text-sm font-semibold text-navy">Destination<input name="destination" maxLength={80} placeholder="For example, Gulmarg" className="min-h-11 rounded-lg border border-navy/15 px-3 font-normal" /></label>
      <div className="md:col-span-2"><button disabled={busy} className="min-h-11 rounded-lg bg-navy px-5 font-semibold text-white disabled:opacity-60">{busy ? "Uploading…" : "Add image"}</button>{message && <p role="status" className="mt-3 text-sm text-ink/70">{message}</p>}</div>
    </form>
    <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{images.map((image) => <article key={image._id} className="overflow-hidden rounded-xl border border-navy/10"><div className="relative aspect-[4/3]"><Image src={image.url} alt={image.caption || image.destination || "Gallery image"} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" /></div><div className="flex items-center justify-between gap-3 p-3"><p className="min-w-0 truncate text-sm text-navy">{image.caption || image.destination || "Untitled image"}</p><button onClick={() => remove(image._id)} className="shrink-0 text-sm font-semibold text-red-700">Remove</button></div></article>)}</div>
    {!images.length && <p className="mt-5 text-ink/60">No gallery images yet.</p>}
  </>;
}
