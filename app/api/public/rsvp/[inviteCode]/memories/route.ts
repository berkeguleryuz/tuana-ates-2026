import { NextRequest, NextResponse } from "next/server";
import { ensureInviteCode, upstreamUrl } from "@/app/_lib/upstream";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ inviteCode: string }> }
) {
  const { inviteCode } = await params;
  if (!ensureInviteCode(inviteCode)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  let body: { authorName?: string; message?: string } | null = null;
  try {
    body = (await req.json()) as { authorName?: string; message?: string };
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const authorName = body?.authorName?.trim();
  const message = body?.message?.trim();

  if (!authorName || !message) {
    return NextResponse.json({ error: "Eksik bilgi." }, { status: 400 });
  }

  try {
    const res = await fetch(upstreamUrl("/memories"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorName, message }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Gönderim başarısız." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gönderim başarısız." },
      { status: 500 }
    );
  }
}
