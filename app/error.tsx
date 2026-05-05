"use client";

export default function SunsetError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-[#1a0f0a] px-6 text-center">
      <h2 className="font-merienda text-2xl text-[#faf0e6] mb-4">Bir şeyler ters gitti</h2>
      <p className="font-sans text-sm text-[#faf0e6]/50 mb-8">Sayfa yüklenirken bir hata oluştu.</p>
      <button
        onClick={reset}
        className="font-sans text-sm font-medium tracking-wide bg-gradient-to-r from-[#d4735e] to-[#e8a87c] text-white rounded-full px-8 py-3 hover:opacity-90 transition-opacity cursor-pointer"
      >
        Tekrar Dene
      </button>
    </div>
  );
}
