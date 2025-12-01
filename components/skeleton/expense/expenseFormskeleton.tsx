import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ExpenseFormSkeleton() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-6 w-60 mt-2" />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-40" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-60 mt-2" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              {/* Expense Title */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Amount & Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-20 w-full" />
              </div>

              {/* Buttons */}
              <div className="flex space-x-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-24" />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
