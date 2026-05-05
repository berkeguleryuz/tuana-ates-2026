"use client";

import Link from "next/link";
import Image from "next/image";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { ArrowRightIcon } from "../_icons/ArrowRightIcon";

export function SunsetFooter() {
  const wedding = useWedding();
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  const weddingDate = new Date(wedding.weddingDate).toLocaleDateString(
    "tr-TR",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const pageLinks = [
    { label: t("navHome"), href: "/" },
    { label: t("navStory"), href: "/hikayemiz" },
    { label: t("navEvent"), href: "/etkinlik" },
    ...(wedding.hasGallery
      ? [{ label: t("navGallery"), href: "/galeri" }]
      : []),
    ...(wedding.hasMemoryBook
      ? [{ label: t("navMemory"), href: "/ani-defteri" }]
      : []),
    { label: t("navRsvp"), href: "/lcv" },
  ];

  return (
    <footer>
      <div className="bg-[#241710]">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-16">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12">
            <div>
              <h3 className="font-merienda text-3xl text-[#e8a87c]">
                {brideFirst} & {groomFirst}
              </h3>
              <p className="font-sans text-sm text-[#c4a88a] mt-2">{weddingDate}</p>
              {wedding.venueName && (
                <p className="font-sans text-sm text-[#8a7565] mt-1">
                  {wedding.venueName}
                </p>
              )}
            </div>

            <div className="flex gap-16">
              <div>
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#8a7565] mb-4">
                  Sayfalar
                </p>
                <ul className="space-y-2.5">
                  {pageLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="font-sans text-sm text-[#c4a88a] hover:text-[#faf0e6] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#8a7565] mb-4">
                  {t("contactLabel")}
                </p>
                <ul className="space-y-2.5">
                  {wedding.venueName && (
                    <li className="font-sans text-sm text-[#c4a88a]">
                      {wedding.venueName}
                    </li>
                  )}
                  {wedding.venueAddress && (
                    <li className="font-sans text-sm text-[#c4a88a] max-w-[200px]">
                      {wedding.venueAddress}
                    </li>
                  )}
                  <li>
                    <Link
                      href="/iletisim"
                      className="font-sans text-sm text-[#c4a88a] hover:text-[#faf0e6] transition-colors"
                    >
                      {t("contactLabel")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#241710]">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="bg-gradient-to-r from-[#d4735e]/10 to-[#e8a87c]/10 border border-[#e8a87c]/10 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-sans text-sm text-[#faf0e6] font-medium">
                {t("footerCtaHeading")}
              </p>
              <p className="font-sans text-xs text-[#8a7565] mt-1">
                {t("footerCtaText")}
              </p>
            </div>
            <Link
              href="https://uygundavet.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#d4735e] to-[#e8a87c] text-white rounded-full px-6 py-2.5 font-sans text-xs font-medium hover:opacity-90 transition-opacity shrink-0"
            >
              {t("footerCtaButton")}
              <ArrowRightIcon className="size-3" size={12} />
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-[#241710]">
        <div className="max-w-5xl mx-auto px-6 md:px-12 pt-8">
          <div className="border-t border-[#e8a87c]/[0.06]" />
        </div>
      </div>

      <div className="bg-[#241710]">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link
              href="https://uygundavet.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/logo-gold-transparent.png"
                alt="Logo"
                width={14}
                height={14}
                className="w-3.5 h-3.5 opacity-40"
              />
              <p className="font-sans text-[11px] text-[#8a7565] hover:text-[#c4a88a] transition-colors">
                Uygun Davet {t("footerCreatedWith")}
              </p>
            </Link>

            <Link
              href="https://uygundavet.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[11px] text-[#8a7565] hover:text-[#c4a88a] transition-colors"
            >
              {t("footerPrivacy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
