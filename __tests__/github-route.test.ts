import type { NextRequest } from "next/server";
import type { GitHubRepo } from "@/types/github";

jest.mock("@/lib/github", () => ({ fetchGitHubTrending: jest.fn() }));
jest.mock("@/lib/cache", () => ({ cache: { get: jest.fn(), set: jest.fn() } }));
jest.mock("@/lib/rateGuard", () => ({ checkRateLimit: jest.fn() }));

import { fetchGitHubTrending } from "@/lib/github";
import { cache } from "@/lib/cache";
import { checkRateLimit } from "@/lib/rateGuard";
import { GET } from "@/app/api/github/trending/route";

function makeReq(params: Record<string, string> = {}): NextRequest {
  return {
    nextUrl: { searchParams: new URLSearchParams(params) },
  } as unknown as NextRequest;
}

const mockRepos: GitHubRepo[] = [
  {
    id: 1,
    name: "repo",
    full_name: "owner/repo",
    description: null,
    html_url: "https://github.com/owner/repo",
    stargazers_count: 500,
    forks_count: 100,
    language: "Go",
    topics: [],
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-02T00:00:00Z",
    owner: { login: "owner", avatar_url: "https://example.com/avatar.png" },
  },
];

beforeEach(() => {
  jest.clearAllMocks();
  (checkRateLimit as jest.Mock).mockReturnValue(true);
  (cache.get as jest.Mock).mockReturnValue(null);
  (fetchGitHubTrending as jest.Mock).mockResolvedValue(mockRepos);
});

describe("GET /api/github/trending", () => {
  it("retourne les repos", async () => {
    const res = await GET(makeReq());
    const json = await res.json();
    expect(json.data).toEqual(mockRepos);
    expect(res.status).toBe(200);
  });

  it("passe le paramètre language au fetcher", async () => {
    await GET(makeReq({ language: "rust" }));
    expect(fetchGitHubTrending).toHaveBeenCalledWith("rust");
  });

  it("set le cache avec TTL 15min", async () => {
    await GET(makeReq());
    expect(cache.set).toHaveBeenCalledWith(
      "github:trending:",
      mockRepos,
      15 * 60 * 1000
    );
  });

  it("retourne le cache si hit", async () => {
    (cache.get as jest.Mock).mockReturnValue(mockRepos);
    const res = await GET(makeReq());
    const json = await res.json();
    expect(json.data).toEqual(mockRepos);
    expect(fetchGitHubTrending).not.toHaveBeenCalled();
  });

  it("retourne 429 si rate limit dépassé", async () => {
    (checkRateLimit as jest.Mock).mockReturnValue(false);
    const res = await GET(makeReq());
    expect(res.status).toBe(429);
    const json = await res.json();
    expect(json.data).toEqual([]);
  });

  it("retourne 500 si fetcher throw", async () => {
    (fetchGitHubTrending as jest.Mock).mockRejectedValue(new Error("timeout"));
    const res = await GET(makeReq());
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("timeout");
    expect(json.data).toEqual([]);
  });
});
