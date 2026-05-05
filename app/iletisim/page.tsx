"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { HeartIcon } from "../_icons/HeartIcon";
import { MapPinIcon } from "../_icons/MapPinIcon";

const BASE = "";

export default function IletisimPage() {
  const wedding = useWedding();
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  return (
    <div className="min-h-svh pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="w-12 h-px bg-gradient-to-r from-[#d4735e] to-[#e8a87c] mb-6" />
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#8a7565] mb-3">
            {t("contactLabel")}
          </p>
          <h1 className="font-merienda text-3xl md:text-4xl text-[#e8a87c]">
            {brideFirst} & {groomFirst}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="space-y-6">
            <p className="font-sans text-sm text-[#c4a88a] leading-relaxed">
              {t("contactText")}
            </p>

            {wedding.venueName && (
              <div className="flex items-center gap-2.5 text-[#c4a88a]">
                <MapPinIcon className="size-4 text-[#e8a87c]" size={16} />
                <span className="font-sans text-sm">{wedding.venueName}</span>
              </div>
            )}

            {wedding.venueAddress && (
              <p className="font-sans text-sm text-[#8a7565] pl-7">
                {wedding.venueAddress}
              </p>
            )}

            <div className="h-px bg-[#e8a87c]/[0.06]" />

            <Link
              href={`${BASE}/lcv`}
              className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-gradient-to-r from-[#d4735e] to-[#e8a87c] text-white font-sans font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <HeartIcon className="size-4" size={16} />
              {t("contactCtaButton")}
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10"
        >
          <p className="font-sans text-[11px] text-[#8a7565]">
            <Link
              href="https://uygundavet.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#c4a88a] transition-colors"
            >
              Uygun Davet
            </Link>{" "}
            {t("footerCreatedWith")}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
