import { useState } from "react";
import { format, addDays } from "date-fns";
import { zhTW } from "date-fns/locale";
import { 
  Crown, Calendar, CreditCard, RefreshCw, AlertTriangle, 
  Check, Clock, Gift, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { 
  SUBSCRIPTION_PLANS, 
  SUBSCRIPTION_STATUS_LABELS,
  getDaysRemaining,
  isExpiringSoon,
  type SubscriptionStatus 
} from "@/types/subscription";

interface SubscriptionManagementProps {
  userId: string;
  currentStatus: SubscriptionStatus;
  expiresAt: string | null;
  startedAt: string | null;
  onUpdate: () => void;
}

export function SubscriptionManagement({
  userId,
  currentStatus,
  expiresAt,
  startedAt,
  onUpdate,
}: SubscriptionManagementProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [customExpiry, setCustomExpiry] = useState<Date | undefined>();
  const [autoRenew, setAutoRenew] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const daysRemaining = getDaysRemaining(expiresAt);
  const expiringSoon = isExpiringSoon(expiresAt);
  const statusInfo = SUBSCRIPTION_STATUS_LABELS[currentStatus];

  const handleUpdateSubscription = async () => {
    if (!selectedPlan) {
      toast({ title: "請選擇訂閱方案", variant: "destructive" });
      return;
    }

    setIsUpdating(true);

    const plan = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlan);
    if (!plan) {
      toast({ title: "無效的方案", variant: "destructive" });
      setIsUpdating(false);
      return;
    }

    const now = new Date();
    let newStatus: SubscriptionStatus = 'active';
    let expirationDate: Date | null = null;

    if (plan.id === 'free') {
      newStatus = 'free';
      expirationDate = null;
    } else if (plan.id === 'trial') {
      newStatus = 'trial';
      expirationDate = customExpiry || addDays(now, plan.duration_days);
    } else {
      newStatus = 'active';
      expirationDate = customExpiry || addDays(now, plan.duration_days);
    }

    // Update profile subscription
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        subscription_status: newStatus,
        subscription_started_at: now.toISOString(),
        subscription_expires_at: expirationDate?.toISOString() || null,
      })
      .eq('user_id', userId);

    if (profileError) {
      console.error('Error updating profile:', profileError);
      toast({ title: "更新失敗", variant: "destructive" });
      setIsUpdating(false);
      return;
    }

    // Create subscription record
    const { error: subError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_name: plan.name,
        status: newStatus,
        amount: plan.price,
        currency: plan.currency,
        started_at: now.toISOString(),
        expires_at: expirationDate?.toISOString() || null,
        metadata: { 
          plan_id: plan.id, 
          auto_renew: autoRenew,
          updated_by: 'admin'
        },
      });

    if (subError) {
      console.error('Error creating subscription record:', subError);
    }

    // Log interaction
    await supabase
      .from('member_interactions')
      .insert({
        user_id: userId,
        interaction_type: 'subscription_change',
        content: `訂閱變更: ${plan.name}${expirationDate ? `, 到期日: ${format(expirationDate, 'yyyy/MM/dd')}` : ''}`,
        metadata: { 
          plan_id: plan.id,
          previous_status: currentStatus,
          new_status: newStatus,
        }
      });

    toast({ title: "訂閱已更新" });
    setDialogOpen(false);
    setSelectedPlan("");
    setCustomExpiry(undefined);
    onUpdate();
    setIsUpdating(false);
  };

  const handleExtendSubscription = async (days: number) => {
    setIsUpdating(true);
    
    const currentExpiry = expiresAt ? new Date(expiresAt) : new Date();
    const newExpiry = addDays(currentExpiry, days);

    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_expires_at: newExpiry.toISOString(),
        subscription_status: 'active',
      })
      .eq('user_id', userId);

    if (error) {
      toast({ title: "延長失敗", variant: "destructive" });
    } else {
      // Log interaction
      await supabase
        .from('member_interactions')
        .insert({
          user_id: userId,
          interaction_type: 'subscription_extend',
          content: `訂閱延長 ${days} 天，新到期日: ${format(newExpiry, 'yyyy/MM/dd')}`,
        });

      toast({ title: `已延長 ${days} 天` });
      onUpdate();
    }
    setIsUpdating(false);
  };

  const handleCancelSubscription = async () => {
    setIsUpdating(true);
    
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'cancelled',
      })
      .eq('user_id', userId);

    if (error) {
      toast({ title: "取消失敗", variant: "destructive" });
    } else {
      await supabase
        .from('member_interactions')
        .insert({
          user_id: userId,
          interaction_type: 'subscription_cancel',
          content: `訂閱已取消`,
        });

      toast({ title: "訂閱已取消" });
      onUpdate();
    }
    setIsUpdating(false);
  };

  return (
    <Card className="bg-card/60 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Crown className="w-4 h-4 text-primary" />
          訂閱管理
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">目前狀態</span>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>

        {/* Expiration Info */}
        {expiresAt && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">到期日期</span>
            <div className="flex items-center gap-2">
              {expiringSoon && (
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              )}
              <span className={`text-sm ${expiringSoon ? 'text-yellow-500 font-medium' : ''}`}>
                {format(new Date(expiresAt), 'yyyy/MM/dd', { locale: zhTW })}
              </span>
            </div>
          </div>
        )}

        {/* Days Remaining */}
        {currentStatus === 'active' || currentStatus === 'trial' ? (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">剩餘天數</span>
            <span className={`text-sm font-medium ${daysRemaining <= 7 ? 'text-yellow-500' : ''}`}>
              {daysRemaining} 天
            </span>
          </div>
        ) : null}

        {/* Started At */}
        {startedAt && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">開始日期</span>
            <span className="text-sm">
              {format(new Date(startedAt), 'yyyy/MM/dd', { locale: zhTW })}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => setDialogOpen(true)}
          >
            <CreditCard className="w-4 h-4 mr-1" />
            變更方案
          </Button>

          {(currentStatus === 'active' || currentStatus === 'trial') && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExtendSubscription(30)}
                disabled={isUpdating}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                +30天
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExtendSubscription(7)}
                disabled={isUpdating}
              >
                <Gift className="w-4 h-4 mr-1" />
                +7天
              </Button>
            </>
          )}

          {currentStatus === 'active' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelSubscription}
              disabled={isUpdating}
              className="text-destructive hover:text-destructive"
            >
              取消訂閱
            </Button>
          )}
        </div>
      </CardContent>

      {/* Change Plan Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>變更訂閱方案</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>選擇方案</Label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger>
                  <SelectValue placeholder="選擇訂閱方案" />
                </SelectTrigger>
                <SelectContent>
                  {SUBSCRIPTION_PLANS.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      <div className="flex items-center gap-2">
                        <span>{plan.name}</span>
                        {plan.price > 0 && (
                          <span className="text-muted-foreground">
                            ${plan.price}/{plan.duration_days}天
                          </span>
                        )}
                        {plan.is_popular && (
                          <Badge variant="default" className="text-xs">熱門</Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPlan && selectedPlan !== 'free' && (
              <>
                <div className="space-y-2">
                  <Label>自訂到期日（可選）</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="w-4 h-4 mr-2" />
                        {customExpiry 
                          ? format(customExpiry, 'yyyy/MM/dd', { locale: zhTW })
                          : '使用預設期限'
                        }
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={customExpiry}
                        onSelect={setCustomExpiry}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>自動續訂</Label>
                    <p className="text-xs text-muted-foreground">
                      到期時自動續訂相同方案
                    </p>
                  </div>
                  <Switch
                    checked={autoRenew}
                    onCheckedChange={setAutoRenew}
                  />
                </div>
              </>
            )}

            {/* Plan Features Preview */}
            {selectedPlan && (
              <div className="rounded-lg border p-3 bg-muted/30">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  方案權益
                </h4>
                <ul className="space-y-1">
                  {SUBSCRIPTION_PLANS.find(p => p.id === selectedPlan)?.features.map((feature, i) => (
                    <li key={i} className="text-sm flex items-center gap-2">
                      <Check className="w-3 h-3 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleUpdateSubscription} disabled={isUpdating || !selectedPlan}>
              {isUpdating ? "處理中..." : "確認變更"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
