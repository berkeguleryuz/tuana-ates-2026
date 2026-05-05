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
import { ArrowRightIcon } from "../_icons/ArrowRightIcon";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const BASE = "";

export function SectionStoryPreview() {
  const wedding = useWedding();
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  const sectionRef = useRef<HTMLElement>(null);
  const photo1Ref = useRef<HTMLDivElement>(null);
  const photo2Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (photo1Ref.current) {
      gsap.to(photo1Ref.current, {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    if (photo2Ref.current) {
      gsap.to(photo2Ref.current, {
        y: -25,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-[#241710] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4 mb-6"
            >
              <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-[#e8a87c] shrink-0">
                {t("storyLabel")}
              </p>
              <div className="h-px flex-1 bg-[#e8a87c]/15" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-merienda text-3xl md:text-4xl lg:text-5xl text-[#faf0e6] mb-6 leading-[1.15]"
            >
              {brideFirst} & {groomFirst}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-sans text-sm md:text-base text-[#c4a88a] leading-[1.8] mb-8 max-w-md"
            >
              {t("storyText")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link
                href={`${BASE}/hikayemiz`}
                className="group inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.2em] uppercase text-[#e8a87c] hover:text-[#f0c27f] transition-colors duration-300"
              >
                {t("storyCtaButton")}
                <ArrowRightIcon
                  size={14}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </Link>
            </motion.div>
          </div>

          <div className="order-1 lg:order-2 relative h-[400px] md:h-[500px]">
            <motion.div
              ref={photo1Ref}
              initial={{ opacity: 0, y: 40, rotate: 3 }}
              whileInView={{ opacity: 1, y: 0, rotate: 2 }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute top-0 right-0 w-[75%] md:w-[70%] h-[85%] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] will-change-transform"
            >
              <Image
                src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=900&q=85"
                alt="Story"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 75vw, 35vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0a]/30 to-[#d4735e]/10 mix-blend-multiply" />
            </motion.div>

            <motion.div
              ref={photo2Ref}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                delay: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute bottom-0 left-0 w-[55%] md:w-[50%] h-[65%] rounded-2xl overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.5)] z-10 will-change-transform border-2 border-[#241710]"
            >
              <Image
                src="/image3.webp"
                alt="Story"
                fill
                className="object-top"
                sizes="(max-width: 1024px) 55vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#f0c27f]/10 to-[#1a0f0a]/20 mix-blend-multiply" />
            </motion.div>

            <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-gradient-to-br from-[#d4735e]/10 to-transparent blur-2xl pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
