import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { id } = await req.json();

  const { data, error } = await supabaseAdmin
    .from("farmacias_credenciales")
    .select("email_login")
    .eq("farmacia_id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ credenciales: data });
}
