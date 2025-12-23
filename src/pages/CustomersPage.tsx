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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { usePendingChanges } from "@/hooks/usePendingChanges";
import { HelperPendingChanges } from "@/components/HelperPendingChanges";
import { CustomerListSkeleton } from "@/components/CustomerCardSkeleton";
import { Plus, Search, User, Phone, Mail, Calendar, Pencil, Trash2, Shield, Sparkles, TrendingUp, FileText, X } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false);
  const [currentUserIsHelper, setCurrentUserIsHelper] = useState(false);

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

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone?.includes(searchQuery) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in" style={{ animationDelay: '150ms' }}>
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

          {/* Customer List */}
          {loading ? (
            <CustomerListSkeleton count={5} />
          ) : filteredCustomers.length > 0 ? (
            <div className="grid gap-4">
              {filteredCustomers.map((customer, index) => (
                <Card
                  key={customer.id}
                  className="p-6 hover:shadow-lg hover:bg-muted/30 transition-all duration-300 group animate-fade-in"
                  style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20 group-hover:shadow-lg">
                        <User className="w-6 h-6 text-primary transition-transform group-hover:scale-95" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                          {customer.name}
                        </h3>
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

                    <div className="flex gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
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
              ))}
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
    </div>
    </TooltipProvider>
  );
};

export default CustomersPage;