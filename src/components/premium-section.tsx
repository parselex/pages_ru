"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SubscribeModal } from "@/components/subscribe-modal";
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  FileText,
  Infinity as InfinityIcon,
  Sparkles,
} from "lucide-react";

/**
 * Четыре преимущества Premium — формулировки заданы владельцем продукта
 * дословно (2026-10-12), не перефразировать без согласования:
 *   1. Правовая база РФ — ответы со ссылками на законы и практику
 *   2. Работа с документами — разбор и создание PDF, Word, DOC
 *   3. Безлимитное общение — задавайте любое количество вопросов
 *   4. Мощные нейросети — 10 000 кредитов на Claude Opus 5, ChatGPT-5.6,
 *      Gemini 3.1 Pro для сложных дел
 * Цена: 1 490 ₽/мес, рекуррентные платежи.
 */
const PREMIUM_FEATURES = [
  {
    icon: BookOpenCheck,
    title: "Правовая база РФ",
    text: "Ответы со ссылками на законы и практику",
  },
  {
    icon: FileText,
    title: "Работа с документами",
    text: "Разбор и создание PDF, Word, DOC",
  },
  {
    icon: InfinityIcon,
    title: "Безлимитное общение",
    text: "Задавайте любое количество вопросов",
  },
  {
    icon: Sparkles,
    title: "Мощные нейросети",
    text: "10 000 кредитов на Claude Opus 5, ChatGPT-5.6, Gemini 3.1 Pro для сложных дел",
  },
];

export function PremiumSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="premium" className="relative scroll-mt-20 overflow-hidden bg-zinc-950 py-16 text-white sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 75% 25%, #f59e0b 0, transparent 42%), radial-gradient(circle at 15% 80%, #f59e0b 0, transparent 40%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_420px]">
          {/* Левая колонка: преимущества */}
          <div>
            <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-400">
              Premium
            </Badge>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Всё наши преимущества — в одной подписке
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              Бесплатный чат отвечает на первые вопросы. Premium открывает полную
              правовую базу РФ, работу с документами и старшие нейросети — для
              сложных дел и профессиональных задач.
            </p>

            <ul className="mt-8 space-y-5">
              {PREMIUM_FEATURES.map((f) => (
                <li key={f.title} className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                    <f.icon className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{f.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-400">{f.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Правая колонка: карта подписки */}
          <div className="rounded-2xl bg-white p-8 text-zinc-900 shadow-2xl shadow-amber-500/10 ring-1 ring-amber-500/20">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Parselex Premium</h3>
              <Badge className="border-amber-300 bg-amber-100 text-amber-800">
                без рекламы
              </Badge>
            </div>

            <p className="mt-5">
              <span className="text-4xl font-bold tracking-tight">1 490 ₽</span>
              <span className="ml-1.5 text-sm text-zinc-500">в месяц</span>
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Списание раз в 30 дней · автопродление
            </p>

            <div className="my-6 border-t border-zinc-200" />

            <ul className="space-y-3">
              {PREMIUM_FEATURES.map((f) => (
                <li key={f.title} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <span>
                    <b className="font-semibold">{f.title}.</b>{" "}
                    <span className="text-zinc-600">{f.text}</span>
                  </span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => setModalOpen(true)}
              className="mt-7 h-12 w-full rounded-xl bg-amber-500 text-base font-semibold text-white hover:bg-amber-600"
            >
              Подписаться за 1 490 ₽ <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <p className="mt-3 text-center text-[11px] leading-relaxed text-zinc-400">
              Оформляя подписку, вы соглашаетесь с условиями{" "}
              <a href="/offer" className="underline underline-offset-2 hover:text-amber-700">
                оферты рекуррентных платежей
              </a>
              ,{" "}
              <a href="/privacy" className="underline underline-offset-2 hover:text-amber-700">
                политики ПД
              </a>{" "}
              и{" "}
              <a href="/terms" className="underline underline-offset-2 hover:text-amber-700">
                условий подписки
              </a>
              . Отмена — в любой момент.
            </p>
          </div>
        </div>

        <p className="relative mt-10 text-center text-xs text-zinc-500">
          Демо-режим: платёжный провайдер будет подключён при публичном запуске сервиса.
        </p>
      </div>

      <SubscribeModal open={modalOpen} onOpenChange={setModalOpen} />
    </section>
  );
}
