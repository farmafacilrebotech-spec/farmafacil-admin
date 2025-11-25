import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { id } = await req.json();

  const { data, error } = await supabaseAdmin
    .from("farmacias")
    .select(`
      *,
      provincias:provincia_id (nombre)
    `)
    .eq("farmacia_id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ farmacia: data });
}
