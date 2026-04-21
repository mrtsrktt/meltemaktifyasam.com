import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

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

    if (!customer_name || !customer_phone || !shipping_address || !shipping_city || !items?.length) {
      return NextResponse.json(
        { error: "Gerekli alanlar eksik" },
        { status: 400 }
      );
    }

    // Get authenticated user (optional - guest checkout allowed)
    const serverClient = await createServerClient();
    const { data: { user } } = await serverClient.auth.getUser();

    // Service role client to bypass RLS (guest checkout support)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Create the order with shipping_address as JSONB
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user?.id || null,
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

    return NextResponse.json({
      success: true,
      order_id: order.id,
      order_number: order.order_number,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
