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

  const getStatusDot = (status: string) => {
    switch (status.toLowerCase()) {
      case 'alive':
        return 'bg-emerald-400 animate-pulse'
      case 'dead':
        return 'bg-rose-500'
      default:
        return 'bg-slate-400'
    }
  }

  return (
    <div className="flex flex-col bg-slate-950/40 backdrop-blur-md border border-slate-900 rounded-2xl overflow-hidden transition-all duration-300 hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.12)] group relative">
      <div className="relative aspect-square w-full bg-slate-950 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10 opacity-70 group-hover:opacity-40 transition-opacity duration-300" />
        
        {imageError || !character.image ? (
          <div className="text-6xl font-extrabold text-slate-800 flex items-center justify-center w-full h-full bg-slate-900">
            {character.name.charAt(0).toUpperCase()}
          </div>
        ) : (
          <Image
            src={character.image}
            alt={character.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <div className="p-5 flex flex-col gap-3 z-20">
        <h3 className="font-extrabold text-white text-lg group-hover:text-emerald-400 transition-colors duration-300 truncate tracking-tight">
          {character.name}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(character.status)}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(character.status)}`}></span>
            {character.status}
          </span>
          <span className="text-slate-700 text-xs font-mono">•</span>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500 truncate max-w-[100px]">
            {character.species}
          </span>
        </div>
      </div>
    </div>
  )
}
