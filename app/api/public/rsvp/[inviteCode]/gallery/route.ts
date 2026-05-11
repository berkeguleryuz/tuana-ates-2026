import { NextRequest, NextResponse } from "next/server";
import { ensureInviteCode, upstreamUrl } from "@/app/_lib/upstream";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ inviteCode: string }> }
) {
  const { inviteCode } = await params;
  if (!ensureInviteCode(inviteCode)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch (err) {
    console.error("[gallery] formData parse failed", err);
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const file = form.get("file");
  const uploaderRaw = form.get("uploader");

  if (!(file instanceof File) || file.size === 0) {
    console.error("[gallery] missing or empty file", {
      hasFile: file instanceof File,
      size: file instanceof File ? file.size : null,
    });
    return NextResponse.json({ error: "Dosya eksik." }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    console.error("[gallery] file too large", {
      name: file.name,
      size: file.size,
    });
    return NextResponse.json(
      { error: "Dosya 10MB sınırını aşıyor." },
      { status: 413 }
    );
  }
  if (!file.type.startsWith("image/")) {
    console.error("[gallery] non-image file rejected", {
      name: file.name,
      type: file.type,
    });
    return NextResponse.json(
      { error: "Sadece görsel yüklenebilir." },
      { status: 400 }
    );
  }

  const uploader =
    typeof uploaderRaw === "string" ? uploaderRaw.trim() : "";
  if (!uploader) {
    console.error("[gallery] missing uploader name");
    return NextResponse.json({ error: "İsim zorunlu." }, { status: 400 });
  }

  const upstream = new FormData();
  upstream.append("file", file, file.name);
  upstream.append("uploader", uploader);

  try {
    const res = await fetch(upstreamUrl("/gallery"), {
      method: "POST",
      body: upstream,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[gallery] upstream rejected", {
        status: res.status,
        body: body.slice(0, 500),
        file: { name: file.name, type: file.type, size: file.size },
        uploader,
      });
      return NextResponse.json(
        { error: "Yükleme başarısız." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[gallery] upstream fetch threw", {
      err: err instanceof Error ? err.message : String(err),
      file: { name: file.name, type: file.type, size: file.size },
      uploader,
    });
    return NextResponse.json(
      { error: "Yükleme başarısız." },
      { status: 500 }
    );
  }
}
