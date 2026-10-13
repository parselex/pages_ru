import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { TemplatesBrowser } from "@/components/templates-browser";
import { DOC_TEMPLATES, TEMPLATE_CATEGORIES } from "@/lib/templates";

export const metadata: Metadata = {
  title: "База шаблонов документов — Parselex Право (внутренняя бета)",
  description:
    "База типовых юридических документов: претензии, жалобы, заявления, договоры, судебные документы и обращения в госорганы — с местами для заполнения и ссылками на нормы. Внутренняя версия — не публиковать.",
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Страница «База шаблонов» (/templates).
 *
 * 2026-10-13 (владелец): добавлена собственная база шаблонов документов.
 * Данные шаблонов — src/lib/templates.ts (только клиент, без API).
 * noindex + INTERNAL-бейдж — как на всём сайте.
 */
export default function TemplatesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-amber-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M12 3v18M5 7l7-4 7 4M5 7l-2 9a5 5 0 0 0 4 0L5 7ZM19 7l-2 9a5 5 0 0 0 4 0L19 7Z" />
            </svg>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold tracking-tight">Parselex Право</p>
            <p className="text-[11px] text-zinc-500">legal document intelligence</p>
          </div>
          <Badge className="ml-3 hidden border-amber-300 bg-amber-100 text-[11px] text-amber-800 sm:inline-flex">
            ВНУТРЕННЯЯ ВЕРСИЯ — НЕ ПУБЛИКОВАТЬ
          </Badge>
          <nav className="ml-auto hidden items-center gap-5 sm:flex">
            <Link href="/templates" className="text-sm font-semibold text-amber-600">
              Шаблоны
            </Link>
            <Link
              href="/#premium"
              className="text-sm font-semibold text-zinc-600 transition hover:text-amber-600"
            >
              Premium
            </Link>
          </nav>
          <Link
            href="/"
            className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
          >
            На главную
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-zinc-950 text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, #f59e0b 0, transparent 40%), radial-gradient(circle at 80% 70%, #f59e0b 0, transparent 45%)",
            }}
          />
          <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-18">
            <Badge variant="outline" className="mb-5 border-amber-500/40 bg-amber-500/10 text-amber-400">
              База шаблонов · {DOC_TEMPLATES.length} документов · {TEMPLATE_CATEGORIES.length} категорий
            </Badge>
            <h1 className="max-w-3xl text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl">
              Готовые структуры юридических документов —{" "}
              <span className="text-amber-400">с местами для заполнения</span> и ссылками на нормы
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-300">
              Претензии, жалобы, заявления, договоры и судебные документы по типовым ситуациям:
              возврат товара, задержка зарплаты, споры с УК, взыскание долга, наследство,
              кредитные каникулы, самозанятость, обжалование постановлений. Раскройте шаблон,
              скопируйте текст и заполните поля [в квадратных скобках] — или передайте
              заполнение ИИ-помощнику кнопкой «Заполнить с Parselex».
            </p>
            <dl className="mt-8 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                [`${DOC_TEMPLATES.length}`, "шаблонов с полными текстами"],
                [`${TEMPLATE_CATEGORIES.length}`, "категорий — от потребителей до суда"],
                ["0", "ваших данных: шаблоны открываются без регистрации"],
              ].map(([k, v]) => (
                <div key={k} className="border-l-2 border-amber-500/60 pl-4">
                  <dt className="text-2xl font-bold text-amber-400">{k}</dt>
                  <dd className="mt-1 text-sm text-zinc-400">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Браузер шаблонов ─────────────────────────────── */}
        <section className="bg-zinc-50 py-14 sm:py-16">
          <div className="mx-auto max-w-4xl px-4">
            <TemplatesBrowser />

            {/* Дисклеймер */}
            <div className="mt-12 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="text-[13px] leading-relaxed text-amber-900">
                <b>Важно.</b> Шаблоны носят информационный характер, отражают типовые ситуации и не
                являются юридической консультацией (см. «Отказ от ответственности» в{" "}
                <Link href="/terms" className="underline underline-offset-2 hover:text-amber-700">
                  условиях подписки
                </Link>
                ). Ссылки, сроки и пошлины в шаблонах сверены с редакциями законодательства на
                октябрь 2026 года (самопроверка Parselex), но не заменяют вычитку профильным
                юристом по вашей ситуации. Законодательство меняется: перед подачей документа
                проверьте актуальность норм и адаптируйте текст под свои обстоятельства.
                Разобрать вашу ситуацию со ссылками на закон можно в чате Parselex.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="mt-auto bg-zinc-950 py-8 text-zinc-400">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs">© 2026 Parselex — Legal Document Intelligence Platform</p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
            <Link href="/" className="transition hover:text-amber-400">
              Главная
            </Link>
            <Link href="/offer" className="transition hover:text-amber-400">
              Оферта
            </Link>
            <Link href="/privacy" className="transition hover:text-amber-400">
              Политика ПД
            </Link>
            <Link href="/terms" className="transition hover:text-amber-400">
              Условия подписки
            </Link>
            <a href="mailto:contact@parselex.ru" className="transition hover:text-amber-400">
              contact@parselex.ru
            </a>
          </nav>
        </div>
        <div className="mx-auto mt-4 max-w-6xl px-4">
          <p className="border-t border-zinc-800 pt-4 text-xs text-zinc-500">
            Внутренняя сборка для обсуждения — не публиковать. Веб-сайт Parselex — parselex.ru.
          </p>
        </div>
      </footer>
    </div>
  );
}
