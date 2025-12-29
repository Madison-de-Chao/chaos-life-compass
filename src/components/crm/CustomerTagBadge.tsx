import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface CustomerTagBadgeProps {
  name: string;
  color: string;
  onRemove?: () => void;
  size?: "sm" | "md";
}

export function CustomerTagBadge({ name, color, onRemove, size = "md" }: CustomerTagBadgeProps) {
  const sizeClasses = size === "sm" ? "text-xs px-1.5 py-0.5" : "text-sm px-2 py-1";
  
  return (
    <Badge
      variant="outline"
      className={`${sizeClasses} gap-1 border-transparent font-normal transition-all hover:opacity-80`}
      style={{
        backgroundColor: `${color}20`,
        color: color,
        borderColor: `${color}40`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      {name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 hover:bg-white/30 rounded-full p-0.5 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </Badge>
  );
}
