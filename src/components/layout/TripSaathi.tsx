import Link from "next/link";
import { Bot } from "lucide-react";

export function TripSaathi() {
  return <Link href="/trip-saathi" aria-label="Open Katra Trip Saathi" className="trip-saathi-nav-button"><Bot className="size-4" /><span className="hidden 2xl:inline">Katra Trip Saathi</span><span className="2xl:hidden">Saathi</span></Link>;
}
