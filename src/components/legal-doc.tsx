import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * Общий каркас правовых документов (/offer, /privacy, /terms).
 * Серверный компонент — без интерактива.
 */
export function LegalDoc({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900">
      <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-4xl items-center gap-3 px-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition hover:text-amber-700"
          >
            <ArrowLeft className="h-4 w-4" /> На главную
          </Link>
          <div className="ml-auto flex items-center gap-2.5">
            <Badge className="hidden border-amber-300 bg-amber-100 text-[11px] text-amber-800 sm:inline-flex">
              ВНУТРЕННЯЯ ВЕРСИЯ — НЕ ПУБЛИКОВАТЬ
            </Badge>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-amber-400">
              <Scale className="h-4 w-4" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:py-14">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-2 text-xs text-zinc-500">
          Редакция от 12 октября 2026 г. · Проект для внутреннего обсуждения —
          требует финальной юридической проверки перед публикацией.
        </p>
        <div className="mt-8 border-t border-zinc-200 pt-6 [&_h2]:mt-10 [&_h2]:scroll-mt-20 [&_h2]:text-lg [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:font-semibold [&_li]:mt-1.5 [&_li]:leading-relaxed [&_li]:text-zinc-700 [&_p]:mt-3 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-zinc-700 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-sm first:[&_h2]:mt-0">
          {children}
        </div>
      </main>

      <footer className="mt-auto border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <p className="text-xs leading-relaxed text-zinc-500">
            Parselex предоставляет правовую информацию, а не юридическую
            консультацию. Полноценную консультацию может дать только
            лицензированный юрист или адвокат. © 2026 Parselex — Legal Document
            Intelligence Platform.
          </p>
          <p className="mt-2 text-xs text-zinc-400">
            См. также:{" "}
            <Link href="/offer" className="underline underline-offset-2 hover:text-amber-700">
              оферта рекуррентных платежей
            </Link>{" "}
            ·{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-amber-700">
              политика ПД
            </Link>{" "}
            ·{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:text-amber-700">
              условия подписки
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
