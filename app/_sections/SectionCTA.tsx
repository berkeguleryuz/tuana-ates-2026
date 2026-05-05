"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { HeartIcon } from "../_icons/HeartIcon";

const BASE = "";

export function SectionCTA() {
  useWedding(); 

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative bg-gradient-to-br from-[#d4735e] via-[#e8a87c] to-[#f0c27f] py-28 md:py-36 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-8"
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <HeartIcon size={28} className="text-[#1a0f0a]" />
          </motion.div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-merienda text-3xl md:text-4xl text-[#1a0f0a] mb-5 leading-[1.3]"
        >
          {t("ctaHeading")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-sans text-sm text-[#1a0f0a]/70 leading-[1.8] mb-12 max-w-sm mx-auto"
        >
          {t("ctaText")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link
            href={`${BASE}/lcv`}
            className="inline-flex items-center justify-center font-sans text-[11px] tracking-[0.2em] uppercase bg-[#1a0f0a] text-[#faf0e6] rounded-full px-10 py-4 hover:bg-[#241710] transition-colors duration-300 shadow-lg"
          >
            {t("ctaButton")}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-center gap-6 mt-12 flex-wrap"
        >
          {[
            { label: t("navMemory"), href: `${BASE}/ani-defteri` },
            { label: t("navGallery"), href: `${BASE}/galeri` },
            { label: t("contactLabel"), href: `${BASE}/iletisim` },
          ].map((link, i) => (
            <span key={link.label} className="flex items-center gap-6">
              {i > 0 && <span className="w-px h-3 bg-[#1a0f0a]/15" />}
              <Link
                href={link.href}
                className="font-sans text-[10px] text-[#1a0f0a]/50 hover:text-[#1a0f0a]/80 transition-colors tracking-[0.2em] uppercase"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
