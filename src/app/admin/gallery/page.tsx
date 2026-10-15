import Link from "next/link";
import { GalleryManager } from "@/components/admin/GalleryManager";

export default function AdminGalleryPage() {
  return <main className="mx-auto max-w-5xl px-5 py-12"><Link href="/admin" className="text-sm font-semibold text-navy">← Admin</Link><h1 className="mt-4 font-display text-3xl text-navy">Gallery manager</h1><p className="mt-2 text-ink/65">Upload destination photos to Cloudinary and add them to the public gallery.</p><GalleryManager /></main>;
}
