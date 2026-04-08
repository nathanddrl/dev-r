import { GitHubRepo } from "@/types/github";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript:  "bg-[#3178c6] text-white",
  JavaScript:  "bg-[#f1e05a] text-[#3D3A35]",
  Python:      "bg-[#3572A5] text-white",
  Rust:        "bg-[#dea584] text-[#3D3A35]",
  Go:          "bg-[#00ADD8] text-white",
  Java:        "bg-[#b07219] text-white",
  C:           "bg-[#555555] text-white",
  "C++":       "bg-[#f34b7d] text-white",
  "C#":        "bg-[#178600] text-white",
  Ruby:        "bg-[#701516] text-white",
  Swift:       "bg-[#fa7343] text-white",
  Kotlin:      "bg-[#A97BFF] text-white",
  PHP:         "bg-[#4F5D95] text-white",
  Dart:        "bg-[#00B4AB] text-white",
  Shell:       "bg-[#89e051] text-[#3D3A35]",
  HTML:        "bg-[#e34c26] text-white",
  CSS:         "bg-[#563d7c] text-white",
  Vue:         "bg-[#41b883] text-white",
  Svelte:      "bg-[#ff3e00] text-white",
  Elixir:      "bg-[#6e4a7e] text-white",
  Haskell:     "bg-[#5e5086] text-white",
  Scala:       "bg-[#c22d40] text-white",
  Zig:         "bg-[#ec915c] text-[#3D3A35]",
};

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

interface RepoCardProps {
  repo: GitHubRepo;
}

export function RepoCard({ repo }: RepoCardProps) {
  const description = repo.description
    ? repo.description.slice(0, 100) + (repo.description.length > 100 ? "…" : "")
    : null;

  const langColor =
    repo.language && LANGUAGE_COLORS[repo.language]
      ? LANGUAGE_COLORS[repo.language]
      : "bg-muted text-muted-foreground";

  return (
    <Card className="h-full transition-shadow hover:shadow-md hover:ring-foreground/20">
      <CardHeader>
        <CardTitle>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
          >
            {repo.full_name}
          </a>
        </CardTitle>
        {description && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </CardHeader>

      <CardContent className="flex items-center gap-2 flex-wrap">
        {repo.language && (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${langColor}`}
          >
            {repo.language}
          </span>
        )}
      </CardContent>

      <CardFooter className="mt-auto border-t border-border pt-4 gap-4">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>⭐</span>
          <span className="font-medium text-foreground">
            {formatCount(repo.stargazers_count)}
          </span>
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>🍴</span>
          <span className="font-medium text-foreground">
            {formatCount(repo.forks_count)}
          </span>
        </span>
      </CardFooter>
    </Card>
  );
}
