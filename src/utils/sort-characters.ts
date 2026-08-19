import { Character } from '@/types/rick-and-morty'

/**
 * Sorts an array of characters alphabetically by name without mutating the original array.
 */
export function sortCharactersByName(characters: Character[]): Character[] {
  return [...characters].sort((a, b) => a.name.localeCompare(b.name))
}
