import { fetchGitHubTrending } from "@/lib/github";
import type { GitHubRepo, GitHubSearchResponse } from "@/types/github";

const mockRepo: GitHubRepo = {
  id: 1,
  name: "repo",
  full_name: "owner/repo",
  description: null,
  html_url: "https://github.com/owner/repo",
  stargazers_count: 1000,
  forks_count: 200,
  language: "TypeScript",
  topics: [],
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-02T00:00:00Z",
  owner: { login: "owner", avatar_url: "https://example.com/avatar.png" },
};

const mockResponse: GitHubSearchResponse = {
  total_count: 1,
  incomplete_results: false,
  items: [mockRepo],
};

describe("fetchGitHubTrending", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("retourne les repos depuis l'API GitHub", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    }) as jest.Mock;

    const result = await fetchGitHubTrending("");
    expect(result).toEqual([mockRepo]);
  });

  it("construit l'URL avec un langage", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    }) as jest.Mock;

    await fetchGitHubTrending("rust");

    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toContain("language%3Arust");
  });

  it("throw si la réponse n'est pas ok", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 403,
    }) as jest.Mock;

    await expect(fetchGitHubTrending("")).rejects.toThrow("GitHub API error: 403");
  });
});
