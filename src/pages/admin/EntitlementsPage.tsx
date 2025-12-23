import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  useProducts, 
  useAllEntitlements, 
  useCreateEntitlement,
  useUpdateEntitlement,
  useDeleteEntitlement,
  useSearchUsers 
} from "@/hooks/useEntitlements";
import { Search, Plus, Edit, Trash2, Key, RefreshCw, CheckSquare, UserPlus, ChevronDown, Bell, Package, ShoppingCart, Repeat, Users } from "lucide-react";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

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

const purchaseTypeLabels: Record<string, string> = {
  one_time: '單次購買',
  subscription: '訂閱制',
};

export default function EntitlementsPage() {
  const queryClient = useQueryClient();
  const [searchEmail, setSearchEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntitlement, setEditingEntitlement] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Batch operation dialog
  const [batchDialogOpen, setBatchDialogOpen] = useState(false);
  const [batchOperation, setBatchOperation] = useState<'extend' | 'revoke' | 'delete' | null>(null);
  const [extendDays, setExtendDays] = useState("30");
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [isSendingReminders, setIsSendingReminders] = useState(false);

  // Add member dialog
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberPassword, setNewMemberPassword] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  const [isCreatingMember, setIsCreatingMember] = useState(false);
  
  // Product management state
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productId, setProductId] = useState("");
  const [newProductId, setNewProductId] = useState(""); // For editing product ID
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPurchaseType, setProductPurchaseType] = useState<'one_time' | 'subscription'>('one_time');
  const [productPrice, setProductPrice] = useState("");
  const [productDuration, setProductDuration] = useState("");
  const [isProductSaving, setIsProductSaving] = useState(false);
  
  // Product entitlements detail sheet
  const [productEntitlementsSheetOpen, setProductEntitlementsSheetOpen] = useState(false);
  const [viewingProductId, setViewingProductId] = useState<string | null>(null);
  
  // Form state for entitlement
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [status, setStatus] = useState<'active' | 'expired' | 'revoked'>('active');
  const [endsAt, setEndsAt] = useState("");
  const [notes, setNotes] = useState("");
  
  const { data: products = [] } = useProducts();
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

  const getUserDisplay = (userId: string) => {
    const profile = profiles.find(p => p.user_id === userId);
    return profile?.display_name || userId.substring(0, 8) + '...';
  };

  const filteredEntitlements = entitlements.filter(e => {
    if (!searchEmail) return true;
    const userDisplay = getUserDisplay(e.user_id).toLowerCase();
    return userDisplay.includes(searchEmail.toLowerCase());
  });

  // Group entitlements by user for consolidated view
  const groupedByUser = filteredEntitlements.reduce((acc, ent) => {
    if (!acc[ent.user_id]) {
      acc[ent.user_id] = [];
    }
    acc[ent.user_id].push(ent);
    return acc;
  }, {} as Record<string, typeof filteredEntitlements>);

  const userEntitlementsList = Object.entries(groupedByUser).map(([userId, userEnts]) => ({
    userId,
    entitlements: userEnts,
    activeCount: userEnts.filter(e => e.status === 'active').length,
    totalCount: userEnts.length,
  }));

  const handleOpenDialog = (entitlement?: any) => {
    if (entitlement) {
      setEditingEntitlement(entitlement);
      setSelectedUserId(entitlement.user_id);
      setSelectedProductId(entitlement.product_id);
      setStatus(entitlement.status);
      setEndsAt(entitlement.ends_at ? format(new Date(entitlement.ends_at), 'yyyy-MM-dd') : "");
      setNotes(entitlement.notes || "");
    } else {
      setEditingEntitlement(null);
      setSelectedUserId("");
      setSelectedProductId("");
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

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredEntitlements.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredEntitlements.map(e => e.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Batch operations
  const handleBatchExtend = async () => {
    if (selectedIds.length === 0) return;
    
    setIsBatchProcessing(true);
    const days = parseInt(extendDays);
    
    try {
      for (const id of selectedIds) {
        const entitlement = entitlements.find(e => e.id === id);
        if (entitlement) {
          const currentEnds = entitlement.ends_at ? new Date(entitlement.ends_at) : new Date();
          const newEnds = new Date(currentEnds);
          newEnds.setDate(newEnds.getDate() + days);
          
          await supabase
            .from('entitlements')
            .update({ 
              ends_at: newEnds.toISOString(),
              status: 'active',
              updated_at: new Date().toISOString()
            })
            .eq('id', id);
        }
      }
      
      toast({ title: `已延長 ${selectedIds.length} 筆權限 ${days} 天` });
      queryClient.invalidateQueries({ queryKey: ['all-entitlements'] });
      setSelectedIds([]);
      setBatchDialogOpen(false);
    } catch (error) {
      toast({ title: "批次延長失敗", variant: "destructive" });
    }
    
    setIsBatchProcessing(false);
  };

  const handleBatchRevoke = async () => {
    if (selectedIds.length === 0) return;
    
    setIsBatchProcessing(true);
    
    try {
      const { error } = await supabase
        .from('entitlements')
        .update({ 
          status: 'revoked',
          updated_at: new Date().toISOString()
        })
        .in('id', selectedIds);
      
      if (error) throw error;
      
      toast({ title: `已撤銷 ${selectedIds.length} 筆權限` });
      queryClient.invalidateQueries({ queryKey: ['all-entitlements'] });
      setSelectedIds([]);
      setBatchDialogOpen(false);
    } catch (error) {
      toast({ title: "批次撤銷失敗", variant: "destructive" });
    }
    
    setIsBatchProcessing(false);
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    
    setIsBatchProcessing(true);
    
    try {
      const { error } = await supabase
        .from('entitlements')
        .delete()
        .in('id', selectedIds);
      
      if (error) throw error;
      
      toast({ title: `已刪除 ${selectedIds.length} 筆權限` });
      queryClient.invalidateQueries({ queryKey: ['all-entitlements'] });
      setSelectedIds([]);
      setBatchDialogOpen(false);
    } catch (error) {
      toast({ title: "批次刪除失敗", variant: "destructive" });
    }
    
    setIsBatchProcessing(false);
  };

  const openBatchDialog = (operation: 'extend' | 'revoke' | 'delete') => {
    setBatchOperation(operation);
    setBatchDialogOpen(true);
  };

  // Send reminder manually
  const handleSendReminders = async () => {
    setIsSendingReminders(true);
    try {
      const { data, error } = await supabase.functions.invoke('subscription-reminder');
      
      if (error) throw error;
      
      const result = data;
      toast({ 
        title: "提醒已發送", 
        description: `已處理 ${result?.entitlements?.expiring_count || 0} 筆即將到期權限，發送 ${result?.entitlements?.reminders_sent || 0} 封提醒` 
      });
    } catch (error: any) {
      console.error('Send reminders error:', error);
      toast({ title: "發送失敗", description: error.message, variant: "destructive" });
    }
    setIsSendingReminders(false);
  };

  // Add member handler
  const handleAddMember = async () => {
    if (!newMemberEmail || !newMemberPassword) {
      toast({ title: "請填寫電子郵件與密碼", variant: "destructive" });
      return;
    }

    setIsCreatingMember(true);
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newMemberEmail,
        password: newMemberPassword,
        options: {
          data: {
            display_name: newMemberName || newMemberEmail.split('@')[0],
          }
        }
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        await supabase
          .from('profiles')
          .upsert({
            user_id: authData.user.id,
            display_name: newMemberName || newMemberEmail.split('@')[0],
          });
        
        toast({ title: "會員已建立", description: "新會員可使用該電子郵件登入" });
        setAddMemberDialogOpen(false);
        setNewMemberEmail("");
        setNewMemberPassword("");
        setNewMemberName("");
        queryClient.invalidateQueries({ queryKey: ['all-profiles'] });
      }
    } catch (error: any) {
      console.error('Create member error:', error);
      toast({ 
        title: "建立失敗", 
        description: error.message || "請稍後再試",
        variant: "destructive" 
      });
    }
    
    setIsCreatingMember(false);
  };

  // Product management handlers
  const handleOpenProductDialog = (product?: any) => {
    if (product) {
      setEditingProduct(product);
      setProductId(product.id);
      setNewProductId(product.id); // Initialize with current ID
      setProductName(product.name);
      setProductDescription(product.description || "");
      setProductPurchaseType(product.purchase_type || 'one_time');
      setProductPrice(product.price?.toString() || "");
      setProductDuration(product.duration_days?.toString() || "");
    } else {
      setEditingProduct(null);
      setProductId("");
      setNewProductId("");
      setProductName("");
      setProductDescription("");
      setProductPurchaseType('one_time');
      setProductPrice("");
      setProductDuration("");
    }
    setProductDialogOpen(true);
  };

  // Product ID validation pattern: only English letters, numbers, and underscores
  const isValidProductId = (id: string) => /^[a-zA-Z0-9_]+$/.test(id);

  const handleSaveProduct = async () => {
    const targetId = editingProduct ? newProductId : productId;
    if (!targetId || !productName) {
      toast({ title: "請填寫產品 ID 與名稱", variant: "destructive" });
      return;
    }

    if (!isValidProductId(targetId)) {
      toast({ 
        title: "產品 ID 格式錯誤", 
        description: "產品 ID 只能包含英文字母、數字和底線",
        variant: "destructive" 
      });
      return;
    }

    // Check for duplicate product ID (only when creating new or changing ID)
    const isNewProduct = !editingProduct;
    const isChangingId = editingProduct && newProductId !== editingProduct.id;
    
    if (isNewProduct || isChangingId) {
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('id', targetId)
        .maybeSingle();
      
      if (existingProduct) {
        toast({ 
          title: "產品 ID 已存在", 
          description: `產品 ID「${targetId}」已被使用，請使用其他 ID`,
          variant: "destructive" 
        });
        return;
      }
    }

    setIsProductSaving(true);
    try {
      const productData = {
        name: productName,
        description: productDescription || null,
        purchase_type: productPurchaseType,
        price: productPrice ? parseFloat(productPrice) : null,
        duration_days: productPurchaseType === 'subscription' && productDuration ? parseInt(productDuration) : null,
        updated_at: new Date().toISOString(),
      };

      if (editingProduct) {
        // Check if product ID is being changed
        if (newProductId !== editingProduct.id) {
          // Need to create new product and migrate entitlements
          const { error: insertError } = await supabase
            .from('products')
            .insert({
              id: newProductId,
              ...productData,
            });
          
          if (insertError) throw insertError;

          // Update all entitlements to use new product ID
          const { error: updateEntError } = await supabase
            .from('entitlements')
            .update({ product_id: newProductId })
            .eq('product_id', editingProduct.id);
          
          if (updateEntError) {
            // Rollback: delete the new product
            await supabase.from('products').delete().eq('id', newProductId);
            throw updateEntError;
          }

          // Delete old product
          const { error: deleteError } = await supabase
            .from('products')
            .delete()
            .eq('id', editingProduct.id);
          
          if (deleteError) throw deleteError;
          
          toast({ title: "產品 ID 已更新", description: `${editingProduct.id} → ${newProductId}` });
        } else {
          // Just update the product without changing ID
          const { error } = await supabase
            .from('products')
            .update(productData)
            .eq('id', editingProduct.id);
          
          if (error) throw error;
          toast({ title: "產品已更新" });
        }
      } else {
        const { error } = await supabase
          .from('products')
          .insert({
            id: productId,
            ...productData,
          });
        
        if (error) throw error;
        toast({ title: "產品已建立" });
      }
      
      setProductDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['all-entitlements'] });
    } catch (error: any) {
      console.error('Save product error:', error);
      toast({ 
        title: "儲存失敗", 
        description: error.message || "請稍後再試",
        variant: "destructive" 
      });
    }
    setIsProductSaving(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('確定要刪除此產品？此操作將同時刪除相關的權限。')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "產品已刪除" });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error: any) {
      toast({ 
        title: "刪除失敗", 
        description: error.message || "可能還有相關的權限存在",
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-foreground">權限管理</h1>
          <div className="flex flex-wrap gap-2">
            {/* Send Reminders Button */}
            <Button 
              variant="outline" 
              onClick={handleSendReminders}
              disabled={isSendingReminders}
            >
              <Bell className="h-4 w-4 mr-2" />
              {isSendingReminders ? "發送中..." : "發送到期提醒"}
            </Button>
            
            {/* Add Member Button */}
            <Dialog open={addMemberDialogOpen} onOpenChange={setAddMemberDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <UserPlus className="h-4 w-4 mr-2" />
                  新增會員
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>手動新增會員</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>電子郵件 *</Label>
                    <Input
                      type="email"
                      placeholder="member@example.com"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>密碼 *</Label>
                    <Input
                      type="password"
                      placeholder="設定登入密碼"
                      value={newMemberPassword}
                      onChange={(e) => setNewMemberPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>顯示名稱（選填）</Label>
                    <Input
                      placeholder="會員暱稱"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setAddMemberDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleAddMember} disabled={isCreatingMember}>
                    {isCreatingMember ? "建立中..." : "建立會員"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Add Entitlement Button */}
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
                            <div className="flex items-center gap-2">
                              {product.name}
                              <Badge variant="outline" className="text-xs">
                                {purchaseTypeLabels[(product as any).purchase_type] || '單次購買'}
                              </Badge>
                            </div>
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
                    <Label>到期日（選填，留空為永久）</Label>
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
        </div>

        {/* Batch Operation Dialog */}
        <Dialog open={batchDialogOpen} onOpenChange={setBatchDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {batchOperation === 'extend' && '批次延長權限'}
                {batchOperation === 'revoke' && '批次撤銷權限'}
                {batchOperation === 'delete' && '批次刪除權限'}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-muted-foreground mb-4">
                已選擇 <span className="font-bold text-foreground">{selectedIds.length}</span> 筆權限
              </p>
              {batchOperation === 'extend' && (
                <div className="space-y-2">
                  <Label>延長天數</Label>
                  <Select value={extendDays} onValueChange={setExtendDays}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 天</SelectItem>
                      <SelectItem value="14">14 天</SelectItem>
                      <SelectItem value="30">30 天</SelectItem>
                      <SelectItem value="60">60 天</SelectItem>
                      <SelectItem value="90">90 天</SelectItem>
                      <SelectItem value="180">180 天</SelectItem>
                      <SelectItem value="365">365 天</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {batchOperation === 'revoke' && (
                <p className="text-destructive">
                  確定要撤銷所選的 {selectedIds.length} 筆權限嗎？此操作無法還原。
                </p>
              )}
              {batchOperation === 'delete' && (
                <p className="text-destructive font-medium">
                  ⚠️ 確定要永久刪除所選的 {selectedIds.length} 筆權限記錄嗎？此操作無法復原！
                </p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBatchDialogOpen(false)}>
                取消
              </Button>
              <Button 
                variant={batchOperation === 'revoke' || batchOperation === 'delete' ? 'destructive' : 'default'}
                onClick={
                  batchOperation === 'extend' ? handleBatchExtend : 
                  batchOperation === 'delete' ? handleBatchDelete :
                  handleBatchRevoke
                }
                disabled={isBatchProcessing}
              >
                {isBatchProcessing ? "處理中..." : 
                  batchOperation === 'extend' ? '確認延長' : 
                  batchOperation === 'delete' ? '確認刪除' :
                  '確認撤銷'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Tabs defaultValue="entitlements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-flex">
            <TabsTrigger value="entitlements" className="gap-2">
              <Key className="h-4 w-4" />
              權限列表
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" />
              產品管理
            </TabsTrigger>
          </TabsList>

          {/* Entitlements Tab */}
          <TabsContent value="entitlements">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜尋使用者..."
                      className="pl-10"
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                    />
                  </div>
                  
                  {/* Batch Actions */}
                  {selectedIds.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="px-3 py-1">
                        <CheckSquare className="h-3 w-3 mr-1" />
                        已選 {selectedIds.length} 筆
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            批次操作
                            <ChevronDown className="h-4 w-4 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openBatchDialog('extend')}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            批次延長
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => openBatchDialog('revoke')}
                            className="text-orange-600"
                          >
                            <Key className="h-4 w-4 mr-2" />
                            批次撤銷
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => openBatchDialog('delete')}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            批次刪除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedIds([])}
                      >
                        清除選擇
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-center py-8 text-muted-foreground">載入中...</p>
                ) : userEntitlementsList.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">尚無權限資料</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedIds.length === filteredEntitlements.length && filteredEntitlements.length > 0}
                            onCheckedChange={toggleSelectAll}
                          />
                        </TableHead>
                        <TableHead>使用者</TableHead>
                        <TableHead>擁有產品</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userEntitlementsList.map(({ userId, entitlements: userEnts }) => {
                        const allUserEntIds = userEnts.map(e => e.id);
                        const allSelected = allUserEntIds.every(id => selectedIds.includes(id));
                        const someSelected = allUserEntIds.some(id => selectedIds.includes(id));
                        
                        return (
                          <TableRow 
                            key={userId}
                            className={someSelected ? 'bg-muted/50' : ''}
                          >
                            <TableCell>
                              <Checkbox
                                checked={allSelected}
                                onCheckedChange={() => {
                                  if (allSelected) {
                                    setSelectedIds(prev => prev.filter(id => !allUserEntIds.includes(id)));
                                  } else {
                                    setSelectedIds(prev => [...new Set([...prev, ...allUserEntIds])]);
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <span>{getUserDisplay(userId)}</span>
                                <Badge variant="outline" className="text-xs">
                                  {userEnts.filter(e => e.status === 'active').length} 啟用
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1.5">
                                {userEnts.map(ent => (
                                  <Badge 
                                    key={ent.id}
                                    variant={ent.status === 'active' ? 'default' : ent.status === 'expired' ? 'secondary' : 'destructive'}
                                    className="gap-1 cursor-pointer hover:opacity-80"
                                    onClick={() => handleOpenDialog(ent)}
                                    title={`${statusLabels[ent.status]}${ent.ends_at ? ` · 到期: ${format(new Date(ent.ends_at), 'yyyy/MM/dd', { locale: zhTW })}` : ' · 永久'}`}
                                  >
                                    {getProductName(ent.product_id)}
                                    {ent.status !== 'active' && (
                                      <span className="text-[10px] opacity-70">
                                        ({statusLabels[ent.status]})
                                      </span>
                                    )}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    // Open add entitlement dialog for this user
                                    setEditingEntitlement(null);
                                    setSelectedUserId(userId);
                                    setSelectedProductId("");
                                    setStatus('active');
                                    setEndsAt("");
                                    setNotes("");
                                    setIsDialogOpen(true);
                                  }}
                                  title="新增產品權限"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                                {userEnts.some(e => e.status === 'active') && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      const activeEnts = userEnts.filter(e => e.status === 'active');
                                      activeEnts.forEach(ent => handleExtend(ent, 30));
                                    }}
                                    title="延長所有權限30天"
                                  >
                                    <RefreshCw className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>產品管理</CardTitle>
                    <CardDescription>管理系統中可授權的產品（訂閱或單次購買）</CardDescription>
                  </div>
                  <Button onClick={() => handleOpenProductDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    新增產品
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">尚無產品資料</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>產品 ID</TableHead>
                        <TableHead>名稱</TableHead>
                        <TableHead>類型</TableHead>
                        <TableHead>使用者數</TableHead>
                        <TableHead>價格</TableHead>
                        <TableHead>期限</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product: any) => {
                        const productEntitlements = entitlements.filter(e => e.product_id === product.id);
                        const activeCount = productEntitlements.filter(e => e.status === 'active').length;
                        const totalCount = productEntitlements.length;
                        
                        return (
                          <TableRow key={product.id}>
                            <TableCell>
                              <code className="text-xs bg-muted px-2 py-1 rounded">
                                {product.id}
                              </code>
                            </TableCell>
                            <TableCell className="font-medium">
                              <div>
                                <p>{product.name}</p>
                                {product.description && (
                                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                    {product.description}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="gap-1">
                                {product.purchase_type === 'subscription' ? (
                                  <>
                                    <Repeat className="h-3 w-3" />
                                    訂閱制
                                  </>
                                ) : (
                                  <>
                                    <ShoppingCart className="h-3 w-3" />
                                    單次購買
                                  </>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <button
                                onClick={() => {
                                  setViewingProductId(product.id);
                                  setProductEntitlementsSheetOpen(true);
                                }}
                                className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
                                title="點擊查看詳細權限列表"
                              >
                                <Badge variant="default" className="gap-1">
                                  <Users className="h-3 w-3" />
                                  {activeCount}
                                </Badge>
                                {totalCount > activeCount && (
                                  <span className="text-xs text-muted-foreground">
                                    / {totalCount} 總計
                                  </span>
                                )}
                              </button>
                            </TableCell>
                            <TableCell>
                              {product.price ? `NT$ ${product.price.toLocaleString()}` : '-'}
                            </TableCell>
                            <TableCell>
                              {product.purchase_type === 'subscription' && product.duration_days 
                                ? `${product.duration_days} 天` 
                                : '-'}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleOpenProductDialog(product)}
                                  title="編輯"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteProduct(product.id)}
                                  title="刪除"
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Product Dialog */}
        <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingProduct ? '編輯產品' : '新增產品'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>產品 ID *</Label>
                {editingProduct ? (
                  <>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded">{editingProduct.id}</code>
                      <span className="text-muted-foreground">→</span>
                      <Input
                        placeholder="新的產品 ID"
                        value={newProductId}
                        onChange={(e) => setNewProductId(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                        pattern="[a-zA-Z0-9_]+"
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      只能使用英文字母、數字和底線。修改會自動更新相關權限
                    </p>
                  </>
                ) : (
                  <>
                    <Input
                      placeholder="例如: report_platform"
                      value={productId}
                      onChange={(e) => setProductId(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                      pattern="[a-zA-Z0-9_]+"
                    />
                    <p className="text-xs text-muted-foreground">
                      只能使用英文字母、數字和底線，例如: yuanyi_divination
                    </p>
                  </>
                )}
              </div>
              <div className="space-y-2">
                <Label>名稱 *</Label>
                <Input
                  placeholder="產品名稱"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>購買類型</Label>
                <Select value={productPurchaseType} onValueChange={(v) => setProductPurchaseType(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one_time">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        單次購買
                      </div>
                    </SelectItem>
                    <SelectItem value="subscription">
                      <div className="flex items-center gap-2">
                        <Repeat className="h-4 w-4" />
                        訂閱制
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>價格 (TWD)</Label>
                  <Input
                    type="number"
                    placeholder="選填"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                  />
                </div>
                {productPurchaseType === 'subscription' && (
                  <div className="space-y-2">
                    <Label>訂閱週期（天）</Label>
                    <Input
                      type="number"
                      placeholder="例如: 30"
                      value={productDuration}
                      onChange={(e) => setProductDuration(e.target.value)}
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>描述（選填）</Label>
                <Textarea
                  placeholder="產品描述..."
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setProductDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleSaveProduct} disabled={isProductSaving || !productId || !productName}>
                {isProductSaving ? "儲存中..." : editingProduct ? "更新" : "建立"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Product Entitlements Detail Sheet */}
        <Sheet open={productEntitlementsSheetOpen} onOpenChange={setProductEntitlementsSheetOpen}>
          <SheetContent className="w-full sm:max-w-xl">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {viewingProductId ? getProductName(viewingProductId) : '產品權限'}
              </SheetTitle>
              <SheetDescription>
                {viewingProductId && (
                  <code className="text-xs bg-muted px-2 py-1 rounded">{viewingProductId}</code>
                )}
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-120px)] mt-4">
              {viewingProductId && (() => {
                const productEnts = entitlements.filter(e => e.product_id === viewingProductId);
                if (productEnts.length === 0) {
                  return (
                    <p className="text-center py-8 text-muted-foreground">
                      此產品尚無任何權限記錄
                    </p>
                  );
                }
                
                // Group by status
                const activeEnts = productEnts.filter(e => e.status === 'active');
                const expiredEnts = productEnts.filter(e => e.status === 'expired');
                const revokedEnts = productEnts.filter(e => e.status === 'revoked');
                
                return (
                  <div className="space-y-6">
                    {/* Summary */}
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="default" className="gap-1">
                        <Users className="h-3 w-3" />
                        啟用中: {activeEnts.length}
                      </Badge>
                      {expiredEnts.length > 0 && (
                        <Badge variant="secondary" className="gap-1">
                          已過期: {expiredEnts.length}
                        </Badge>
                      )}
                      {revokedEnts.length > 0 && (
                        <Badge variant="destructive" className="gap-1">
                          已撤銷: {revokedEnts.length}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Active Users */}
                    {activeEnts.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-green-600">啟用中</h4>
                        <div className="space-y-2">
                          {activeEnts.map(ent => (
                            <div 
                              key={ent.id} 
                              className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800"
                            >
                              <div>
                                <p className="font-medium">{getUserDisplay(ent.user_id)}</p>
                                {ent.ends_at && (
                                  <p className="text-xs text-muted-foreground">
                                    到期: {format(new Date(ent.ends_at), 'yyyy/MM/dd', { locale: zhTW })}
                                  </p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setProductEntitlementsSheetOpen(false);
                                  setEditingEntitlement(ent);
                                  setSelectedUserId(ent.user_id);
                                  setSelectedProductId(ent.product_id);
                                  setStatus(ent.status);
                                  setEndsAt(ent.ends_at ? ent.ends_at.split('T')[0] : '');
                                  setNotes(ent.notes || '');
                                  setIsDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Expired Users */}
                    {expiredEnts.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-yellow-600">已過期</h4>
                        <div className="space-y-2">
                          {expiredEnts.map(ent => (
                            <div 
                              key={ent.id} 
                              className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
                            >
                              <div>
                                <p className="font-medium">{getUserDisplay(ent.user_id)}</p>
                                {ent.ends_at && (
                                  <p className="text-xs text-muted-foreground">
                                    過期於: {format(new Date(ent.ends_at), 'yyyy/MM/dd', { locale: zhTW })}
                                  </p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setProductEntitlementsSheetOpen(false);
                                  setEditingEntitlement(ent);
                                  setSelectedUserId(ent.user_id);
                                  setSelectedProductId(ent.product_id);
                                  setStatus(ent.status);
                                  setEndsAt(ent.ends_at ? ent.ends_at.split('T')[0] : '');
                                  setNotes(ent.notes || '');
                                  setIsDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Revoked Users */}
                    {revokedEnts.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-red-600">已撤銷</h4>
                        <div className="space-y-2">
                          {revokedEnts.map(ent => (
                            <div 
                              key={ent.id} 
                              className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800"
                            >
                              <div>
                                <p className="font-medium">{getUserDisplay(ent.user_id)}</p>
                                {ent.notes && (
                                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                    {ent.notes}
                                  </p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setProductEntitlementsSheetOpen(false);
                                  setEditingEntitlement(ent);
                                  setSelectedUserId(ent.user_id);
                                  setSelectedProductId(ent.product_id);
                                  setStatus(ent.status);
                                  setEndsAt(ent.ends_at ? ent.ends_at.split('T')[0] : '');
                                  setNotes(ent.notes || '');
                                  setIsDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </main>
    </div>
  );
}
