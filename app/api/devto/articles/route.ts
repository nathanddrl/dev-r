import { NextRequest, NextResponse } from "next/server";
import { cache } from "@/lib/cache";
import { checkRateLimit } from "@/lib/rateGuard";
import { fetchDevToArticles } from "@/lib/devto";
import type { DevToArticle } from "@/types/devto";

const TTL_MS = 10 * 60 * 1000;

export async function GET(req: NextRequest): Promise<NextResponse> {
  const tag = req.nextUrl.searchParams.get("tag") ?? "";
  const cacheKey = `devto:articles:${tag}`;

  if (!checkRateLimit("devto:articles", 30, 60_000)) {
    return NextResponse.json(
      { error: "Rate limit exceeded", data: [] },
      { status: 429 }
    );
  }

  const cached = cache.get<DevToArticle[]>(cacheKey);
  if (cached) return NextResponse.json({ data: cached });

  try {
    const articles = await fetchDevToArticles(tag || undefined);
    cache.set<DevToArticle[]>(cacheKey, articles, TTL_MS);
    return NextResponse.json({ data: articles });
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error, data: [] }, { status: 500 });
  }
}
