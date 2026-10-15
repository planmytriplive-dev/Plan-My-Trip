"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";

type ItineraryDay = { day: number; title: string; description: string };

type TourPackage = {
  _id: string; title: string; slug: string; destinations: string[]; collections: string[]; badge: string; category: string;
  days: number; nights: number; price: number; startingFrom: boolean; shortDescription: string; description: string;
  highlights: string[]; inclusions: string[]; exclusions: string[]; itinerary: ItineraryDay[]; images: string[]; imagePublicIds: string[];
  featured: boolean; published: boolean;
};

const blank: Omit<TourPackage, "_id"> = {
  title: "", slug: "", destinations: [], collections: [], badge: "", category: "Tour", days: 1, nights: 0,
  price: 0, startingFrom: true, shortDescription: "", description: "", highlights: [], inclusions: [],
  exclusions: [], itinerary: [], images: [], imagePublicIds: [], featured: false, published: false,
};
const splitList = (value: FormDataEntryValue | null) => String(value ?? "").split(/[\n,]/).map((item) => item.trim()).filter(Boolean);

export function PackageManager() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [editing, setEditing] = useState<TourPackage | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [itineraryDraft, setItineraryDraft] = useState<ItineraryDay[]>([]);
  async function load() {
    const response = await fetch("/api/admin/packages");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not load packages.");
    setPackages(data.packages);
  }
  useEffect(() => { load().catch((error) => setMessage(error.message)); }, []);
  useEffect(() => { setItineraryDraft(editing?.itinerary?.length ? editing.itinerary : [{ day: 1, title: "", description: "" }]); }, [editing]);

  async function uploadImage(file: File) {
    const signedResponse = await fetch("/api/admin/gallery/sign", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ purpose: "packages" }) });
    const signed = await signedResponse.json();
    if (!signedResponse.ok) throw new Error(signed.error || "Could not prepare image upload.");
    const body = new FormData();
    body.set("file", file); body.set("api_key", signed.apiKey); body.set("timestamp", String(signed.timestamp));
    body.set("folder", signed.folder); body.set("signature", signed.signature);
    const response = await fetch(`https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`, { method: "POST", body });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error?.message || "Image upload failed.");
    return { url: result.secure_url as string, publicId: result.public_id as string };
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    setBusy(true); setMessage("");
    try {
      let images = [...(editing?.images ?? [])];
      let imagePublicIds = [...(editing?.imagePublicIds ?? [])];
      const files = values.getAll("images").filter((value): value is File => value instanceof File && value.size > 0);
      if (files.length + images.length > 12) throw new Error("A package can have up to 12 photos.");
      for (const file of files) {
        if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) throw new Error("Choose image files up to 10 MB each.");
        const uploaded = await uploadImage(file);
        images.push(uploaded.url); imagePublicIds.push(uploaded.publicId);
      }
      const payload = {
        ...(editing ? { id: editing._id } : {}),
        title: values.get("title"), slug: values.get("slug"), destinations: splitList(values.get("destinations")),
        collections: splitList(values.get("collections")), badge: values.get("badge"), category: values.get("category"),
        days: Number(values.get("days")), nights: Number(values.get("nights")), price: Number(values.get("price")),
        startingFrom: values.get("startingFrom") === "on", shortDescription: values.get("shortDescription"),
        description: values.get("description"), highlights: splitList(values.get("highlights")),
        inclusions: splitList(values.get("inclusions")), exclusions: splitList(values.get("exclusions")),
        itinerary: itineraryDraft.filter((day) => day.title.trim() || day.description.trim()).map((day, index) => ({ ...day, day: index + 1, title: day.title.trim() || `Day ${index + 1}`, description: day.description.trim() })),
        featured: values.get("featured") === "on", published: values.get("published") === "on", images, imagePublicIds,
      };
      const response = await fetch("/api/admin/packages", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save package.");
      setEditing(null); form.reset(); await load(); setMessage("Package saved.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not save package."); }
    finally { setBusy(false); }
  }

  async function remove(item: TourPackage) {
    if (!window.confirm(`Delete “${item.title}” and its uploaded package photos?`)) return;
    const response = await fetch("/api/admin/packages", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item._id }) });
    const result = await response.json();
    if (!response.ok) { setMessage(result.error || "Could not delete package."); return; }
    setPackages((items) => items.filter((pkg) => pkg._id !== item._id));
    if (editing?._id === item._id) setEditing(null);
    setMessage("Package deleted.");
  }

  function field(label: string, name: string, options: { value?: string | number; required?: boolean; type?: string; hint?: string; minLength?: number; maxLength?: number } = {}) {
    return <label className="grid gap-1.5 text-sm font-semibold text-navy">{label}<input name={name} type={options.type ?? "text"} defaultValue={options.value} required={options.required} minLength={options.minLength} maxLength={options.maxLength} className="min-h-11 rounded-lg border border-navy/15 px-3 font-normal" />{options.hint && <span className="text-xs font-normal text-ink/55">{options.hint}</span>}</label>;
  }

  return <div className="admin-package-manager mt-6">
    <form key={editing?._id ?? "new"} onSubmit={save} className="grid min-w-0 gap-4 rounded-2xl border border-amber-200 bg-white p-4 shadow-sm sm:p-6 md:grid-cols-2">
      <div className="md:col-span-2"><p className="text-xs font-bold uppercase tracking-[.16em] text-amber-700">Package details</p><h2 className="mt-1 font-display text-2xl text-slate-900">{editing ? "Edit package" : "Create a package"}</h2><p className="mt-1 text-sm text-slate-600">Add your route, pricing and a day by day itinerary.</p></div>
      {field("Package name", "title", { value: editing?.title, required: true, minLength: 3, maxLength: 140 })}
      {field("URL slug (optional)", "slug", { value: editing?.slug, maxLength: 160, hint: "Leave blank to create it from the package name." })}
      {field("Destinations", "destinations", { value: editing?.destinations.join(", "), required: true, hint: "Separate destinations with commas. Himachal examples: Shimla, Manali, Dharamshala." })}
      {field("Collections", "collections", { value: editing?.collections.join(", "), hint: "For example: family, kashmir, himachal, multi-city." })}
      {field("Badge", "badge", { value: editing?.badge, hint: "For example: Family favourite." })}
      {field("Category", "category", { value: editing?.category ?? "Tour" })}
      {field("Days", "days", { value: editing?.days ?? 1, required: true, type: "number" })}
      {field("Nights", "nights", { value: editing?.nights ?? 0, required: true, type: "number" })}
      {field("Price in INR (0 means ask for quote)", "price", { value: editing?.price ?? 0, required: true, type: "number" })}
      <div className="grid gap-2 self-center text-sm text-navy"><label><input type="checkbox" name="startingFrom" defaultChecked={editing?.startingFrom ?? true} className="mr-2" />Show as starting price</label><label><input type="checkbox" name="featured" defaultChecked={editing?.featured} className="mr-2" />Featured</label><label><input type="checkbox" name="published" defaultChecked={editing?.published ?? true} className="mr-2" />Published on the website</label></div>
      <label className="grid gap-1.5 text-sm font-semibold text-navy md:col-span-2">Short description<textarea name="shortDescription" required minLength={10} maxLength={300} defaultValue={editing?.shortDescription} rows={2} className="rounded-lg border border-navy/15 p-3 font-normal" /></label>
      <label className="grid gap-1.5 text-sm font-semibold text-navy md:col-span-2">Full description<textarea name="description" defaultValue={editing?.description} rows={4} className="rounded-lg border border-navy/15 p-3 font-normal" /></label>
      {(["highlights", "inclusions", "exclusions"] as const).map((name) => <label key={name} className="grid gap-1.5 text-sm font-semibold capitalize text-navy">{name}<textarea name={name} defaultValue={editing?.[name].join("\n")} rows={3} placeholder="One item per line" className="rounded-lg border border-navy/15 p-3 font-normal" /></label>)}
      <section className="grid gap-3 md:col-span-2" aria-labelledby="package-itinerary-heading">
        <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-amber-700">Daywise tour plan</p><h3 id="package-itinerary-heading" className="mt-1 text-lg font-bold text-slate-900">Itinerary</h3><p className="text-sm text-slate-600">Describe the travel, sightseeing, hotel and overnight stay for each day.</p></div><button type="button" onClick={() => setItineraryDraft((days) => [...days, { day: days.length + 1, title: "", description: "" }])} className="min-h-10 rounded-lg border border-amber-300 bg-amber-50 px-4 text-sm font-bold text-amber-900 hover:bg-amber-100">+ Add day</button></div>
        {itineraryDraft.map((day, index) => <div key={index} className="grid min-w-0 gap-3 rounded-xl border border-amber-100 bg-amber-50/40 p-3 sm:p-4 md:grid-cols-[5rem_minmax(0,1fr)]"><div className="flex items-center gap-2 text-sm font-bold text-amber-900 md:block"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-amber-300">{index + 1}</span><span className="md:mt-2 md:block">Day {index + 1}</span></div><div className="grid min-w-0 gap-3"><label className="grid gap-1 text-sm font-semibold text-slate-800">Day title<input value={day.title} onChange={(event) => setItineraryDraft((days) => days.map((item, i) => i === index ? { ...item, title: event.target.value } : item))} placeholder="Arrival in Srinagar" className="min-h-11 min-w-0 rounded-lg border border-amber-200 bg-white px-3 font-normal" /></label><label className="grid gap-1 text-sm font-semibold text-slate-800">Day plan<textarea value={day.description} onChange={(event) => setItineraryDraft((days) => days.map((item, i) => i === index ? { ...item, description: event.target.value } : item))} placeholder="Airport pickup, hotel check-in, sightseeing, return to hotel and overnight stay." rows={4} className="min-w-0 rounded-lg border border-amber-200 bg-white p-3 font-normal" /></label></div><button type="button" onClick={() => setItineraryDraft((days) => days.filter((_, i) => i !== index).map((item, i) => ({ ...item, day: i + 1 })))} disabled={itineraryDraft.length === 1} className="min-h-9 justify-self-start rounded-lg px-3 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-40 md:col-start-2">Remove day</button></div>)}
      </section>
      <label className="grid gap-1.5 text-sm font-semibold text-navy md:col-span-2">Package photos<input name="images" type="file" accept="image/*" multiple className="rounded-lg border border-navy/15 p-3 font-normal" /><span className="text-xs font-normal text-ink/55">Up to 12 photos total, 10 MB each.</span></label>
      {!!editing?.images.length && <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:col-span-2">{editing.images.map((url, index) => <div key={url} className="relative"><Image src={url} alt={`Package photo ${index + 1}`} width={400} height={300} className="h-28 w-full rounded-lg object-cover" /><button type="button" onClick={() => setEditing((current) => current ? { ...current, images: current.images.filter((_, i) => i !== index), imagePublicIds: current.imagePublicIds.filter((_, i) => i !== index) } : null)} className="mt-1 text-xs font-semibold text-red-700">Remove photo</button></div>)}</div>}
      <div className="flex flex-wrap gap-3 md:col-span-2"><button disabled={busy} className="min-h-11 rounded-lg bg-amber-400 px-5 font-bold text-slate-950 transition hover:bg-amber-300 disabled:opacity-60">{busy ? "Saving..." : editing ? "Save changes" : "Create package"}</button>{editing && <button type="button" onClick={() => setEditing(null)} className="min-h-11 rounded-lg border border-amber-300 px-5 font-semibold text-slate-800">Cancel</button>}{message && <p role="status" className="self-center text-sm text-ink/70">{message}</p>}</div>
    </form>
    <h2 className="mt-10 font-display text-2xl text-navy">Packages ({packages.length})</h2>
    <div className="mt-4 grid gap-3">{packages.map((item) => <article key={item._id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-navy/10 bg-white p-4"><div className="flex items-center gap-3">{item.images[0] && <Image src={item.images[0]} alt="" width={96} height={72} className="h-16 w-20 rounded-lg object-cover" />}<div><h3 className="font-semibold text-navy">{item.title}</h3><p className="mt-1 text-xs text-ink/55">/{item.slug} · {item.days} days · {item.published ? "Published" : "Draft"}</p></div></div><div className="flex gap-2"><button onClick={() => { setEditing(item); setMessage(""); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="min-h-10 rounded-lg border border-navy/15 px-3 text-sm font-semibold text-navy">Edit</button><button onClick={() => remove(item)} className="min-h-10 rounded-lg border border-red-200 px-3 text-sm font-semibold text-red-700">Delete</button></div></article>)}</div>
  </div>;
}
