import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function CustomerCardSkeleton() {
  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          {/* Avatar */}
          <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
          
          {/* Info section */}
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-5 w-32" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
        
        {/* Contact info */}
        <div className="flex gap-6">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-36" />
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </Card>
  );
}

export function CustomerListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CustomerCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CustomerStatsSkeleton() {
  return (
    <div className="flex gap-4 mb-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-32 rounded-lg" />
      ))}
    </div>
  );
}
