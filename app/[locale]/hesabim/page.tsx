"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Package, LogIn, Mail, Lock } from "lucide-react";

export default function AccountPage() {
  const t = useTranslations("account");
  const nav = useTranslations("nav");

  // For now, show login form since auth isn't connected
  const isLoggedIn = false;

  if (!isLoggedIn) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10">
                    <User className="h-8 w-8 text-brand-green" />
                  </div>
                  <h1 className="text-2xl font-bold text-brand-dark">
                    {nav("login")}
                  </h1>
                </div>

                <Tabs defaultValue="login">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">{nav("login")}</TabsTrigger>
                    <TabsTrigger value="register">{nav("register")}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="mt-6 space-y-4">
                    <div>
                      <Label htmlFor="login-email">E-posta</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          className="pl-10"
                          placeholder="ornek@email.com"
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
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Button className="w-full bg-brand-green hover:bg-brand-green-dark text-white">
                      <LogIn className="mr-2 h-4 w-4" />
                      {nav("login")}
                    </Button>
                  </TabsContent>

                  <TabsContent value="register" className="mt-6 space-y-4">
                    <div>
                      <Label htmlFor="reg-name">Ad Soyad</Label>
                      <Input id="reg-name" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="reg-email">E-posta</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reg-email"
                          type="email"
                          className="pl-10"
                          placeholder="ornek@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="reg-phone">Telefon</Label>
                      <Input id="reg-phone" type="tel" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="reg-password">Şifre</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reg-password"
                          type="password"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Button className="w-full bg-brand-green hover:bg-brand-green-dark text-white">
                      {nav("register")}
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-brand-dark">{t("title")}</h1>
        <Tabs defaultValue="profile" className="mt-8">
          <TabsList>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              {t("profile")}
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <Package className="h-4 w-4" />
              {t("orders")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Card className="mt-4 border-0 shadow-md">
              <CardContent className="p-6">
                <p className="text-muted-foreground">{t("profile")}</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="orders">
            <Card className="mt-4 border-0 shadow-md">
              <CardContent className="p-6 text-center py-12">
                <Package className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <p className="mt-4 text-muted-foreground">{t("noOrders")}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
