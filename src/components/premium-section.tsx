import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

/**
 * Тарифные планы Parselex — синхронизировано с витриной Studio
 * (parselex/studio, раунды R86–R89, 2026-10-20):
 *
 *   Стандарт — 3 000 ₽/мес: частная практика и повседневные дела.
 *   Про — 30 000 ₽/мес: юристы с большим потоком дел (бейдж «Рекомендуем»).
 *   Enterprise — 300 000 ₽/мес: организации и сложные дела — ориентир корпуса
 *   1000+ страниц и 1000+ документов; выделенный GPU-контур (H100/A100-класс)
 *   с on-demand мощностями; БЕЗ лимита токенов — учёт в часах работы
 *   ИИ-контура, а не в токенах.
 *
 * Базовые формулировки преимуществ (2026-10-12, владелец, дословно)
 * сохранены в составе тарифа «Стандарт»: правовая база РФ; работа
 * с документами (PDF, Word, DOC); безлимитное общение; мощные нейросети
 * (1М кредитов на Claude/Gemini, дообученные модели, раннеры A100/H100).
 *
 * Кнопки подключения активируются при публичном запуске — сейчас действует
 * бесплатная бета, платёжный провайдер подключается в демо-режиме.
 */

const PLANS: {
  name: string;
  audience: string;
  price: string;
  features: string[];
  highlight?: boolean;
}[] = [
  {
    name: "Стандарт",
    audience: "частная практика и повседневные дела",
    price: "3 000",
    features: [
      "Полный AI-юрист: ответы со ссылками на законы и практику",
      "Работа с документами: разбор и создание PDF, Word, DOC — с историей версий и черновиков",
      "2000+ шаблонов процессуальных форм",
      "Безлимитное общение — без дневных лимитов на вопросы",
      "Мощные нейросети: 1М кредитов в месяц на Claude/Gemini, дообученные для русскоязычных пользователей",
      "PII Firewall: персональные данные редактируются до модели",
    ],
  },
  {
    name: "Про",
    audience: "юристы с большим потоком дел",
    price: "30 000",
    highlight: true,
    features: [
      "Всё из тарифа «Стандарт»",
      "10М кредитов в месяц; раннеры на A100/H100 для сложных задач",
      "Анализ корпуса любого объёма — от 1 документа до тысяч уникальных файлов",
      "Проверка документов: риски, пропуски, нестандартные условия",
      "Импорт чатов в документы — переписки становятся материалами дела",
      "Приоритетная поддержка",
    ],
  },
  {
    name: "Enterprise",
    audience: "организации и сложные дела: 1000+ страниц · 1000+ документов",
    price: "300 000",
    features: [
      "Всё из тарифа «Про»",
      "Выделенный GPU-контур (H100/A100-класс): on-demand мощности для запуска ИИ-моделей включены в подписку",
      "Без лимита токенов: учёт в часах работы ИИ-контура, а не в токенах",
      "Корпусы без практических лимитов: 1000+ страниц и 1000+ документов в анализе",
      "SSO и личные пространства: пользователи не видят данные друг друга",
      "Режим администратора (директора): команда, дела, доступы",
      "Скоринг дел, Google Диск, LexZtna Secure Network, SLA и выделенная поддержка",
    ],
  },
];

export function PremiumSection() {
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
        <div className="text-center">
          <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-400">
            Тарифные планы
          </Badge>
          <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
            Три тарифа — от частной практики до организаций
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Сейчас действует бесплатная бета. Тарифы подключатся при публичном
            запуске — кнопки активируются автоматически, данные и история не потеряются.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col rounded-2xl bg-white p-6 text-zinc-900 shadow-2xl sm:p-8 ${
                p.highlight
                  ? "shadow-amber-500/20 ring-2 ring-amber-500"
                  : "shadow-black/20 ring-1 ring-zinc-200"
              }`}
            >
              {p.highlight && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 border-amber-300 bg-amber-100 text-amber-800">
                  <Sparkles className="mr-1 h-3 w-3" /> Рекомендуем
                </Badge>
              )}
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-lg font-bold">{p.name}</h3>
              </div>
              <p className="mt-1 text-sm text-zinc-500">{p.audience}</p>
              <p className="mt-4">
                <span className="text-4xl font-bold tracking-tight">{p.price} ₽</span>
                <span className="ml-1.5 text-sm text-zinc-500">в месяц</span>
              </p>

              <div className="my-6 border-t border-zinc-200" />

              <ul className="flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <span className="text-zinc-600">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                disabled
                className="mt-7 h-12 w-full rounded-xl bg-amber-500 text-base font-semibold text-white hover:bg-amber-600"
              >
                Подключить — при публичном запуске
              </Button>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs leading-relaxed text-zinc-500">
          Биллинг — раз в 30 дней, автопродление, отмена в любой момент.
          Оформляя подписку, вы соглашаетесь с{" "}
          <a href="/offer" className="underline underline-offset-2 hover:text-amber-400">
            офертой рекуррентных платежей
          </a>
          ,{" "}
          <a href="/privacy" className="underline underline-offset-2 hover:text-amber-400">
            политикой ПД
          </a>{" "}
          и{" "}
          <a href="/terms" className="underline underline-offset-2 hover:text-amber-400">
            условиями подписки
          </a>
          . Демо-режим: платёжный провайдер будет подключён при публичном запуске сервиса.
        </p>
      </div>
    </section>
  );
}
