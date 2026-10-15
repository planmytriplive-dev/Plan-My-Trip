import { site } from "@/lib/site";

export function GET() {
  const text = `# ${site.name}\n\n${site.name} is a Katra-based travel agency helping visitors plan Vaishno Devi yatra trips, Jammu and Kashmir tours, and Himachal Pradesh holidays.\n\nPhone: ${site.phoneDisplay}\nWhatsApp: https://wa.me/${site.whatsappNumber}\n\nServices: Vaishno Devi yatra planning, Jammu and Kashmir and Himachal Pradesh tour packages, hotel planning, local transport and cab coordination.\nDestinations: Katra, Jammu, Patnitop, Srinagar, Gulmarg, Pahalgam, Sonamarg, Shimla and Manali.\n\nKey pages:\n- ${site.url}/packages\n- ${site.url}/destinations\n- ${site.url}/gallery\n- ${site.url}/reviews\n- ${site.url}/services\n- ${site.url}/about\n- ${site.url}/contact\n`;
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
