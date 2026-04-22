"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Lock,
  Loader2,
  Check,
  ShoppingBag,
  ShieldCheck,
  AlertCircle,
  Landmark,
  Copy,
  MessageCircle,
} from "lucide-react";
import { useCartStore } from "@/lib/store/cart";

type CheckoutStatus =
  | "form"
  | "loading"
  | "payment"
  | "bankTransfer"
  | "paymentNotified"
  | "success"
  | "error";

const PAYTR_ENABLED = process.env.NEXT_PUBLIC_PAYTR_ENABLED === "true";
const BANK_NAME = process.env.NEXT_PUBLIC_BANK_NAME || "";
const BANK_ACCOUNT_HOLDER = process.env.NEXT_PUBLIC_BANK_ACCOUNT_HOLDER || "";
const BANK_IBAN = process.env.NEXT_PUBLIC_BANK_IBAN || "";
const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "905412523421";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<CheckoutStatus>("form");
  const [paytrToken, setPaytrToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [notifyError, setNotifyError] = useState("");
  // Havale akışında: form submit'te siparişi OLUŞTURMA.
  // Müşteri "Ödemeyi Yaptım" butonuna basınca sipariş oluşturulur + bildirim kaydedilir.
  const [pendingOrderData, setPendingOrderData] = useState<{
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    shipping_city: string;
    shipping_district: string;
    shipping_zip: string;
    items: typeof items;
    total: number;
  } | null>(null);

  // Handle redirect from PayTR result page (?payment=success/fail)
  useEffect(() => {
    const paymentResult = searchParams.get("payment");
    if (paymentResult === "success") {
      setStatus("success");
      clearCart();
    } else if (paymentResult === "fail") {
      setStatus("error");
      setErrorMessage(t("paymentFailed"));
    }
  }, [searchParams, clearCart, t]);

  // Listen for PayTR iframe postMessage (fallback)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "PAYTR_RESULT") {
        if (event.data.status === "success") {
          setStatus("success");
          clearCart();
        } else {
          setStatus("error");
          setErrorMessage(t("paymentFailed"));
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [clearCart, t]);

  const handlePaymentMade = async () => {
    if (!pendingOrderData || notifyLoading) return;
    setNotifyLoading(true);
    setNotifyError("");

    try {
      // Tek çağrı: sipariş oluştur + ödeme bildirimi notunu aynı anda ekle
      const orderRes = await fetch("/api/siparis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: pendingOrderData.customer_name,
          customer_email: pendingOrderData.customer_email,
          customer_phone: pendingOrderData.customer_phone,
          shipping_address: pendingOrderData.shipping_address,
          shipping_city: pendingOrderData.shipping_city,
          shipping_district: pendingOrderData.shipping_district,
          shipping_zip: pendingOrderData.shipping_zip,
          items: pendingOrderData.items.map((item) => ({
            product_id: item.type === "set" ? null : item.id,
            name_tr:
              item.type === "set" ? `[SET] ${item.name_tr}` : item.name_tr,
            quantity: item.quantity,
            unit_price: item.price,
            original_price: item.originalPrice || null,
            item_type: item.type || "product",
          })),
          total_amount: pendingOrderData.total,
          customer_notified_payment: true,
        }),
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json().catch(() => null);
        throw new Error(errData?.error || t("orderError"));
      }
      const { order_number } = await orderRes.json();
      setOrderNumber(order_number ? String(order_number) : null);

      clearCart();
      setPendingOrderData(null);
      setStatus("paymentNotified");
    } catch (err) {
      setNotifyError(
        err instanceof Error ? err.message : t("paymentNotifyError")
      );
    } finally {
      setNotifyLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) return;
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const fd = new FormData(form);

    const customerName = fd.get("fullName") as string;
    const customerEmail = fd.get("email") as string;
    const customerPhone = fd.get("phone") as string;
    const customerAddress = fd.get("address") as string;
    const customerCity = fd.get("city") as string;
    const customerDistrict = fd.get("district") as string;
    const customerZip = fd.get("zipCode") as string;

    // Havale akışı: siparişi henüz OLUŞTURMA. Form verilerini ve sepet
    // snapshot'ını state'e kaydet; müşteri "Ödemeyi Yaptım" butonuna basınca oluştur.
    if (!PAYTR_ENABLED) {
      setPendingOrderData({
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        shipping_address: customerAddress,
        shipping_city: customerCity,
        shipping_district: customerDistrict,
        shipping_zip: customerZip,
        items: [...items],
        total,
      });
      setOrderTotal(total);
      setOrderNumber(null);
      setStatus("bankTransfer");
      return;
    }

    // PayTR akışı: siparişi oluştur, iframe token al
    try {
      const orderRes = await fetch("/api/siparis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          shipping_address: customerAddress,
          shipping_city: customerCity,
          shipping_district: customerDistrict,
          shipping_zip: customerZip,
          items: items.map((item) => ({
            product_id: item.type === "set" ? null : item.id,
            name_tr:
              item.type === "set" ? `[SET] ${item.name_tr}` : item.name_tr,
            quantity: item.quantity,
            unit_price: item.price,
            original_price: item.originalPrice || null,
            item_type: item.type || "product",
          })),
          total_amount: total,
        }),
      });

      if (!orderRes.ok) throw new Error(t("orderError"));
      const { order_id, order_number } = await orderRes.json();
      setOrderNumber(order_number ? String(order_number) : null);
      setOrderTotal(total);

      const user_basket = items.map((item) => [
        item.name_tr,
        (item.price * 100).toString(),
        item.quantity,
      ]);

      const tokenRes = await fetch("/api/payment/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id,
          email: customerEmail,
          payment_amount: total,
          user_name: customerName,
          user_address: `${customerAddress}, ${customerDistrict}, ${customerCity}`,
          user_phone: customerPhone,
          user_basket,
        }),
      });

      if (!tokenRes.ok) {
        const errData = await tokenRes.json();
        throw new Error(errData.error || t("paymentStartError"));
      }

      const { token } = await tokenRes.json();
      setPaytrToken(token);
      setStatus("payment");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : t("generalError")
      );
    }
  };

  // Empty cart
  if (
    items.length === 0 &&
    status !== "success" &&
    status !== "payment" &&
    status !== "bankTransfer" &&
    status !== "paymentNotified"
  ) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center py-20">
          <ShoppingBag className="mx-auto h-20 w-20 text-muted-foreground/20" />
          <p className="mt-4 text-lg text-muted-foreground">
            {t("emptyCart")}
          </p>
          <Link href="/magaza">
            <Button className="mt-6 bg-brand-green hover:bg-brand-green-dark text-white">
              {t("goToShop")}
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  // Bank transfer instructions (PayTR askıda iken)
  if (status === "bankTransfer") {
    const copyToClipboard = async (field: string, value: string) => {
      try {
        await navigator.clipboard.writeText(value);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
      } catch {
        // ignore
      }
    };

    const CopyButton = ({ field, value }: { field: string; value: string }) => (
      <button
        type="button"
        onClick={() => copyToClipboard(field, value)}
        className="inline-flex items-center gap-1.5 rounded-md border border-brand-green/30 bg-white hover:bg-brand-green/5 text-brand-green text-xs font-medium px-2.5 py-1.5 transition-colors shrink-0"
      >
        {copiedField === field ? (
          <>
            <Check className="h-3.5 w-3.5" />
            {t("copied")}
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            {t("copy")}
          </>
        )}
      </button>
    );

    const InfoRow = ({
      label,
      value,
      copyField,
      mono = false,
    }: {
      label: string;
      value: string;
      copyField?: string;
      mono?: boolean;
    }) => (
      <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
        <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
          {label}
        </div>
        <div className="flex items-center justify-between gap-3">
          <div
            className={`font-medium text-brand-dark break-all ${
              mono ? "font-mono text-sm" : ""
            }`}
          >
            {value}
          </div>
          {copyField && <CopyButton field={copyField} value={value} />}
        </div>
      </div>
    );

    return (
      <section className="py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Success header */}
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10">
                <Check className="h-8 w-8 text-brand-green" />
              </div>
              <h1 className="text-3xl font-bold text-brand-dark">
                {t("orderReceived")}
              </h1>
              <p className="mt-2 text-muted-foreground">
                {t("orderReceivedDesc")}
              </p>
            </div>

            {/* Amount hero */}
            <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1f6b3e] via-[#17643a] to-[#0a3a22] shadow-2xl shadow-[#0a3a22]/25 ring-1 ring-white/10">
              {/* Decorative blobs */}
              <div
                aria-hidden
                className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-white/10 blur-3xl"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-emerald-300/15 blur-3xl"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                  backgroundSize: "16px 16px",
                }}
              />

              <div className="relative px-8 py-10 text-center text-white sm:py-12">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
                  <Landmark className="h-3 w-3" />
                  {t("amountToPay")}
                </div>
                <div className="mt-4 text-4xl sm:text-5xl font-black tracking-tight drop-shadow-md">
                  {orderTotal.toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  <span className="ml-2 text-2xl sm:text-3xl font-bold text-white/85">
                    TL
                  </span>
                </div>
                {orderNumber && (
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-white/95 ring-1 ring-white/15">
                    <span className="text-white/70">
                      {t("orderNumber")}:
                    </span>
                    <span className="font-mono font-semibold">
                      {orderNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bank details */}
            <Card className="border-0 shadow-xl">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-green/10">
                    <Landmark className="h-5 w-5 text-brand-green" />
                  </div>
                  <h2 className="text-lg font-semibold text-brand-dark">
                    {t("bankTransferTitle")}
                  </h2>
                </div>

                <div className="space-y-3">
                  <InfoRow label={t("bankName")} value={BANK_NAME} />
                  <InfoRow
                    label={t("accountHolder")}
                    value={BANK_ACCOUNT_HOLDER}
                    copyField="holder"
                  />
                  <InfoRow
                    label="IBAN"
                    value={BANK_IBAN}
                    copyField="iban"
                    mono
                  />
                </div>

                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  {t("transferDescriptionHint")}
                </div>

                <button
                  type="button"
                  onClick={handlePaymentMade}
                  disabled={notifyLoading}
                  className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-xl bg-brand-green hover:bg-brand-green-dark text-white font-bold text-base py-4 px-4 shadow-xl shadow-brand-green/30 ring-1 ring-white/10 transition-all hover:shadow-2xl hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {notifyLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {t("paymentMadeProcessing")}
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5" />
                      {t("paymentMadeButton")}
                    </>
                  )}
                </button>

                <p className="mt-3 text-xs text-center text-muted-foreground">
                  {t("paymentNotifyHint")}
                </p>

                {notifyError && (
                  <p className="mt-3 text-xs text-center text-red-600">
                    {notifyError}
                  </p>
                )}

                <p className="mt-5 text-xs text-center text-muted-foreground leading-relaxed">
                  {t("confirmationNote")}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

  // Payment notified (havale sonrası "Ödemeyi Yaptım" basıldı)
  if (status === "paymentNotified") {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-green/10">
                <Check className="h-10 w-10 text-brand-green" />
              </div>
              <h1 className="text-3xl font-bold text-brand-dark">
                {t("paymentNotifiedTitle")}
              </h1>
              <p className="mt-3 text-muted-foreground">
                {t("paymentNotifiedDesc")}
              </p>
            </div>

            {orderNumber && (
              <div className="mb-6 flex justify-center">
                <div className="inline-flex items-center gap-3 rounded-full bg-brand-green px-6 py-3 text-white shadow-lg shadow-brand-green/30 ring-2 ring-white">
                  <span className="text-sm font-medium text-white/90 uppercase tracking-wide">
                    {t("orderNumber")}
                  </span>
                  <span className="font-mono text-xl font-bold tracking-wider">
                    {orderNumber}
                  </span>
                </div>
              </div>
            )}

            <Card className="border-0 shadow-xl">
              <CardContent className="p-6 sm:p-8 space-y-4">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `Sitenizden sipariş verdim (No: ${orderNumber ?? ""}), dekontu gönderiyorum.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#128C7E] to-[#075E54] hover:from-[#075E54] hover:to-[#054740] text-white font-bold text-base py-4 px-4 shadow-xl shadow-[#075E54]/30 ring-1 ring-white/10 transition-all hover:shadow-2xl hover:shadow-[#075E54]/40 hover:scale-[1.01]"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
                    <MessageCircle className="h-4 w-4" />
                  </span>
                  {t("sendReceiptWhatsApp")}
                </a>

                <Link href="/magaza" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
                  >
                    {t("continueShopping")}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

  // Payment success
  if (status === "success") {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-green/10">
              <Check className="h-10 w-10 text-brand-green" />
            </div>
            <h2 className="text-2xl font-bold text-brand-dark">
              {t("paymentSuccess")}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {t("paymentSuccessDesc")}
            </p>
            <Link href="/magaza">
              <Button className="mt-6 bg-brand-green hover:bg-brand-green-dark text-white">
                {t("continueShopping")}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  // PayTR iframe
  if (status === "payment" && paytrToken) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="h-6 w-6 text-brand-green" />
              <h1 className="text-2xl font-bold text-brand-dark">
                {t("securePayment")}
              </h1>
            </div>
            <Card className="border-0 shadow-xl overflow-hidden">
              <CardContent className="p-0">
                <iframe
                  src={`https://www.paytr.com/odeme/guvenli/${paytrToken}`}
                  className="w-full border-0"
                  style={{ height: "600px" }}
                  title="PayTR Güvenli Ödeme"
                />
              </CardContent>
            </Card>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              {t("sslSecure")}
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // Checkout form
  return (
    <section className="py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-brand-dark">{t("title")}</h1>
        </motion.div>

        {status === "error" && errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl bg-red-50 border border-red-200 p-4 flex items-start gap-3"
          >
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-700 font-medium">{errorMessage}</p>
              <button
                onClick={() => {
                  setStatus("form");
                  setErrorMessage("");
                }}
                className="text-sm text-red-600 underline mt-1"
              >
                {t("tryAgain")}
              </button>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* Shipping Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <h2 className="text-xl font-semibold text-brand-dark mb-6">
                    {t("shippingInfo")}
                  </h2>
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="fullName">{t("fullName")}</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">
                          E-posta{" "}
                          <span className="text-muted-foreground text-xs">
                            (opsiyonel)
                          </span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">{t("phone")}</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">{t("address")}</Label>
                      <Input
                        id="address"
                        name="address"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <Label htmlFor="city">{t("city")}</Label>
                        <Input
                          id="city"
                          name="city"
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="district">{t("district")}</Label>
                        <Input
                          id="district"
                          name="district"
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">{t("zipCode")}</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Notice */}
                  {PAYTR_ENABLED ? (
                    <div className="mt-8 rounded-xl bg-brand-green/5 border border-brand-green/10 p-4 flex items-start gap-3">
                      <ShieldCheck className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-brand-green">
                          {t("securePaymentNote")}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("securePaymentDesc")}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-8 rounded-xl bg-brand-green/5 border border-brand-green/10 p-4 flex items-start gap-3">
                      <Landmark className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-brand-green">
                          {t("bankTransferOnlyTitle")}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("bankTransferOnlyDesc")}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-xl sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-brand-dark mb-4">
                    {t("orderSummary")}
                  </h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-muted-foreground">
                          {item.name_tr} x{item.quantity}
                        </span>
                        <span className="font-medium">
                          {(item.price * item.quantity).toLocaleString("tr-TR")}{" "}
                          TL
                        </span>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between">
                    <span className="font-semibold">{t("total")}</span>
                    <span className="font-bold text-brand-green">
                      {total.toLocaleString("tr-TR")} TL
                    </span>
                  </div>
                  <Button
                    type="submit"
                    disabled={status === "loading"}
                    className="mt-6 w-full bg-brand-green hover:bg-brand-green-dark text-white"
                  >
                    {status === "loading" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : PAYTR_ENABLED ? (
                      <CreditCard className="mr-2 h-4 w-4" />
                    ) : (
                      <Landmark className="mr-2 h-4 w-4" />
                    )}
                    {status === "loading"
                      ? t("processing")
                      : PAYTR_ENABLED
                      ? t("proceedToPayment")
                      : t("placeOrderBankTransfer")}
                  </Button>
                  {PAYTR_ENABLED && (
                    <div className="mt-3 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      {t("sslSecure")}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </form>
      </div>
    </section>
  );
}
