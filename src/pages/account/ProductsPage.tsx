import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProducts, useMyEntitlements } from "@/hooks/useEntitlements";
import { useMember } from "@/hooks/useMember";
import { Check, X, Clock, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";

const productLinks: Record<string, string> = {
  report_platform: '/member',
  story_builder_hub: 'https://story-builder-hub.lovable.app',
  seek_monster: 'https://seek-monster.lovable.app',
};

const statusConfig = {
  active: {
    label: '啟用中',
    icon: Check,
    color: 'bg-green-500',
  },
  expired: {
    label: '已過期',
    icon: Clock,
    color: 'bg-yellow-500',
  },
  revoked: {
    label: '已撤銷',
    icon: X,
    color: 'bg-red-500',
  },
  none: {
    label: '未開通',
    icon: X,
    color: 'bg-muted',
  },
};

export default function ProductsPage() {
  const navigate = useNavigate();
  const { user, loading: memberLoading } = useMember();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: entitlements = [], isLoading: entitlementsLoading } = useMyEntitlements();

  useEffect(() => {
    if (!memberLoading && !user) {
      navigate('/member/auth');
    }
  }, [user, memberLoading, navigate]);

  const isLoading = memberLoading || productsLoading || entitlementsLoading;

  const getEntitlement = (productId: string) => {
    return entitlements.find(e => e.product_id === productId);
  };

  const getStatus = (productId: string) => {
    const entitlement = getEntitlement(productId);
    if (!entitlement) return 'none';
    
    // Check if expired
    if (entitlement.ends_at && new Date(entitlement.ends_at) < new Date()) {
      return 'expired';
    }
    
    return entitlement.status;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">載入中...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-2">我的產品</h1>
          <p className="text-muted-foreground mb-8">查看您目前擁有的產品權限</p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const status = getStatus(product.id);
              const entitlement = getEntitlement(product.id);
              const config = statusConfig[status];
              const Icon = config.icon;
              const link = productLinks[product.id];

              return (
                <Card key={product.id} className="relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-1 ${config.color}`} />
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {product.description}
                        </CardDescription>
                      </div>
                      <Badge className={config.color}>
                        <Icon className="h-3 w-3 mr-1" />
                        {config.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {entitlement ? (
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>
                          開始日期：{format(new Date(entitlement.starts_at), 'yyyy/MM/dd', { locale: zhTW })}
                        </p>
                        <p>
                          到期日期：{entitlement.ends_at 
                            ? format(new Date(entitlement.ends_at), 'yyyy/MM/dd', { locale: zhTW })
                            : '永久有效'
                          }
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        您尚未開通此產品
                      </p>
                    )}
                    
                    {status === 'active' && link && (
                      <Button 
                        className="w-full mt-4" 
                        variant="outline"
                        onClick={() => {
                          if (link.startsWith('http')) {
                            window.open(link, '_blank');
                          } else {
                            navigate(link);
                          }
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        前往使用
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Button variant="ghost" onClick={() => navigate('/member')}>
              返回會員中心
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
