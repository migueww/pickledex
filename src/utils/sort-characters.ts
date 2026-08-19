import { Character } from '@/types/rick-and-morty'

export function sortCharactersByName(characters: Character[]): Character[] {
  return [...characters].sort((a, b) => a.name.localeCompare(b.name))
}
