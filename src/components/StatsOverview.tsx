import { FileText, HardDrive, Eye, File } from "lucide-react";
import { Document } from "@/hooks/useDocuments";

interface StatsOverviewProps {
  documents: Document[];
  totalSize: number;
}

export function StatsOverview({ documents, totalSize }: StatsOverviewProps) {
  const totalViews = documents.reduce((acc, doc) => acc + (doc.view_count || 0), 0);
  const protectedCount = documents.filter((doc) => doc.password_hash).length;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const stats = [
    {
      icon: File,
      label: "總檔案數",
      value: documents.length.toString(),
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Eye,
      label: "總閱讀次數",
      value: totalViews.toString(),
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: HardDrive,
      label: "儲存空間",
      value: formatBytes(totalSize),
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: FileText,
      label: "密碼保護",
      value: protectedCount.toString(),
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="p-5 bg-card rounded-xl border border-border shadow-soft animate-slide-up"
          style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground font-serif">
            {stat.value}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
