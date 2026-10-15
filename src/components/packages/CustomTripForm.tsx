"use client";

import type { FormEvent } from "react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { whatsappHref } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

const fieldClass =
  "mt-1.5 min-h-12 w-full rounded-xl border border-ink/15 bg-white px-3.5 text-sm text-ink outline-none transition focus:border-[#d5a900] focus:ring-2 focus:ring-[#ffd21f]/40";

export function CustomTripForm() {
  function sendToWhatsApp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const details = [
      "Hi Plan My Trip, I would like a customized trip plan.",
      `Destination: ${data.get("destination")}`,
      `Travel date: ${data.get("date") || "Flexible"}`,
      `Duration: ${data.get("duration") || "Flexible"} days`,
      `Travellers: ${data.get("travellers")}`,
      `Budget per person: ${data.get("budget") || "Please suggest options"}`,
      `Interests and requests: ${data.get("interests") || "Please suggest an itinerary"}`,
    ].join("\n");

    window.open(whatsappHref(details), "_blank", "noopener,noreferrer");
  }

  return (
    <form
      onSubmit={sendToWhatsApp}
      className="rounded-3xl border border-[#f0e6bd] bg-white p-5 shadow-[0_12px_36px_rgba(50,40,10,.06)] sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold text-ink sm:col-span-2">
          Where would you like to go? <span className="text-orange-deep">*</span>
          <select name="destination" required defaultValue="" className={fieldClass}>
            <option value="" disabled>Select a region or trip type</option>
            <option>Kashmir</option>
            <option>Jammu</option>
            <option>Vaishno Devi Yatra</option>
            <option>Himachal Pradesh</option>
            <option>Jammu and Kashmir</option>
            <option>Multiple regions</option>
            <option>I'm open to suggestions</option>
          </select>
        </label>

        <label className="text-sm font-semibold text-ink">
          Preferred start date
          <input name="date" type="date" className={fieldClass} />
        </label>

        <label className="text-sm font-semibold text-ink">
          Trip length (days)
          <input name="duration" type="number" min="1" max="60" placeholder="For example, 5" className={fieldClass} />
        </label>

        <label className="text-sm font-semibold text-ink">
          Number of travellers <span className="text-orange-deep">*</span>
          <input name="travellers" type="number" min="1" max="100" required defaultValue="2" className={fieldClass} />
        </label>

        <label className="text-sm font-semibold text-ink">
          Approximate budget per person
          <input name="budget" type="text" maxLength={60} placeholder="Optional" className={fieldClass} />
        </label>

        <label className="text-sm font-semibold text-ink sm:col-span-2">
          What would make this trip right for you?
          <textarea
            name="interests"
            rows={4}
            maxLength={500}
            placeholder="Places you want to see, hotel preferences, transport, pace, or anything else..."
            className={`${fieldClass} min-h-28 resize-y py-3`}
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#ffd21f] px-5 font-bold text-ink transition-colors hover:bg-[#f2c400]"
        >
          <WhatsAppIcon className="size-5" />
          Continue to WhatsApp
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </button>
        <p className="flex items-center gap-1.5 text-xs leading-5 text-ink/55">
          <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
          WhatsApp opens with your trip details ready to send.
        </p>
      </div>
    </form>
  );
}
