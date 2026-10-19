"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { GoogleBusinessLink } from "@/components/ui/GoogleBusinessLink";

const SESSION_KEY = "pmt-welcome-spoken";
const feminineVoiceHints = ["female", "samantha", "zira", "victoria", "karen", "susan", "tessa", "moira", "fiona", "veena", "heera", "aria", "jenny"];

function chooseVoice(voices: SpeechSynthesisVoice[]) {
  const englishVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith("en"));
  const feminineVoice = englishVoices.find((voice) => feminineVoiceHints.some((hint) => voice.name.toLowerCase().includes(hint)));
  return feminineVoice ?? englishVoices.find((voice) => voice.lang.toLowerCase() === "en-in") ?? englishVoices[0];
}

export function WelcomeSpeech() {
  const pathname = usePathname();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;
    try {
      setShowWelcome(!window.sessionStorage.getItem(SESSION_KEY));
    } catch {
      setShowWelcome(true);
    }
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") return;
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;

    let queued = false;
    let started = false;
    const speak = () => {
      if (queued) return;
      try {
        if (window.sessionStorage.getItem(SESSION_KEY)) return;
      } catch {
        // Storage may be unavailable in private browsing; the in-memory guard still prevents repeats.
      }

      const utterance = new SpeechSynthesisUtterance("Welcome to Plan My Trip.");
      utterance.lang = "en-IN";
      utterance.rate = 0.94;
      utterance.pitch = 1.08;
      utterance.volume = 1;
      const voice = chooseVoice(window.speechSynthesis.getVoices());
      if (voice) utterance.voice = voice;
      utterance.onstart = () => {
        started = true;
        try { window.sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* Storage is optional. */ }
      };
      utterance.onend = () => setShowWelcome(false);
      utterance.onerror = () => { queued = false; };
      window.speechSynthesis.speak(utterance);
      queued = true;
    };

    const onFirstClick = () => {
      if (document.activeElement?.getAttribute("aria-label") === "Hear welcome to Plan My Trip") return;
      window.removeEventListener("click", onFirstClick, true);
      let hasSpoken = false;
      try { hasSpoken = Boolean(window.sessionStorage.getItem(SESSION_KEY)); } catch { /* Storage is optional. */ }
      if (started || hasSpoken) return;
      if (queued) {
        window.speechSynthesis.cancel();
        queued = false;
      }
      speak();
    };

    const voiceLoadFallback = window.setTimeout(() => speak(), 900);
    const onVoicesChanged = () => speak();
    window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
    window.addEventListener("click", onFirstClick, true);
    const initialAttempt = window.setTimeout(() => speak(), 200);
    return () => {
      window.clearTimeout(voiceLoadFallback);
      window.clearTimeout(initialAttempt);
      window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
      window.removeEventListener("click", onFirstClick, true);
    };
  }, [pathname]);

  if (pathname !== "/" || !showWelcome) return null;
  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end gap-2 lg:bottom-5">
      <button
        type="button"
        onClick={() => {
          if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance("Welcome to Plan My Trip.");
          utterance.lang = "en-IN";
          utterance.rate = 0.94;
          utterance.pitch = 1.08;
          utterance.volume = 1;
          const voice = chooseVoice(window.speechSynthesis.getVoices());
          if (voice) utterance.voice = voice;
          utterance.onstart = () => {
            try { window.sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* Storage is optional. */ }
          };
          utterance.onend = () => setShowWelcome(false);
          window.speechSynthesis.speak(utterance);
        }}
        className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy shadow-lg ring-1 ring-navy/10 transition hover:bg-mist"
        aria-label="Hear welcome to Plan My Trip"
      >
        Hear welcome
      </button>
      <GoogleBusinessLink className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-3 text-xs font-semibold text-navy shadow-lg ring-1 ring-navy/10 transition hover:bg-mist" />
    </div>
  );
}
