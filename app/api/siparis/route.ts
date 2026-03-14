import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
    } = body;

    if (!customer_name || !customer_email || !customer_phone || !shipping_address || !items?.length) {
      return NextResponse.json(
        { error: "Gerekli alanlar eksik" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Create the order with shipping_address as JSONB
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
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
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order error:", orderError);
      return NextResponse.json(
        { error: "Sipariş oluşturulurken hata oluştu" },
        { status: 500 }
      );
    }

    // Create order items
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

    return NextResponse.json({ success: true, order_id: order.id });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
