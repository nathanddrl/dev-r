import { computeHypeScore } from "@/lib/aggregator";
import type { GitHubRepo } from "@/types/github";
import type { DevToArticle } from "@/types/devto";

function makeRepo(
  id: number,
  language: string,
  stars: number,
  forks: number
): GitHubRepo {
  return {
    id,
    name: `repo-${id}`,
    full_name: `owner/repo-${id}`,
    description: null,
    html_url: `https://github.com/owner/repo-${id}`,
    stargazers_count: stars,
    forks_count: forks,
    language,
    topics: [],
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-02T00:00:00Z",
    owner: { login: "owner", avatar_url: "https://example.com/avatar.png" },
  };
}

function makeArticle(
  id: number,
  tags: string[],
  reactions: number
): DevToArticle {
  return {
    id,
    title: `Article ${id}`,
    description: "desc",
    url: `https://dev.to/article-${id}`,
    cover_image: null,
    published_at: "2025-01-01T00:00:00Z",
    reading_time_minutes: 5,
    tag_list: tags,
    public_reactions_count: reactions,
    comments_count: 0,
    user: {
      name: "Author",
      username: "author",
      profile_image: "https://example.com/profile.png",
    },
  };
}

const repos: GitHubRepo[] = [
  makeRepo(1, "TypeScript", 10000, 2000),
  makeRepo(2, "TypeScript", 8000, 1500),
  makeRepo(3, "Python", 5000, 800),
  makeRepo(4, "Python", 4000, 600),
  makeRepo(5, "Rust", 1000, 200),
];

const articles: DevToArticle[] = [
  makeArticle(1, ["typescript", "webdev"], 50),
  makeArticle(2, ["python", "ai"], 500),
  makeArticle(3, ["python"], 300),
  makeArticle(4, ["rust", "systems"], 200),
];

describe("computeHypeScore", () => {
  const results = computeHypeScore(repos, articles);

  it("retourne au max 6 entrées", () => {
    expect(results.length).toBeLessThanOrEqual(6);
  });

  it("est trié par score desc", () => {
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score);
    }
  });

  it("tous les scores sont entre 0 et 100", () => {
    for (const r of results) {
      expect(r.score).toBeGreaterThanOrEqual(0);
      expect(r.score).toBeLessThanOrEqual(100);
      expect(r.githubScore).toBeGreaterThanOrEqual(0);
      expect(r.githubScore).toBeLessThanOrEqual(100);
      expect(r.devtoScore).toBeGreaterThanOrEqual(0);
      expect(r.devtoScore).toBeLessThanOrEqual(100);
    }
  });

  it("le meilleur github score est 100 (normalisé)", () => {
    const ts = results.find((r) => r.label === "typescript");
    expect(ts?.githubScore).toBe(100);
  });

  it("contient les 3 langages", () => {
    const labels = results.map((r) => r.label);
    expect(labels).toContain("typescript");
    expect(labels).toContain("python");
    expect(labels).toContain("rust");
  });
});
