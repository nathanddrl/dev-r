import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonCardProps {
  count?: number;
}

export function SkeletonCard({ count = 5 }: SkeletonCardProps) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="h-full">
          <CardHeader>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-full mt-2" />
            <Skeleton className="h-3 w-2/3 mt-1" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-5 w-16 rounded-full" />
          </CardContent>
          <CardFooter className="border-t border-border pt-4 gap-4">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-10" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
