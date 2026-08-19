'use client'

import { useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { EpisodeSearch } from './episode-search'

interface SearchSectionProps {
  initialValue: string
}

export function SearchSection({ initialValue }: SearchSectionProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const handleSearch = (episodeId: number) => {
    startTransition(() => {
      router.push(`${pathname}?episode=${episodeId}`)
    })
  }

  return (
    <EpisodeSearch
      onSearch={handleSearch}
      isLoading={isPending}
      initialValue={initialValue}
    />
  )
}
