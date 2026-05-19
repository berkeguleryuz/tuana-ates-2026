# Zarf Intro (Davetiye Açılışı) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Anasayfa açıldığında tam ekran kapalı bir davetiye zarfı gösteren, mum mührüne dokununca açılıp arkadaki siteyi açığa çıkaran bir intro overlay'i eklemek.

**Architecture:** Tek bir client component (`EnvelopeIntro`) tam ekran sabit overlay olarak anasayfada render edilir. Zarf, Higgsfield ile üretilen tek bir kapalı zarf görseli üzerine kurulur; üst kapak aynı görselin `clip-path` ile dilimlenmiş, bağımsız 3D döndürülebilen bir katmanıdır. Mum mührü CSS/SVG ile çizilir. Açılış koreografisi GSAP timeline ile yapılır. `sessionStorage` ile oturum başına bir kez gösterilir.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, GSAP + @gsap/react, next/image, Higgsfield (görsel üretimi).

**Notlar:**
- Bu projede otomatik test altyapısı yoktur. Doğrulama adımları `npm run dev` ile tarayıcıda görsel kontrol, `npx tsc --noEmit` ve `npm run lint` üzerinden yapılır.
- Global kullanıcı kuralı gereği bu plan **commit adımı içermez**. Commit kararı kullanıcıya aittir; her görev sonunda değişiklikler staged/unstaged bırakılır.
- Spec'teki "2 ayrı görsel" yaklaşımı, hizalama güvenilirliği için **tek görsel + CSS clip-path dilim** yaklaşımına sadeleştirilmiştir (aynı görsel intent: karma yaklaşım, bağımsız kapak, bağımsız mühür).

İlgili spec: `docs/superpowers/specs/2026-05-18-zarf-intro-tasarim.md`

---

## File Structure

- **Create:** `app/_components/EnvelopeIntro.tsx` — Zarf overlay client component'i (görsel katmanlar, mühür, açılış animasyonu, sessionStorage mantığı).
- **Modify:** `app/page.tsx` — `EnvelopeIntro` bileşenini render eder.
- **Modify:** `app/layout.tsx` — FOUC engelleme inline script'i ekler.
- **Modify:** `app/globals.css` — `.ta-envelope-seen` sınıfı için overlay'i gizleyen kural + perspective yardımcıları.
- **Create:** `public/envelope.webp` — Higgsfield ile üretilen kapalı zarf görseli.

---

## Task 1: Zarf görselini Higgsfield ile üret

**Files:**
- Create: `public/envelope.webp`

- [ ] **Step 1: Higgsfield ile zarf görselini üret**

`higgsfield-generate` skill'ini kullan (text-to-image). Aşağıdaki prompt ile üret:

```
A closed wedding invitation envelope, photographed straight from the front,
centered, vertical portrait orientation. Made of textured handmade paper in
warm sunset terracotta and peach tones (deep terracotta #7a4a38 body, lighter
peach #8a5440 flap). The paper has delicate embossed botanical line-art:
small flowers, leaves and branches pressed into the surface, tone-on-tone.
The triangular top flap is closed, pointing down, its tip meeting the center.
Soft warm directional studio lighting, gentle shadows, subtle paper grain.
NO wax seal, NO text, NO hands, NO background objects — just the envelope on
a soft dark warm gradient background. Elegant, romantic, premium stationery.
```

2-3 varyasyon üret, en temiz/ortalı olanı seç. Çıktı oranı dikey (örn. 3:4 veya 4:5).

- [ ] **Step 2: Görseli `public/` altına kaydet**

Higgsfield çıktısının URL'ini indir ve `public/envelope.webp` olarak kaydet:

```bash
curl -L -o public/envelope.webp "<higgsfield-cikti-url>"
```

PNG/JPG geldiyse `.webp`'ye çevir veya uzantıyı çıktıya göre `public/envelope.png` yap (sonraki görevlerde import yolunu buna göre güncelle).

- [ ] **Step 3: Görseli doğrula**

Run: `file public/envelope.webp`
Expected: Geçerli bir görsel dosyası (WebP/PNG image data), boyut > 50KB.

Görseli aç ve kontrol et: zarf ortalı, kapağı kapalı (uç aşağıda), mühür/yazı yok, terracotta tonlarda.

---

## Task 2: EnvelopeIntro bileşeninin statik iskeleti

Animasyon yok — sadece kapalı zarf, mühür, yazılar görünür ve doğru konumlanır.

**Files:**
- Create: `app/_components/EnvelopeIntro.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: EnvelopeIntro bileşenini oluştur (statik)**

`app/_components/EnvelopeIntro.tsx` dosyasını oluştur:

```tsx
"use client";

import Image from "next/image";

