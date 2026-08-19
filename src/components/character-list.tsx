import { Character } from '@/types/rick-and-morty'
import { CharacterCard } from './character-card'

interface CharacterListProps {
  characters: Character[]
}

export function CharacterList({ characters }: CharacterListProps) {
  if (characters.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        Nenhum personagem encontrado para este episódio.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  )
}
