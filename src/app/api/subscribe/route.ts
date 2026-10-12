import { NextResponse } from "next/server";

/**
 * ДЕМО-эндпоинт оформления подписки Premium (Phase 4 заготовка).
 *
 * Что делает СЕЙЧАС:
 *   - валидирует e-mail и оба обязательных согласия
 *     (оферта рекуррентных платежей + политика ПД; условия подписки);
 *   - примитивный rate limit (10 заявок/час на IP);
 *   - хранит заявку ТОЛЬКО в памяти процесса (демо, не ПД-хранилище).
 *
 * Чего НЕТ (подключается при публичном запуске):
 *   - платёжный провайдер / рекуррентные списания 1 490 ₽/мес;
 *   - постоянное хранилище, письма-подтверждения;
 *   - запись согласий как юридических фактов (требуется по 152-ФЗ:
 *     IP, timestamp, версия оферты — добавить вместе с БД).
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RATE_LIMIT = 10;
const WINDOW_MS = 60 * 60 * 1000;

const hits = new Map<string, number[]>();
// Демо-хранилище заявок в памяти процесса: очищается при рестарте.
const demoSubmissions = new Map<string, number>();

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "unknown";
}

export async function POST(req: Request) {
  // --- rate limit ---
  const ip = clientIp(req);
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    return NextResponse.json(
      { message: "Слишком много попыток. Попробуйте через час." },
      { status: 429 }
    );
  }
  recent.push(now);
  hits.set(ip, recent);

  // --- валидация тела ---
  const body = await req.json().catch(() => null);
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const acceptOffer = body?.acceptOffer === true;
  const acceptTerms = body?.acceptTerms === true;

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { message: "Укажите корректный e-mail." },
      { status: 400 }
    );
  }
  if (!acceptOffer || !acceptTerms) {
    return NextResponse.json(
      {
        message:
          "Для оформления подписки необходимо согласие с условиями оферты рекуррентных платежей, политикой обработки персональных данных и условиями подписки.",
      },
      { status: 400 }
    );
  }

  // --- демо-приём заявки ---
  demoSubmissions.set(email, now);
  console.info(
    `[subscribe] demo submission: ${email} (offer+terms accepted, ip=${ip})`
  );

  return NextResponse.json({
    ok: true,
    demo: true,
    message:
      "Демо-заявка принята. Платёжная интеграция будет подключена при публичном запуске.",
  });
}
