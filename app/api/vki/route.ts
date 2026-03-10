import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Save to Supabase when connected
    // const supabase = await createClient();
    // await supabase.from('vki_leads').insert({
    //   full_name: body.name,
    //   phone: body.phone,
    //   email: body.email,
    //   age: body.age ? parseInt(body.age) : null,
    //   height_cm: parseFloat(body.height),
    //   weight_kg: parseFloat(body.weight),
    //   bmi: body.bmi,
    //   bmi_category: body.bmi_category,
    //   goal: body.goal,
    //   whatsapp_consent: body.consent,
    // });

    console.log("VKİ Lead:", body);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
