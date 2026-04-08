import { NextResponse } from "next/server";
import { cache } from "@/lib/cache";
import { checkRateLimit } from "@/lib/rateGuard";
import { fetchGitHubTrending } from "@/lib/github";
import { fetchDevToArticles } from "@/lib/devto";
import { computeHypeScore } from "@/lib/aggregator";
import type { HypeScore } from "@/types/hype";

const CACHE_KEY = "stats:hype";
const TTL_MS = 10 * 60 * 1000;

export async function GET(): Promise<NextResponse> {
  if (!checkRateLimit(CACHE_KEY, 30, 60_000)) {
    return NextResponse.json(
      { error: "Rate limit exceeded", data: [] },
      { status: 429 }
    );
  }

  const cached = cache.get<HypeScore[]>(CACHE_KEY);
  if (cached) return NextResponse.json({ data: cached });

  try {
    const [repos, articles] = await Promise.all([
      fetchGitHubTrending(""),
      fetchDevToArticles(),
    ]);

    const scores = computeHypeScore(repos, articles);
    cache.set<HypeScore[]>(CACHE_KEY, scores, TTL_MS);
    return NextResponse.json({ data: scores });
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error, data: [] }, { status: 500 });
  }
}
