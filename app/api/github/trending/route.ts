import { NextRequest, NextResponse } from "next/server";
import { cache } from "@/lib/cache";
import { checkRateLimit } from "@/lib/rateGuard";
import { fetchGitHubTrending } from "@/lib/github";
import type { GitHubRepo } from "@/types/github";

const TTL_MS = 15 * 60 * 1000;

export async function GET(req: NextRequest): Promise<NextResponse> {
  const language = req.nextUrl.searchParams.get("language") ?? "";
  const cacheKey = `github:trending:${language}`;

  if (!checkRateLimit("github:trending", 30, 60_000)) {
    return NextResponse.json(
      { error: "Rate limit exceeded", data: [] },
      { status: 429 }
    );
  }

  const cached = cache.get<GitHubRepo[]>(cacheKey);
  if (cached) return NextResponse.json({ data: cached });

  try {
    const repos = await fetchGitHubTrending(language);
    cache.set<GitHubRepo[]>(cacheKey, repos, TTL_MS);
    return NextResponse.json({ data: repos });
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error, data: [] }, { status: 500 });
  }
}
