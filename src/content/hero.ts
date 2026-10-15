export const HERO_INTERVAL_MS = 2000;

export const heroSlides = [
  { id: "yatra", image: "/images/vaishno-devi-yatra.png", mobileImage: "/images/katra-vaishno-devi-hero-mobile.png", alt: "Pilgrims on the Vaishno Devi yatra route", headline: "VAISHNO DEVI YATRA", subline: "Stay, cabs and darshan planning from Katra", ctaLabel: "View yatra packages", ctaHref: "/packages?destination=katra-vaishno-devi", objectPosition: "center" },
  { id: "kashmir", image: "/images/sonamarg-glacier.png", alt: "A wide mountain glacier valley in Kashmir at sunrise", headline: "KASHMIR AWAITS", subline: "Srinagar, Gulmarg, Pahalgam and Sonamarg", ctaLabel: "Explore Kashmir tours", ctaHref: "/packages?destination=srinagar", objectPosition: "center 55%" },
  { id: "gulmarg", image: "/images/gulmarg-meadows.png", alt: "Meadows and mountains in Gulmarg", headline: "GULMARG SNOW DAYS", subline: "Gondola rides and winter meadows", ctaLabel: "Plan a snow trip", ctaHref: "/destinations/gulmarg", objectPosition: "center" },
  { id: "srinagar", image: "/images/srinagar-dal-lake.png", alt: "A quiet morning on Dal Lake in Srinagar", headline: "DAL LAKE STAYS", subline: "Shikara rides and houseboat nights", ctaLabel: "See Srinagar", ctaHref: "/destinations/srinagar", objectPosition: "center" },
  { id: "combined", image: "/images/katra_to_kashmir.png", alt: "A trip connecting Katra and Kashmir", headline: "KATRA TO KASHMIR", subline: "One trip, two journeys", ctaLabel: "See combined trips", ctaHref: "/packages?collection=multi-city", objectPosition: "center" },
  { id: "himachal", image: "/images/himachal_landscape.png", mobileImage: "/images/himachal_portrait.png", alt: "Himalayan landscape in Himachal Pradesh", headline: "HIMACHAL HILL ESCAPES", subline: "Shimla, Manali and mountain journeys", ctaLabel: "Explore Himachal", ctaHref: "/destinations/himachal-pradesh", objectPosition: "center" },
] as const;
