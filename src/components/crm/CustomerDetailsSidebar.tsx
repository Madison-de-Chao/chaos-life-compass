import { useState } from "react";
import { X, User, Tags, MessageSquare, Clock, Activity, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CustomerTagSelector } from "./CustomerTagSelector";
import { InteractionList } from "./InteractionList";
import { FollowUpList } from "./FollowUpList";
import { CustomerTimeline } from "./CustomerTimeline";
import {
  useCustomerTagAssignments,
  useCustomerFollowUps,
} from "@/hooks/useCRM";

interface Customer {
  id: string;
  name: string;
  gender: string | null;
  birth_date: string | null;
  birth_time: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
}

interface CustomerDetailsSidebarProps {
  customer: Customer;
  onClose: () => void;
}

export function CustomerDetailsSidebar({
  customer,
  onClose,
}: CustomerDetailsSidebarProps) {
  const [openSections, setOpenSections] = useState({
    tags: true,
    interactions: true,
    followUps: true,
    timeline: false,
  });

  const { assignments } = useCustomerTagAssignments(customer.id);
  const { followUps } = useCustomerFollowUps(customer.id);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const formatGender = (gender: string | null) => {
    switch (gender) {
      case "male": return "男";
      case "female": return "女";
      case "other": return "其他";
      default: return "-";
    }
  };

  const pendingFollowUps = followUps.filter((f) => f.status === "pending");
  const overdueFollowUps = pendingFollowUps.filter(
    (f) => new Date(f.due_date) < new Date()
  );

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-background border-l border-border shadow-2xl z-50 animate-fade-in flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">{customer.name}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                {formatGender(customer.gender)}
              </Badge>
              {customer.phone && <span>{customer.phone}</span>}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Tags Section */}
          <Collapsible open={openSections.tags} onOpenChange={() => toggleSection("tags")}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-3 h-auto hover:bg-muted/50">
                <div className="flex items-center gap-2">
                  <Tags className="w-4 h-4 text-primary" />
                  <span className="font-medium">客戶標籤</span>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {assignments.length}
                  </Badge>
                </div>
                {openSections.tags ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 px-2">
              <CustomerTagSelector customerId={customer.id} />
            </CollapsibleContent>
          </Collapsible>

          {/* Interactions Section */}
          <Collapsible open={openSections.interactions} onOpenChange={() => toggleSection("interactions")}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-3 h-auto hover:bg-muted/50">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">互動紀錄</span>
                </div>
                {openSections.interactions ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 px-2">
              <InteractionList customerId={customer.id} />
            </CollapsibleContent>
          </Collapsible>

          {/* Follow-ups Section */}
          <Collapsible open={openSections.followUps} onOpenChange={() => toggleSection("followUps")}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-3 h-auto hover:bg-muted/50">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="font-medium">跟進提醒</span>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {pendingFollowUps.length}
                  </Badge>
                  {overdueFollowUps.length > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {overdueFollowUps.length} 逾期
                    </Badge>
                  )}
                </div>
                {openSections.followUps ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 px-2">
              <FollowUpList customerId={customer.id} />
            </CollapsibleContent>
          </Collapsible>

          {/* Timeline Section */}
          <Collapsible open={openSections.timeline} onOpenChange={() => toggleSection("timeline")}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-3 h-auto hover:bg-muted/50">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span className="font-medium">活動時間軸</span>
                </div>
                {openSections.timeline ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 px-2">
              <CustomerTimeline customerId={customer.id} />
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    </div>
  );
}
