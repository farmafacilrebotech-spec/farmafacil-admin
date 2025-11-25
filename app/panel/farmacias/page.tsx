import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export default async function FarmaciasPanelPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: farmacias, error } = await supabase
    .from("farmacias")
    .select("id, farmacia_id, nombre_farmacia, logo_url, provincia_id, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Farmacias
          </h1>

          <Link
            href="/farmacias/nueva"
            className="bg-[#1ABBB3] text-white px-4 py-2 rounded-md text-sm hover:bg-[#159e96] transition"
          >
            + Nueva farmacia
          </Link>
        </div>

        {!farmacias || farmacias.length === 0 ? (
          <p className="text-slate-500">Todavía no hay farmacias dadas de alta.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {farmacias.map((f) => (
              <Link key={f.id} href={`/panel/farmacias/${f.farmacia_id}`}>
                <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition p-4 flex flex-col items-center text-center">
                  
                  <div className="w-20 h-20 relative mb-3 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">
                    {f.logo_url ? (
                      <Image
                        src={f.logo_url}
                        alt={f.nombre_farmacia}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-xs text-slate-400">Sin logo</span>
                    )}
                  </div>

                  <h2 className="font-semibold text-slate-900 mb-1">
                    {f.nombre_farmacia}
                  </h2>

                  <p className="text-xs text-slate-500">
                    {f.farmacia_id}
                  </p>

                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
