import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { ChatWidget } from "@/components/chat-widget";
import { PremiumSection } from "@/components/premium-section";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  FileCheck2,
  FileText,
  Lock,
  MessagesSquare,
  Scale,
  Search,
  ShieldCheck,
} from "lucide-react";

const FAQ = [
  {
    q: "Это бесплатный ИИ-юрист?",
    a: "Да, это внутренняя бета-версия бесплатного правового помощника Parselex. Задавать вопросы можно прямо на этой странице без регистрации. В будущем планируются тарифные планы с расширенными функциями: разбор документов, составление претензий и договоров, аналитика судебной практики.",
  },
  {
    q: "Это юридическая консультация?",
    a: "Нет. Parselex Право предоставляет правовую информацию, а не юридическую консультацию — как любой ИИ-инструмент. Полноценную консультацию может дать только лицензированный юрист или адвокат, который несёт профессиональную ответственность и соблюдает адвокатскую тайну.",
  },
  {
    q: "Откуда берутся ссылки на законы?",
    a: "Помощник указывает применимые нормы российского права (ГК РФ, КоАП РФ, ТК РФ, Закон о защите прав потребителей и другие) прямо в ответах. В production-версии ссылки проверяются через RAG-поиск по юридическому корпусу Parselex — с цитатами на источник и опубликованным бенчмарком качества.",
  },
  {
    q: "Что происходит с моими данными?",
    a: "Архитектура Parselex построена на Zero-Trust (LexZTNA): перед обработкой текст проходит через «Ethics Firewall» — конвейер редактирования персональных данных (PII). Мы не используем ваши вопросы для обучения публичных моделей.",
  },
  {
    q: "Что входит в подписку Premium и сколько она стоит?",
    a: "Premium стоит 3 000 ₽ в месяц и включает: правовую базу РФ — ответы со ссылками на законы и практику; работу с документами — разбор и создание PDF, Word, DOC; безлимитное общение — без дневных лимитов на вопросы; 1М кредитов в месяц на Claude/Gemini для дел с большим объёмом — модели дообучены для русскоязычных пользователей, а для сложных задач разворачиваются раннеры на A100/H100; а также продукты безопасности — LexZtna Secure Network (защищённый Zero-Trust-доступ к сервисам) и PII Firewall (автоматическое редактирование персональных данных до передачи в модель).",
  },
  {
    q: "Что такое кредиты нейросетей и как они работают?",
    a: "Вместе с подпиской вы получаете 1М кредитов в месяц. Кредиты расходуются при обращениях к старшим моделям — Claude/Gemini, дообученным для русскоязычных пользователей, — которые подключаются для дел с большим объёмом: многостраничные договоры, объёмные исследования, судебная практика. Для самых сложных задач разворачиваются раннеры на A100/H100. Расход на запрос зависит от модели и объёма. Неизрасходованные кредиты не переносятся на следующий месяц.",
  },
  {
    q: "Как отменить подписку Premium?",
    a: "В любой момент: в личном кабинете или письмом в поддержку. Отмена прекращает будущие рекуррентные списания, при этом доступ к Premium сохраняется до конца уже оплаченного периода — после этого аккаунт переводится на бесплатный тариф.",
  },
  {
    q: "Заменит ли ИИ адвоката?",
    a: "Нет. ИИ берёт на себя рутину: первичную проверку документов, черновики, краткие изложения норм и исследований. Юридическое суждение, стратегия дела и ответственность остаются за человеком — адвокатом.",
  },
  {
    q: "Как сообщить об ошибке в ответе?",
    a: "Напишите на contact@parselex.ru: укажите текст вопроса и фрагмент ответа. Ошибочные ссылки на нормы — самый ценный тип обратной связи для нас.",
  },
];

