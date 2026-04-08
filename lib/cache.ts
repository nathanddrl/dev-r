export interface ICache {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T, ttlMs: number): void;
  invalidate(key: string): void;
}

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class InMemoryCache implements ICache {
  private store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    if (!entry) {
      console.log(`[CACHE MISS ${key}]`);
      return null;
    }
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      console.log(`[CACHE MISS ${key}]`);
      return null;
    }
    console.log(`[CACHE HIT ${key}]`);
    return entry.value;
  }

  set<T>(key: string, value: T, ttlMs: number): void {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
    console.log(`[CACHE SET ${key} ${ttlMs}]`);
  }

  invalidate(key: string): void {
    this.store.delete(key);
  }
}

export const cache: ICache = new InMemoryCache();
