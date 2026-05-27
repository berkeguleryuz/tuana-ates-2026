"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { useWedding } from "../_lib/context";
import { stripSurname } from "../_lib/names";
import { t } from "../_lib/i18n";
import { ChevronDownIcon } from "../_icons/ChevronDownIcon";

const BASE = "";

const TR_DAYS = ["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"];
const TR_MONTHS = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];

function formatWeddingDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()} ${TR_MONTHS[d.getMonth()]} ${d.getFullYear()}, ${TR_DAYS[d.getDay()]}`;
}

const bentoMedia = [
  { type: "image" as const, src: "/image1.webp" },
  { type: "image" as const, src: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&q=85" },
  { type: "video" as const, src: "/yuzuk.mp4" },
  { type: "image" as const, src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=85" },
  { type: "image" as const, src: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800&q=85" },
  { type: "image" as const, src: "/image0.webp" },
  { type: "image" as const, src: "/image3.webp" },
  { type: "image" as const, src: "/image2.webp" },
];

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function SectionHero() {
  const wedding = useWedding();
  const wrapRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const brideFirst = stripSurname(wedding.brideName);
  const groomFirst = stripSurname(wedding.groomName);
  const formattedDate = formatWeddingDate(wedding.weddingDate);

  useGSAP(() => {
    const galleryEl = galleryRef.current;
    const wrapEl = wrapRef.current;
    const textEl = textRef.current;

    if (!galleryEl || !wrapEl) return;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Flip } = require("gsap/dist/Flip");
    gsap.registerPlugin(Flip);

    const items = Array.from(galleryEl.querySelectorAll<HTMLElement>(".bento-item"));

    galleryEl.classList.remove("bento-final");
    galleryEl.classList.add("bento-final");
    const flipState = Flip.getState(items);
    galleryEl.classList.remove("bento-final");

    const flip = Flip.to(flipState, {
      simple: true,
      ease: "expoScale(1, 5)",
    });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: galleryEl,
        start: "center center",
        end: "+=100%",
        scrub: true,
        pin: wrapEl,
      },
    });

    timeline.add(flip);

    if (textEl) {
      timeline.to(textEl, { opacity: 0, scale: 1.05, duration: 0.3 }, 0);
    }

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
      flip.kill();
      galleryEl.classList.remove("bento-final");
      gsap.set(items, { clearProps: "all" });
    };
  }, { scope: wrapRef });

  return (
    <>
      <div ref={wrapRef} className="gallery-wrap">
        <div ref={textRef} className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} className="text-center px-6">
            <p className="font-sans text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-[#e8a87c]/80 mb-4 md:mb-6 drop-shadow-md">{t("heroTagline")}</p>
            <h1 className="font-merienda text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[1.05] drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)]">{brideFirst}</h1>
            <div className="flex items-center justify-center gap-4 my-2 md:my-3">
              <div className="h-px w-8 md:w-12 bg-[#e8a87c]/50" />
              <span className="bg-gradient-to-r from-[#d4735e] to-[#f0c27f] bg-clip-text text-transparent text-2xl md:text-3xl font-merienda">&</span>
              <div className="h-px w-8 md:w-12 bg-[#e8a87c]/50" />
            </div>
            <h1 className="font-merienda text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[1.05] drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)]">{groomFirst}</h1>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-6 space-y-1">
              <p className="font-sans text-xs md:text-sm text-white/70 tracking-[0.15em] uppercase drop-shadow-md">{formattedDate}</p>
              {wedding.venueName && <p className="font-sans text-xs text-white/40 drop-shadow-md">{wedding.venueName}</p>}
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }} className="mt-8 pointer-events-auto">
              <Link href={`${BASE}/lcv`} className="inline-flex items-center justify-center font-sans text-[10px] tracking-[0.25em] uppercase text-white bg-gradient-to-r from-[#d4735e] to-[#e8a87c] rounded-full px-8 py-3 hover:shadow-[0_0_30px_rgba(212,115,94,0.3)] transition-all duration-300 shadow-lg">{t("heroCtaButton")}</Link>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/30">{t("heroScrollHint")}</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
              <ChevronDownIcon size={16} className="text-white/30" />
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute inset-0 bg-[#1a0f0a]/35 z-10 pointer-events-none" />

        <div ref={galleryRef} className="bento-gallery">
          {bentoMedia.map((media, i) => (
            <div key={i} className="bento-item">
              {media.type === "video" ? (
                <video autoPlay muted loop playsInline preload="auto" style={{ objectFit: "cover", width: "100%", height: "100%" }} src={media.src} />
              ) : (
                <Image src={media.src} alt={`Gallery ${i + 1}`} fill className="object-cover" sizes="33vw" priority={i < 4} />
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .gallery-wrap {
          position: relative;
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #1a0f0a;
        }

        .bento-gallery {
          position: relative;
          width: 100%;
          height: 100%;
          flex: none;
          display: grid;
          gap: 1vh;
          grid-template-columns: repeat(3, 32.5vw);
          grid-template-rows: repeat(4, 23vh);
          justify-content: center;
          align-content: center;
        }

        .bento-final.bento-gallery {
          grid-template-columns: repeat(3, 100vw);
          grid-template-rows: repeat(4, 49.5vh);
          gap: 1vh;
        }

        .bento-item {
          background-position: 50% 50%;
          background-size: cover;
          flex: none;
          position: relative;
          overflow: hidden;
        }

        .bento-item img {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }

        .bento-gallery .bento-item:nth-child(1) { grid-area: 1 / 1 / 3 / 2; }
        .bento-gallery .bento-item:nth-child(2) { grid-area: 1 / 2 / 2 / 3; }
        .bento-gallery .bento-item:nth-child(3) { grid-area: 2 / 2 / 4 / 3; }
        .bento-gallery .bento-item:nth-child(4) { grid-area: 1 / 3 / 3 / 3; }
        .bento-gallery .bento-item:nth-child(5) { grid-area: 3 / 1 / 3 / 2; }
        .bento-gallery .bento-item:nth-child(6) { grid-area: 3 / 3 / 5 / 4; }
        .bento-gallery .bento-item:nth-child(7) { grid-area: 4 / 1 / 5 / 2; }
        .bento-gallery .bento-item:nth-child(8) { grid-area: 4 / 2 / 5 / 3; }
      `}</style>
    </>
  );
}