const SCENARIOS = [
  {
    icon: Search,
    title: "Правовые исследования",
    text: "Найдём применимые нормы и объясним их простым языком: от бытовых споров до корпоративных вопросов.",
  },
  {
    icon: FileCheck2,
    title: "Проверка документов",
    text: "Разберём договор, претензию или отказ до того, как вы его подпишете: риски, пропуски, нестандартные условия.",
  },
  {
    icon: FileText,
    title: "Составление документов",
    text: "Черновики претензий, жалоб и заявлений по вашей ситуации — со структурой и ссылками на нормы.",
  },
  {
    icon: MessagesSquare,
    title: "Бытовые правовые вопросы",
    text: "Права потребителя, споры с работодателем, ЖКХ, штрафы — понятные ответы за секунды, без регистрации.",
  },
];

const DIFFERENTIATORS = [
  {
    icon: BookOpenCheck,
    title: "Цитаты, а не догадки",
    text: "Ответы со ссылками на конкретные нормы. В production — RAG-поиск по юридическому корпусу с проверяемыми цитатами.",
  },
  {
    icon: BarChart3,
    title: "Публичный бенчмарк",
    text: "Качество RAG-конвейера Parselex измеряется и публикуется открыто — редкость для правового ИИ.",
  },
  {
    icon: Lock,
    title: "Ethics Firewall",
    text: "Персональные данные редактируются на границе сети, до того как текст попадёт в модель.",
  },
  {
    icon: ShieldCheck,
    title: "Zero-Trust архитектура",
    text: "LexZTNA: доступ к сервисам только через аутентифицированные туннели, без доверия к сети.",
  },
];

const STEPS = [
  { n: "01", title: "Опишите ситуацию", text: "Простыми словами — что произошло и что вы хотите добиться." },
  { n: "02", title: "Получите разбор", text: "Применимые нормы, порядок действий и ссылки на статьи закона." },
  { n: "03", title: "Примите решение", text: "Действуйте сами или передайте дело юристу — с готовым черновиком позиции." },
];

