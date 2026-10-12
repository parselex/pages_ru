"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpenCheck, CornerDownLeft, Loader2, Scale, ShieldAlert } from "lucide-react";

type Citation = { source: string; note: string };
type Msg = { role: "user" | "assistant"; content: string; citations?: Citation[] };

const SUGGESTIONS = [
  "Нарушены права потребителя — как вернуть деньги за товар?",
  "Как обжаловать штраф ГИБДД?",
  "Работодатель задерживает зарплату — что делать?",
  "Соседи затопили квартиру — порядок действий",
  "Как составить претензию продавцу?",
  "Уволили без объяснения причин — мои права",
];

const GREETING: Msg = {
  role: "assistant",
  content:
    "Здравствуйте! Я — ИИ-помощник Parselex по российскому праву. Опишите ситуацию — я подскажу применимые нормы и порядок действий со ссылками на закон.\n\nПомните: я даю правовую информацию, а не юридическую консультацию.",
};

function MarkdownView({ text }: { text: string }) {
  return (
    <div className="[&_a]:text-amber-700 [&_a]:underline [&_h3]:mt-3 [&_h3]:text-sm [&_h3]:font-bold [&_h4]:mt-2 [&_h4]:text-sm [&_h4]:font-semibold [&_li]:mt-1 [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_p]:mt-2 [&_p]:first:mt-0 [&_strong]:font-semibold [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-2" aria-label="ИИ печатает">
      {[0, 150, 300].map((d) => (
        <span
          key={d}
          className="h-2 w-2 animate-bounce rounded-full bg-amber-500/80"
          style={{ animationDelay: `${d}ms` }}
        />
      ))}
    </div>
  );
}

export function ChatWidget() {
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quota, setQuota] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || loading) return;
    setError(null);
    setInput("");
    const history = messages
      .filter((m) => m !== GREETING)
      .map(({ role, content }) => ({ role, content }));

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message ?? "Не удалось получить ответ. Попробуйте ещё раз.");
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.answer, citations: data.citations }]);
        if (typeof data?.quota?.dayLeft === "number") {
          setQuota(`осталось запросов сегодня: ${data.quota.dayLeft}`);
        }
      }
    } catch {
      setError("Сеть недоступна. Проверьте соединение и попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[70vh] min-h-[520px] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg">
      {/* header */}
      <div className="flex items-center gap-3 border-b border-zinc-100 bg-zinc-50/80 px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white">
          <Scale className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-zinc-900">Parselex Право — ИИ-помощник</p>
          <p className="truncate text-xs text-zinc-500">
            Российское право · ответы со ссылками на нормы
          </p>
        </div>
        <Badge variant="outline" className="ml-auto shrink-0 border-amber-300 bg-amber-50 text-amber-700">
          beta
        </Badge>
      </div>

      {/* messages */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4 py-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "rounded-br-sm bg-zinc-900 text-zinc-50"
                    : "rounded-bl-sm border border-zinc-100 bg-zinc-50 text-zinc-800"
                }`}
              >
                {m.role === "assistant" ? <MarkdownView text={m.content} /> : m.content}
                {m.citations && m.citations.length > 0 && (
                  <div className="mt-3 space-y-1.5 border-t border-zinc-200 pt-2">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                      <BookOpenCheck className="h-3.5 w-3.5 text-amber-600" /> Источники
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {m.citations.map((c, j) => (
                        <Badge
                          key={j}
                          variant="outline"
                          className="max-w-full border-amber-200 bg-amber-50/60 text-[11px] font-normal text-amber-900"
                        >
                          <span className="truncate" title={c.note || c.source}>
                            {c.source}
                          </span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-sm border border-zinc-100 bg-zinc-50 px-4">
                <TypingDots />
              </div>
            </div>
          )}
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="flex-1">
                {error}
                <button
                  onClick={() => setError(null)}
                  className="ml-2 font-semibold underline underline-offset-2"
                >
                  закрыть
                </button>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* suggestions (visible while conversation is short) */}
      {messages.length <= 1 && !loading && (
        <div className="flex flex-wrap gap-2 px-4 pb-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-600 transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* input */}
      <div className="border-t border-zinc-100 bg-white px-4 py-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Опишите вашу ситуацию…"
            maxLength={4000}
            disabled={loading}
            className="h-11 flex-1 rounded-xl border-zinc-200 focus-visible:ring-amber-400"
            aria-label="Ваш правовой вопрос"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="h-11 rounded-xl bg-amber-500 px-4 text-white hover:bg-amber-600"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CornerDownLeft className="h-4 w-4" />}
            <span className="ml-1.5 hidden sm:inline">Отправить</span>
          </Button>
        </form>
        <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-zinc-400">
          <p>Правовая информация, а не юридическая консультация.</p>
          {quota && <p className="shrink-0">{quota}</p>}
        </div>
      </div>
    </div>
  );
}
