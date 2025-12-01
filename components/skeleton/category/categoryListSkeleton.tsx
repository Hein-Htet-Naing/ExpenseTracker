import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CategoriesListSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Feedback placeholder */}
      <Skeleton className="w-full max-w-md mx-auto h-12 rounded" />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-60 mt-2" />
        </div>
        <Skeleton className="h-10 w-32 rounded" />
      </div>

      {/* Search card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium">
            <Skeleton className="h-6 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full max-w-md" />
        </CardContent>
      </Card>

      {/* Categories list card */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-60 mt-2" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent>
                  <div className="flex flex-col items-center justify-between space-y-2">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-4 h-4 rounded-full" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                    <div className="flex space-x-3 w-full">
                      <Skeleton className="h-8 w-16 rounded" />
                      <Skeleton className="h-8 w-16 rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
