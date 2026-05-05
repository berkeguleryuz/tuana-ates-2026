"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { t } from "../_lib/i18n";
import { ArrowRightIcon } from "../_icons/ArrowRightIcon";
import { CameraIcon } from "../_icons/CameraIcon";
import { QuoteIcon } from "../_icons/QuoteIcon";

const BASE = "";

const cards = [
  {
    href: `${BASE}/ani-defteri`,
    label: t("memoryPageLabel"),
    title: t("memoryFormHeading"),
    text: t("memoryPageSubtitle"),
    cta: t("bottomMemory"),
    Icon: QuoteIcon,
  },
  {
    href: `${BASE}/galeri`,
    label: t("galleryLabel"),
    title: t("galleryUploadHeading"),
    text: t("galleryUploadInfo"),
    cta: t("galleryCtaButton"),
    Icon: CameraIcon,
  },
];

export function SectionShare() {
  return (
    <section className="relative py-24 md:py-32 bg-[#241710] overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[60%] h-72 rounded-full bg-gradient-to-br from-[#d4735e]/8 to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-[#e8a87c] mb-3">
            {t("memoryPageLabel")} · {t("galleryLabel")}
          </p>
          <h2 className="font-merienda text-2xl md:text-3xl lg:text-4xl text-[#faf0e6] leading-[1.25]">
            Anılarınızı Bizimle Paylaşın
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
          {cards.map(({ href, label, title, text, cta, Icon }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link
                href={href}
                className="group relative block h-full rounded-3xl overflow-hidden border border-[#e8a87c]/15 bg-gradient-to-br from-[#1a0f0a]/70 to-[#241710]/40 p-8 md:p-10 transition-all duration-500 hover:border-[#e8a87c]/40 hover:shadow-[0_20px_60px_-15px_rgba(212,115,94,0.35)] hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4735e]/0 via-transparent to-[#e8a87c]/0 group-hover:from-[#d4735e]/10 group-hover:to-[#e8a87c]/5 transition-colors duration-500 pointer-events-none" />

                <div className="relative flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d4735e] to-[#e8a87c] flex items-center justify-center shadow-[0_8px_24px_-8px_rgba(212,115,94,0.6)] shrink-0">
                      <Icon size={20} className="text-[#1a0f0a]" />
                    </div>
                    <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#e8a87c]">
                      {label}
                    </p>
                  </div>

                  <h3 className="font-merienda text-2xl md:text-3xl text-[#faf0e6] mb-4 leading-[1.2]">
                    {title}
                  </h3>

                  <p className="font-sans text-sm text-[#c4a88a] leading-[1.7] mb-8 flex-1">
                    {text}
                  </p>

                  <span className="inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.2em] uppercase text-[#e8a87c] group-hover:text-[#f0c27f] transition-colors">
                    {cta}
                    <ArrowRightIcon
                      size={14}
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
