export const RECENT_KEY = "hadi-recent-v1";
export const PURCHASED_KEY = "hadi-purchased-v1";

function read(key: string): number[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  } catch {
    return [];
  }
}

function write(key: string, ids: number[]): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    // حافظه در دسترس نیست
  }
}

export function readRecent(): number[] {
  return read(RECENT_KEY);
}

export function pushRecent(productId: number): void {
  const next = [productId, ...read(RECENT_KEY).filter((id) => id !== productId)].slice(0, 8);
  write(RECENT_KEY, next);
}

export function readPurchased(): number[] {
  return read(PURCHASED_KEY);
}

export function pushPurchased(productIds: number[]): void {
  const current = read(PURCHASED_KEY);
  const next = [...productIds, ...current.filter((id) => !productIds.includes(id))].slice(0, 8);
  write(PURCHASED_KEY, next);
}
