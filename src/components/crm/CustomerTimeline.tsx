import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { useCustomerTimeline } from "@/hooks/useCRM";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  Users,
  Mail,
  MessageSquare,
  FileText,
  Calendar,
  Tag,
  MessageCircle,
  MoreHorizontal,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomerTimelineProps {
  customerId: string;
}

const getActivityIcon = (type: string, metadata?: Record<string, unknown>) => {
  if (type === "interaction") {
    const interactionType = metadata?.interaction_type as string;
    switch (interactionType) {
      case "call":
        return Phone;
      case "meeting":
        return Users;
      case "email":
        return Mail;
      case "message":
        return MessageSquare;
      case "note":
        return FileText;
      default:
        return MoreHorizontal;
    }
  }
  switch (type) {
    case "follow_up":
      return Calendar;
    case "document":
      return FileText;
    case "feedback":
      return MessageCircle;
    case "tag":
      return Tag;
    default:
      return Clock;
  }
};

const getActivityColor = (type: string, metadata?: Record<string, unknown>) => {
  switch (type) {
    case "interaction":
      return "bg-blue-500";
    case "follow_up":
      return metadata?.status === "completed" ? "bg-green-500" : "bg-orange-500";
    case "document":
      return "bg-purple-500";
    case "feedback":
      return "bg-pink-500";
    case "tag":
      return "bg-indigo-500";
    default:
      return "bg-slate-500";
  }
};

const getActivityLabel = (type: string) => {
  switch (type) {
    case "interaction":
      return "互動";
    case "follow_up":
      return "跟進";
    case "document":
      return "報告";
    case "feedback":
      return "回饋";
    case "tag":
      return "標籤";
    default:
      return "活動";
  }
};

export function CustomerTimeline({ customerId }: CustomerTimelineProps) {
  const { activities, loading } = useCustomerTimeline(customerId);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>尚無活動紀錄</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

      <div className="space-y-6">
        {activities.map((activity, index) => {
          const Icon = getActivityIcon(activity.type, activity.metadata);
          const colorClass = getActivityColor(activity.type, activity.metadata);

          return (
            <div
              key={activity.id}
              className={cn(
                "relative flex gap-4 animate-fade-in",
                index === 0 && "pt-0"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Icon */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center z-10 flex-shrink-0",
                  colorClass
                )}
              >
                <Icon className="w-4 h-4 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 pb-6">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {getActivityLabel(activity.type)}
                      </Badge>
                      {activity.metadata?.priority && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            activity.metadata.priority === "urgent" && "border-red-500 text-red-500",
                            activity.metadata.priority === "high" && "border-orange-500 text-orange-500",
                            activity.metadata.priority === "medium" && "border-blue-500 text-blue-500",
                            activity.metadata.priority === "low" && "border-slate-500 text-slate-500"
                          )}
                        >
                          {activity.metadata.priority === "urgent" && "緊急"}
                          {activity.metadata.priority === "high" && "高"}
                          {activity.metadata.priority === "medium" && "中"}
                          {activity.metadata.priority === "low" && "低"}
                        </Badge>
                      )}
                      {activity.metadata?.status === "completed" && (
                        <Badge variant="outline" className="text-xs text-green-500 border-green-500">
                          已完成
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-medium mt-1">{activity.title}</h4>
                    {activity.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {activity.description}
                      </p>
                    )}
                  </div>
                  <time className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(activity.date), "MM/dd HH:mm", { locale: zhTW })}
                  </time>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
