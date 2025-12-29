import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  progress: number;
  shouldTrigger: boolean;
}

export function PullToRefreshIndicator({
  pullDistance,
  isRefreshing,
  progress,
  shouldTrigger,
}: PullToRefreshIndicatorProps) {
  if (pullDistance === 0 && !isRefreshing) return null;

  return (
    <div
      className="absolute left-0 right-0 flex justify-center pointer-events-none z-40"
      style={{
        top: 0,
        transform: `translateY(${Math.max(pullDistance - 40, 0)}px)`,
        opacity: Math.min(progress * 1.5, 1),
        transition: isRefreshing ? 'none' : 'transform 0.2s ease-out, opacity 0.2s ease-out',
      }}
    >
      <div
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full",
          "bg-slate-800 border border-slate-600 shadow-lg",
          shouldTrigger || isRefreshing ? "border-amber-500/50" : "border-slate-600"
        )}
      >
        <RefreshCw
          className={cn(
            "w-5 h-5 transition-all duration-200",
            isRefreshing ? "animate-spin text-amber-500" : "text-slate-400",
            shouldTrigger && !isRefreshing && "text-amber-500"
          )}
          style={{
            transform: isRefreshing ? 'none' : `rotate(${progress * 180}deg)`,
          }}
        />
      </div>
    </div>
  );
}
