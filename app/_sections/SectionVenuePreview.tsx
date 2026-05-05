"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { MapPinIcon } from "../_icons/MapPinIcon";
import { CalendarIcon } from "../_icons/CalendarIcon";
import { ClockIcon } from "../_icons/ClockIcon";
import { ArrowRightIcon } from "../_icons/ArrowRightIcon";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const BASE = "";

const TR_MONTHS = [
  "Ocak",
  "\u015eubat",
  "Mart",
  "Nisan",
  "May\u0131s",
  "Haziran",
  "Temmuz",
  "A\u011fustos",
  "Eyl\u00fcl",
  "Ekim",
  "Kas\u0131m",
  "Aral\u0131k",
];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()} ${TR_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function SectionVenuePreview() {
  const wedding = useWedding();
  const imageRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const image = imageRef.current;
    if (image) {
      gsap.fromTo(
        image,
        { scale: 1 },
        {
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[550px] md:min-h-[650px] flex items-end justify-center overflow-hidden"
    >
      <div ref={imageRef} className="absolute inset-0 will-change-transform">
        <Image
          src="https://images.unsplash.com/photo-1478146059778-26028b07395a?w=1800&q=85"
          alt={wedding.venueName || "Venue"}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0a] via-[#1a0f0a]/50 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 bg-[#241710]/90 backdrop-blur-md border border-[#e8a87c]/10 rounded-2xl p-8 md:p-12 max-w-md mx-6 mb-12 md:mb-16"
      >
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-merienda text-2xl text-[#faf0e6] mb-8 text-center"
        >
          {wedding.venueName || t("venueLabel")}
        </motion.h2>

        <div className="space-y-5">
          {wedding.venueAddress && (
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-[#e8a87c]/10 flex items-center justify-center shrink-0 mt-0.5">
                <MapPinIcon size={15} className="text-[#e8a87c]" />
              </div>
              <div>
                <p className="font-sans text-[10px] text-[#8a7565] uppercase tracking-[0.2em] mb-1">
                  {t("venueAddress")}
                </p>
                <p className="font-sans text-sm text-[#faf0e6] leading-relaxed">
                  {wedding.venueAddress}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-full bg-[#e8a87c]/10 flex items-center justify-center shrink-0 mt-0.5">
              <CalendarIcon size={15} className="text-[#e8a87c]" />
            </div>
            <div>
              <p className="font-sans text-[10px] text-[#8a7565] uppercase tracking-[0.2em] mb-1">
                {t("venueDate")}
              </p>
              <p className="font-sans text-sm text-[#faf0e6]">
                {formatDate(wedding.weddingDate)}
              </p>
            </div>
          </div>

          {wedding.weddingTime && (
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-[#e8a87c]/10 flex items-center justify-center shrink-0 mt-0.5">
                <ClockIcon size={15} className="text-[#e8a87c]" />
              </div>
              <div>
                <p className="font-sans text-[10px] text-[#8a7565] uppercase tracking-[0.2em] mb-1">
                  {t("venueTime")}
                </p>
                <p className="font-sans text-sm text-[#faf0e6]">
                  {wedding.weddingTime}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="h-px bg-[#e8a87c]/10 my-7" />

        <div className="text-center">
          <Link
            href={`${BASE}/etkinlik`}
            className="group inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.2em] uppercase text-[#e8a87c] hover:text-[#f0c27f] transition-colors duration-300"
          >
            {t("venueCtaButton")}
            <ArrowRightIcon
              size={14}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
