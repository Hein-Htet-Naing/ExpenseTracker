import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CategoryFormSkeleton() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-6 w-60 mt-2" />
        </div>
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">
              <Skeleton className="h-6 w-40" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-60 mt-2" />
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              {/* Category Name */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Color Options */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-md" />
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-20 w-full" />
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
