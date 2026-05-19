import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const merchant_oid = formData.get("merchant_oid") as string;
    const status = formData.get("status") as string;
    const total_amount = formData.get("total_amount") as string;
    const hash = formData.get("hash") as string;

    const merchant_key = process.env.PAYTR_MERCHANT_KEY!;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT!;

    // Verify PayTR hash
    const hash_str = merchant_oid + merchant_salt + status + total_amount;
    const expected_hash = crypto
      .createHmac("sha256", merchant_key)
      .update(hash_str)
      .digest("base64");

    if (hash !== expected_hash) {
      console.error("PayTR callback: hash mismatch");
      return new NextResponse("HASH_MISMATCH", { status: 400 });
    }

    // Service role client to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Reconstruct UUID from alphanumeric merchant_oid
    const uuid = merchant_oid.replace(
      /^(.{8})(.{4})(.{4})(.{4})(.{12})$/,
      "$1-$2-$3-$4-$5"
    );

    if (status === "success") {
      await supabase
        .from("orders")
        .update({
          status: "confirmed",
          payment_method: "paytr",
          payment_id: merchant_oid,
        })
        .eq("id", uuid);
    } else {
      await supabase
        .from("orders")
        .update({
          status: "cancelled",
          payment_method: "paytr",
          note: "Ödeme başarısız",
        })
        .eq("id", uuid);
    }

    // PayTR expects "OK" response
    return new NextResponse("OK");
  } catch (error) {
    console.error("PayTR callback error:", error);
    return new NextResponse("ERROR", { status: 500 });
  }
}
