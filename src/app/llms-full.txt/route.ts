import { site } from "@/lib/site";
import { destinations, tripPackages } from "@/lib/travel-content";

export function GET() {
  const destinationText = destinations.map((place) => `- ${place.name}: ${place.intro}`).join("\n");
  const packageText = tripPackages.map((trip) => `- ${trip.name} (${trip.days}; ${trip.price}): ${trip.intro}`).join("\n");
  const text = `# ${site.name} — travel information\n\n${site.name} is a Katra-based travel agency for Vaishno Devi yatra planning, Jammu and Kashmir tours, and Himachal Pradesh holidays. Contact the team by phone at ${site.phoneDisplay} or WhatsApp at https://wa.me/${site.whatsappNumber}. Package prices depend on dates, group size, route and stay choice; request a current quote. Traveller reviews appear when submitted.\n\n## Destinations\n${destinationText}\n\n## Trip ideas\n${packageText}\n\n## Key pages\n- ${site.url}/packages\n- ${site.url}/destinations\n- ${site.url}/gallery\n- ${site.url}/reviews\n- ${site.url}/services\n- ${site.url}/about\n- ${site.url}/contact\n`;
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
