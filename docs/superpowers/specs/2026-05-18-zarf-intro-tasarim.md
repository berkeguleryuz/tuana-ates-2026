# Zarf Intro (Davetiye Açılışı) — Tasarım Dökümanı

Tarih: 2026-05-18
Proje: tuana-ates2026 (Tuana & Ateş düğün davetiyesi sitesi)

## Amaç

Anasayfa açıldığında ziyaretçiyi tam ekran kapalı bir davetiye zarfı karşılar.
Zarfın üzerindeki mum mührüne dokununca zarf açılır ve arkadaki gerçek site
açığa çıkar. Referans görseldeki fiziksel davetiye hissini dijitalde yeniden
yaratmak hedeflenir.

## Kapsam

- Overlay **yalnızca anasayfada** (`/`) gösterilir.
- Diğer sayfalara (`/galeri`, `/hikayemiz`, `/lcv` vb.) doğrudan girişte
  overlay gösterilmez.
- Overlay **oturum başına bir kez** gösterilir. Ziyaretçi zarfı açtıktan sonra
  aynı oturumda anasayfayı yenilese / tekrar gelse zarf bir daha gelmez.

## Genel Akış

1. Anasayfa render olur; site içeriği arka planda hazırdır.
2. Tam ekran sabit (`position: fixed`) zarf overlay'i siteyi tamamen örter.
3. Ziyaretçi mum mührüne dokunur/tıklar (veya klavye ile Enter/Space).
4. Açılış koreografisi çalışır (aşağıda).
5. Overlay kaybolur, `sessionStorage`'a açılma kaydedilir, site açığa çıkar.

## Açılış Koreografisi (GSAP timeline)

Mühre tıklama ile tetiklenir:

1. **Mühür nabzı:** Mum mührü kısa bir scale pulse yapar.
2. **Mühür kopar:** Mühür yukarı doğru kayar, hafif döner ve solar (`y`, `rotate`, `opacity`).
3. **Kapak açılır:** Üst kapak katmanı menteşeden yukarı açılır — üst-orta
   `transform-origin`, `rotateX` ile 3D çevrilir (~0.7s). Ebeveyn elemanda
   `perspective` tanımlı.
4. **Işık + solma:** Sıcak altın tonlu kısa bir ışık parlaması (glow/bloom);
   zarf bütünü hafifçe büyür (`scale`) ve solar.
5. **Overlay kalkar:** Overlay opaklığı sıfırlanır ve DOM'dan kaldırılır.

Animasyon süresi toplam ~1.6–2.0s civarı.

## Görsel Katmanlar (Karma yaklaşım)

### Higgsfield ile üretilecek görseller (2 adet)

Tonlar: günbatımı / terracotta-şeftali-altın (site temasıyla uyumlu).
Doku: kabartmalı kağıt, botanik (çiçek/yaprak) kabartma desenleri.
Mühür görsele dahil **edilmez** (mühür kod katmanıdır).

- **Görsel A — Zarf gövdesi + iç kısım:** Arka katman. Kapak açıldığında
  görünecek karanlık iç cep dahil.
- **Görsel B — Üst kapak:** Şeffaf arka planlı üçgen kapak. Bağımsız olarak
  3D döndürülür.

Görseller `/public` altına kaydedilir.

### Kod ile üretilecek katmanlar

- **Mum mührü:** CSS/SVG ile dairesel mühür. İçinde "T&A" monogramı, altın/krem
  tonlu, hafif kabartma gölgesi. Bağımsız animasyon hedefi.
- **Monogram altı yazı:** "Tuana & Ateş" — Merienda fontu, kabartma gölge efekti.
- **Alt satır:** "Bu davetiye size özeldir" — ince, küçük, harf aralıklı.
- **Arka plan:** Sıcak koyu gradyan (site `#1a0f0a` ailesiyle uyumlu).

## Teknik Yapı

- **Yeni dosya:** `app/_components/EnvelopeIntro.tsx` — client component
  (`"use client"`).
  - `position: fixed`, tüm ekranı kaplar, yüksek `z-index`.
  - Açılış animasyonu GSAP timeline ile (GSAP zaten projede mevcut).
- **Mount noktası:** `app/page.tsx` içinde render edilir (sadece anasayfa).
- **Scroll kilidi:** Overlay görünürken `body` scroll kilitlenir; açılış
  tamamlanınca serbest bırakılır.
- **Kalıcılık:** `sessionStorage` anahtarı `ta-envelope-opened`.
  - Component mount olunca anahtar varsa overlay hiç gösterilmez.
  - Zarf açılınca anahtar yazılır.
- **Flaş engelleme:** Tekrar ziyarette overlay'in bir an görünüp kaybolmasını
  (FOUC) engellemek için `app/layout.tsx`'e küçük bir senkron inline script
  eklenir. Script `sessionStorage`'ı okuyup `<html>` üzerine bir sınıf
  (`ta-envelope-seen`) koyar; bu sınıf varken overlay CSS ile başlangıçta
  `display:none` olur.
- **Görseller:** `next/image` ile servis edilir, `priority` ile yüklenir.

## Erişilebilirlik & Uç Durumlar

- Mum mührü gerçek bir `<button>` elementidir; `aria-label="Davetiyeyi aç"`.
  Enter ve Space ile de açılabilir.
- `prefers-reduced-motion`: açılış koreografisi kısaltılır — mühür/kapak
  animasyonları atlanır, kısa bir fade ile overlay kaldırılır.
- Görsel yüklenene kadar düz renkli (terracotta) bir zarf iskeleti gösterilir;
  görsel gelince layout kayması olmaz.
- JavaScript kapalıysa client component render olmaz; site doğrudan görünür
  (kabul edilebilir fallback).
- Responsive: zarf ortalanır, dikey (mobil) ve geniş (masaüstü) ekranlarda
  orantılı ölçeklenir; masaüstünde zarf daha büyük/dolu görünür.

## Bileşen Arayüzü

`EnvelopeIntro` — props almaz. Kendi içinde:
- `sessionStorage` durumunu okur.
- Açık/kapalı/animasyon durumunu yönetir.
- Açılış bittiğinde kendini DOM'dan kaldırır.

Bağımlılıklar: `gsap`, `@gsap/react` (useGSAP), `next/image`.

## Kapsam Dışı (YAGNI)

- Kişiye özel isimle karşılama (davet kodu bazlı) — yapılmaz, genel metin.
- Ses/müzik efekti — yapılmaz.
- Zarfın fiziksel olarak uçup gitmesi — yapılmaz (site zaten arkada).
