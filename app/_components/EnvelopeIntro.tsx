"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";

import { useWedding } from "../_lib/context";
import { stripSurname } from "../_lib/names";

const STORAGE_KEY = "ta-envelope-opened";
// TEST modu: true iken zarf HER sayfa yenilemesinde tekrar açılır.
// CANLIYA ALMADAN ÖNCE false YAP (oturum başına bir kez gösterim).
const ALWAYS_SHOW = true;
// Üst kapağın üçgen geometrisi — hem kapak katmanında hem iç kısımda kullanılır.
// Görsel kapak ucu yüksekliğin %53'üne ölçülerek hizalandı (public/envelope.webp, 654x938).
const FLAP_CLIP = "polygon(0% 0%, 100% 0%, 50% 53%)";

export function EnvelopeIntro() {
  const wedding = useWedding();
  const brideFirst = stripSurname(wedding.brideName);
  const groomFirst = stripSurname(wedding.groomName);

  const [removed, setRemoved] = useState(false);
  const [opening, setOpening] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLButtonElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  // Bu oturumda zarf daha önce açıldıysa overlay'i hiç gösterme.
  // SSR ve ilk client render aynı olmalı; bu yüzden kaldırma efektte yapılır.
  useEffect(() => {
    if (ALWAYS_SHOW) {
      // TEST modu: önceki oturumdan kalan kaydı ve FOUC sınıfını temizle
      // ki zarf her yenilemede tekrar gelsin.
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {}
      document.documentElement.classList.remove("ta-envelope-seen");
      return;
    }
    let opened = false;
    try {
      opened = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount'ta tek seferlik, hydration-guvenli kaldirma
    if (opened) setRemoved(true);
  }, []);

  // Overlay görünürken sayfa kaymasını kilitle; kaldırılınca geri ver.
  useEffect(() => {
    if (removed) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [removed]);

  function finish() {
    if (!ALWAYS_SHOW) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {}
    }
    setRemoved(true);
  }

  function handleOpen() {
    if (opening) return;
    setOpening(true);

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      gsap.to(rootRef.current, {
        opacity: 0,
        duration: 0.4,
        onComplete: finish,
      });
      return;
    }

    const tl = gsap.timeline({ onComplete: finish });
    tl.to(sealRef.current, { scale: 1.09, duration: 0.16, ease: "power2.out" })
      .to(sealRef.current, {
        y: -130,
        rotate: -28,
        opacity: 0,
        duration: 0.5,
        ease: "back.in(1.5)",
      })
      .to(
        flapRef.current,
        { rotateX: -172, duration: 0.8, ease: "power3.inOut" },
        "-=0.18",
      )
      .to(
        glowRef.current,
        { opacity: 1, duration: 0.5, ease: "power2.out" },
        "-=0.5",
      )
      // Zarf izleyiciye doğru "dalış" yapar.
      .to(
        envelopeRef.current,
        { scale: 1.95, opacity: 0, duration: 1.2, ease: "power2.in" },
        "-=0.3",
      )
      // Sıcak ışık ekranı sarar — koyu arka planı maskeler.
      .to(
        flashRef.current,
        { opacity: 1, duration: 0.7, ease: "power2.out" },
        "-=1.05",
      )
      // Işık ve overlay birlikte sönerek siteyi açığa çıkarır.
      .to(
        rootRef.current,
        { opacity: 0, duration: 0.7, ease: "power2.inOut" },
        "-=0.25",
      );
  }

  if (removed) return null;

  return (
    <div
      ref={rootRef}
      className="envelope-intro fixed inset-0 z-[100] flex items-center justify-center
                 bg-[radial-gradient(ellipse_at_center,#3a2418_0%,#1a0f0a_75%)]"
    >
      {/* Zarf kutusu — tüm katmanlar bunun içinde absolute.
          Görsel oranı 654/938; yükseklikle sınırlanır ki uzun ekranda taşmasın. */}
      <div
        ref={envelopeRef}
        className="envelope relative h-[min(78vh,560px)] aspect-[654/938]
                   drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
        style={{ perspective: "1400px" }}
      >
        {/* Taban: kapalı zarf görseli */}
        <div className="absolute inset-0">
          <Image
            src="/envelope.webp"
            alt="Davetiye zarfı"
            fill
            priority
            sizes="min(54vh, 390px)"
            className="object-cover"
          />
        </div>

        {/* İç kısım — kapak açılınca görünür koyu cep */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#2a160e,#140a06)]"
          style={{ clipPath: FLAP_CLIP }}
        />

        {/* Üst kapak — taban görselin dilimi, bağımsız döner */}
        <div
          ref={flapRef}
          className="envelope-flap absolute inset-0"
          style={{
            clipPath: FLAP_CLIP,
            transformOrigin: "top center",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          <Image
            src="/envelope.webp"
            alt=""
            aria-hidden
            fill
            sizes="min(54vh, 390px)"
            className="object-cover"
          />
        </div>

        {/* Mum mührü — dış sarmalayıcı konumlandırır (GSAP dokunmaz),
            iç buton GSAP animasyon hedefidir. */}
        <div className="absolute left-1/2 top-[53%] -translate-x-1/2 -translate-y-1/2">
          <button
            ref={sealRef}
            type="button"
            aria-label="Davetiyeyi aç"
            onClick={handleOpen}
            className="envelope-seal h-[88px] w-[88px] rounded-full
                       bg-[radial-gradient(circle_at_38%_32%,#f4d8a8,#d4735e_70%,#a8533f)]
                       shadow-[0_8px_20px_rgba(0,0,0,0.55),inset_0_2px_6px_rgba(255,255,255,0.4)]
                       flex items-center justify-center cursor-pointer
                       ring-1 ring-black/10"
          >
            <span className="text-[#3d2418]/85 select-none leading-none flex items-center">
              <span className="font-merienda italic text-[26px]">{brideFirst.charAt(0)}</span>
              <span className="font-geist italic text-[28px] font-light mx-0.5 leading-none">
                &amp;
              </span>
              <span className="font-merienda italic text-[26px]">{groomFirst.charAt(0)}</span>
            </span>
          </button>
        </div>

        {/* Çift altı yazılar */}
        <div className="absolute left-0 right-0 top-[64%] text-center px-4 select-none">
          <p className="text-2xl text-[#f0c27f] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] leading-tight">
            <span className="font-merienda">{brideFirst}</span>
            <span className="font-cormorant italic font-medium mx-1.5 text-[1.05em]">ve</span>
            <span className="font-merienda">{groomFirst}</span>
          </p>
          <p className="mt-2 font-sans text-[10px] tracking-[0.3em] uppercase text-[#e8a87c]/70">
            sizi davet ediyor
          </p>
        </div>

        {/* Açılış ışık parlaması */}
        <div
          ref={glowRef}
          className="envelope-glow absolute inset-0 opacity-0 pointer-events-none
                     bg-[radial-gradient(circle_at_50%_45%,rgba(255,210,140,0.9),transparent_65%)]"
        />
      </div>

      {/* İpucu */}
      <p className="absolute bottom-12 left-1/2 -translate-x-1/2 font-sans text-[11px]
                    tracking-[0.25em] uppercase text-[#faf0e6]/45">
        Açmak için mühre dokun
      </p>

      {/* Siteye geçişte ekranı saran sıcak ışık */}
      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0 opacity-0
                   bg-[radial-gradient(circle_at_50%_45%,rgba(255,224,170,0.97),rgba(255,196,130,0.55)_45%,rgba(255,170,110,0.15)_72%)]"
      />
    </div>
  );
}
