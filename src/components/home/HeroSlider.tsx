"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { HERO_INTERVAL_MS, heroSlides } from "@/content/hero";
import { SearchCard } from "@/components/home/SearchCard";

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touchPaused, setTouchPaused] = useState(false);
  const touchStart = useRef<number | null>(null);
  const touchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduced = useReducedMotion();
  const paused = Boolean(reduced) || hovered || focused || touchPaused;
  const change = useCallback((step: number) => setIndex((current) => (current + step + heroSlides.length) % heroSlides.length), []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => change(1), HERO_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [change, paused]);

  useEffect(() => {
    const visibility = () => setTouchPaused(document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, []);

  useEffect(() => () => { if (touchTimer.current) clearTimeout(touchTimer.current); }, []);

  function onTouchStart(event: React.TouchEvent<HTMLElement>) {
    touchStart.current = event.touches[0]?.clientX ?? null;
    setTouchPaused(true);
    if (touchTimer.current) clearTimeout(touchTimer.current);
  }
  function onTouchEnd(event: React.TouchEvent<HTMLElement>) {
    const start = touchStart.current;
    const end = event.changedTouches[0]?.clientX;
    if (start !== null && end !== undefined && Math.abs(end - start) >= 40) change(end < start ? 1 : -1);
    touchTimer.current = setTimeout(() => setTouchPaused(false), 4000);
  }
  function onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "ArrowRight") { event.preventDefault(); change(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); change(-1); }
  }
  const active = heroSlides[index];
  const nextIndex = (index + 1) % heroSlides.length;
  return <section className="hero-frame" role="region" aria-roledescription="carousel" aria-label="Plan My Trip highlights" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }} onKeyDown={onKeyDown} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
    <h1 className="sr-only">Travel agency in Katra for Vaishno Devi and Kashmir tour packages</h1>
    {heroSlides.map((slide, slideIndex) => (slideIndex === index || slideIndex === nextIndex) && <div key={slide.id} className={`hero-backdrop hero-backdrop-${slide.id} ${slideIndex === index ? "hero-backdrop-active" : ""}`} aria-hidden="true" style={{ opacity: slideIndex === index ? 1 : 0 }}>
      <Image src={slide.image} alt="" fill priority={slideIndex === 0} loading={slideIndex === 0 ? undefined : "eager"} sizes="100vw" className={`hero-photo ${"mobileImage" in slide ? "hero-photo-desktop" : ""}`} style={{ objectPosition: slide.objectPosition }} />
      {"mobileImage" in slide && <Image src={slide.mobileImage} alt="" fill loading="eager" sizes="100vw" className="hero-photo hero-photo-mobile" style={{ objectPosition: slide.objectPosition }} />}
    </div>)}
    <div className="hero-scrim" aria-hidden="true" />
    <span className="hero-placeholder-label">Original Kashmir photography needed · see /assets/README</span>
    <div className="hero-slide-content" aria-live={paused ? "polite" : "off"}>
      <div key={index} className="hero-text"><p className="hero-headline">{active.headline}</p><p className="hero-subline">{active.subline}</p><Link href={active.ctaHref} className="hero-cta">{active.ctaLabel}</Link></div>
    </div>
    <SearchCard />
    <button type="button" aria-label="Previous slide" onClick={() => change(-1)} className="hero-arrow hero-arrow-left"><ArrowLeft className="size-5"/></button>
    <button type="button" aria-label="Next slide" onClick={() => change(1)} className="hero-arrow hero-arrow-right"><ArrowRight className="size-5"/></button>
    <span className="sr-only">{active.alt}</span>
  </section>;
}
