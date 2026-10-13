"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Copy, FileText, Scale, Search, Sparkles } from "lucide-react";
import { DOC_TEMPLATES, TEMPLATE_CATEGORIES } from "@/lib/templates";

/**
 * Ключ sessionStorage для передачи контекста шаблона в чат
 * (ChatWidget читает его при монтировании и подставляет запрос).
 */
export const TEMPLATE_PREFILL_KEY = "parselex-template-prefill";

/**
 * Браузер базы шаблонов (страница /templates).
 *
 * Полностью клиентский: поиск, фильтр по категориям, раскрытие текста
 * шаблона и копирование в буфер обмена. Не требует API — работает
 * в статическом экспорте (GitHub Pages).
 */

export function TemplatesBrowser() {
  const router = useRouter();
  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [fillingId, setFillingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DOC_TEMPLATES.filter((t) => {
      const byCat = category === "all" || t.category === category;
      if (!byCat) return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.body.toLowerCase().includes(q) ||
        t.refs.some((r) => r.toLowerCase().includes(q))
      );
    });
  }, [category, query]);

  const grouped = useMemo(() => {
    return TEMPLATE_CATEGORIES.map((c) => ({
      ...c,
      templates: filtered.filter((t) => t.category === c.id),
    })).filter((c) => c.templates.length > 0);
  }, [filtered]);

  const copyBody = async (id: string, body: string) => {
    try {
      await navigator.clipboard.writeText(body);
      setCopiedId(id);
      setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 2000);
    } catch {
      // Буфер обмена недоступен (например, вне HTTPS) — молча игнорируем:
      // текст шаблона и так виден и выделяется вручную.
    }
  };

  /**
   * «Заполнить с Parselex»: копируем текст шаблона в буфер, кладём
   * контекст в sessionStorage и переходим к чату на лендинге (/#chat).
   * ChatWidget прочитает ключ TEMPLATE_PREFILL_KEY и подставит запрос.
   * Работает и в статической сборке (там чат покажет уведомление,
   * а текст шаблона останется в буфере обмена).
   */
  const fillWithParselex = async (id: string, title: string, body: string) => {
    setFillingId(id);
    try {
      await navigator.clipboard.writeText(body);
      setCopiedId(id);
    } catch {
      // без буфера обмена всё равно переходим в чат — шаблон передаётся в контексте
    }
    try {
      sessionStorage.setItem(
        TEMPLATE_PREFILL_KEY,
        JSON.stringify({ title, body, ts: Date.now() })
      );
    } catch {
      // sessionStorage недоступен — просто перейдём в чат без предзаполнения
    }
    setTimeout(() => setFillingId((cur) => (cur === id ? null : cur)), 2000);
    router.push("/#chat");
  };

  return (
    <div>
      {/* Поиск и фильтры */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по названию, описанию или тексту шаблона…"
            className="h-11 rounded-xl border-zinc-200 pl-9 text-sm"
            aria-label="Поиск по базе шаблонов"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
              category === "all"
                ? "border-amber-500 bg-amber-500 text-white"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-amber-300 hover:text-amber-700"
            }`}
          >
            Все шаблоны ({DOC_TEMPLATES.length})
          </button>
          {TEMPLATE_CATEGORIES.map((c) => {
            const count = DOC_TEMPLATES.filter((t) => t.category === c.id).length;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                  category === c.id
                    ? "border-amber-500 bg-amber-500 text-white"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-amber-300 hover:text-amber-700"
                }`}
              >
                {c.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Список шаблонов по категориям */}
      {grouped.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center text-sm text-zinc-500">
          По запросу «{query}» ничего не найдено. Попробуйте другое слово — например,
          «претензия», «зарплата», «аренда» или «расписка».
        </p>
      ) : (
        <div className="mt-10 space-y-10">
          {grouped.map((c) => (
            <section key={c.id}>
              <h2 className="text-lg font-bold tracking-tight text-zinc-900">{c.name}</h2>
              <p className="mt-1 text-sm text-zinc-500">{c.description}</p>
              <Accordion type="single" collapsible className="mt-4">
                {c.templates.map((t) => (
                  <AccordionItem key={t.id} value={t.id} className="rounded-2xl border border-zinc-200 bg-white px-5 mb-3 data-[state=open]:border-amber-300">
                    <AccordionTrigger className="text-left text-sm font-semibold text-zinc-900 hover:no-underline sm:text-base">
                      <span className="flex items-start gap-3">
                        <FileText className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-600" />
                        <span>{t.title}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-5">
                      <p className="text-sm leading-relaxed text-zinc-600">{t.description}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {t.refs.map((r) => (
                          <Badge
                            key={r}
                            variant="outline"
                            className="border-amber-200 bg-amber-50 text-[11px] font-normal text-amber-800"
                          >
                            {r}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                        <div className="max-h-96 overflow-y-auto whitespace-pre-wrap text-[13px] leading-relaxed text-zinc-800">
                          {t.body}
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <Button
                          size="sm"
                          className="h-8 rounded-lg bg-amber-500 text-xs font-semibold text-white hover:bg-amber-600"
                          onClick={() => fillWithParselex(t.id, t.title, t.body)}
                        >
                          {fillingId === t.id ? (
                            <>
                              <Check className="mr-1.5 h-3.5 w-3.5" />
                              Готово — открываю чат
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                              Заполнить с Parselex
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 rounded-lg border-zinc-200 text-xs text-zinc-700 hover:border-amber-300 hover:text-amber-700"
                          onClick={() => copyBody(t.id, t.body)}
                        >
                          {copiedId === t.id ? (
                            <>
                              <Check className="mr-1.5 h-3.5 w-3.5 text-green-600" />
                              Скопировано
                            </>
                          ) : (
                            <>
                              <Copy className="mr-1.5 h-3.5 w-3.5" />
                              Скопировать текст
                            </>
                          )}
                        </Button>
                        <span className="text-[11px] leading-snug text-zinc-400">
                          Заполните поля [в квадратных скобках] под вашу ситуацию
                        </span>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>
      )}

      {/* CTA: разбор ситуации в чате + Premium */}
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <Scale className="h-6 w-6 text-amber-600" />
          <h3 className="mt-3 font-semibold text-zinc-900">Нужен документ под вашу ситуацию?</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">
            Опишите ситуацию ИИ-помощнику — он поможет адаптировать шаблон, подскажет
            применимые нормы и порядок действий со ссылками на закон.
          </p>
          <Button asChild className="mt-4 h-10 rounded-xl bg-amber-500 text-sm font-semibold text-white hover:bg-amber-600">
            <Link href="/#chat">Задать вопрос в чате</Link>
          </Button>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <FileText className="h-6 w-6 text-amber-700" />
          <h3 className="mt-3 font-semibold text-zinc-900">Безлимит и документы — в Premium</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
            Разбор и создание PDF, Word, DOC без дневных лимитов, старшие нейросети
            для дел с большим объёмом и продукты безопасности LexZtna.
          </p>
          <Button asChild className="mt-4 h-10 rounded-xl bg-zinc-900 text-sm font-semibold text-white hover:bg-zinc-800">
            <Link href="/#premium">Premium — 3 000 ₽/мес</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
