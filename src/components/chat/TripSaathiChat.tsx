"use client";

import { useRef, useState, type FormEvent } from "react";
import { Bot, LoaderCircle, MapPin, Send, Sparkles, UserRound } from "lucide-react";

type ChatMessage = { role: "user" | "assistant"; content: string };
const starters = ["Plan a Vaishno Devi yatra", "Suggest a 5-day Kashmir trip", "What packages are available?", "Help me choose a destination"];

export function TripSaathiChat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const transcript = useRef<HTMLDivElement>(null);

  async function send(text: string) {
    const content = text.trim();
    if (!content || pending) return;
    const history = [...messages, { role: "user" as const, content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setQuestion(""); setPending(true); setError("");
    try {
      const response = await fetch("/api/chatbot", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history.slice(-10) }) });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || "Trip Saathi couldn't connect. Please try again.");
      }
      if (!response.body) throw new Error("Trip Saathi couldn't connect. Please try again.");
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ""; let answer = "";
      while (true) {
        const { value, done } = await reader.read(); buffer += decoder.decode(value, { stream: !done });
        const lines = buffer.split(/\r?\n/); buffer = lines.pop() ?? "";
        for (const line of lines) if (line.startsWith("data: ") && line.slice(6) !== "[DONE]") {
          try { const part = JSON.parse(line.slice(6)); answer += part.choices?.[0]?.delta?.content ?? ""; setMessages((current) => current.map((item, index) => index === current.length - 1 ? { ...item, content: answer } : item)); } catch { /* Ignore stream metadata frames. */ }
        }
        if (done) break;
      }
      if (!answer.trim()) throw new Error("I didn't get a reply that time. Please try once more.");
      requestAnimationFrame(() => transcript.current?.scrollTo({ top: transcript.current.scrollHeight, behavior: "smooth" }));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Trip Saathi couldn't connect. Please try again.");
      setMessages((current) => current.slice(0, -1));
    } finally { setPending(false); }
  }

  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void send(question); }

  return <section className="flex min-h-[min(680px,calc(100dvh-12rem))] flex-col overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-[0_20px_60px_rgba(7,27,61,.12)]">
    <header className="flex items-center gap-4 bg-navy px-5 py-5 text-white sm:px-7"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sun text-navy"><Bot className="size-6" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-display text-lg font-bold sm:text-xl">Katra Trip Saathi</h2><span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/80"><span className="mr-1.5 inline-block size-1.5 rounded-full bg-emerald-400"/>Ready to help</span></div><p className="mt-1 text-sm text-white/70">Your personal Plan My Trip guide</p></div><Sparkles className="hidden size-5 text-sun sm:block" /></header>
    <div ref={transcript} aria-live="polite" className="flex-1 space-y-5 overflow-y-auto bg-[#fafbfd] p-4 sm:p-7">
      {!messages.length && <><div className="flex max-w-2xl items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-sun/20 text-navy"><Bot className="size-5" /></span><div className="rounded-2xl rounded-tl-sm border border-navy/5 bg-white p-4 shadow-sm"><p className="font-semibold text-ink">Namaste! Where would you like to go?</p><p className="mt-1 text-sm leading-relaxed text-ink/65">Ask about our packages, destinations, routes, or trip planning. I know the information published on this website and can also help with general travel ideas.</p></div></div><div className="grid gap-2 pl-12 sm:grid-cols-2">{starters.map((starter) => <button key={starter} type="button" onClick={() => void send(starter)} className="flex min-h-11 items-center gap-2 rounded-xl border border-navy/10 bg-white px-3 text-left text-sm font-medium text-navy transition hover:border-orange/50 hover:bg-orange/5"><MapPin className="size-4 shrink-0 text-orange"/>{starter}</button>)}</div></>}
      {messages.map((message, index) => <div key={`${index}-${message.role}`} className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}><span className={`grid size-9 shrink-0 place-items-center rounded-xl ${message.role === "user" ? "bg-navy text-white" : "bg-sun/20 text-navy"}`}>{message.role === "user" ? <UserRound className="size-4"/> : <Bot className="size-5"/>}</span><p className={`max-w-[88%] whitespace-pre-wrap rounded-2xl p-4 text-sm leading-relaxed sm:max-w-[75%] ${message.role === "user" ? "rounded-tr-sm bg-navy text-white" : "rounded-tl-sm border border-navy/5 bg-white text-ink/80 shadow-sm"}`}>{message.content || (pending && index === messages.length - 1 ? <span className="inline-flex items-center gap-2 text-ink/60"><LoaderCircle className="size-4 animate-spin"/>Planning a helpful answer…</span> : "")}</p></div>)}
      {error && <p role="alert" className="ml-12 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    </div>
    <form onSubmit={submit} className="flex gap-2 border-t border-navy/10 bg-white p-3 sm:p-4"><label className="sr-only" htmlFor="trip-saathi-question">Ask Katra Trip Saathi</label><input id="trip-saathi-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about packages, places, or your trip…" maxLength={1200} className="min-h-12 min-w-0 flex-1 rounded-xl border border-navy/15 px-4 text-sm outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/15"/><button type="submit" aria-label="Send message" disabled={!question.trim() || pending} className="grid size-12 shrink-0 place-items-center rounded-xl bg-sun text-navy transition hover:bg-sun/90 disabled:opacity-50"><Send className="size-5"/></button></form>
    <p className="px-4 pb-3 text-center text-xs text-ink/50">For current availability, exact pricing, and official travel updates, please confirm with the team.</p>
  </section>;
}
