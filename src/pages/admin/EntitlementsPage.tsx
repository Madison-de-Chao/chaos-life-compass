import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  useProducts, 
  usePlans, 
  useAllEntitlements, 
  useCreateEntitlement,
  useUpdateEntitlement,
  useDeleteEntitlement,
  useSearchUsers 
} from "@/hooks/useEntitlements";
import { Search, Plus, Edit, Trash2, Key, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const statusLabels: Record<string, string> = {
  active: '啟用中',
  expired: '已過期',
  revoked: '已撤銷',
};

const statusColors: Record<string, string> = {
  active: 'bg-green-500',
  expired: 'bg-yellow-500',
  revoked: 'bg-red-500',
};

export default function EntitlementsPage() {
  const [searchEmail, setSearchEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntitlement, setEditingEntitlement] = useState<any>(null);
  
  // Form state
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [status, setStatus] = useState<'active' | 'expired' | 'revoked'>('active');
  const [endsAt, setEndsAt] = useState("");
  const [notes, setNotes] = useState("");
  
  const { data: products = [] } = useProducts();
  const { data: plans = [] } = usePlans();
  const { data: entitlements = [], isLoading } = useAllEntitlements();
  const { data: searchResults = [] } = useSearchUsers(searchEmail);
  const createEntitlement = useCreateEntitlement();
  const updateEntitlement = useUpdateEntitlement();
  const deleteEntitlement = useDeleteEntitlement();

  // Get all profiles for display
  const { data: profiles = [] } = useQuery({
    queryKey: ['all-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, display_name');
      if (error) throw error;
      return data;
    },
  });

  const getProductName = (productId: string) => {
    return products.find(p => p.id === productId)?.name || productId;
  };

  const getPlanName = (planId: string | null) => {
    if (!planId) return '-';
    return plans.find(p => p.id === planId)?.name || planId;
  };

  const getUserDisplay = (userId: string) => {
    const profile = profiles.find(p => p.user_id === userId);
    return profile?.display_name || userId.substring(0, 8) + '...';
  };

  const filteredEntitlements = entitlements.filter(e => {
    if (!searchEmail) return true;
    const userDisplay = getUserDisplay(e.user_id).toLowerCase();
    return userDisplay.includes(searchEmail.toLowerCase());
  });

  const handleOpenDialog = (entitlement?: any) => {
    if (entitlement) {
      setEditingEntitlement(entitlement);
      setSelectedUserId(entitlement.user_id);
      setSelectedProductId(entitlement.product_id);
      setSelectedPlanId(entitlement.plan_id || "");
      setStatus(entitlement.status);
      setEndsAt(entitlement.ends_at ? format(new Date(entitlement.ends_at), 'yyyy-MM-dd') : "");
      setNotes(entitlement.notes || "");
    } else {
      setEditingEntitlement(null);
      setSelectedUserId("");
      setSelectedProductId("");
      setSelectedPlanId("");
      setStatus('active');
      setEndsAt("");
      setNotes("");
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!selectedUserId || !selectedProductId) return;

    const entitlementData = {
      user_id: selectedUserId,
      product_id: selectedProductId,
      plan_id: selectedPlanId || undefined,
      status,
      ends_at: endsAt ? new Date(endsAt).toISOString() : null,
      notes: notes || undefined,
    };

    if (editingEntitlement) {
      await updateEntitlement.mutateAsync({ id: editingEntitlement.id, ...entitlementData });
    } else {
      await createEntitlement.mutateAsync(entitlementData);
    }
    
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('確定要刪除此權限？')) {
      await deleteEntitlement.mutateAsync(id);
    }
  };

  const handleRevoke = async (entitlement: any) => {
    await updateEntitlement.mutateAsync({ 
      id: entitlement.id, 
      status: 'revoked' 
    });
  };

  const handleExtend = async (entitlement: any, days: number) => {
    const currentEnds = entitlement.ends_at ? new Date(entitlement.ends_at) : new Date();
    const newEnds = new Date(currentEnds);
    newEnds.setDate(newEnds.getDate() + days);
    
    await updateEntitlement.mutateAsync({ 
      id: entitlement.id, 
      ends_at: newEnds.toISOString(),
      status: 'active'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">權限管理</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                新增權限
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingEntitlement ? '編輯權限' : '新增權限'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>使用者</Label>
                  <Input
                    placeholder="搜尋使用者..."
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                  />
                  {searchResults.length > 0 && (
                    <div className="border rounded-md max-h-32 overflow-y-auto">
                      {searchResults.map((user) => (
                        <button
                          key={user.user_id}
                          className="w-full text-left px-3 py-2 hover:bg-muted text-sm"
                          onClick={() => {
                            setSelectedUserId(user.user_id);
                            setSearchEmail(user.display_name || '');
                          }}
                        >
                          {user.display_name}
                        </button>
                      ))}
                    </div>
                  )}
                  {selectedUserId && (
                    <p className="text-xs text-muted-foreground">
                      已選擇: {getUserDisplay(selectedUserId)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>產品</Label>
                  <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇產品" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>方案（選填）</Label>
                  <Select value={selectedPlanId || "none"} onValueChange={(v) => setSelectedPlanId(v === "none" ? "" : v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇方案" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">無</SelectItem>
                      {plans
                        .filter(p => p.product_id === selectedProductId)
                        .map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>狀態</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">啟用中</SelectItem>
                      <SelectItem value="expired">已過期</SelectItem>
                      <SelectItem value="revoked">已撤銷</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>到期日（選填）</Label>
                  <Input
                    type="date"
                    value={endsAt}
                    onChange={(e) => setEndsAt(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>備註（選填）</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="備註..."
                  />
                </div>

                <Button 
                  onClick={handleSubmit} 
                  className="w-full"
                  disabled={!selectedUserId || !selectedProductId}
                >
                  {editingEntitlement ? '更新' : '新增'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜尋使用者..."
                  className="pl-10"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center py-8 text-muted-foreground">載入中...</p>
            ) : filteredEntitlements.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">尚無權限資料</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>使用者</TableHead>
                    <TableHead>產品</TableHead>
                    <TableHead>方案</TableHead>
                    <TableHead>狀態</TableHead>
                    <TableHead>開始日期</TableHead>
                    <TableHead>到期日期</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntitlements.map((entitlement) => (
                    <TableRow key={entitlement.id}>
                      <TableCell className="font-medium">
                        {getUserDisplay(entitlement.user_id)}
                      </TableCell>
                      <TableCell>{getProductName(entitlement.product_id)}</TableCell>
                      <TableCell>{getPlanName(entitlement.plan_id)}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[entitlement.status]}>
                          {statusLabels[entitlement.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(entitlement.starts_at), 'yyyy/MM/dd', { locale: zhTW })}
                      </TableCell>
                      <TableCell>
                        {entitlement.ends_at 
                          ? format(new Date(entitlement.ends_at), 'yyyy/MM/dd', { locale: zhTW })
                          : '永久'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(entitlement)}
                            title="編輯"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleExtend(entitlement, 30)}
                            title="延長30天"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          {entitlement.status === 'active' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRevoke(entitlement)}
                              title="撤銷"
                            >
                              <Key className="h-4 w-4 text-orange-500" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(entitlement.id)}
                            title="刪除"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