export default function Home() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900">
      {/* JSON-LD FAQ (SEO-ready for future publication) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-amber-400">
            <Scale className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold tracking-tight">Parselex Право</p>
            <p className="text-[11px] text-zinc-500">legal document intelligence</p>
          </div>
          <Badge className="ml-3 hidden border-amber-300 bg-amber-100 text-[11px] text-amber-800 sm:inline-flex">
            ВНУТРЕННЯЯ ВЕРСИЯ — НЕ ПУБЛИКОВАТЬ
          </Badge>
          <nav className="ml-auto hidden items-center gap-5 sm:flex">
            <Link
              href="/templates"
              className="text-sm font-semibold text-zinc-600 transition hover:text-amber-600"
            >
              Шаблоны
            </Link>
            <a
              href="#premium"
              className="text-sm font-semibold text-zinc-600 transition hover:text-amber-600"
            >
              Premium
            </a>
          </nav>
          <Button
            asChild
            className="rounded-xl bg-amber-500 text-white hover:bg-amber-600"
          >
            <a href="#chat">
              Задать вопрос <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Button>
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
          <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
            <Badge variant="outline" className="mb-6 border-amber-500/40 bg-amber-500/10 text-amber-400">
              Бесплатный доступ · без регистрации · бета
            </Badge>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl">
              ИИ-помощник по российскому праву —{" "}
              <span className="text-amber-400">со ссылками на закон</span>, а не догадками
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
              Задайте правовой вопрос и получите структурированный разбор: применимые нормы,
              порядок действий и источники. Правовая информация — понятно, быстро и с проверяемыми цитатами.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild className="h-12 rounded-xl bg-amber-500 px-6 text-base font-semibold text-white hover:bg-amber-600">
                <a href="#chat">
                  Попробовать сейчас <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-xl border-zinc-700 bg-transparent px-6 text-base text-zinc-200 hover:bg-zinc-800 hover:text-white"
              >
                <a href="#how">Как это работает</a>
              </Button>
            </div>
            <dl className="mt-14 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                ["7", "категорий права: уголовное, гражданское, коммерческое, IP…"],
                ["RAG", "поиск по корпусу с цитатами (в production)"],
                ["0", "ваших персональных данных в обучении моделей"],
              ].map(([k, v]) => (
                <div key={k} className="border-l-2 border-amber-500/60 pl-4">
                  <dt className="text-2xl font-bold text-amber-400">{k}</dt>
                  <dd className="mt-1 text-sm text-zinc-400">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Chat ─────────────────────────────────────────── */}
        <section id="chat" className="scroll-mt-20 bg-zinc-50 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Спросите ИИ-юриста прямо сейчас
              </h2>
              <p className="mt-2 text-sm text-zinc-500 sm:text-base">
                Опишите ситуацию своими словами — ответ придёт со ссылками на нормы права
              </p>
            </div>
            <ChatWidget />
            <p className="mt-5 text-center text-sm text-zinc-500">
              Нужен безлимит, разбор документов и старшие модели?{" "}
              <Link
                href="#premium"
                className="font-semibold text-amber-700 underline underline-offset-2 hover:text-amber-800"
              >
                Premium — 3 000 ₽/мес
              </Link>
            </p>
          </div>
        </section>

        {/* ── Scenarios ────────────────────────────────────── */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Что умеет нейроюрист</h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-500 sm:text-base">
              Четыре основных сценария — от быстрого вопроса до подготовки документов
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SCENARIOS.map((s) => (
                <Card key={s.title} className="border-zinc-200 transition hover:border-amber-300 hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                      <s.icon className="h-5.5 w-5.5" />
                    </div>
                    <h3 className="mt-4 font-semibold">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-500">{s.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-zinc-500">
              Готовые структуры претензий, жалоб, заявлений и договоров — в{" "}
              <Link
                href="/templates"
                className="font-semibold text-amber-700 underline underline-offset-2 hover:text-amber-800"
              >
                базе шаблонов документов
              </Link>
              .
            </p>
          </div>
        </section>

        {/* ── Differentiators ──────────────────────────────── */}
        <section className="bg-zinc-50 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Почему Parselex, а не очередной чат-бот
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {DIFFERENTIATORS.map((d) => (
                <Card key={d.title} className="border-zinc-200 bg-white">
                  <CardContent className="p-6">
                    <d.icon className="h-6 w-6 text-amber-600" />
                    <h3 className="mt-3 font-semibold">{d.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-500">{d.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────── */}
        <section id="how" className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Как это работает</h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {STEPS.map((s) => (
                <div key={s.n} className="rounded-2xl border border-zinc-200 p-6">
                  <p className="text-3xl font-bold text-amber-500/90">{s.n}</p>
                  <h3 className="mt-3 font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────── */}
        {/* ── Premium ──────────────────────────────────────── */}
        <PremiumSection />

        <section className="bg-zinc-50 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Частые вопросы</h2>
            <Accordion type="single" collapsible className="mt-6">
              {FAQ.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-sm font-semibold sm:text-base">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-zinc-600">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      {/* ── Footer (sticky bottom) ────────────────────────── */}
      <footer className="mt-auto bg-zinc-950 text-zinc-400">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Parselex Право</p>
                <p className="text-xs">© 2026 Parselex — Legal Document Intelligence Platform</p>
              </div>
            </div>
            <nav className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm" aria-label="Правовые документы">
              {[
                ["Оферта рекуррентных платежей", "/offer"],
                ["Политика обработки персональных данных", "/privacy"],
                ["Условия подписки Premium", "/terms"],
                ["Отказ от ответственности (ИИ)", "/terms"],
                ["Premium — 3 000 ₽/мес", "#premium"],
                ["База шаблонов документов", "/templates"],
                ["contact@parselex.ru", "mailto:contact@parselex.ru"],
              ].map(([label, href]) => (
                <Link key={label} href={href} className="transition hover:text-amber-400">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <p className="mt-8 border-t border-zinc-800 pt-4 text-xs text-zinc-500">
            Внутренняя сборка для обсуждения — не публиковать. Веб-сайт Parselex — parselex.ru.
          </p>
        </div>
      </footer>
    </div>
  );
}
