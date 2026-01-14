/**
 * 會員卡片骨架載入元件
 */

import { Skeleton } from "@/components/ui/skeleton";

export function MemberCardSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 animate-fade-in">
      {/* Avatar */}
      <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
      
      {/* Info section */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-16 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
    </div>
  );
}

export function MemberListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: count }).map((_, i) => (
        <MemberCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="bg-card/60 backdrop-blur rounded-lg p-4 animate-pulse">
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-8 w-12" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}
