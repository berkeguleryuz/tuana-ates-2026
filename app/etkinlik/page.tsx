"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { EventSchedule } from "../_components/EventSchedule";
import { MapPinIcon } from "../_icons/MapPinIcon";
import { CalendarIcon } from "../_icons/CalendarIcon";
import { ClockIcon } from "../_icons/ClockIcon";

export default function EtkinlikPage() {
  const wedding = useWedding();
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  const weddingDate = new Date(wedding.weddingDate).toLocaleDateString(
    "tr-TR",
    { day: "numeric", month: "long", year: "numeric", weekday: "long" }
  );

  return (
    <div className="min-h-svh">
      <div className="relative h-[50vh] min-h-[320px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1478146059778-26028b07395a?w=1400&q=80"
          alt="Venue"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0a] via-[#1a0f0a]/50 to-[#d4735e]/10" />

        <div className="absolute bottom-8 left-6 md:left-12 z-10">
          <div className="w-12 h-px bg-gradient-to-r from-[#d4735e] to-[#e8a87c] mb-4" />
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#e8a87c]/70 mb-2">
            {t("eventLabel")}
          </p>
          <h1 className="font-merienda text-3xl md:text-4xl text-[#faf0e6]">
            {brideFirst} & {groomFirst}
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 -mt-12 relative z-10 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-[#241710] rounded-2xl border border-[#e8a87c]/10 p-6 md:p-8 mb-8">
            <h2 className="font-merienda text-xl text-[#faf0e6] mb-5">
              {wedding.venueName || t("venueLabel")}
            </h2>

            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              {wedding.venueAddress && (
                <div className="flex items-start gap-2.5">
                  <MapPinIcon
                    className="size-4 text-[#e8a87c] mt-0.5 shrink-0"
                    size={16}
                  />
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-wider text-[#8a7565] mb-1">
                      {t("venueAddress")}
                    </p>
                    <p className="font-sans text-[#c4a88a] leading-relaxed">
                      {wedding.venueAddress}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-2.5">
                <CalendarIcon
                  className="size-4 text-[#e8a87c] mt-0.5 shrink-0"
                  size={16}
                />
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-wider text-[#8a7565] mb-1">
                    {t("venueDate")}
                  </p>
                  <p className="font-sans text-[#c4a88a]">{weddingDate}</p>
                </div>
              </div>
              {wedding.weddingTime && (
                <div className="flex items-start gap-2.5">
                  <ClockIcon
                    className="size-4 text-[#e8a87c] mt-0.5 shrink-0"
                    size={16}
                  />
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-wider text-[#8a7565] mb-1">
                      {t("venueTime")}
                    </p>
                    <p className="font-sans text-[#c4a88a]">
                      {wedding.weddingTime}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {wedding.venueAddress || wedding.venueName ? (
              <div className="mt-6 rounded-xl overflow-hidden aspect-[16/9] border border-[#e8a87c]/10">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(wedding.venueAddress || wedding.venueName)}&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-xl"
                />
              </div>
            ) : (
              <div className="mt-6 rounded-xl bg-[#2d1c14] border border-[#e8a87c]/10 aspect-[16/9] flex items-center justify-center">
                <div className="text-center">
                  <MapPinIcon
                    className="size-6 text-[#8a7565] mx-auto mb-1"
                    size={24}
                  />
                  <p className="font-sans text-[10px] text-[#8a7565]">
                    {t("venueAddress")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-[#241710] rounded-2xl border border-[#e8a87c]/10 p-6 md:p-8 mb-8">
            <h2 className="font-merienda text-lg text-[#faf0e6] mb-6">
              {t("eventScheduleHeading")}
            </h2>
            <EventSchedule schedule={wedding.eventSchedule} />
          </div>
        </motion.div>

        {(wedding.groomFamily || wedding.brideFamily) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-[#241710] rounded-2xl border border-[#e8a87c]/10 p-6 md:p-8">
              <h2 className="font-merienda text-lg text-[#faf0e6] mb-5">
                {t("eventFamilyHeading")}
              </h2>

              <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-[13px]">
                {wedding.brideFamily && (
                  <>
                    <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#8a7565] col-span-1 pt-2">
                      {t("eventBrideFamily")}
                    </p>
                    <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#8a7565] col-span-1 pt-2">
                      {t("eventGroomFamily")}
                    </p>
                    <p className="font-sans text-[#c4a88a]">
                      {wedding.brideFamily.father.firstName}{" "}
                      {wedding.brideFamily.father.lastName}
                    </p>
                    <p className="font-sans text-[#c4a88a]">
                      {wedding.groomFamily?.father.firstName}{" "}
                      {wedding.groomFamily?.father.lastName}
                    </p>
                    <p className="font-sans text-[#c4a88a]">
                      {wedding.brideFamily.mother.firstName}{" "}
                      {wedding.brideFamily.mother.lastName}
                    </p>
                    <p className="font-sans text-[#c4a88a]">
                      {wedding.groomFamily?.mother.firstName}{" "}
                      {wedding.groomFamily?.mother.lastName}
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
