import { Suspense } from "react";
import type { GitHubRepo } from "@/types/github";
import type { DevToArticle } from "@/types/devto";
import type { HypeScore } from "@/types/hype";
import { HypeChart } from "@/components/HypeChart";
import { GitHubSection } from "@/components/GitHubSection";
import { DevToSection } from "@/components/DevToSection";
import { SkeletonCard } from "@/components/SkeletonCard";
import { Skeleton } from "@/components/ui/skeleton";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

async function GitHubSectionAsync() {
  try {
    const res = await fetch(`${BASE_URL}/api/github/trending`, {
      next: { revalidate: 900 },
    });
    const json = (await res.json()) as { data?: GitHubRepo[] };
    const data = json.data ?? [];
    return <GitHubSection repos={data} lastFetchedAt={Date.now()} />;
  } catch {
    return <GitHubSection repos={[]} lastFetchedAt={Date.now()} />;
  }
}

async function DevToSectionAsync() {
  try {
    const res = await fetch(`${BASE_URL}/api/devto/articles`, {
      next: { revalidate: 600 },
    });
    const json = (await res.json()) as { data?: DevToArticle[] };
    const data = json.data ?? [];
    return <DevToSection articles={data} lastFetchedAt={Date.now()} />;
  } catch {
    return <DevToSection articles={[]} lastFetchedAt={Date.now()} />;
  }
}

async function HypeChartAsync() {
  try {
    const res = await fetch(`${BASE_URL}/api/stats/hype`, {
      next: { revalidate: 600 },
    });
    const json = (await res.json()) as { data?: HypeScore[] };
    return <HypeChart data={json.data ?? []} />;
  } catch {
    return <HypeChart data={[]} />;
  }
}

function HypeChartSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-80 w-full" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--color-bg, #FAF7F2)" }}>
      {/* Header */}
      <header
        className="px-8 py-5 flex items-center justify-between"
        style={{ borderBottom: "0.5px solid var(--border-primary, rgba(60,55,50,0.15))" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="text-[28px] font-bold tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary, #3D3A35)" }}
          >
            Dev&apos;R
          </span>
          <span
            className="text-[11px] font-medium uppercase tracking-[0.08em] px-3 py-1 rounded-full"
            style={{
              background: "var(--color-accent-light, #F5EBD8)",
              color: "var(--color-accent-dark, #8B5E2B)",
              fontFamily: "var(--font-body)",
            }}
          >
            Beta
          </span>
        </div>
        <p
          className="text-sm hidden sm:block"
          style={{ color: "var(--color-text-secondary, #6B6560)", fontFamily: "var(--font-body)" }}
        >
          La tech qui monte, chaque matin.
        </p>
      </header>

      {/* Main */}
      <main className="flex-1 px-6 md:px-8 py-10 max-w-7xl mx-auto w-full">
        {/* Hero */}
        <section className="mb-12">
          <p
            className="text-[11px] font-medium uppercase tracking-[0.08em] mb-3"
            style={{ color: "var(--color-accent, #D97B4F)", fontFamily: "var(--font-body)" }}
          >
            Dashboard veille tech
          </p>
          <h1
            className="text-[40px] font-bold leading-[1.05] tracking-[-0.03em] mb-4"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary, #3D3A35)" }}
          >
            La tech qui monte,
            <br />
            chaque matin.
          </h1>
          <p
            className="text-base leading-[1.7] max-w-lg"
            style={{ color: "var(--color-text-secondary, #6B6560)", fontFamily: "var(--font-body)" }}
          >
            GitHub trending + Dev.to agrégés, scorés, filtrés. Un dashboard pour ne rien manquer des tendances tech.
          </p>
        </section>

        {/* HypeChart — pleine largeur */}
        <section
          className="mb-10 rounded-[16px] p-6"
          style={{
            background: "var(--color-surface, #E8DFD0)",
            border: "0.5px solid var(--border-primary, rgba(60,55,50,0.15))",
          }}
        >
          <p
            className="text-[11px] font-medium uppercase tracking-[0.08em] mb-2"
            style={{ color: "var(--color-accent, #D97B4F)", fontFamily: "var(--font-body)" }}
          >
            HypeScore
          </p>
          <Suspense fallback={<HypeChartSkeleton />}>
            <HypeChartAsync />
          </Suspense>
        </section>

        {/* Deux colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* GitHub */}
          <div
            className="rounded-[16px] p-6"
            style={{
              background: "var(--color-surface, #E8DFD0)",
              border: "0.5px solid var(--border-primary, rgba(60,55,50,0.15))",
            }}
          >
            <Suspense fallback={<SkeletonCard count={5} />}>
              <GitHubSectionAsync />
            </Suspense>
          </div>

          {/* Dev.to */}
          <div
            className="rounded-[16px] p-6"
            style={{
              background: "var(--color-surface, #E8DFD0)",
              border: "0.5px solid var(--border-primary, rgba(60,55,50,0.15))",
            }}
          >
            <Suspense fallback={<SkeletonCard count={5} />}>
              <DevToSectionAsync />
            </Suspense>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="px-8 py-5 text-center"
        style={{ borderTop: "0.5px solid var(--border-primary, rgba(60,55,50,0.15))" }}
      >
        <p
          className="text-xs"
          style={{ color: "var(--color-text-tertiary, #9E9890)", fontFamily: "var(--font-body)" }}
        >
          Dev&apos;R · GitHub API + Dev.to API · 2026
        </p>
      </footer>
    </div>
  );
}
