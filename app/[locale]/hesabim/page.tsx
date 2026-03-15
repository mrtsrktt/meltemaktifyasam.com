"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Package,
  LogIn,
  LogOut,
  Mail,
  Lock,
  Phone,
  Loader2,
  Check,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { Profile } from "@/lib/supabase/types";

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  order_items: { product_name: string; quantity: number; unit_price: number }[];
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Beklemede", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Onaylandı", color: "bg-blue-100 text-blue-700" },
  shipped: { label: "Kargoda", color: "bg-purple-100 text-purple-700" },
  delivered: { label: "Teslim Edildi", color: "bg-green-100 text-green-700" },
  cancelled: { label: "İptal", color: "bg-red-100 text-red-700" },
};

export default function AccountPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Profile edit
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        setUser(currentUser);
        await fetchProfile(currentUser.id);
        await fetchOrders(currentUser.id);
      }
      setLoading(false);
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
        fetchOrders(session.user.id);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
        setOrders([]);
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (data) {
      setProfile(data);
      setEditName(data.full_name || "");
      setEditPhone(data.phone || "");
    }
  };

  const fetchOrders = async (userId: string) => {
    const { data } = await supabase
      .from("orders")
      .select("id, status, total_amount, created_at, order_items(product_name, quantity, unit_price)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (data) setOrders(data as Order[]);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAuthLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "E-posta veya şifre hatalı."
          : authError.message
      );
    }
    setAuthLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setAuthLoading(true);

    if (regPassword.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      setAuthLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signUp({
      email: regEmail,
      password: regPassword,
      options: {
        data: {
          full_name: regName,
          phone: regPhone,
        },
      },
    });

    if (authError) {
      if (authError.message.includes("already registered")) {
        setError("Bu e-posta adresi zaten kayıtlı.");
      } else {
        setError(authError.message);
      }
    } else {
      setSuccess("Hesabınız oluşturuldu! E-posta adresinize gönderilen onay linkine tıklayın.");
      setRegName("");
      setRegEmail("");
      setRegPhone("");
      setRegPassword("");
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setOrders([]);
  };

  const handleProfileUpdate = async () => {
    if (!user) return;
    setProfileSaving(true);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: editName || null,
        phone: editPhone || null,
      })
      .eq("id", user.id);

    if (updateError) {
      setError("Profil güncellenemedi. Lütfen tekrar deneyin.");
    } else {
      setError("");
      setProfile((prev) => prev ? { ...prev, full_name: editName, phone: editPhone } : null);
      setSuccess("Profil güncellendi.");
      setTimeout(() => setSuccess(""), 3000);
    }
    setProfileSaving(false);
  };

  if (loading) {
    return (
      <section className="py-20">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
        </div>
      </section>
    );
  }

  // Not logged in — show login/register
  if (!user) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10">
                    <User className="h-8 w-8 text-brand-green" />
                  </div>
                  <h1 className="text-2xl font-bold text-brand-dark">Hesabım</h1>
                </div>

                {error && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                    <Check className="h-4 w-4 shrink-0" />
                    {success}
                  </div>
                )}

                <Tabs defaultValue="login">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Giriş Yap</TabsTrigger>
                    <TabsTrigger value="register">Kayıt Ol</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="mt-6">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="login-email">E-posta</Label>
                        <div className="relative mt-1">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="login-email"
                            type="email"
                            required
                            className="pl-10"
                            placeholder="ornek@email.com"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="login-password">Şifre</Label>
                        <div className="relative mt-1">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="login-password"
                            type="password"
                            required
                            className="pl-10"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={authLoading}
                        className="w-full bg-brand-green hover:bg-brand-green-dark text-white"
                      >
                        {authLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <LogIn className="mr-2 h-4 w-4" />
                        )}
                        Giriş Yap
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="register" className="mt-6">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div>
                        <Label htmlFor="reg-name">Ad Soyad</Label>
                        <Input
                          id="reg-name"
                          required
                          className="mt-1"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="reg-email">E-posta</Label>
                        <div className="relative mt-1">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="reg-email"
                            type="email"
                            required
                            className="pl-10"
                            placeholder="ornek@email.com"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="reg-phone">Telefon</Label>
                        <div className="relative mt-1">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="reg-phone"
                            type="tel"
                            className="pl-10"
                            placeholder="0500 000 00 00"
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="reg-password">Şifre (en az 6 karakter)</Label>
                        <div className="relative mt-1">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="reg-password"
                            type="password"
                            required
                            minLength={6}
                            className="pl-10"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={authLoading}
                        className="w-full bg-brand-green hover:bg-brand-green-dark text-white"
                      >
                        {authLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Kayıt Ol
                      </Button>
                      <p className="text-xs text-center text-gray-400">
                        Kayıt olarak Kullanım Koşullarını ve Gizlilik Politikasını kabul etmiş olursunuz.
                      </p>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

  // Logged in — show profile & orders
  return (
    <section className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-brand-dark">Hesabım</h1>
            <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="text-red-500 border-red-200 hover:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Çıkış Yap
          </Button>
        </div>

        {success && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            <Check className="h-4 w-4 shrink-0" />
            {success}
          </div>
        )}

        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <Package className="h-4 w-4" />
              Siparişlerim
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="mt-4 border-0 shadow-md">
              <CardContent className="p-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Ad Soyad</Label>
                    <Input
                      className="mt-1"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Telefon</Label>
                    <Input
                      className="mt-1"
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label>E-posta</Label>
                  <Input className="mt-1" value={user.email || ""} disabled />
                  <p className="text-xs text-gray-400 mt-1">E-posta değiştirilemez.</p>
                </div>
                <Button
                  onClick={handleProfileUpdate}
                  disabled={profileSaving}
                  className="bg-brand-green hover:bg-brand-green-dark text-white"
                >
                  {profileSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  Kaydet
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            {orders.length === 0 ? (
              <Card className="mt-4 border-0 shadow-md">
                <CardContent className="p-6 text-center py-12">
                  <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/30" />
                  <p className="mt-4 text-muted-foreground">Henüz siparişiniz bulunmuyor.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="mt-4 space-y-4">
                {orders.map((order) => {
                  const st = statusLabels[order.status] || { label: order.status, color: "bg-gray-100 text-gray-600" };
                  return (
                    <Card key={order.id} className="border-0 shadow-md">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString("tr-TR", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                            <p className="text-xs text-gray-400 font-mono mt-0.5">
                              #{order.id.slice(0, 8)}
                            </p>
                          </div>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${st.color}`}>
                            {st.label}
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          {order.order_items.map((item, j) => (
                            <div key={j} className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                {item.product_name} x{item.quantity}
                              </span>
                              <span className="text-gray-900 font-medium">
                                {(item.unit_price * item.quantity).toLocaleString("tr-TR")} TL
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t flex justify-between">
                          <span className="text-sm font-semibold text-gray-900">Toplam</span>
                          <span className="text-sm font-bold text-brand-green">
                            {Number(order.total_amount).toLocaleString("tr-TR")} TL
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
