import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { usePendingChanges } from "@/hooks/usePendingChanges";
import { HelperPendingChanges } from "@/components/HelperPendingChanges";
import { CustomerListSkeleton } from "@/components/CustomerCardSkeleton";
import { CustomerDetailsSidebar } from "@/components/crm/CustomerDetailsSidebar";
import { CustomerTagBadge } from "@/components/crm/CustomerTagBadge";
import { useCustomerTags } from "@/hooks/useCRM";
import { Plus, Search, User, Phone, Mail, Calendar, Pencil, Trash2, Shield, Sparkles, TrendingUp, FileText, X, ChevronRight, Tag, Filter, CheckSquare, Square, Tags } from "lucide-react";

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

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerTagMap, setCustomerTagMap] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false);
  const [currentUserIsHelper, setCurrentUserIsHelper] = useState(false);
  
  // Batch selection state
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<Set<string>>(new Set());
  const [batchMode, setBatchMode] = useState(false);
  const [batchTagDialogOpen, setBatchTagDialogOpen] = useState(false);
  const [batchRemoveTagDialogOpen, setBatchRemoveTagDialogOpen] = useState(false);
  const [batchDeleteDialogOpen, setBatchDeleteDialogOpen] = useState(false);
  const [batchTagId, setBatchTagId] = useState<string>("");
  const [batchRemoveTagId, setBatchRemoveTagId] = useState<string>("");

  const { tags } = useCustomerTags();
  const { addDraftChange } = usePendingChanges();

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    birth_date: "",
    birth_time: "",
    phone: "",
    email: "",
    notes: "",
  });

  const fetchCurrentUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    if (roles) {
      const roleNames = roles.map(r => r.role);
      setCurrentUserIsAdmin(roleNames.includes("admin"));
      setCurrentUserIsHelper(roleNames.includes("helper") && !roleNames.includes("admin"));
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCustomers(data || []);

      // Fetch all tag assignments to build a map
      const { data: assignments } = await supabase
        .from("customer_tag_assignments")
        .select("customer_id, tag_id");

      if (assignments) {
        const tagMap: Record<string, string[]> = {};
        assignments.forEach((a) => {
          if (!tagMap[a.customer_id]) {
            tagMap[a.customer_id] = [];
          }
          tagMap[a.customer_id].push(a.tag_id);
        });
        setCustomerTagMap(tagMap);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast({
        title: "載入失敗",
        description: "無法載入客戶資料",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchCurrentUserRole();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    // Text search filter
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone?.includes(searchQuery) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase());

    // Tag filter - if no tags selected, show all; otherwise show customers with ALL selected tags
    const matchesTags =
      selectedTagIds.length === 0 ||
      selectedTagIds.every((tagId) => customerTagMap[c.id]?.includes(tagId));

    return matchesSearch && matchesTags;
  });

  const toggleTagFilter = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const clearTagFilters = () => {
    setSelectedTagIds([]);
  };

  // Batch selection functions
  const toggleCustomerSelection = (customerId: string) => {
    setSelectedCustomerIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(customerId)) {
        newSet.delete(customerId);
      } else {
        newSet.add(customerId);
      }
      return newSet;
    });
  };

  const selectAllFiltered = () => {
    setSelectedCustomerIds(new Set(filteredCustomers.map((c) => c.id)));
  };

  const clearSelection = () => {
    setSelectedCustomerIds(new Set());
    setBatchMode(false);
  };

  const handleBatchAddTag = async () => {
    if (!batchTagId || selectedCustomerIds.size === 0) return;

    try {
      const { data: user } = await supabase.auth.getUser();
      const customerIds = Array.from(selectedCustomerIds);
      
      // Get existing assignments to avoid duplicates
      const { data: existingAssignments } = await supabase
        .from("customer_tag_assignments")
        .select("customer_id")
        .eq("tag_id", batchTagId)
        .in("customer_id", customerIds);

      const existingCustomerIds = new Set(existingAssignments?.map((a) => a.customer_id) || []);
      const newAssignments = customerIds
        .filter((id) => !existingCustomerIds.has(id))
        .map((customerId) => ({
          customer_id: customerId,
          tag_id: batchTagId,
          assigned_by: user.user?.id,
        }));

      if (newAssignments.length > 0) {
        const { error } = await supabase.from("customer_tag_assignments").insert(newAssignments);
        if (error) throw error;
      }

      toast({
        title: "標籤已添加",
        description: `已為 ${newAssignments.length} 位客戶添加標籤（${existingCustomerIds.size} 位已有此標籤）`,
      });

      setBatchTagDialogOpen(false);
      setBatchTagId("");
      clearSelection();
      fetchCustomers();
    } catch (error: any) {
      console.error("Batch add tag error:", error);
      toast({
        title: "批量添加標籤失敗",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleBatchDelete = async () => {
    if (selectedCustomerIds.size === 0) return;

    try {
      const customerIds = Array.from(selectedCustomerIds);

      if (currentUserIsHelper && !currentUserIsAdmin) {
        // Helper needs approval
        for (const customerId of customerIds) {
          const customer = customers.find((c) => c.id === customerId);
          await addDraftChange({
            target_table: "customers",
            change_type: "delete",
            target_id: customerId,
            change_data: { id: customerId },
            notes: `刪除客戶「${customer?.name || customerId}」`,
          });
        }
        toast({
          title: "已加入待審核清單",
          description: `${customerIds.length} 位客戶的刪除將在管理員核准後生效`,
        });
      } else {
        const { error } = await supabase.from("customers").delete().in("id", customerIds);
        if (error) throw error;
        toast({
          title: "客戶已刪除",
          description: `已刪除 ${customerIds.length} 位客戶`,
        });
        fetchCustomers();
      }

      setBatchDeleteDialogOpen(false);
      clearSelection();
    } catch (error: any) {
      console.error("Batch delete error:", error);
      toast({
        title: "批量刪除失敗",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleBatchRemoveTag = async () => {
    if (!batchRemoveTagId || selectedCustomerIds.size === 0) return;

    try {
      const customerIds = Array.from(selectedCustomerIds);
      
      const { data: deletedAssignments, error } = await supabase
        .from("customer_tag_assignments")
        .delete()
        .eq("tag_id", batchRemoveTagId)
        .in("customer_id", customerIds)
        .select();

      if (error) throw error;

      const removedCount = deletedAssignments?.length || 0;

      toast({
        title: "標籤已移除",
        description: `已從 ${removedCount} 位客戶移除標籤`,
      });

      setBatchRemoveTagDialogOpen(false);
      setBatchRemoveTagId("");
      clearSelection();
      fetchCustomers();
    } catch (error: any) {
      console.error("Batch remove tag error:", error);
      toast({
        title: "批量移除標籤失敗",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openCreateDialog = () => {
    setEditingCustomer(null);
    setFormData({
      name: "",
      gender: "",
      birth_date: "",
      birth_time: "",
      phone: "",
      email: "",
      notes: "",
    });
    setDialogOpen(true);
  };

  const openEditDialog = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      gender: customer.gender || "",
      birth_date: customer.birth_date || "",
      birth_time: customer.birth_time || "",
      phone: customer.phone || "",
      email: customer.email || "",
      notes: customer.notes || "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "請輸入姓名",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        gender: formData.gender || null,
        birth_date: formData.birth_date || null,
        birth_time: formData.birth_time || null,
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
        notes: formData.notes.trim() || null,
      };

      // Helper needs approval for changes
      if (currentUserIsHelper && !currentUserIsAdmin) {
        if (editingCustomer) {
          await addDraftChange({
            target_table: "customers",
            change_type: "update",
            target_id: editingCustomer.id,
            change_data: payload,
            notes: `更新客戶「${payload.name}」的資料`,
          });
          toast({
            title: "已加入待審核清單",
            description: "變更將在管理員核准後生效",
          });
        } else {
          await addDraftChange({
            target_table: "customers",
            change_type: "create",
            change_data: payload,
            notes: `新增客戶「${payload.name}」`,
          });
          toast({
            title: "已加入待審核清單",
            description: "新增將在管理員核准後生效",
          });
        }
        setDialogOpen(false);
        return;
      }

      // Admin can directly modify
      if (editingCustomer) {
        const { error } = await supabase
          .from("customers")
          .update(payload)
          .eq("id", editingCustomer.id);

        if (error) throw error;

        toast({
          title: "客戶已更新",
        });
      } else {
        const { error } = await supabase.from("customers").insert([payload]);

        if (error) throw error;

        toast({
          title: "客戶已新增",
        });
      }

      setDialogOpen(false);
      fetchCustomers();
    } catch (error: any) {
      console.error("Save error:", error);
      toast({
        title: "儲存失敗",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string, customerName: string) => {
    try {
      // Helper needs approval for delete
      if (currentUserIsHelper && !currentUserIsAdmin) {
        await addDraftChange({
          target_table: "customers",
          change_type: "delete",
          target_id: id,
          change_data: { id },
          notes: `刪除客戶「${customerName}」`,
        });
        toast({
          title: "已加入待審核清單",
          description: "刪除將在管理員核准後生效",
        });
        return;
      }

      const { error } = await supabase.from("customers").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "客戶已刪除",
      });
      fetchCustomers();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast({
        title: "刪除失敗",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatGender = (gender: string | null) => {
    switch (gender) {
      case "male":
        return "男";
      case "female":
        return "女";
      case "other":
        return "其他";
      default:
        return "-";
    }
  };

  const formatDateTime = (date: string | null, time: string | null) => {
    if (!date) return "-";
    const dateStr = date;
    const timeStr = time ? ` ${time.substring(0, 5)}` : "";
    return dateStr + timeStr;
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 py-10">
          {/* Helper Mode Indicator */}
          {currentUserIsHelper && !currentUserIsAdmin && (
            <div className="mb-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="gap-1 animate-pulse">
                  <Shield className="w-3 h-3" />
                  小幫手模式
                </Badge>
                <span className="text-sm text-muted-foreground">
                  您的變更需要管理員核准後才會生效
                </span>
              </div>
              <HelperPendingChanges />
            </div>
          )}

          {/* Page Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-3 flex items-center gap-3">
              <div className="relative">
                <User className="w-8 h-8 text-primary" />
                <Sparkles className="w-3 h-3 text-primary absolute -top-1 -right-1 animate-pulse" />
              </div>
              客戶管理
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              共 <span className="font-semibold text-foreground">{customers.length}</span> 位客戶
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: '總客戶', value: customers.length, color: 'primary' },
              { label: '本月新增', value: customers.filter(c => new Date(c.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length, color: 'green-500' },
              { label: '有電話', value: customers.filter(c => c.phone).length, color: 'blue-500' },
              { label: '有Email', value: customers.filter(c => c.email).length, color: 'purple-500' },
            ].map((stat, index) => (
              <Card 
                key={stat.label} 
                className="p-4 bg-card/60 backdrop-blur hover:shadow-lg hover:scale-[1.02] transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${100 + index * 50}ms` }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </Card>
            ))}
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col gap-4 mb-8 animate-fade-in" style={{ animationDelay: '150ms' }}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-md group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="text"
                  placeholder="搜尋姓名、電話、Email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 transition-all focus:ring-2 focus:ring-primary/20"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={batchMode ? "secondary" : "outline"} 
                      onClick={() => {
                        setBatchMode(!batchMode);
                        if (batchMode) clearSelection();
                      }}
                      className="gap-2"
                    >
                      {batchMode ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                      批量操作
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>開啟批量選擇模式</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={openCreateDialog} className="gap-2 transition-all hover:scale-105">
                      <Plus className="w-4 h-4" />
                      新增客戶
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>新增一位新客戶</TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Batch Actions Bar */}
            {batchMode && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border animate-fade-in">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedCustomerIds.size === filteredCustomers.length && filteredCustomers.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) selectAllFiltered();
                      else setSelectedCustomerIds(new Set());
                    }}
                  />
                  <span className="text-sm text-muted-foreground">
                    已選 <span className="font-semibold text-foreground">{selectedCustomerIds.size}</span> / {filteredCustomers.length} 位客戶
                  </span>
                </div>
                <div className="flex-1" />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={selectedCustomerIds.size === 0}
                    onClick={() => setBatchTagDialogOpen(true)}
                    className="gap-1.5"
                  >
                    <Tags className="w-4 h-4" />
                    添加標籤
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={selectedCustomerIds.size === 0}
                    onClick={() => setBatchRemoveTagDialogOpen(true)}
                    className="gap-1.5"
                  >
                    <X className="w-4 h-4" />
                    移除標籤
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={selectedCustomerIds.size === 0}
                    onClick={() => setBatchDeleteDialogOpen(true)}
                    className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                    批量刪除
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSelection}
                  >
                    取消
                  </Button>
                </div>
              </div>
            )}

            {/* Tag Filters */}
            {tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Filter className="w-4 h-4" />
                  <span>標籤篩選：</span>
                </div>
                {tags.map((tag) => {
                  const isSelected = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      onClick={() => toggleTagFilter(tag.id)}
                      className={`
                        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                        transition-all duration-200 border
                        ${isSelected 
                          ? 'ring-2 ring-offset-1 ring-primary shadow-md scale-105' 
                          : 'hover:scale-102 hover:shadow-sm opacity-70 hover:opacity-100'
                        }
                      `}
                      style={{
                        backgroundColor: isSelected ? tag.color : `${tag.color}20`,
                        color: isSelected ? '#fff' : tag.color,
                        borderColor: tag.color,
                      }}
                    >
                      <Tag className="w-3 h-3" />
                      {tag.name}
                    </button>
                  );
                })}
                {selectedTagIds.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearTagFilters}
                    className="text-muted-foreground hover:text-foreground h-8"
                  >
                    <X className="w-3 h-3 mr-1" />
                    清除篩選
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Customer List */}
          {loading ? (
            <CustomerListSkeleton count={5} />
          ) : filteredCustomers.length > 0 ? (
            <div className="grid gap-4">
              {filteredCustomers.map((customer, index) => {
                const isSelected = selectedCustomerIds.has(customer.id);
                return (
                <Card
                  key={customer.id}
                  className={`p-6 hover:shadow-lg hover:bg-muted/30 transition-all duration-300 group animate-fade-in cursor-pointer ${
                    isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
                  onClick={() => {
                    if (batchMode) {
                      toggleCustomerSelection(customer.id);
                    } else {
                      setSelectedCustomer(customer);
                    }
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      {batchMode && (
                        <div onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleCustomerSelection(customer.id)}
                            className="h-5 w-5"
                          />
                        </div>
                      )}
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20 group-hover:shadow-lg">
                        <User className="w-6 h-6 text-primary transition-transform group-hover:scale-95" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                            {customer.name}
                          </h3>
                          {/* Customer Tags */}
                          {customerTagMap[customer.id]?.map((tagId) => {
                            const tag = tags.find((t) => t.id === tagId);
                            if (!tag) return null;
                            return (
                              <CustomerTagBadge
                                key={tagId}
                                name={tag.name}
                                color={tag.color}
                                size="sm"
                              />
                            );
                          })}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                          <Badge variant="outline" className="text-xs">
                            {formatGender(customer.gender)}
                          </Badge>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="flex items-center gap-1 cursor-help hover:text-primary transition-colors">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDateTime(customer.birth_date, customer.birth_time)}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>出生日期時間</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                      {customer.phone && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex items-center gap-1.5 cursor-help hover:text-primary transition-colors">
                              <Phone className="w-4 h-4" />
                              {customer.phone}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>點擊可複製電話</TooltipContent>
                        </Tooltip>
                      )}
                      {customer.email && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex items-center gap-1.5 cursor-help hover:text-primary transition-colors">
                              <Mail className="w-4 h-4" />
                              {customer.email}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>點擊可複製 Email</TooltipContent>
                        </Tooltip>
                      )}
                    </div>

                    <div className="flex gap-2 opacity-70 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setSelectedCustomer(customer)}
                            className="transition-all hover:border-primary hover:text-primary"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>查看詳情</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openEditDialog(customer)}
                            className="transition-all hover:border-primary hover:text-primary"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>編輯客戶資料</TooltipContent>
                      </Tooltip>
                      <AlertDialog>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                          </TooltipTrigger>
                          <TooltipContent>刪除客戶</TooltipContent>
                        </Tooltip>
                        <AlertDialogContent className="animate-scale-in">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <Trash2 className="w-5 h-5 text-destructive" />
                              確定要刪除嗎？
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              此操作無法復原。客戶「{customer.name}」將被永久刪除。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(customer.id, customer.name)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {currentUserIsHelper && !currentUserIsAdmin ? "送審刪除" : "刪除"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  {customer.notes && (
                    <div className="mt-4 pt-4 border-t border-border text-sm text-muted-foreground flex items-start gap-2">
                      <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {customer.notes}
                    </div>
                  )}
                </Card>
              );
              })}
            </div>
          ) : (
            <div className="text-center py-20 animate-fade-in">
              <div className="relative inline-block">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
                  <User className="w-10 h-10 text-muted-foreground" />
                </div>
                {searchQuery && (
                  <Search className="w-6 h-6 absolute -bottom-1 -right-1 text-muted-foreground" />
                )}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2 font-serif">
                {searchQuery ? "沒有找到符合的客戶" : "沒有找到客戶"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "嘗試其他搜尋關鍵字" : "新增您的第一位客戶"}
              </p>
              {searchQuery && (
                <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")}>
                  清除搜尋
                </Button>
              )}
            </div>
          )}
        </main>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCustomer ? "編輯客戶" : "新增客戶"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">姓名 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="輸入客戶姓名"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">性別</Label>
              <Select
                value={formData.gender}
                onValueChange={(v) => setFormData({ ...formData, gender: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="選擇性別" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">男</SelectItem>
                  <SelectItem value="female">女</SelectItem>
                  <SelectItem value="other">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birth_date">出生日期</Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) =>
                    setFormData({ ...formData, birth_date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birth_time">出生時間</Label>
                <Input
                  id="birth_time"
                  type="time"
                  value={formData.birth_time}
                  onChange={(e) =>
                    setFormData({ ...formData, birth_time: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">手機</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="0912-345-678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="example@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">備註</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="其他備註資訊..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>
              {editingCustomer ? "儲存" : "新增"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Customer Details Sidebar */}
      {selectedCustomer && (
        <CustomerDetailsSidebar
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}

      {/* Batch Add Tag Dialog */}
      <Dialog open={batchTagDialogOpen} onOpenChange={setBatchTagDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tags className="w-5 h-5" />
              批量添加標籤
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              為已選擇的 <span className="font-semibold text-foreground">{selectedCustomerIds.size}</span> 位客戶添加標籤
            </p>
            <Label>選擇標籤</Label>
            <Select value={batchTagId} onValueChange={setBatchTagId}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="選擇要添加的標籤" />
              </SelectTrigger>
              <SelectContent>
                {tags.map((tag) => (
                  <SelectItem key={tag.id} value={tag.id}>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      {tag.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBatchTagDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleBatchAddTag} disabled={!batchTagId}>
              添加標籤
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Batch Remove Tag Dialog */}
      <Dialog open={batchRemoveTagDialogOpen} onOpenChange={setBatchRemoveTagDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <X className="w-5 h-5" />
              批量移除標籤
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              從已選擇的 <span className="font-semibold text-foreground">{selectedCustomerIds.size}</span> 位客戶移除標籤
            </p>
            <Label>選擇標籤</Label>
            <Select value={batchRemoveTagId} onValueChange={setBatchRemoveTagId}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="選擇要移除的標籤" />
              </SelectTrigger>
              <SelectContent>
                {tags.map((tag) => (
                  <SelectItem key={tag.id} value={tag.id}>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      {tag.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBatchRemoveTagDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleBatchRemoveTag} disabled={!batchRemoveTagId} variant="destructive">
              移除標籤
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Batch Delete Confirmation Dialog */}
      <AlertDialog open={batchDeleteDialogOpen} onOpenChange={setBatchDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="w-5 h-5" />
              確認批量刪除
            </AlertDialogTitle>
            <AlertDialogDescription>
              確定要刪除已選擇的 <span className="font-semibold">{selectedCustomerIds.size}</span> 位客戶嗎？
              {currentUserIsHelper && !currentUserIsAdmin && (
                <span className="block mt-2 text-amber-600">
                  您的刪除請求將提交給管理員審核。
                </span>
              )}
              <span className="block mt-2 text-destructive">
                此操作無法撤銷，客戶的所有相關資料也將被刪除。
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBatchDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              確認刪除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </TooltipProvider>
  );
};

export default CustomersPage;