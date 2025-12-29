import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Plus, Copy, Trash2, Eye, EyeOff, RefreshCw, Pencil, Shield, ExternalLink, Globe } from "lucide-react";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";

interface OAuthClient {
  id: string;
  client_id: string;
  name: string;
  description: string | null;
  redirect_uris: string[];
  allowed_products: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: string;
  name: string;
}

export default function OAuthClientsPage() {
  const [clients, setClients] = useState<OAuthClient[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<OAuthClient | null>(null);
  
  // Form states
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formRedirectUris, setFormRedirectUris] = useState("");
  const [formAllowedProducts, setFormAllowedProducts] = useState<string[]>([]);
  const [formIsActive, setFormIsActive] = useState(true);
  
  const [submitting, setSubmitting] = useState(false);
  const [generatedSecret, setGeneratedSecret] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    fetchClients();
    fetchProducts();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("oauth_clients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("載入 OAuth 客戶端失敗");
      console.error(error);
    } else {
      setClients(data || []);
    }
    setLoading(false);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("id, name")
      .order("name");

    if (!error && data) {
      setProducts(data);
    }
  };

  const generateRandomString = (length: number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateClientId = () => {
    return `client_${generateRandomString(16)}`;
  };

  const generateClientSecret = () => {
    return `secret_${generateRandomString(32)}`;
  };

  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setFormRedirectUris("");
    setFormAllowedProducts([]);
    setFormIsActive(true);
    setGeneratedSecret(null);
    setShowSecret(false);
  };

  const handleCreate = async () => {
    if (!formName.trim()) {
      toast.error("請輸入客戶端名稱");
      return;
    }

    const uris = formRedirectUris.split("\n").map(s => s.trim()).filter(Boolean);
    if (uris.length === 0) {
      toast.error("請輸入至少一個重定向網址");
      return;
    }

    // Validate URIs
    for (const uri of uris) {
      try {
        new URL(uri);
      } catch {
        toast.error(`無效的網址: ${uri}`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const clientId = generateClientId();
      const clientSecret = generateClientSecret();

      // Hash the secret
      const { data: hashedSecret, error: hashError } = await supabase
        .rpc('hash_oauth_secret', { secret: clientSecret });

      if (hashError) throw hashError;

      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("oauth_clients")
        .insert({
          client_id: clientId,
          client_secret_hash: hashedSecret,
          name: formName.trim(),
          description: formDescription.trim() || null,
          redirect_uris: uris,
          allowed_products: formAllowedProducts,
          is_active: formIsActive,
          created_by: user?.id,
        });

      if (error) throw error;

      setGeneratedSecret(clientSecret);
      setShowSecret(true);
      toast.success("OAuth 客戶端已建立");
      fetchClients();
    } catch (error) {
      console.error(error);
      toast.error("建立 OAuth 客戶端失敗");
    }
    setSubmitting(false);
  };

  const handleEdit = (client: OAuthClient) => {
    setEditingClient(client);
    setFormName(client.name);
    setFormDescription(client.description || "");
    setFormRedirectUris(client.redirect_uris.join("\n"));
    setFormAllowedProducts(client.allowed_products || []);
    setFormIsActive(client.is_active);
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingClient) return;
    
    if (!formName.trim()) {
      toast.error("請輸入客戶端名稱");
      return;
    }

    const uris = formRedirectUris.split("\n").map(s => s.trim()).filter(Boolean);
    if (uris.length === 0) {
      toast.error("請輸入至少一個重定向網址");
      return;
    }

    for (const uri of uris) {
      try {
        new URL(uri);
      } catch {
        toast.error(`無效的網址: ${uri}`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("oauth_clients")
        .update({
          name: formName.trim(),
          description: formDescription.trim() || null,
          redirect_uris: uris,
          allowed_products: formAllowedProducts,
          is_active: formIsActive,
        })
        .eq("id", editingClient.id);

      if (error) throw error;

      toast.success("已更新");
      setEditDialogOpen(false);
      setEditingClient(null);
      resetForm();
      fetchClients();
    } catch (error) {
      console.error(error);
      toast.error("更新失敗");
    }
    setSubmitting(false);
  };

  const handleDelete = async (client: OAuthClient) => {
    if (!confirm(`確定要刪除 "${client.name}" 嗎？此操作無法復原，所有使用此客戶端的應用將無法登入。`)) return;

    const { error } = await supabase
      .from("oauth_clients")
      .delete()
      .eq("id", client.id);

    if (error) {
      toast.error("刪除失敗");
    } else {
      toast.success("已刪除");
      fetchClients();
    }
  };

  const handleToggleActive = async (client: OAuthClient) => {
    const { error } = await supabase
      .from("oauth_clients")
      .update({ is_active: !client.is_active })
      .eq("id", client.id);

    if (error) {
      toast.error("更新失敗");
    } else {
      toast.success(client.is_active ? "已停用" : "已啟用");
      fetchClients();
    }
  };

  const handleCopySecret = () => {
    if (generatedSecret) {
      navigator.clipboard.writeText(generatedSecret);
      toast.success("已複製到剪貼簿");
    }
  };

  const handleCopyClientId = (clientId: string) => {
    navigator.clipboard.writeText(clientId);
    toast.success("已複製 Client ID");
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
    resetForm();
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingClient(null);
    resetForm();
  };

  const activeClients = clients.filter(c => c.is_active).length;

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OAuth 客戶端</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">
              已註冊的應用程式
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">啟用中</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeClients}</div>
            <p className="text-xs text-muted-foreground">
              可進行 OAuth 授權
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已停用</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{clients.length - activeClients}</div>
            <p className="text-xs text-muted-foreground">
              暫停服務中
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>OAuth 客戶端管理</CardTitle>
            <CardDescription>
              管理可使用 OAuth 授權流程的外部應用程式
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={fetchClients}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  新增客戶端
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>新增 OAuth 客戶端</DialogTitle>
                  <DialogDescription>
                    建立一個新的 OAuth 客戶端供外部應用程式使用
                  </DialogDescription>
                </DialogHeader>

                {generatedSecret ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg dark:bg-amber-950/20 dark:border-amber-800">
                      <p className="text-sm text-amber-800 dark:text-amber-200 font-medium mb-2">
                        ⚠️ 請立即複製 Client Secret，關閉後將無法再次查看
                      </p>
                      <div className="flex items-center gap-2">
                        <Input
                          type={showSecret ? "text" : "password"}
                          value={generatedSecret}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setShowSecret(!showSecret)}
                        >
                          {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleCopySecret}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCloseCreateDialog}>完成</Button>
                    </DialogFooter>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                      <div>
                        <Label htmlFor="name">名稱 *</Label>
                        <Input
                          id="name"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="例如：元壹卜卦系統"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">描述</Label>
                        <Textarea
                          id="description"
                          value={formDescription}
                          onChange={(e) => setFormDescription(e.target.value)}
                          placeholder="選填，說明此客戶端的用途"
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="redirectUris">
                          重定向網址 *
                          <span className="text-xs text-muted-foreground ml-2">（每行一個）</span>
                        </Label>
                        <Textarea
                          id="redirectUris"
                          value={formRedirectUris}
                          onChange={(e) => setFormRedirectUris(e.target.value)}
                          placeholder="https://your-app.com/callback&#10;https://localhost:3000/callback"
                          rows={3}
                          className="font-mono text-sm"
                        />
                      </div>
                      <div>
                        <Label>允許的產品</Label>
                        <div className="mt-2 space-y-2 p-3 border rounded-lg bg-muted/30">
                          {products.map((product) => (
                            <div key={product.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`product-${product.id}`}
                                checked={formAllowedProducts.includes(product.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setFormAllowedProducts([...formAllowedProducts, product.id]);
                                  } else {
                                    setFormAllowedProducts(formAllowedProducts.filter(id => id !== product.id));
                                  }
                                }}
                              />
                              <label
                                htmlFor={`product-${product.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {product.name}
                              </label>
                            </div>
                          ))}
                          {products.length === 0 && (
                            <p className="text-sm text-muted-foreground">尚無產品</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isActive"
                          checked={formIsActive}
                          onCheckedChange={setFormIsActive}
                        />
                        <Label htmlFor="isActive">立即啟用</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={handleCloseCreateDialog}>
                        取消
                      </Button>
                      <Button onClick={handleCreate} disabled={submitting}>
                        {submitting ? "建立中..." : "建立"}
                      </Button>
                    </DialogFooter>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">載入中...</div>
          ) : clients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              尚未建立任何 OAuth 客戶端
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>名稱</TableHead>
                    <TableHead>Client ID</TableHead>
                    <TableHead>重定向網址</TableHead>
                    <TableHead>產品權限</TableHead>
                    <TableHead>狀態</TableHead>
                    <TableHead>建立時間</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div>
                          <span className="font-medium">{client.name}</span>
                          {client.description && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {client.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {client.client_id.substring(0, 20)}...
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleCopyClientId(client.client_id)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {client.redirect_uris.slice(0, 2).map((uri, i) => (
                            <Badge key={i} variant="outline" className="text-xs font-mono truncate max-w-[150px]">
                              {new URL(uri).hostname}
                            </Badge>
                          ))}
                          {client.redirect_uris.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{client.redirect_uris.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {client.allowed_products.length === 0 ? (
                            <span className="text-xs text-muted-foreground">無限制</span>
                          ) : (
                            client.allowed_products.slice(0, 2).map((productId) => {
                              const product = products.find(p => p.id === productId);
                              return (
                                <Badge key={productId} variant="secondary" className="text-xs">
                                  {product?.name || productId}
                                </Badge>
                              );
                            })
                          )}
                          {client.allowed_products.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{client.allowed_products.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={client.is_active ? "default" : "secondary"}>
                          {client.is_active ? "啟用" : "停用"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(client.created_at), "yyyy/MM/dd", { locale: zhTW })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(client)}
                            title="編輯"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleActive(client)}
                            title={client.is_active ? "停用" : "啟用"}
                          >
                            {client.is_active ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(client)}
                            className="text-destructive hover:text-destructive"
                            title="刪除"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>編輯 OAuth 客戶端</DialogTitle>
            <DialogDescription>
              修改客戶端設定（Client ID 和 Secret 無法更改）
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {editingClient && (
              <div className="p-3 bg-muted rounded-lg">
                <Label className="text-xs text-muted-foreground">Client ID</Label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-sm font-mono">{editingClient.client_id}</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleCopyClientId(editingClient.client_id)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="edit-name">名稱 *</Label>
              <Input
                id="edit-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">描述</Label>
              <Textarea
                id="edit-description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="edit-redirectUris">
                重定向網址 *
                <span className="text-xs text-muted-foreground ml-2">（每行一個）</span>
              </Label>
              <Textarea
                id="edit-redirectUris"
                value={formRedirectUris}
                onChange={(e) => setFormRedirectUris(e.target.value)}
                rows={3}
                className="font-mono text-sm"
              />
            </div>
            <div>
              <Label>允許的產品</Label>
              <div className="mt-2 space-y-2 p-3 border rounded-lg bg-muted/30">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-product-${product.id}`}
                      checked={formAllowedProducts.includes(product.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormAllowedProducts([...formAllowedProducts, product.id]);
                        } else {
                          setFormAllowedProducts(formAllowedProducts.filter(id => id !== product.id));
                        }
                      }}
                    />
                    <label
                      htmlFor={`edit-product-${product.id}`}
                      className="text-sm font-medium leading-none"
                    >
                      {product.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formIsActive}
                onCheckedChange={setFormIsActive}
              />
              <Label htmlFor="edit-isActive">啟用</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseEditDialog}>
              取消
            </Button>
            <Button onClick={handleUpdate} disabled={submitting}>
              {submitting ? "更新中..." : "更新"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}