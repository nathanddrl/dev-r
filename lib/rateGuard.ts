interface RateWindow {
  count: number;
  windowStart: number;
}

const windows = new Map<string, RateWindow>();

export function checkRateLimit(
  key: string,
  maxCalls: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = windows.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    windows.set(key, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= maxCalls) {
    console.log(`[RATE LIMIT BLOCKED ${key}]`);
    return false;
  }

  entry.count++;
  return true;
}
