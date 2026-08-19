import { Character } from '@/types/rick-and-morty'
import { CharacterCard } from './character-card'

interface CharacterListProps {
  characters: Character[]
}

export function CharacterList({ characters }: CharacterListProps) {
  if (characters.length === 0) {
    return (
      <div className="text-center py-12 px-6 bg-white border border-slate-200 rounded-lg flex flex-col items-center gap-2 max-w-md mx-auto animate-fade-in">
        <p className="font-semibold text-slate-800 text-sm">
          Nenhum personagem encontrado para este episódio.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 animate-fade-in">
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  )
}
