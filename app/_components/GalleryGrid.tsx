"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { CameraIcon } from "../_icons/CameraIcon";
import { CloseIcon } from "../_icons/CloseIcon";
import { UserIcon } from "../_icons/UserIcon";

interface Photo {
  id: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  uploader: string;
}

interface Props {
  initialPhotos: Photo[];
}

export function GalleryGrid({ initialPhotos }: Props) {
  const wedding = useWedding();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const photos = initialPhotos;
  const [uploaderName, setUploaderName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!uploaderName.trim()) {
      toast.error(t("memoryNameRequired"));
      return;
    }

    const fileArray = Array.from(files).slice(0, 25);

    const oversized = fileArray.filter((f) => f.size > 10 * 1024 * 1024);
    if (oversized.length > 0) {
      toast.error(`${oversized.length} dosya 10MB sınırını aşıyor.`);
      return;
    }

    setIsUploading(true);
    setUploadProgress({ current: 0, total: fileArray.length });

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < fileArray.length; i++) {
      setUploadProgress({ current: i + 1, total: fileArray.length });
      try {
        const formData = new FormData();
        formData.append("file", fileArray[i]);
        formData.append("uploader", uploaderName.trim());

        const res = await fetch(
          `/api/public/rsvp/${wedding.inviteCode}/gallery`,
          { method: "POST", body: formData }
        );

        if (!res.ok) throw new Error();
        successCount++;
      } catch {
        failCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} ${t("galleryUploadSuccess")}`);
      router.refresh();
    }
    if (failCount > 0) {
      toast.error(`${failCount} ${t("galleryUploadError")}`);
    }

    setIsUploading(false);
    setUploadProgress({ current: 0, total: 0 });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-12 h-px bg-gradient-to-r from-[#d4735e] to-[#e8a87c] mb-6" />
        <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#8a7565] mb-3">
          {t("galleryLabel")}
        </p>
        <h1 className="font-merienda text-3xl md:text-4xl text-[#e8a87c]">
          {t("galleryHeading")}
        </h1>
      </motion.div>

      {wedding.hasGallery && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-lg"
        >
          <div className="bg-[#241710] rounded-xl border border-[#e8a87c]/10 p-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <div className="relative flex-1">
                <UserIcon
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#e8a87c]"
                />
                <input
                  type="text"
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                  placeholder={t("galleryUploadNamePlaceholder")}
                  aria-label={t("galleryUploadNamePlaceholder")}
                  className="w-full h-11 rounded-lg border border-[#e8a87c]/15 bg-[#1a0f0a] pl-9 pr-3 text-sm text-[#faf0e6] placeholder:text-[#8a7565] focus:border-[#e8a87c]/40 focus:outline-none transition-all font-sans"
                />
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => {
                  if (!uploaderName.trim()) {
                    toast.error(t("memoryNameRequired"));
                    return;
                  }
                  fileInputRef.current?.click();
                }}
                disabled={isUploading}
                className={cn(
                  "h-11 px-5 rounded-lg font-sans text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-all shrink-0",
                  isUploading
                    ? "bg-[#e8a87c]/20 text-[#e8a87c]/50 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#d4735e] to-[#e8a87c] text-white hover:opacity-90 cursor-pointer"
                )}
              >
                {isUploading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-[#e8a87c]/30 border-t-[#e8a87c] rounded-full animate-spin" />
                    {uploadProgress.current}/{uploadProgress.total} {t("galleryUploading")}
                  </>
                ) : (
                  <>
                    <CameraIcon className="size-3.5" size={14} />
                    {t("galleryUploadHeading")}
                  </>
                )}
              </button>
            </div>
            <p className="font-sans text-[10px] text-[#8a7565] mt-2">
              {t("galleryUploadInfo")}
            </p>
          </div>
        </motion.div>
      )}

      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 gap-2">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="group relative aspect-[4/3] overflow-hidden cursor-pointer rounded-xl border border-[#e8a87c]/10 bg-[#241710]"
              onClick={() => setSelectedPhoto(photo)}
            >
              <Image
                src={photo.thumbnailUrl || photo.url}
                alt={photo.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1536px) 16vw, 12vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#d4735e]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent pt-6 pb-2 px-2.5">
                <p className="font-sans text-[10px] text-white/90 truncate">
                  {photo.uploader}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center py-16 space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#e8a87c]/5 border border-[#e8a87c]/10 flex items-center justify-center mx-auto mb-4">
              <CameraIcon className="size-6 text-[#8a7565]" size={24} />
            </div>
            <p className="font-sans text-sm text-[#c4a88a]">
              {t("galleryEmpty")}
            </p>
            <p className="font-sans text-xs text-[#8a7565]">
              {t("galleryEmptySubtitle")}
            </p>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#1a0f0a]/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-colors z-10"
            >
              <CloseIcon className="size-5" size={20} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[80vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedPhoto.url}
                alt={selectedPhoto.name}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </motion.div>

            <div className="absolute bottom-6 left-0 right-0 text-center">
              <p className="font-sans text-sm text-white/70">
                {selectedPhoto.uploader}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
