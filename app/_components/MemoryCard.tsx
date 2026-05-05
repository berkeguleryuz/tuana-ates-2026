"use client";

import { motion } from "framer-motion";
import { t } from "../_lib/i18n";
import { QuoteIcon } from "../_icons/QuoteIcon";

interface MemoryCardProps {
  authorName: string;
  message: string;
  createdAt: string;
  pending?: boolean;
}

function getRelativeDate(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return t("memoryTimeJustNow");
  if (diffMin < 60) return `${diffMin} ${t("memoryTimeMinutes")}`;
  if (diffHour < 24) return `${diffHour} ${t("memoryTimeHours")}`;
  if (diffDay < 7) return `${diffDay} ${t("memoryTimeDays")}`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)} ${t("memoryTimeWeeks")}`;
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function MemoryCard({
  authorName,
  message,
  createdAt,
  pending,
}: MemoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#241710] border border-[#e8a87c]/10 rounded-2xl p-5 relative"
    >
      <div className="absolute top-5 right-5 text-[#e8a87c]/[0.06]">
        <QuoteIcon className="size-8" size={32} />
      </div>

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-[#e8a87c]/10 flex items-center justify-center shrink-0">
            <span className="font-merienda text-xs text-[#e8a87c]">
              {authorName[0]?.toUpperCase()}
            </span>
          </div>
          <p className="font-sans text-xs uppercase tracking-[0.1em] text-[#e8a87c] font-medium">
            {authorName}
          </p>
        </div>
        {pending && (
          <span className="shrink-0 inline-flex items-center rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-sans text-amber-400">
            {t("memoryPendingBadge")}
          </span>
        )}
      </div>

      <p className="font-sans text-sm text-[#c4a88a] italic leading-[1.8] pl-11">
        &ldquo;{message}&rdquo;
      </p>

      <p className="font-sans text-[10px] text-[#8a7565] mt-2 pl-11">
        {getRelativeDate(createdAt)}
      </p>
    </motion.div>
  );
}
