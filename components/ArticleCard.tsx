import Image from "next/image";
import { DevToArticle } from "@/types/devto";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

interface ArticleCardProps {
  article: DevToArticle;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const tags = article.tag_list.slice(0, 3);

  return (
    <Card className="h-full transition-shadow hover:shadow-md hover:ring-foreground/20">
      <CardHeader>
        <CardTitle>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug"
          >
            {article.title}
          </a>
        </CardTitle>

        <div className="flex items-center gap-2 pt-1">
          {article.user.profile_image && (
            <Image
              src={article.user.profile_image}
              alt={article.user.name}
              width={20}
              height={20}
              className="rounded-full shrink-0"
            />
          )}
          <span className="text-xs text-muted-foreground truncate">
            {article.user.name}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-full bg-accent text-accent-foreground px-2 py-0.5 text-xs font-medium"
          >
            #{tag}
          </span>
        ))}
      </CardContent>

      <CardFooter className="mt-auto border-t border-border pt-4">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>❤️</span>
          <span className="font-medium text-foreground">
            {article.public_reactions_count}
          </span>
        </span>
      </CardFooter>
    </Card>
  );
}
