/** Tam addan soyismi (son kelimeyi) çıkarır.
 *  "Ateş Fırat Kılınçay" → "Ateş Fırat"
 *  "Tuana Kılınçay"     → "Tuana"
 *  "Tuana"              → "Tuana" (tek kelimeyse aynen döner)
 */
export function stripSurname(fullName: string): string {
  const parts = (fullName || "").trim().split(/\s+/);
  return parts.length > 1 ? parts.slice(0, -1).join(" ") : parts[0] ?? "";
}
