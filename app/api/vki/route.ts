import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const supabase = await createClient();
    const { error } = await supabase.from("vki_leads").insert({
      full_name: body.name,
      phone: body.phone,
      email: body.email || null,
      age: body.age ? parseInt(body.age) : null,
      height_cm: parseFloat(body.height),
      weight_kg: parseFloat(body.weight),
      bmi: body.bmi,
      bmi_category: body.bmi_category,
      goal: body.goal,
      health_note: body.health_note || null,
      whatsapp_consent: body.consent || false,
    });

    if (error) {
      console.error("VKI lead error:", error);
      return NextResponse.json(
        { error: "Kayit sirasinda bir hata olustu" },
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
