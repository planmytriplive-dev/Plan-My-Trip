// SINGLE SOURCE OF TRUTH for business details. Never hardcode these elsewhere.
const RAW_PHONE = "7006298659";

export const site = {
  name: "Plan My Trip",
  shortName: "PMT",
  tagline: "Jammu, Kashmir & Himachal tour packages",
  logo: "/logo/logo.png", // rename your logo file to logo.png (or change this path)
  url: "https://planmytrip.live",
  phoneDisplay: "70062 98659",
  phoneE164: `+91${RAW_PHONE}`,
  whatsappNumber: `91${RAW_PHONE}`,
  email: "planmytriplive@gmail.com",
  address: {
    // Add the verified street address before publishing it.
    street: "",
    locality: "Katra",
    region: "Jammu and Kashmir",
    postalCode: "182301",
    country: "IN",
  },
  social: [] as string[], // TODO: add Facebook/Instagram/YouTube URLs
} as const;

export const telHref = `tel:${site.phoneE164}`;

export function whatsappHref(message = "Hi Plan My Trip, I want to enquire about a tour package.") {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Packages" },
  { href: "/destinations", label: "Destinations" },
  { href: "/gallery", label: "Gallery" },
  { href: "/services", label: "Services" },
  { href: "/reviews", label: "Reviews" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
