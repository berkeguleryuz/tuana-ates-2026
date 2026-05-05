import "server-only";

const API_BASE =
  process.env.UYGUNDAVET_API_URL || "https://www.uygundavet.com";
const INVITE_CODE = process.env.INVITE_CODE;

if (!INVITE_CODE) {
  throw new Error(
    "INVITE_CODE env değişkeni tanımlı değil. .env.local dosyasını kontrol et."
  );
}

export const SERVER_INVITE_CODE: string = INVITE_CODE;

export function ensureInviteCode(code: string): boolean {
  return code === INVITE_CODE;
}

export function upstreamUrl(path: string = ""): string {
  return `${API_BASE}/api/public/rsvp/${INVITE_CODE}${path}`;
}
