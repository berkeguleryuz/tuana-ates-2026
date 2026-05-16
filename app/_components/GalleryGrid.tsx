"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { CameraIcon } from "../_icons/CameraIcon";
import { UserIcon } from "../_icons/UserIcon";

const TARGET_BYTES = 4 * 1024 * 1024;
const COMPRESS_STEPS: Array<{ maxDim: number; quality: number }> = [
  { maxDim: 1920, quality: 0.85 },
  { maxDim: 1600, quality: 0.8 },
  { maxDim: 1280, quality: 0.75 },
  { maxDim: 1024, quality: 0.7 },
  { maxDim: 800, quality: 0.65 },
];

function reportToServer(inviteCode: string, payload: Record<string, unknown>) {
  try {
    const body = JSON.stringify({
      ts: new Date().toISOString(),
      ...payload,
    });
    fetch(`/api/public/rsvp/${inviteCode}/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // best effort
  }
}

async function compressOnce(
  source: File | Blob,
  baseName: string,
  maxDim: number,
  quality: number
): Promise<File> {
  const bitmap = await createImageBitmap(source, {
    imageOrientation: "from-image",
  });

  let { width, height } = bitmap;
  if (width > maxDim || height > maxDim) {
    const ratio = Math.min(maxDim / width, maxDim / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("canvas-unavailable");
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality)
  );
  if (!blob) throw new Error("encode-failed");

  return new File([blob], `${baseName}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

type StepFailure = { maxDim: number; error: string };

async function prepareForUpload(
  file: File,
  stepFailures: StepFailure[]
): Promise<{ file: File; hitTarget: boolean }> {
  const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";
  let best: File | null = null;

  for (const step of COMPRESS_STEPS) {
    try {
      const compressed = await compressOnce(
        file,
        baseName,
        step.maxDim,
        step.quality
      );
      if (compressed.size <= TARGET_BYTES) {
        return { file: compressed, hitTarget: true };
      }
      if (!best || compressed.size < best.size) best = compressed;
    } catch (err) {
      stepFailures.push({
        maxDim: step.maxDim,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  if (best) return { file: best, hitTarget: false };
  return { file, hitTarget: false };
}

type AttemptInfo = {
  try: number;
  status?: number;
  body?: string;
  error?: string;
  sizeMB: number;
};

async function uploadWithRetry(
  url: string,
  initialFile: File,
  uploader: string,
  attempts: AttemptInfo[],
  maxAttempts = 3
): Promise<boolean> {
  let current = initialFile;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const attemptInfo: AttemptInfo = {
      try: attempt + 1,
      sizeMB: +(current.size / 1024 / 1024).toFixed(2),
    };
    try {
      const formData = new FormData();
      formData.append("file", current);
      formData.append("uploader", uploader);
      const res = await fetch(url, { method: "POST", body: formData });
      if (res.ok) return true;
      attemptInfo.status = res.status;
      attemptInfo.body = (await res.text().catch(() => "")).slice(0, 200);
      attempts.push(attemptInfo);
      if (res.status === 413 || res.status === 502) {
        try {
          const baseName = current.name.replace(/\.[^.]+$/, "") || "photo";
          current = await compressOnce(current, baseName, 1024, 0.65);
        } catch {
          // can't shrink further
        }
      } else if (res.status >= 400 && res.status < 500) {
        return false;
      }
    } catch (err) {
      attemptInfo.error = err instanceof Error ? err.message : String(err);
      attempts.push(attemptInfo);
    }
    if (attempt < maxAttempts - 1) {
      await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
    }
  }
  return false;
}

export function GalleryGrid() {
  const wedding = useWedding();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploaderName, setUploaderName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!uploaderName.trim()) {
      toast.error(t("memoryNameRequired"));
      return;
    }

    const fileArray = Array.from(files).slice(0, 25);

    setIsUploading(true);
    setUploadProgress({ current: 0, total: fileArray.length });

    const uploader = uploaderName.trim();
    const inviteCode = wedding.inviteCode;
    const url = `/api/public/rsvp/${inviteCode}/gallery`;
    const queue = [...fileArray];
    let completed = 0;
    let successCount = 0;
    let failCount = 0;
    const failures: Record<string, unknown>[] = [];

    const startedAt = performance.now();

    const worker = async () => {
      while (queue.length > 0) {
        const file = queue.shift();
        if (!file) break;

        const stepFailures: StepFailure[] = [];
        const originalInfo = {
          name: file.name,
          type: file.type || "unknown",
          sizeMB: +(file.size / 1024 / 1024).toFixed(2),
        };

        let prepared: File;
        let hitTarget = false;
        let prepareThrew: string | undefined;
        try {
          const result = await prepareForUpload(file, stepFailures);
          prepared = result.file;
          hitTarget = result.hitTarget;
        } catch (err) {
          prepareThrew = err instanceof Error ? err.message : String(err);
          prepared = file;
        }

        const attempts: AttemptInfo[] = [];
        const ok = await uploadWithRetry(url, prepared, uploader, attempts);

        if (ok) {
          successCount++;
        } else {
          failCount++;
          failures.push({
            file: originalInfo,
            prepared: {
              sizeMB: +(prepared.size / 1024 / 1024).toFixed(2),
              hitTarget,
              prepareThrew,
              stepFailures,
            },
            attempts,
          });
        }
        completed++;
        setUploadProgress({ current: completed, total: fileArray.length });
      }
    };

    const concurrency = Math.min(3, fileArray.length);
    await Promise.all(Array.from({ length: concurrency }, () => worker()));

    const elapsedMs = Math.round(performance.now() - startedAt);

    if (failCount > 0) {
      reportToServer(inviteCode, {
        kind: "batch-failure",
        uploader,
        total: fileArray.length,
        successCount,
        failCount,
        elapsedMs,
        failures,
      });
    }

    if (successCount > 0) {
      toast.success(`${successCount} ${t("galleryUploadSuccess")}`);
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
          {t("galleryUploadHeading")}
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
                  className="w-full h-11 rounded-lg border border-[#e8a87c]/15 bg-[#1a0f0a] pl-9 pr-3 text-base sm:text-sm text-[#faf0e6] placeholder:text-[#8a7565] focus:border-[#e8a87c]/40 focus:outline-none transition-all font-sans"
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
    </div>
  );
}
