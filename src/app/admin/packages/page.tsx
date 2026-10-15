import Link from "next/link";
import { PackageManager } from "@/components/admin/PackageManager";

export default function AdminPackagesPage() {
  return <main className="mx-auto max-w-6xl px-5 py-12"><Link href="/admin" className="text-sm font-semibold text-navy">← Admin</Link><h1 className="mt-4 font-display text-3xl text-navy">Package manager</h1><p className="mt-2 text-ink/65">Create and edit trip packages. Published packages appear on the homepage and packages page.</p><PackageManager /></main>;
}
