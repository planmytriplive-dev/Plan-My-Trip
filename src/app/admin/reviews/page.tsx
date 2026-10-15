import Link from "next/link";
import { ReviewModeration } from "@/components/admin/ReviewModeration";

export default function AdminReviewsPage() {
  return <main className="mx-auto max-w-4xl px-5 py-12"><Link href="/admin" className="text-sm font-semibold text-navy">← Admin</Link><h1 className="mt-4 font-display text-3xl text-navy">Review management</h1><p className="mt-2 text-ink/65">New reviews appear publicly as soon as they are submitted. You can remove a review here if needed.</p><ReviewModeration /></main>;
}
