import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "Ad, e-posta ve mesaj zorunludur" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { error } = await supabase.from("contact_messages").insert({
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      message: body.message,
    });

    if (error) {
      console.error("Contact message error:", error);
      return NextResponse.json(
        { error: "Mesaj gönderilirken bir hata oluştu" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
