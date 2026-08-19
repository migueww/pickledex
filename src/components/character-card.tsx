'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Character } from '@/types/rick-and-morty'

interface CharacterCardProps {
  character: Character
}

export function CharacterCard({ character }: CharacterCardProps) {
  const [imageError, setImageError] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'alive':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'dead':
        return 'bg-rose-50 text-rose-700 border-rose-200'
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200'
    }
  }

  const getStatusDot = (status: string) => {
    switch (status.toLowerCase()) {
      case 'alive':
        return 'bg-emerald-500'
      case 'dead':
        return 'bg-rose-500'
      default:
        return 'bg-slate-400'
    }
  }

  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden transition-shadow hover:shadow-sm">
      <div className="relative aspect-square w-full bg-slate-100 flex items-center justify-center overflow-hidden">
        {imageError || !character.image ? (
          <div className="text-5xl font-bold text-slate-400 flex items-center justify-center w-full h-full bg-slate-100">
            {character.name.charAt(0).toUpperCase()}
          </div>
        ) : (
          <Image
            src={character.image}
            alt={character.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-semibold text-slate-900 text-base truncate">
          {character.name}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded border ${getStatusColor(character.status)}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(character.status)}`}></span>
            {character.status}
          </span>
          <span className="text-slate-300 text-xs">•</span>
          <span className="text-xs text-slate-500 truncate max-w-[120px]">
            {character.species}
          </span>
        </div>
      </div>
    </div>
  )
}
