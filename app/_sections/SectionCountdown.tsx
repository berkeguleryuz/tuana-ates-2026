"use client";

import { useCallback, useEffect, useSyncExternalStore, useState } from "react";
import { motion } from "framer-motion";
import { useWedding } from "../_lib/context";
import { stripSurname } from "../_lib/names";
import { t } from "../_lib/i18n";

const TR_TIMEZONE = "Europe/Istanbul";

function buildTurkeyTarget(dateStr: string, timeStr: string) {
  const datePart = (dateStr || "").slice(0, 10);
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh = 0, mm = 0] = (timeStr || "00:00").split(":").map(Number);
  return new Date(Date.UTC(y, (m || 1) - 1, d || 1, hh - 3, mm, 0));
}

function computeTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const trDateFormatter = new Intl.DateTimeFormat("tr-TR", {
  timeZone: TR_TIMEZONE,
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const trTimeFormatter = new Intl.DateTimeFormat("tr-TR", {
  timeZone: TR_TIMEZONE,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function useIsMounted() {
  return useSyncExternalStore(
    useCallback((cb: () => void) => {
      cb();
      return () => {};
    }, []),
    () => true,
    () => false,
  );
}

function CountdownCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-gradient-to-br from-[#d4735e]/30 to-[#f0c27f]/10 rounded-2xl p-px">
        <div className="bg-[#241710] rounded-2xl px-5 py-6 sm:px-7 sm:py-8 md:px-8 md:py-10 min-w-[70px] sm:min-w-[90px] md:min-w-[110px] flex flex-col items-center">
          <span className="font-merienda text-4xl sm:text-5xl md:text-5xl text-[#faf0e6] tabular-nums leading-none">
            {value}
          </span>
          <span className="font-sans text-[9px] md:text-[10px] text-[#8a7565] uppercase tracking-[0.25em] mt-3">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}

export function SectionCountdown() {
  const wedding = useWedding();
  const mounted = useIsMounted();
  const target = buildTurkeyTarget(wedding.weddingDate, wedding.weddingTime);
  const [timeLeft, setTimeLeft] = useState(() => computeTimeLeft(target));

  useEffect(() => {
    const interval = setInterval(
      () => setTimeLeft(computeTimeLeft(target)),
      1000,
    );
    return () => clearInterval(interval);
  }, [target]);

  const brideFirst = stripSurname(wedding.brideName);
  const groomFirst = stripSurname(wedding.groomName);

  const pad = (n: number) => String(n).padStart(2, "0");

  const targetDateLabel = trDateFormatter.format(target);
  const targetTimeLabel = trTimeFormatter.format(target);

  return (
    <section className="relative py-20 md:py-28 bg-[#1a0f0a] overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-[#8a7565] mb-3">
            {t("countdownLabel")}
          </p>
          <h2 className="font-merienda text-2xl md:text-3xl text-[#faf0e6]">
            {t("countdownHeading")}
          </h2>
          <p className="font-sans text-xs md:text-sm text-[#c4a88a] mt-4 capitalize">
            {targetDateLabel} • {targetTimeLabel} (TRT)
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6"
          suppressHydrationWarning
        >
          {mounted ? (
            <>
              <CountdownCard
                value={pad(timeLeft.days)}
                label={t("countdownDays")}
              />
              <span className="text-[#d4735e]/40 text-lg select-none hidden sm:block">
                &#9671;
              </span>
              <CountdownCard
                value={pad(timeLeft.hours)}
                label={t("countdownHours")}
              />
              <span className="text-[#d4735e]/40 text-lg select-none hidden sm:block">
                &#9671;
              </span>
              <CountdownCard
                value={pad(timeLeft.minutes)}
                label={t("countdownMinutes")}
              />
              <span className="text-[#d4735e]/40 text-lg select-none hidden sm:block">
                &#9671;
              </span>
              <CountdownCard
                value={pad(timeLeft.seconds)}
                label={t("countdownSeconds")}
              />
            </>
          ) : (
            <>
              <CountdownCard value="--" label={t("countdownDays")} />
              <span className="text-[#d4735e]/40 text-lg select-none hidden sm:block">
                &#9671;
              </span>
              <CountdownCard value="--" label={t("countdownHours")} />
              <span className="text-[#d4735e]/40 text-lg select-none hidden sm:block">
                &#9671;
              </span>
              <CountdownCard value="--" label={t("countdownMinutes")} />
              <span className="text-[#d4735e]/40 text-lg select-none hidden sm:block">
                &#9671;
              </span>
              <CountdownCard value="--" label={t("countdownSeconds")} />
            </>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-10 text-[#8a7565] italic font-merienda text-sm"
        >
          #{brideFirst}
          {groomFirst}
        </motion.p>
      </div>
    </section>
  );
}
