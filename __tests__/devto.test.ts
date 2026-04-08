import { fetchDevToArticles } from "@/lib/devto";
import type { DevToArticle } from "@/types/devto";

const mockArticle: DevToArticle = {
  id: 42,
  title: "Article test",
  description: "desc",
  url: "https://dev.to/article",
  cover_image: null,
  published_at: "2025-01-01T00:00:00Z",
  reading_time_minutes: 3,
  tag_list: ["javascript"],
  public_reactions_count: 100,
  comments_count: 5,
  user: {
    name: "Author",
    username: "author",
    profile_image: "https://example.com/profile.png",
  },
};

describe("fetchDevToArticles", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("retourne les articles depuis l'API Dev.to", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [mockArticle],
    }) as jest.Mock;

    const result = await fetchDevToArticles();
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 42,
      title: "Article test",
      public_reactions_count: 100,
    });
  });

  it("ajoute le paramètre tag si fourni", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    }) as jest.Mock;

    await fetchDevToArticles("typescript");

    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toContain("tag=typescript");
  });

  it("n'ajoute pas le paramètre tag si absent", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    }) as jest.Mock;

    await fetchDevToArticles();

    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).not.toContain("tag=");
  });

  it("throw si la réponse n'est pas ok", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    }) as jest.Mock;

    await expect(fetchDevToArticles()).rejects.toThrow("Dev.to API error: 500");
  });
});
