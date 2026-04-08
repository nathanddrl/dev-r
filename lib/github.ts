import type { GitHubRepo, GitHubSearchResponse } from "@/types/github";

export async function fetchGitHubTrending(
  language: string
): Promise<GitHubRepo[]> {
  const since = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const q = language ? `created:>${since} language:${language}` : `created:>${since}`;

  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=30`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "devr-dashboard",
      ...(process.env.GITHUB_TOKEN
        ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        : {}),
    },
  });

  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

  const data: GitHubSearchResponse = await res.json() as GitHubSearchResponse;
  return data.items;
}
