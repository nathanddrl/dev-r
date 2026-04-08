import type { NextRequest } from "next/server";
import type { DevToArticle } from "@/types/devto";

jest.mock("@/lib/devto", () => ({ fetchDevToArticles: jest.fn() }));
jest.mock("@/lib/cache", () => ({ cache: { get: jest.fn(), set: jest.fn() } }));
jest.mock("@/lib/rateGuard", () => ({ checkRateLimit: jest.fn() }));

import { fetchDevToArticles } from "@/lib/devto";
import { cache } from "@/lib/cache";
import { checkRateLimit } from "@/lib/rateGuard";
import { GET } from "@/app/api/devto/articles/route";

function makeReq(params: Record<string, string> = {}): NextRequest {
  return {
    nextUrl: { searchParams: new URLSearchParams(params) },
  } as unknown as NextRequest;
}

const mockArticles: DevToArticle[] = [
  {
    id: 1,
    title: "Article",
    description: "desc",
    url: "https://dev.to/article",
    cover_image: null,
    published_at: "2025-01-01T00:00:00Z",
    reading_time_minutes: 4,
    tag_list: ["typescript"],
    public_reactions_count: 80,
    comments_count: 2,
    user: {
      name: "Author",
      username: "author",
      profile_image: "https://example.com/profile.png",
    },
  },
];

beforeEach(() => {
  jest.clearAllMocks();
  (checkRateLimit as jest.Mock).mockReturnValue(true);
  (cache.get as jest.Mock).mockReturnValue(null);
  (fetchDevToArticles as jest.Mock).mockResolvedValue(mockArticles);
});

describe("GET /api/devto/articles", () => {
  it("retourne les articles", async () => {
    const res = await GET(makeReq());
    const json = await res.json();
    expect(json.data).toEqual(mockArticles);
    expect(res.status).toBe(200);
  });

  it("passe undefined au fetcher si tag vide", async () => {
    await GET(makeReq());
    expect(fetchDevToArticles).toHaveBeenCalledWith(undefined);
  });

  it("passe le tag au fetcher", async () => {
    await GET(makeReq({ tag: "python" }));
    expect(fetchDevToArticles).toHaveBeenCalledWith("python");
  });

  it("set le cache avec TTL 10min", async () => {
    await GET(makeReq({ tag: "go" }));
    expect(cache.set).toHaveBeenCalledWith(
      "devto:articles:go",
      mockArticles,
      10 * 60 * 1000
    );
  });

  it("retourne le cache si hit", async () => {
    (cache.get as jest.Mock).mockReturnValue(mockArticles);
    const res = await GET(makeReq());
    const json = await res.json();
    expect(json.data).toEqual(mockArticles);
    expect(fetchDevToArticles).not.toHaveBeenCalled();
  });

  it("retourne 429 si rate limit dépassé", async () => {
    (checkRateLimit as jest.Mock).mockReturnValue(false);
    const res = await GET(makeReq());
    expect(res.status).toBe(429);
    const json = await res.json();
    expect(json.data).toEqual([]);
  });

  it("retourne 500 si fetcher throw", async () => {
    (fetchDevToArticles as jest.Mock).mockRejectedValue(new Error("network error"));
    const res = await GET(makeReq());
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("network error");
    expect(json.data).toEqual([]);
  });
});
