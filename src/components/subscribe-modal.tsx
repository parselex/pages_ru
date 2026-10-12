"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Демо-модалка оформления подписки Premium.
 * Платёжный провайдер НЕ подключён (Phase 4) — submit уходит в /api/subscribe,
 * который лишь валидирует согласия и имитирует приём заявки.
 * Оба согласия обязательны: чекбокс оферты+ПД и чекбокс условий подписки.
 */
export function SubscribeModal({ open, onOpenChange }: Props) {
  const [email, setEmail] = useState("");
  const [acceptOffer, setAcceptOffer] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function close(v: boolean) {
    if (!v) {
      setDone(false);
      setError(null);
    }
    onOpenChange(v);
  }

  async function submit() {
    setError(null);
    if (!EMAIL_RE.test(email.trim())) {
      setError("Укажите корректный e-mail — на него придёт подтверждение подписки.");
      return;
    }
    if (!acceptOffer) {
      setError(
        "Отметьте согласие с условиями оферты рекуррентных платежей и политикой обработки персональных данных."
      );
      return;
    }
    if (!acceptTerms) {
      setError("Отметьте согласие с условиями подписки.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), acceptOffer, acceptTerms }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.message ?? "Не удалось оформить подписку. Попробуйте ещё раз.");
      } else {
        setDone(true);
      }
    } catch {
      setError("Сеть недоступна. Проверьте соединение и попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-md">
        {done ? (
          <div className="py-2 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-amber-500" />
            <h3 className="mt-4 text-lg font-bold">Демо-заявка сохранена</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              Оформление подписки имитируется: платёжный провайдер будет подключён при
              публичном запуске. Мы пришлём письмо на <b>{email.trim()}</b>, когда оплата
              заработает.
            </p>
            <DialogFooter className="mt-6 sm:justify-center">
              <Button
                onClick={() => close(false)}
                className="w-full rounded-xl bg-amber-500 text-white hover:bg-amber-600 sm:w-auto"
              >
                Закрыть
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Оформление подписки Premium</DialogTitle>
              <DialogDescription>
                1 490 ₽ в месяц · автопродление · отмена в любой момент
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sub-email">E-mail</Label>
                <Input
                  id="sub-email"
                  type="email"
                  inputMode="email"
                  placeholder="you@example.ru"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex items-start gap-2.5">
                  <Checkbox
                    id="consent-offer"
                    checked={acceptOffer}
                    onCheckedChange={(v) => setAcceptOffer(v === true)}
                    className="mt-0.5"
                  />
                  <label
                    htmlFor="consent-offer"
                    className="text-xs leading-relaxed text-zinc-600"
                  >
                    Я согласен с условиями{" "}
                    <a
                      href="/offer"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-amber-700 underline underline-offset-2"
                    >
                      оферты рекуррентных платежей
                    </a>{" "}
                    и{" "}
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-amber-700 underline underline-offset-2"
                    >
                      политикой обработки персональных данных
                    </a>
                  </label>
                </div>
                <div className="flex items-start gap-2.5">
                  <Checkbox
                    id="consent-terms"
                    checked={acceptTerms}
                    onCheckedChange={(v) => setAcceptTerms(v === true)}
                    className="mt-0.5"
                  />
                  <label
                    htmlFor="consent-terms"
                    className="text-xs leading-relaxed text-zinc-600"
                  >
                    Я согласен с{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-amber-700 underline underline-offset-2"
                    >
                      условиями подписки
                    </a>
                  </label>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs leading-relaxed text-red-700"
                >
                  {error}
                </p>
              )}
            </div>

            <DialogFooter className="flex-col gap-3">
              <Button
                onClick={submit}
                disabled={loading}
                className="h-12 w-full rounded-xl bg-amber-500 text-base font-semibold text-white hover:bg-amber-600"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Оформить подписку — 1 490 ₽/мес"
                )}
              </Button>
              <p className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                Демо-режим: оплата не списывается, данные карты не запрашиваются.
              </p>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
