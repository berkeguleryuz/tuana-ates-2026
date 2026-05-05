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
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const file = form.get("file");
  const uploaderRaw = form.get("uploader");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Dosya eksik." }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Dosya 10MB sınırını aşıyor." },
      { status: 413 }
    );
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Sadece görsel yüklenebilir." },
      { status: 400 }
    );
  }

  const uploader =
    typeof uploaderRaw === "string" ? uploaderRaw.trim() : "";
  if (!uploader) {
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
      return NextResponse.json(
        { error: "Yükleme başarısız." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Yükleme başarısız." },
      { status: 500 }
    );
  }
}
