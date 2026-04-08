import type { DevToArticle } from "@/types/devto";

interface DevToApiArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  cover_image: string | null;
  published_at: string;
  reading_time_minutes: number;
  tag_list: string[];
  public_reactions_count: number;
  comments_count: number;
  user: {
    name: string;
    username: string;
    profile_image: string;
  };
}

export async function fetchDevToArticles(tag?: string): Promise<DevToArticle[]> {
  const url = new URL("https://dev.to/api/articles");
  url.searchParams.set("per_page", "30");
  if (tag) url.searchParams.set("tag", tag);

  const res = await fetch(url.toString(), {
    headers: { "User-Agent": "devr-dashboard" },
  });

  if (!res.ok) throw new Error(`Dev.to API error: ${res.status}`);

  const data: DevToApiArticle[] = await res.json() as DevToApiArticle[];

  return data.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    url: a.url,
    cover_image: a.cover_image,
    published_at: a.published_at,
    reading_time_minutes: a.reading_time_minutes,
    tag_list: a.tag_list,
    public_reactions_count: a.public_reactions_count,
    comments_count: a.comments_count,
    user: a.user,
  }));
}
