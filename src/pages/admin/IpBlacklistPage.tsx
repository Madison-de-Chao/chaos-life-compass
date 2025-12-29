import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { Shield, ShieldOff, Plus, Trash2, Ban } from "lucide-react";
import { Header } from "@/components/Header";

interface IpBlacklistEntry {
  id: string;
  ip_address: string;
  reason: string | null;
  blocked_by: string | null;
  blocked_at: string;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export default function IpBlacklistPage() {
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newIp, setNewIp] = useState("");
  const [newReason, setNewReason] = useState("");
  const [newExpiry, setNewExpiry] = useState("");

  const { data: blacklist, isLoading } = useQuery({
    queryKey: ["ip-blacklist"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ip_blacklist")
        .select("*")
        .order("blocked_at", { ascending: false });

      if (error) throw error;
      return data as IpBlacklistEntry[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async ({
      ip_address,
      reason,
      expires_at,
    }: {
      ip_address: string;
      reason?: string;
      expires_at?: string;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from("ip_blacklist").insert({
        ip_address,
        reason: reason || null,
        expires_at: expires_at || null,
        blocked_by: user?.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ip-blacklist"] });
      toast.success("IP 已加入黑名單");
      setIsAddOpen(false);
      setNewIp("");
      setNewReason("");
      setNewExpiry("");
    },
    onError: (error: Error) => {
      if (error.message.includes("duplicate")) {
        toast.error("此 IP 已在黑名單中");
      } else {
        toast.error("新增失敗：" + error.message);
      }
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("ip_blacklist")
        .update({ is_active })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ip-blacklist"] });
      toast.success("狀態已更新");
    },
    onError: (error: Error) => {
      toast.error("更新失敗：" + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ip_blacklist").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ip-blacklist"] });
      toast.success("已從黑名單移除");
    },
    onError: (error: Error) => {
      toast.error("刪除失敗：" + error.message);
    },
  });

  const handleAdd = () => {
    if (!newIp.trim()) {
      toast.error("請輸入 IP 地址");
      return;
    }

    // Basic IP validation
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(newIp.trim())) {
      toast.error("請輸入有效的 IP 地址格式");
      return;
    }

    addMutation.mutate({
      ip_address: newIp.trim(),
      reason: newReason.trim() || undefined,
      expires_at: newExpiry || undefined,
    });
  };

  const activeCount = blacklist?.filter((item) => item.is_active).length || 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Ban className="h-8 w-8 text-destructive" />
            <div>
              <h1 className="text-2xl font-bold">IP 黑名單管理</h1>
              <p className="text-muted-foreground">
                目前有 {activeCount} 個 IP 被封鎖
              </p>
            </div>
          </div>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                新增 IP
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新增 IP 到黑名單</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="ip">IP 地址</Label>
                  <Input
                    id="ip"
                    placeholder="例如：192.168.1.1"
                    value={newIp}
                    onChange={(e) => setNewIp(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">封鎖原因（選填）</Label>
                  <Textarea
                    id="reason"
                    placeholder="例如：多次密碼暴力破解嘗試"
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry">到期時間（選填，留空為永久）</Label>
                  <Input
                    id="expiry"
                    type="datetime-local"
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  取消
                </Button>
                <Button
                  onClick={handleAdd}
                  disabled={addMutation.isPending}
                >
                  {addMutation.isPending ? "新增中..." : "新增"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>IP 地址</TableHead>
                <TableHead>封鎖原因</TableHead>
                <TableHead>封鎖時間</TableHead>
                <TableHead>到期時間</TableHead>
                <TableHead>狀態</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    載入中...
                  </TableCell>
                </TableRow>
              ) : !blacklist?.length ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    目前沒有封鎖的 IP
                  </TableCell>
                </TableRow>
              ) : (
                blacklist.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-mono font-medium">
                      {entry.ip_address}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {entry.reason || "-"}
                    </TableCell>
                    <TableCell>
                      {format(new Date(entry.blocked_at), "yyyy/MM/dd HH:mm", {
                        locale: zhTW,
                      })}
                    </TableCell>
                    <TableCell>
                      {entry.expires_at
                        ? format(new Date(entry.expires_at), "yyyy/MM/dd HH:mm", {
                            locale: zhTW,
                          })
                        : "永久"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={entry.is_active}
                          onCheckedChange={(checked) =>
                            toggleMutation.mutate({ id: entry.id, is_active: checked })
                          }
                        />
                        <Badge variant={entry.is_active ? "destructive" : "secondary"}>
                          {entry.is_active ? (
                            <>
                              <Shield className="h-3 w-3 mr-1" />
                              封鎖中
                            </>
                          ) : (
                            <>
                              <ShieldOff className="h-3 w-3 mr-1" />
                              已停用
                            </>
                          )}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(entry.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
