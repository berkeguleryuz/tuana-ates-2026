import { NextRequest, NextResponse } from "next/server";
import { ensureInviteCode, upstreamUrl } from "@/app/_lib/upstream";

interface RsvpBody {
  name?: string;
  phone?: string;
  rsvpStatus?: "confirmed" | "declined";
  additionalGuests?: { name?: string }[];
  note?: string;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ inviteCode: string }> }
) {
  const { inviteCode } = await params;
  if (!ensureInviteCode(inviteCode)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  let body: RsvpBody | null = null;
  try {
    body = (await req.json()) as RsvpBody;
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const name = body?.name?.trim();
  if (!name) {
    return NextResponse.json({ error: "İsim zorunlu." }, { status: 400 });
  }

  const status: "confirmed" | "declined" =
    body?.rsvpStatus === "declined" ? "declined" : "confirmed";

  const additionalGuests =
    status === "confirmed"
      ? (body?.additionalGuests ?? [])
          .map((g) => g?.name?.trim())
          .filter((n): n is string => Boolean(n))
          .map((n) => ({ name: n }))
      : [];

  try {
    const res = await fetch(upstreamUrl(""), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone: body?.phone?.trim() ?? "",
        rsvpStatus: status,
        additionalGuests,
        note: body?.note?.trim() ?? "",
        source: "website",
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Gönderim başarısız." },
        { status: res.status === 409 ? 409 : 502 }
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
