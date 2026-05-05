"use client";

import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useWedding } from "../_lib/context";
import { BottomBar } from "./BottomBar";
import { t } from "../_lib/i18n";
import { MenuIcon } from "../_icons/MenuIcon";
import { CloseIcon } from "../_icons/CloseIcon";
import { UserIcon } from "../_icons/UserIcon";

interface NavItem {
  label: string;
  href: string;
}

export function SunsetNav() {
  const wedding = useWedding();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  const isHome = pathname === "/" || pathname === "";

  const navItems: NavItem[] = [
    { label: t("navHome"), href: "/" },
    { label: t("navStory"), href: "/hikayemiz" },
    { label: t("navEvent"), href: "/etkinlik" },
    ...(wedding.hasGallery
      ? [{ label: t("navGallery"), href: "/galeri" }]
      : []),
    ...(wedding.hasMemoryBook
      ? [{ label: t("navMemory"), href: "/ani-defteri" }]
      : []),
  ];

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!isOpen) setIsScrolled(latest > 50);
  });

  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  const isActive = (href: string) => {
    if (href === "/") return isHome;
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[60] px-4 md:px-6 pt-4">
        <div
          className={cn(
            "max-w-6xl mx-auto flex items-center justify-between rounded-lg px-4 md:px-6 h-12 transition-all duration-300",
            isScrolled || !isHome
              ? "bg-[#1a0f0a]/85 backdrop-blur-md border border-[#e8a87c]/10 shadow-lg shadow-black/10"
              : "bg-[#1a0f0a]/40 backdrop-blur-sm border border-white/[0.06]"
          )}
        >
          <Link
            href="/"
            className="shrink-0 flex items-center gap-2 font-merienda text-sm text-[#e8a87c] hover:opacity-70 transition-opacity"
          >
            <Image
              src="/logo-gold-transparent.png"
              alt="Logo"
              width={100}
              height={100}
              priority
            />
            {brideFirst} & {groomFirst}
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "px-3 py-1 rounded-full font-sans text-[11px] tracking-[0.12em] uppercase transition-all",
                  isActive(item.href)
                    ? "text-[#e8a87c]"
                    : "text-[#c4a88a]/80 hover:text-[#faf0e6]"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/lcv"
              className="hidden md:inline-flex items-center rounded-full px-4 py-1 font-sans text-[10px] tracking-[0.15em] uppercase bg-gradient-to-r from-[#d4735e] to-[#e8a87c] text-white hover:opacity-90 transition-opacity"
            >
              {t("navRsvp")}
            </Link>

            <Link
              href="https://uygundavet.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center justify-center w-7 h-7 rounded-full bg-white/[0.06] text-[#c4a88a] hover:text-[#faf0e6] transition-colors"
            >
              <UserIcon className="size-3.5" size={14} />
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-1.5 text-[#faf0e6]/70 hover:text-[#faf0e6] transition-colors"
            >
              {isOpen ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="md:hidden mt-2 max-w-6xl mx-auto bg-[#1a0f0a]/95 backdrop-blur-md border border-[#e8a87c]/10 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-4 space-y-0.5">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-2.5 rounded-xl font-sans text-sm transition-all",
                      isActive(item.href)
                        ? "bg-[#e8a87c]/10 text-[#e8a87c]"
                        : "text-[#c4a88a] hover:bg-white/5 hover:text-[#faf0e6]"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="h-px bg-[#e8a87c]/[0.08] my-2" />
                <Link
                  href="/lcv"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center mx-4 py-2.5 rounded-full bg-gradient-to-r from-[#d4735e] to-[#e8a87c] text-white font-sans text-xs tracking-[0.15em] uppercase"
                >
                  {t("navRsvp")}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <BottomBar
        items={[
          ...(wedding.hasGallery
            ? [{ label: t("navGallery"), href: "/galeri" }]
            : []),
          ...(wedding.hasMemoryBook
            ? [{ label: t("bottomMemory"), href: "/ani-defteri" }]
            : []),
          { label: t("bottomRsvp"), href: "/lcv" },
        ]}
      />
    </>
  );
}
