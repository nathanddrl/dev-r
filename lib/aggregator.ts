import type { GitHubRepo } from "@/types/github";
import type { DevToArticle } from "@/types/devto";
import type { HypeScore } from "@/types/hype";

function normalize(value: number, max: number): number {
  if (max === 0) return 0;
  return Math.min(100, (value / max) * 100);
}

export function computeHypeScore(
  repos: GitHubRepo[],
  articles: DevToArticle[]
): HypeScore[] {
  // Group repos by language
  const byLanguage = new Map<string, GitHubRepo[]>();
  for (const repo of repos) {
    const lang = (repo.language ?? "Unknown").toLowerCase();
    const group = byLanguage.get(lang) ?? [];
    group.push(repo);
    byLanguage.set(lang, group);
  }

  // Raw github scores per language (mean of stars*0.6 + forks*0.4)
  const rawGithub = new Map<string, number>();
  for (const [lang, group] of byLanguage) {
    const sum = group.reduce(
      (acc, r) => acc + r.stargazers_count * 0.6 + r.forks_count * 0.4,
      0
    );
    rawGithub.set(lang, sum / group.length);
  }

  const maxGithub = Math.max(...rawGithub.values(), 0);

  // Raw devto scores per language (sum of reactions for matching articles)
  const rawDevto = new Map<string, number>();
  for (const lang of byLanguage.keys()) {
    const sum = articles
      .filter((a) => a.tag_list.some((t) => t.toLowerCase() === lang))
      .reduce((acc, a) => acc + a.public_reactions_count, 0);
    rawDevto.set(lang, sum);
  }

  const maxDevto = Math.max(...rawDevto.values(), 0);

  // Build HypeScore entries
  const results: HypeScore[] = [];
  for (const lang of byLanguage.keys()) {
    const githubScore = normalize(rawGithub.get(lang) ?? 0, maxGithub);
    const devtoScore = normalize(rawDevto.get(lang) ?? 0, maxDevto);
    const score = githubScore * 0.6 + devtoScore * 0.4;

    results.push({
      label: lang,
      score: Math.round(score * 100) / 100,
      githubScore: Math.round(githubScore * 100) / 100,
      devtoScore: Math.round(devtoScore * 100) / 100,
    });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 6);
}
