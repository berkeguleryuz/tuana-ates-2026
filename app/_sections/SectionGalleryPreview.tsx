"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { t } from "../_lib/i18n";
import { ArrowRightIcon } from "../_icons/ArrowRightIcon";

const BASE = "";

const photos = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=85",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=85",
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&q=85",
  "https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&q=85",
  "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600&q=85",
  "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&q=85",
];

export function SectionGalleryPreview() {
  return (
    <section className="relative py-24 md:py-32 bg-[#1a0f0a] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16 px-6"
        >
          <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-[#8a7565] mb-3">
            {t("galleryLabel")}
          </p>
          <h2 className="font-merienda text-2xl md:text-3xl text-[#faf0e6]">
            {t("galleryHeading")}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div
            className="flex gap-4 md:gap-6 px-6 md:px-12 overflow-x-auto snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {photos.map((url, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative w-[260px] md:w-[320px] shrink-0 snap-start group"
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-[#e8a87c]/10 transition-shadow duration-500 group-hover:shadow-[0_0_30px_rgba(232,168,124,0.1)]">
                  <Image
                    src={url}
                    alt={`${t("galleryLabel")} ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 260px, 320px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0a]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mt-12 md:mt-16 px-6"
        >
          <Link
            href={`${BASE}/galeri`}
            className="group inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.2em] uppercase text-[#e8a87c] hover:text-[#f0c27f] transition-colors duration-300"
          >
            {t("galleryCtaButton")}
            <ArrowRightIcon
              size={14}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
