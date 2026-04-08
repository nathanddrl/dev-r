import { cache } from "@/lib/cache";

describe("InMemoryCache", () => {
  beforeEach(() => {
    // Invalidate any keys used in tests to start fresh
    cache.invalidate("key1");
    cache.invalidate("key2");
  });

  it("retourne null sur MISS", () => {
    expect(cache.get("key1")).toBeNull();
  });

  it("retourne la valeur après SET", () => {
    cache.set("key1", { foo: "bar" }, 60_000);
    expect(cache.get("key1")).toEqual({ foo: "bar" });
  });

  it("retourne null après expiration TTL", () => {
    jest.useFakeTimers();
    cache.set("key2", "value", 1_000);

    jest.advanceTimersByTime(1_001);
    expect(cache.get("key2")).toBeNull();

    jest.useRealTimers();
  });

  it("invalidate supprime l'entrée", () => {
    cache.set("key1", "data", 60_000);
    cache.invalidate("key1");
    expect(cache.get("key1")).toBeNull();
  });

  it("supporte les types génériques", () => {
    cache.set<number[]>("key1", [1, 2, 3], 60_000);
    const result = cache.get<number[]>("key1");
    expect(result).toEqual([1, 2, 3]);
  });
});
