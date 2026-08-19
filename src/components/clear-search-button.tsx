'use client'

import { useRouter, usePathname } from 'next/navigation'

export function ClearSearchButton() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <button
      onClick={() => router.push(pathname)}
      className="mt-1 text-xs font-medium px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
    >
      Limpar Busca
    </button>
  )
}