// Üst kapağın üçgen geometrisi — hem kapak katmanında hem iç kısımda kullanılır.
// Görsel kapak ucu yüksekliğin %53'üne ölçülerek hizalandı (public/envelope.webp, 654x938).
const FLAP_CLIP = "polygon(0% 0%, 100% 0%, 50% 53%)";

export function EnvelopeIntro() {
  return (
    <div
      className="envelope-intro fixed inset-0 z-[100] flex items-center justify-center
                 bg-[radial-gradient(ellipse_at_center,#3a2418_0%,#1a0f0a_75%)]"
    >
      {/* Zarf kutusu — tüm katmanlar bunun içinde absolute.
          Görsel oranı 654/938; yükseklikle sınırlanır ki uzun ekranda taşmasın. */}
      <div
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
            sizes="(max-width: 640px) 60vh, 560px"
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
          className="envelope-flap absolute inset-0"
          style={{ clipPath: FLAP_CLIP, transformOrigin: "top center" }}
        >
          <Image
            src="/envelope.webp"
            alt=""
            aria-hidden
            fill
            sizes="(max-width: 640px) 60vh, 560px"
            className="object-cover"
          />
        </div>

        {/* Mum mührü */}
        <button
          type="button"
          aria-label="Davetiyeyi aç"
          className="envelope-seal absolute left-1/2 top-[53%] -translate-x-1/2 -translate-y-1/2
                     h-[88px] w-[88px] rounded-full
                     bg-[radial-gradient(circle_at_38%_32%,#f4d8a8,#d4735e_70%,#a8533f)]
                     shadow-[0_8px_20px_rgba(0,0,0,0.55),inset_0_2px_6px_rgba(255,255,255,0.4)]
                     flex items-center justify-center cursor-pointer
                     ring-1 ring-black/10 transition-transform"
        >
          <span className="font-merienda text-[26px] italic text-[#3d2418]/85 select-none">
            T&amp;A
          </span>
        </button>

        {/* Çift altı yazılar */}
        <div className="absolute left-0 right-0 top-[64%] text-center px-4 select-none">
          <p className="font-merienda text-2xl text-[#f0c27f] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            Tuana &amp; Ateş
          </p>
          <p className="mt-2 font-sans text-[10px] tracking-[0.3em] uppercase text-[#e8a87c]/70">
            Bu davetiye size özeldir
          </p>
        </div>

        {/* Açılış ışık parlaması */}
        <div
          className="envelope-glow absolute inset-0 opacity-0 pointer-events-none
                     bg-[radial-gradient(circle_at_50%_45%,rgba(255,210,140,0.9),transparent_65%)]"
        />
      </div>

      {/* İpucu */}
      <p className="absolute bottom-12 left-1/2 -translate-x-1/2 font-sans text-[11px]
                    tracking-[0.25em] uppercase text-[#faf0e6]/45">
        Açmak için mühre dokun
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Bileşeni anasayfaya ekle**

`app/page.tsx` dosyasını düzenle — `EnvelopeIntro` import et ve fragment'in en üstüne ekle:

```tsx
import { EnvelopeIntro } from "./_components/EnvelopeIntro";
import { SectionHero } from "./_sections/SectionHero";
import { SectionCountdown } from "./_sections/SectionCountdown";
import { SectionVenuePreview } from "./_sections/SectionVenuePreview";
import { SectionGalleryPreview } from "./_sections/SectionGalleryPreview";
import { SectionShare } from "./_sections/SectionShare";
import { SectionCTA } from "./_sections/SectionCTA";

export default function Home() {
  return (
    <>
      <EnvelopeIntro />
      <SectionHero />
      <SectionCountdown />
      <SectionVenuePreview />
      <SectionShare />
      <SectionGalleryPreview />
      <SectionCTA />
    </>
  );
}
```

- [ ] **Step 3: Tip kontrolü**

Run: `npx tsc --noEmit`
Expected: Hata yok.

- [ ] **Step 4: Tarayıcıda doğrula**

Run: `npm run dev`
Anasayfayı (`http://localhost:3000`) aç. Beklenen:
- Tam ekran koyu gradyan üzerinde ortalı zarf görünür.
- Zarf görseli yükleniyor; üçgen kapak alanı net.
- Mum mührü kapağın ucunda (~%53 yükseklikte), içinde "T&A".
- Altında "Tuana & Ateş" ve "Bu davetiye size özeldir".
- Altta "Açmak için mühre dokun" ipucu.
- Mührün konumu (`top-[53%]`) görselin kapak ucuyla, `FLAP_CLIP` üçgeninin ucu (`50% 53%`) ile aynı hizada olmalı. Görsel `public/envelope.webp` (654x938) zaten kapak ucu %53'te olacak şekilde kırpıldı; sapma görürsen bu değeri ölç ve hem `FLAP_CLIP` hem `top-[53%]` içinde eşitle.

---

## Task 3: sessionStorage mantığı ve FOUC engelleme

Overlay oturum başına bir kez gösterilir; tekrar ziyarette hiç görünmez ve "flaş" yapmaz.

**Files:**
- Modify: `app/_components/EnvelopeIntro.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: globals.css'e gizleme kuralı ekle**

`app/globals.css` dosyasının sonuna ekle:

```css
/* Zarf intro: oturumda daha önce açıldıysa ilk boyamada gizle (FOUC engeli) */
html.ta-envelope-seen .envelope-intro {
  display: none;
}
```

- [ ] **Step 2: layout.tsx'e senkron inline script ekle**

`app/layout.tsx` içinde `<body>` etiketinin **ilk çocuğu** olarak inline script ekle. `<WeddingProvider>` satırının hemen üstüne:

```tsx
      <body
        className="min-h-full flex flex-col bg-[#1a0f0a] text-[#faf0e6]"
        suppressHydrationWarning
      >
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('ta-envelope-opened'))document.documentElement.classList.add('ta-envelope-seen')}catch(e){}",
          }}
        />
        <WeddingProvider data={weddingData}>
```

Bu script senkron çalışır, sayfa boyanmadan önce `<html>`'e sınıf ekler; CSS overlay'i anında gizler.

- [ ] **Step 3: EnvelopeIntro'ya sessionStorage durumu ekle**

`app/_components/EnvelopeIntro.tsx` — import satırını ve bileşen gövdesini güncelle. `import Image from "next/image";` satırını şununla değiştir:

```tsx
import { useEffect, useState } from "react";
import Image from "next/image";

const STORAGE_KEY = "ta-envelope-opened";
```

`export function EnvelopeIntro() {` satırından hemen sonra, `return` ifadesinden önce ekle:

```tsx
  const [removed, setRemoved] = useState(false);

  // Bu oturumda zarf daha önce açıldıysa overlay'i hiç gösterme.
  useEffect(() => {
    let opened = false;
    try {
      opened = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {}
    if (opened) setRemoved(true);
  }, []);

  if (removed) return null;
```

- [ ] **Step 4: Tip kontrolü**

Run: `npx tsc --noEmit`
Expected: Hata yok.

- [ ] **Step 5: Tarayıcıda doğrula**

`npm run dev` çalışırken:
- Anasayfayı aç → zarf görünür.
- DevTools Console'da `sessionStorage.setItem('ta-envelope-opened','1')` çalıştır, sayfayı yenile → zarf **hiç görünmez**, flaş/yanıp sönme yok, site direkt gelir.
- `sessionStorage.removeItem('ta-envelope-opened')` → yenile → zarf yine görünür.

---

## Task 4: Açılış animasyonu (GSAP timeline)

Mühre tıklayınca: mühür kopar → kapak açılır → ışık parlar → zarf solar → overlay kalkar.

**Files:**
- Modify: `app/_components/EnvelopeIntro.tsx`

- [ ] **Step 1: GSAP importları ve ref'leri ekle**

`app/_components/EnvelopeIntro.tsx` üst importlarını güncelle. `import { useEffect, useState } from "react";` satırını şununla değiştir:

```tsx
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";

gsap.registerPlugin(useGSAP);
```

`const [removed, setRemoved] = useState(false);` satırının altına ref'leri ekle:

```tsx
  const [opening, setOpening] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLButtonElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
```

- [ ] **Step 2: Açılış fonksiyonunu ekle**

`if (removed) return null;` satırından **önce** `handleOpen` fonksiyonunu ekle:

```tsx
  function finish() {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}
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
        { rotateX: -172, duration: 0.78, ease: "power3.inOut" },
        "-=0.18",
      )
      .to(glowRef.current, { opacity: 1, duration: 0.32 }, "-=0.5")
      .to(
        envelopeRef.current,
        { scale: 1.16, opacity: 0, duration: 0.6, ease: "power2.in" },
        "-=0.28",
      )
      .to(glowRef.current, { opacity: 0, duration: 0.4 }, "<")
      .to(rootRef.current, { opacity: 0, duration: 0.35 }, "-=0.25");
  }
```

- [ ] **Step 3: Scroll kilidini ekle**

`if (removed) return null;` satırından **önce**, `handleOpen`'dan sonra ekle:

```tsx
  // Overlay görünürken sayfa kaymasını kilitle.
  useGSAP(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
```

- [ ] **Step 4: JSX'e ref'leri ve onClick'i bağla**

`return (` içindeki elemanları güncelle:

- En dış `<div className="envelope-intro ...">` → `<div ref={rootRef} className="envelope-intro ...">`
- `<div className="envelope relative ...">` → `<div ref={envelopeRef} className="envelope relative ...">`
- `<div className="envelope-flap absolute inset-0" ...>` → `<div ref={flapRef} className="envelope-flap absolute inset-0" ...>`
- `<button type="button" aria-label="Davetiyeyi aç" ...>` → aynı butona `ref={sealRef}` ve `onClick={handleOpen}` ekle.
- `<div className="envelope-glow ...">` → `<div ref={glowRef} className="envelope-glow ...">`

Ayrıca `flapRef`'li div'in `style`'ına `transformStyle: "preserve-3d"` ve `backfaceVisibility: "hidden"` ekle:

```tsx
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
```

- [ ] **Step 5: Tip kontrolü ve lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: Hata yok.

- [ ] **Step 6: Tarayıcıda doğrula**

`npm run dev` çalışırken, `sessionStorage`'ı temizleyip anasayfayı aç. Mühre tıkla. Beklenen sıra:
1. Mühür hafif büyür, sonra yukarı kayıp dönerek kaybolur.
2. Üst kapak menteşeden yukarı/arkaya açılır, altından koyu iç kısım görünür.
3. Sıcak altın ışık parlaması belirir.
4. Zarf hafif büyüyüp solar, overlay kaybolur, site açığa çıkar.
5. Sayfayı yenile → zarf tekrar gelmez (sessionStorage yazıldı).
- Açılış sırasında sayfa kaymıyor (scroll kilidi). Overlay kalkınca scroll geri geliyor.

---

## Task 5: Erişilebilirlik, indirgenmiş hareket ve cila

**Files:**
- Modify: `app/_components/EnvelopeIntro.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Mühür hover/focus durumu ve ipucu nabzı**

`app/globals.css` sonuna ekle:

```css
/* Zarf mührü etkileşim ipuçları */
.envelope-seal:hover {
  transform: translate(-50%, -50%) scale(1.05);
}
.envelope-seal:focus-visible {
  outline: 2px solid #f0c27f;
  outline-offset: 4px;
}
@media (prefers-reduced-motion: reduce) {
  .envelope-seal {
    transition: none;
  }
}
```

Not: mühür butonunda zaten `transition-transform` sınıfı var; `-translate-x-1/2 -translate-y-1/2` ile çakışmayı önlemek için hover kuralı tam transform'u yeniden tanımlar.

- [ ] **Step 2: Klavye erişimini doğrula**

`npm run dev` çalışırken, `sessionStorage`'ı temizle, anasayfayı aç:
- Tab tuşuyla mühür butonuna odaklan → altın focus halkası görünür.
- Enter veya Space → açılış animasyonu çalışır (buton `onClick` klavyeyi de tetikler).

- [ ] **Step 3: İndirgenmiş hareketi doğrula**

DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce" aç. `sessionStorage`'ı temizle, anasayfayı yenile, mühre tıkla.
Expected: Uzun koreografi yerine kısa bir fade ile overlay kalkar (Task 4 Step 2'deki `prefersReduced` dalı).

- [ ] **Step 4: Diğer sayfalarda overlay olmadığını doğrula**

`http://localhost:3000/galeri` ve `http://localhost:3000/hikayemiz` adreslerini doğrudan aç.
Expected: Zarf overlay'i görünmez (sadece `app/page.tsx`'te render ediliyor).

- [ ] **Step 5: Responsive doğrulama**

DevTools cihaz emülasyonu ile mobil (375px) ve masaüstü (1440px) genişliklerinde anasayfayı kontrol et.
Expected: Zarf ortalı ve orantılı; mühür/yazı kapak ucuyla hizalı; taşma yok.

- [ ] **Step 6: Son tip kontrolü, lint ve build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: Üçü de hatasız tamamlanır.

---

## Self-Review Notları

- **Spec kapsamı:** Akış (Task 2-4), görsel katmanlar/karma yaklaşım (Task 1-2), açılış koreografisi (Task 4), sessionStorage + FOUC (Task 3), erişilebilirlik/reduced-motion/responsive/fallback (Task 5), sadece anasayfa kapsamı (Task 2 Step 2 + Task 5 Step 4) — hepsi karşılandı.
- **Spec sapması:** Spec'teki 2 ayrı görsel, tek görsel + clip-path dilim yaklaşımına sadeleştirildi (plan başındaki nota bakınız). Görsel intent korunuyor.
- **JS kapalı fallback:** Client component render olmaz; site doğrudan görünür — ek iş gerekmez.
- **Tip tutarlılığı:** `STORAGE_KEY`, `FLAP_CLIP`, ref isimleri ve `finish`/`handleOpen` fonksiyonları görevler arası tutarlı.
