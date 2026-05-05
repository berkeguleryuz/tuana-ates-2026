"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";

interface Milestone {
  date: string;
  title: string;
  description: string;
  image?: string;
}

const fallbackImages = [
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=900&q=85",
  "https://images.unsplash.com/photo-1529636798458-92182e662485?w=900&q=85",
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=85",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&q=85",
  "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=900&q=85",
];

function getMilestones(brideFirst: string, groomFirst: string): Milestone[] {
  return [
    {
      date: "\u0130lk Kar\u015f\u0131la\u015fma",
      title: "Her \u015eey B\u00f6yle Ba\u015flad\u0131",
      description: `${brideFirst} ve ${groomFirst} ilk kez kar\u015f\u0131la\u015ft\u0131klar\u0131nda, hayatlar\u0131n\u0131n de\u011fi\u015fece\u011fini bilmiyorlard\u0131.`,
      image: fallbackImages[0],
    },
    {
      date: "\u0130lk Bulu\u015fma",
      title: "Tan\u0131\u015fma",
      description: `Saatlerce s\u00fcren sohbetler, payla\u015f\u0131lan kahkahalar... ${brideFirst} ve ${groomFirst} birbirlerini ke\u015ffetmeye ba\u015flad\u0131lar.`,
      image: fallbackImages[1],
    },
    {
      date: "Birlikte",
      title: "A\u015fk B\u00fcy\u00fcd\u00fc",
      description:
        "Her ge\u00e7en g\u00fcn birbirlerini daha iyi tan\u0131d\u0131lar, birlikte yeni an\u0131lar\u0131n kap\u0131s\u0131n\u0131 aralayarak hayatlar\u0131n\u0131 birle\u015ftirdiler.",
      image: fallbackImages[2],
    },
    {
      date: "Evlilik Teklifi",
      title: "Evet!",
      description: `${groomFirst} diz \u00e7\u00f6kt\u00fc ve ${brideFirst}'e hayat\u0131n\u0131n sorusunu sordu. Cevap tabii ki "Evet!" oldu.`,
      image: fallbackImages[3],
    },
    {
      date: "D\u00fc\u011f\u00fcn G\u00fcn\u00fc",
      title: "Yeni Bir Ba\u015flang\u0131\u00e7",
      description:
        "Ve \u015fimdi bu mutlu g\u00fcn\u00fc sizlerle payla\u015fman\u0131n heyecan\u0131n\u0131 ya\u015f\u0131yoruz. Sizi de aram\u0131zda g\u00f6rmekten mutluluk duyaca\u011f\u0131z!",
      image: fallbackImages[4],
    },
  ];
}

export default function HikayemizPage() {
  const wedding = useWedding();
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  const milestones: Milestone[] =
    wedding.storyMilestones && wedding.storyMilestones.length >= 1
      ? wedding.storyMilestones.map((m, i) => ({
          date: m.date,
          title: m.title,
          description: m.description,
          image: m.imageUrl || fallbackImages[i % fallbackImages.length],
        }))
      : getMilestones(brideFirst, groomFirst);

  return (
    <div className="min-h-svh pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="w-12 h-px bg-gradient-to-r from-[#d4735e] to-[#e8a87c] mb-6" />
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#8a7565] mb-3">
            {t("storyLabel")}
          </p>
          <h1 className="font-merienda text-3xl md:text-4xl text-[#e8a87c]">
            {brideFirst} & {groomFirst}
          </h1>
          <p className="font-sans text-sm text-[#c4a88a] mt-3 max-w-lg leading-relaxed">
            {t("storyText")}
          </p>
        </motion.div>

        <div className="space-y-24 md:space-y-32">
          {milestones.map((milestone, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
            >
              <div
                className={`flex flex-col gap-8 ${
                  idx % 2 === 0
                    ? "md:flex-row"
                    : "md:flex-row-reverse"
                } md:items-center md:gap-12`}
              >
                {milestone.image && (
                  <div className="md:w-1/2 relative aspect-[4/5] overflow-hidden rounded-2xl border border-[#e8a87c]/10">
                    <Image
                      src={milestone.image}
                      alt={milestone.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0a]/30 to-[#d4735e]/5 mix-blend-multiply" />
                  </div>
                )}

                <div
                  className={`md:w-1/2 ${
                    idx % 2 !== 0 ? "md:text-right" : ""
                  }`}
                >
                  <span className="inline-block font-sans text-[10px] tracking-[0.2em] uppercase text-[#e8a87c] mb-3">
                    {milestone.date}
                  </span>
                  <h3 className="font-merienda text-2xl text-[#faf0e6] mb-3">
                    {milestone.title}
                  </h3>
                  <p className="font-sans text-sm text-[#c4a88a] leading-[1.8]">
                    {milestone.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-start mt-20"
        >
          <div className="w-12 h-px bg-gradient-to-r from-[#d4735e] to-[#e8a87c]" />
        </motion.div>
      </div>
    </div>
  );
}
