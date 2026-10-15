import { whatsappHref } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

/** Desktop only. Mobile uses the bottom bar instead. */
export function WhatsAppFloat() {
  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 hidden size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg hover:scale-105 lg:flex"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
