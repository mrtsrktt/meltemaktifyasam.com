import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Sipariş ID eksik" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("id, status, note")
      .eq("id", id)
      .single();

    if (fetchError || !order) {
      return NextResponse.json(
        { error: "Sipariş bulunamadı" },
        { status: 404 }
      );
    }

    if (order.status !== "pending") {
      return NextResponse.json(
        { error: "Bu sipariş için bildirim alınamaz" },
        { status: 400 }
      );
    }

    const timestamp = new Date().toLocaleString("tr-TR", {
      timeZone: "Europe/Istanbul",
    });
    const noteEntry = `Müşteri ödeme bildiriminde bulundu (${timestamp})`;
    const updatedNote = order.note
      ? `${order.note}\n${noteEntry}`
      : noteEntry;

    const { error: updateError } = await supabase
      .from("orders")
      .update({ note: updatedNote })
      .eq("id", id);

    if (updateError) {
      console.error("Ödeme bildirimi güncelleme hatası:", updateError);
      return NextResponse.json(
        { error: "Bildirim kaydedilemedi" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ödeme bildirimi hatası:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
