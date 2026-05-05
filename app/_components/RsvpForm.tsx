"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { HeartIcon } from "../_icons/HeartIcon";
import { AnimatedCheckMark, AnimatedCrossMark } from "./AnimatedRsvpMarks";

type RsvpStatus = "confirmed" | "declined";

interface AdditionalGuest {
  id: string;
  name: string;
}

const inputClass =
  "w-full h-12 rounded-xl border border-[#e8a87c]/15 bg-[#241710] px-4 text-sm text-[#faf0e6] placeholder:text-[#8a7565] focus:border-[#e8a87c]/40 focus:outline-none transition-all font-sans";

export function RsvpForm() {
  const wedding = useWedding();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState<RsvpStatus>("confirmed");
  const [additionalGuests, setAdditionalGuests] = useState<AdditionalGuest[]>(
    []
  );
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  const weddingDate = new Date(wedding.weddingDate).toLocaleDateString(
    "tr-TR",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const addGuest = () => {
    setAdditionalGuests((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "" },
    ]);
  };

  const removeGuest = (id: string) => {
    setAdditionalGuests((prev) => prev.filter((g) => g.id !== id));
  };

  const updateGuest = (id: string, value: string) => {
    setAdditionalGuests((prev) =>
      prev.map((g) => (g.id === id ? { ...g, name: value } : g))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(t("rsvpNameRequired"));
      return;
    }

    setIsSubmitting(true);

    try {
      const body = {
        name: name.trim(),
        phone: phone.trim(),
        rsvpStatus,
        additionalGuests:
          rsvpStatus === "confirmed"
            ? additionalGuests
                .filter((g) => g.name.trim())
                .map((g) => ({ name: g.name.trim() }))
            : [],
        note: note.trim(),
        source: "website" as const,
      };

      const res = await fetch(`/api/public/rsvp/${wedding.inviteCode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || t("rsvpErrorToast"));
      }

      setIsSuccess(true);
      toast.success(t("rsvpSuccessToast"));
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t("rsvpErrorToast")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <div className="w-12 h-px bg-gradient-to-r from-[#d4735e] to-[#e8a87c] mb-6" />
        <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#8a7565] mb-3">
          {t("navRsvp")}
        </p>
        <h2 className="font-merienda text-4xl text-[#e8a87c]">
          {brideFirst} & {groomFirst}
        </h2>
        <p className="font-sans text-sm text-[#c4a88a] mt-2">
          {weddingDate} &middot; {wedding.weddingTime}
        </p>
        {wedding.venueName && (
          <p className="font-sans text-sm text-[#8a7565] mt-1">
            {wedding.venueName}
          </p>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-[#241710] rounded-2xl border border-[#e8a87c]/10 p-10 text-center space-y-5"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto"
            >
              <HeartIcon className="size-10 text-emerald-400" size={40} />
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-merienda text-2xl text-[#faf0e6]"
            >
              {t("rsvpSuccessTitle")}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="font-sans text-sm text-[#c4a88a] leading-relaxed"
            >
              {t("rsvpSuccessMessage")}
            </motion.p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit}
            className="bg-[#241710] rounded-2xl border border-[#e8a87c]/10 p-6 md:p-8 space-y-6"
          >
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-wider text-[#8a7565]">
                {t("rsvpNamePlaceholder")} *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("rsvpNamePlaceholder")}
                className={inputClass}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-wider text-[#8a7565]">
                {t("rsvpPhonePlaceholder")}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("rsvpPhonePlaceholder")}
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-wider text-[#8a7565]">
                {t("rsvpAttendanceLabel")}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRsvpStatus("confirmed")}
                  className={cn(
                    "rounded-xl border flex flex-col items-center justify-center gap-1.5 py-3.5 px-2 transition-all",
                    rsvpStatus === "confirmed"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "border-[#e8a87c]/15 bg-[#241710] text-[#8a7565] hover:text-[#c4a88a]"
                  )}
                >
                  <AnimatedCheckMark active={rsvpStatus === "confirmed"} />
                  <span className="font-sans text-[13px] font-medium tracking-wide">
                    {t("rsvpAttending")}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setRsvpStatus("declined")}
                  className={cn(
                    "rounded-xl border flex flex-col items-center justify-center gap-1.5 py-3.5 px-2 transition-all",
                    rsvpStatus === "declined"
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                      : "border-[#e8a87c]/15 bg-[#241710] text-[#8a7565] hover:text-[#c4a88a]"
                  )}
                >
                  <AnimatedCrossMark active={rsvpStatus === "declined"} />
                  <span className="font-sans text-[13px] font-medium tracking-wide">
                    {t("rsvpNotAttending")}
                  </span>
                </button>
              </div>
            </div>

            <AnimatePresence>
              {rsvpStatus === "confirmed" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <label className="font-sans text-xs uppercase tracking-wider text-[#8a7565]">
                      {t("rsvpAdditionalGuests")}
                    </label>
                    <button
                      type="button"
                      onClick={addGuest}
                      className="flex items-center gap-1.5 text-xs font-sans text-[#e8a87c] hover:text-[#e8a87c]/80 transition-colors"
                    >
                      + {t("rsvpAddGuest")}
                    </button>
                  </div>

                  <AnimatePresence>
                    {additionalGuests.map((guest) => (
                      <motion.div
                        key={guest.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          value={guest.name}
                          onChange={(e) =>
                            updateGuest(guest.id, e.target.value)
                          }
                          placeholder={t("rsvpGuestPlaceholder")}
                          className={cn(inputClass, "flex-1")}
                        />
                        <button
                          type="button"
                          onClick={() => removeGuest(guest.id)}
                          className="w-12 h-12 rounded-xl border border-[#e8a87c]/15 bg-[#241710] flex items-center justify-center text-[#8a7565] hover:text-rose-400 hover:border-rose-500/30 transition-all"
                        >
                          &times;
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-wider text-[#8a7565]">
                {t("rsvpNotePlaceholder")}
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t("rsvpNotePlaceholder")}
                rows={3}
                className={cn(inputClass, "h-auto py-3 resize-none")}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#d4735e] to-[#e8a87c] text-white font-semibold font-sans text-sm transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? t("rsvpSubmitting") : t("rsvpSubmit")}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
