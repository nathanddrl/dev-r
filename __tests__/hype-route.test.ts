import type { GitHubRepo } from "@/types/github";
import type { DevToArticle } from "@/types/devto";
import type { HypeScore } from "@/types/hype";

// Mock fetchers and aggregator
jest.mock("@/lib/github", () => ({
  fetchGitHubTrending: jest.fn(),
}));
jest.mock("@/lib/devto", () => ({
  fetchDevToArticles: jest.fn(),
}));
jest.mock("@/lib/aggregator", () => ({
  computeHypeScore: jest.fn(),
}));
jest.mock("@/lib/cache", () => ({
  cache: { get: jest.fn(), set: jest.fn() },
}));
jest.mock("@/lib/rateGuard", () => ({
  checkRateLimit: jest.fn(),
}));

import { fetchGitHubTrending } from "@/lib/github";
import { fetchDevToArticles } from "@/lib/devto";
import { computeHypeScore } from "@/lib/aggregator";
import { cache } from "@/lib/cache";
import { checkRateLimit } from "@/lib/rateGuard";
import { GET } from "@/app/api/stats/hype/route";

const mockRepos: GitHubRepo[] = [];
const mockArticles: DevToArticle[] = [];
const mockScores: HypeScore[] = [
  { label: "typescript", score: 90, githubScore: 100, devtoScore: 75 },
];

beforeEach(() => {
  jest.clearAllMocks();
  (checkRateLimit as jest.Mock).mockReturnValue(true);
  (cache.get as jest.Mock).mockReturnValue(null);
  (fetchGitHubTrending as jest.Mock).mockResolvedValue(mockRepos);
  (fetchDevToArticles as jest.Mock).mockResolvedValue(mockArticles);
  (computeHypeScore as jest.Mock).mockReturnValue(mockScores);
});

describe("GET /api/stats/hype", () => {
  it("retourne les scores calculés", async () => {
    const res = await GET();
    const json = await res.json();
    expect(json.data).toEqual(mockScores);
  });

  it("appelle les deux fetchers en parallèle", async () => {
    await GET();
    expect(fetchGitHubTrending).toHaveBeenCalledTimes(1);
    expect(fetchDevToArticles).toHaveBeenCalledTimes(1);
  });

  it("set le cache après fetch", async () => {
    await GET();
    expect(cache.set).toHaveBeenCalledWith("stats:hype", mockScores, 10 * 60 * 1000);
  });

  it("retourne le cache si hit", async () => {
    (cache.get as jest.Mock).mockReturnValue(mockScores);
    const res = await GET();
    const json = await res.json();
    expect(json.data).toEqual(mockScores);
    expect(fetchGitHubTrending).not.toHaveBeenCalled();
  });

  it("retourne 429 si rate limit dépassé", async () => {
    (checkRateLimit as jest.Mock).mockReturnValue(false);
    const res = await GET();
    expect(res.status).toBe(429);
    const json = await res.json();
    expect(json.data).toEqual([]);
  });

  it("retourne 500 + fallback si fetcher throw", async () => {
    (fetchGitHubTrending as jest.Mock).mockRejectedValue(new Error("API down"));
    const res = await GET();
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("API down");
    expect(json.data).toEqual([]);
  });
});
