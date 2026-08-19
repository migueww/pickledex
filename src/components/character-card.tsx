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
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'dead':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30'
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-lg overflow-hidden transition-all hover:border-slate-700 hover:shadow-md hover:shadow-emerald-950/20 group">
      <div className="relative aspect-square w-full bg-slate-950 flex items-center justify-center overflow-hidden">
        {imageError ? (
          <div className="text-6xl font-extrabold text-slate-800 flex items-center justify-center w-full h-full bg-slate-900">
            {character.name.charAt(0).toUpperCase()}
          </div>
        ) : (
          <Image
            src={character.image}
            alt={character.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-bold text-white text-lg group-hover:text-emerald-400 transition-colors truncate">
          {character.name}
        </h3>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(character.status)}`}>
            {character.status}
          </span>
          <span className="text-xs">•</span>
          <span className="truncate">{character.species}</span>
        </div>
      </div>
    </div>
  )
}
