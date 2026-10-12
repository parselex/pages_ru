import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ─────────────────────────────────────────────────────────────
   Parselex Право — public RU legal chat (INTERNAL prototype)
   Endpoint mirrors the Phase-1 contract from the refactor plan:
   POST { message, history[] } → { answer, citations[], quota, disclaimer }
   Later this proxies the real parselex.app RAG core (kanon-2 + corpus).
   ───────────────────────────────────────────────────────────── */

type ChatMsg = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `Ты — «Parselex Право», ИИ-помощник по российскому праву.
Строгие правила:
1. Отвечай только на русском языке, кратко и структурировано (шаги, списки).
2. Опирайся на нормы российского права (ГК РФ, КоАП РФ, ТК РФ, УК РФ, Закон о защите прав потребителей и т.п.) и указывай конкретные статьи прямо в тексте, например: (ст. 1064 ГК РФ).
3. В самом конце ответа добавь блок ровно в таком формате:
Источники:
- <Акт>, <статья> — <краткое пояснение в одну строку>
4. Ты предоставляешь правовую ИНФОРМАЦИЮ, а не юридическую консультацию; не гарантируй исход дела.
5. Для сложных или высокорискованных ситуаций (уголовное преследование, суд, крупные суммы) прямо рекомендуй обратиться к лицензированному юристу или адвокату.
6. Если данных мало — задай не более двух уточняющих вопросов в конце ответа.
7. Не выдумывай номера статей: если не уверен в норме — честно скажи об этом.`;

const DISCLAIMER =
  "Parselex Право предоставляет правовую информацию, а не юридическую консультацию. Для вопросов, требующих юридической силы, обратитесь к лицензированному юристу.";

const MAX_HISTORY = 10;
const MAX_LEN = 4000;
const LIMIT_HOUR = 30;
const LIMIT_DAY = 120;

/* naive in-memory limiter — fine for an internal prototype */
const buckets = new Map<string, { d: number; day: number }>();
const hourly = new Map<string, number>();

function rateLimit(ip: string) {
  const now = Date.now();
  const today = Math.floor(now / 86_400_000);
  const hourKey = `${ip}:${Math.floor(now / 3_600_000)}`;
  const b = buckets.get(ip) ?? { d: 0, day: today };
  if (b.day !== today) { b.d = 0; b.day = today; }
  b.d += 1;
  const h = (hourly.get(hourKey) ?? 0) + 1;
  hourly.set(hourKey, h);
  if (buckets.size > 5000) buckets.clear();
  if (hourly.size > 5000) hourly.clear();
  return {
    ok: h <= LIMIT_HOUR && b.d <= LIMIT_DAY,
    hourLeft: Math.max(0, LIMIT_HOUR - h),
    dayLeft: Math.max(0, LIMIT_DAY - b.d),
  };
}

function extractSources(text: string): { answer: string; citations: { source: string; note: string }[] } {
  // Robust marker detection: «Источники:», «ИСТОЧНИКИ», «**Источники**» etc.
  const lines = text.split("\n");
  let marker = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (/^\s*(#{1,6}\s*)?\**\s*источник[иия]*\s*:?\s*\**\s*:?\s*$/i.test(lines[i])) {
      marker = i;
      break;
    }
  }
  if (marker === -1) return { answer: text.trim(), citations: [] };
  const answer = lines.slice(0, marker).join("\n").trim();
  const citations: { source: string; note: string }[] = [];
  for (const line of lines.slice(marker + 1)) {
    const t = line.replace(/^[-•*\s]+/, "").trim();
    if (!t) continue;
    const [src, ...rest] = t.split("—");
    if (src.trim()) citations.push({ source: src.trim(), note: rest.join("—").trim() });
  }
  return { answer, citations };
}

function sanitizeHistory(raw: unknown): ChatMsg[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((m): m is ChatMsg =>
      !!m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_LEN) }));
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const limit = rateLimit(ip);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "limit_exceeded", message: "Слишком много запросов. Попробуйте позже." },
        { status: 429 },
      );
    }

    const body = await req.json().catch(() => null);
    const message = typeof body?.message === "string" ? body.message.trim().slice(0, MAX_LEN) : "";
    if (!message) {
      return NextResponse.json({ error: "bad_request", message: "Пустой вопрос." }, { status: 400 });
    }
    const history = sanitizeHistory(body?.history);

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history,
        { role: "user", content: message },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    if (!raw) {
      return NextResponse.json(
        { error: "empty_answer", message: "Модель не вернула ответ. Попробуйте переформулировать вопрос." },
        { status: 502 },
      );
    }
    const { answer, citations } = extractSources(raw);

    return NextResponse.json({
      answer,
      citations,
      quota: { hourLeft: limit.hourLeft, dayLeft: limit.dayLeft },
      disclaimer: DISCLAIMER,
    });
  } catch (e) {
    console.error("[public-chat]", e);
    return NextResponse.json(
      { error: "internal", message: "Сервис временно недоступен. Повторите попытку." },
      { status: 500 },
    );
  }
}
