import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ExpensesSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-60 mt-2" />
        </div>
        <Skeleton className="h-10 w-32 rounded" />
      </div>

      {/* Filters and Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="h-4 w-24" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-24 mt-2" />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="h-4 w-20" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expenses List */}
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
          <div className="space-y-4 min-h-[600px]">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-60" />
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <Skeleton className="h-6 w-20 ml-auto" />
                  <div className="flex space-x-2 justify-end">
                    <Skeleton className="h-8 w-16 rounded" />
                    <Skeleton className="h-8 w-16 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex flex-col items-center gap-4">
            <Skeleton className="h-4 w-32" />
            <div className="flex justify-center items-center gap-4">
              <Skeleton className="h-8 w-8 rounded" />
              <div className="flex space-x-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-8 rounded" />
                ))}
              </div>
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
