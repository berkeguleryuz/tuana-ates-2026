import { NextRequest, NextResponse } from "next/server";
import { ensureInviteCode } from "@/app/_lib/upstream";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ inviteCode: string }> }
) {
  const { inviteCode } = await params;
  if (!ensureInviteCode(inviteCode)) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  try {
    const body = await req.json();
    const ua = req.headers.get("user-agent") || "unknown";
    console.error("[gallery-client]", JSON.stringify({ ua, ...body }));
  } catch {
    // ignore malformed bodies
  }
  return NextResponse.json({ ok: true });
}
