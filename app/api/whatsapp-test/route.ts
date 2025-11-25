import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = `${process.env.WHAPI_API_URL}/messages/text`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHAPI_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel_id: process.env.WHAPI_CHANNEL_ID,
        to: "34679425719", // tu número con prefijo internacional
        body: "Mensaje de prueba enviado desde FarmaFácil 🚀",
      }),
    });

    const data = await res.json();
    return NextResponse.json({ ok: true, data });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
