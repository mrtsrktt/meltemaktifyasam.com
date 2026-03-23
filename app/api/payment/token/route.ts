import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      order_id,
      email,
      payment_amount,
      user_name,
      user_address,
      user_phone,
      user_basket,
    } = body;

    const merchant_id = process.env.PAYTR_MERCHANT_ID!;
    const merchant_key = process.env.PAYTR_MERCHANT_KEY!;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT!;
    const test_mode = process.env.PAYTR_TEST_MODE || "1";

    const user_ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    // PayTR requires alphanumeric merchant_oid (no dashes)
    const merchant_oid = order_id.replace(/-/g, "");
    const payment_amount_kurus = Math.round(payment_amount * 100);
    const payment_type = "card";
    const installment_count = "0";
    const currency = "TL";
    const non_3d = "0";
    const no_installment = "1";
    const max_installment = "0";

    const base_url =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const merchant_ok_url = `${base_url}/api/payment/result?status=success`;
    const merchant_fail_url = `${base_url}/api/payment/result?status=fail`;
    const merchant_notify_url = `${base_url}/api/payment/callback`;

    // Encode basket: [[name, price_kurus, quantity], ...]
    const user_basket_b64 = Buffer.from(JSON.stringify(user_basket)).toString("base64");

    // PayTR HMAC token (official formula)
    // hash_str = merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket + no_installment + max_installment + currency + test_mode
    // paytr_token = base64(hmac_sha256(hash_str + merchant_salt, merchant_key))
    const hash_str =
      merchant_id +
      user_ip +
      merchant_oid +
      email +
      payment_amount_kurus +
      user_basket_b64 +
      no_installment +
      max_installment +
      currency +
      test_mode;

    const paytr_token = crypto
      .createHmac("sha256", merchant_key)
      .update(hash_str + merchant_salt)
      .digest("base64");

    // POST to PayTR API
    const params = new URLSearchParams({
      merchant_id,
      user_ip,
      merchant_oid,
      email,
      payment_amount: payment_amount_kurus.toString(),
      payment_type,
      installment_count,
      currency,
      test_mode,
      non_3d,
      merchant_ok_url,
      merchant_fail_url,
      merchant_notify_url,
      user_name,
      user_address,
      user_phone,
      user_basket: user_basket_b64,
      debug_on: test_mode === "1" ? "1" : "0",
      no_installment,
      max_installment,
      lang: "tr",
      paytr_token,
    });

    const response = await fetch("https://www.paytr.com/odeme/api/get-token", {
      method: "POST",
      body: params,
    });

    const result = await response.json();

    if (result.status === "success") {
      return NextResponse.json({ token: result.token });
    } else {
      console.error("PayTR token error:", result);
      return NextResponse.json(
        { error: result.reason || "Token oluşturulamadı" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Payment token error:", error);
    return NextResponse.json(
      { error: "Ödeme başlatılamadı" },
      { status: 500 }
    );
  }
}
