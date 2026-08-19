import { Character } from '@/types/rick-and-morty'
import { CharacterCard } from './character-card'

interface CharacterListProps {
  characters: Character[]
}

export function CharacterList({ characters }: CharacterListProps) {
  if (characters.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-slate-950/20 backdrop-blur-sm border border-slate-900 rounded-2xl flex flex-col items-center gap-3 max-w-md mx-auto animate-fade-in">
        <div className="text-3xl text-slate-600 select-none">🛸</div>
        <p className="font-bold text-slate-400 text-sm">
          Nenhum personagem encontrado para este episódio.
        </p>
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          Nenhum habitante do multiverso foi registrado para este episódio no banco de dados da Federação Galáctica.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  )
}
