'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export function VolverButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-white bg-[#1ABBB3] hover:bg-[#159e96]
                 text-sm px-4 py-2 rounded-md shadow-sm transition"
    >
      <ArrowLeft className="w-4 h-4" />
      Volver
    </button>
  );
}

