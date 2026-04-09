"use client";

import { useState } from "react";
import type { GitHubRepo } from "@/types/github";
import { FreshnessIndicator } from "./FreshnessIndicator";
import { LanguageFilter } from "./LanguageFilter";
import { RepoCard } from "./RepoCard";
import { Card } from "@/components/ui/card";

const LANGUAGES = ["JavaScript", "TypeScript", "Python", "Rust", "Go"];

interface GitHubSectionProps {
  repos: GitHubRepo[];
  lastFetchedAt: number;
}

export function GitHubSection({ repos, lastFetchedAt }: GitHubSectionProps) {
  const [selected, setSelected] = useState<string | null>(null);

  if (repos.length === 0) {
    return (
      <section>
        <h2
          className="mb-4"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "20px",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: "var(--color-text-primary, #3D3A35)",
          }}
        >
          GitHub
        </h2>
        <Card className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
          <span className="text-3xl mb-3">⚠️</span>
          <p className="text-sm text-muted-foreground">
            Source indisponible - réessayez dans quelques minutes
          </p>
        </Card>
      </section>
    );
  }

  const filtered = selected
    ? repos.filter((r) => r.language === selected)
    : repos;

  return (
    <section>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "20px",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: "var(--color-text-primary, #3D3A35)",
          }}
        >
          GitHub
        </h2>
        <FreshnessIndicator lastFetchedAt={lastFetchedAt} />
      </div>

      <div className="mb-5">
        <LanguageFilter languages={LANGUAGES} selected={selected} onChange={setSelected} />
      </div>

      <div className="flex flex-col gap-4">
        {filtered.slice(0, 10).map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
        {filtered.length === 0 && (
          <p
            style={{
              color: "var(--color-text-tertiary, #9E9890)",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
            }}
          >
            Aucun résultat pour ce langage.
          </p>
        )}
      </div>
    </section>
  );
}
