import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Service role ile tek bir client (her istekte yeniden oluşturmamak için modül seviyesinde)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      shipping_city,
      shipping_district,
      shipping_zip,
      items,
      total_amount,
      customer_notified_payment,
    } = body;

    if (!customer_name || !customer_phone || !shipping_address || !shipping_city || !items?.length) {
      return NextResponse.json(
        { error: "Gerekli alanlar eksik" },
        { status: 400 }
      );
    }

    // Havale akışında müşteri "Ödemeyi Yaptım" basınca bu flag geliyor — notu aynı anda kaydet
    const note = customer_notified_payment
      ? `Müşteri ödeme bildiriminde bulundu (${new Date().toLocaleString("tr-TR", {
          timeZone: "Europe/Istanbul",
        })})`
      : null;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: null,
        shipping_address: {
          fullName: customer_name,
          email: customer_email,
          phone: customer_phone,
          address: shipping_address,
          city: shipping_city,
          district: shipping_district,
          zipCode: shipping_zip || "",
        },
        total_amount,
        status: "pending",
        note,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Order error:", orderError);
      return NextResponse.json(
        { error: "Sipariş oluşturulurken hata oluştu" },
        { status: 500 }
      );
    }

    const orderItems = items.map((item: { product_id: string | null; name_tr: string; quantity: number; unit_price: number }) => ({
      order_id: order.id,
      product_id: item.product_id || null,
      product_name: item.name_tr,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items error:", itemsError);
    }

    // Migration uygulanmadıysa order_number null olabilir — UUID'den türet
    const orderNumber = order.order_number ?? (() => {
      const d = new Date(order.created_at);
      const datePrefix = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
      const hexTail = order.id.replace(/-/g, "").slice(-4);
      const numericTail = String(parseInt(hexTail, 16) % 100).padStart(2, "0");
      return Number(`${datePrefix}${numericTail}`);
    })();

    return NextResponse.json({
      success: true,
      order_id: order.id,
      order_number: orderNumber,
    });
  } catch (err) {
    console.error("Siparis endpoint hatası:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
