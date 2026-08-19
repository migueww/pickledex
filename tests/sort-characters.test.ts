import { describe, it, expect } from 'vitest'
import { sortCharactersByName } from '@/utils/sort-characters'
import { Character } from '@/types/rick-and-morty'

describe('sortCharactersByName', () => {
  it('should sort characters alphabetically by name', () => {
    const characters: Character[] = [
      { id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human', image: '' },
      { id: 2, name: 'Beth Smith', status: 'Alive', species: 'Human', image: '' },
      { id: 3, name: 'Morty Smith', status: 'Alive', species: 'Human', image: '' },
    ]

    const sorted = sortCharactersByName(characters)

    expect(sorted).toEqual([
      { id: 2, name: 'Beth Smith', status: 'Alive', species: 'Human', image: '' },
      { id: 3, name: 'Morty Smith', status: 'Alive', species: 'Human', image: '' },
      { id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human', image: '' },
    ])
  })

  it('should handle localeCompare correctly with special characters/accents', () => {
    const characters: Character[] = [
      { id: 1, name: 'Zeke', status: 'Alive', species: 'Human', image: '' },
      { id: 2, name: 'Álvaro', status: 'Alive', species: 'Human', image: '' },
      { id: 3, name: 'Alexander', status: 'Alive', species: 'Human', image: '' },
    ]

    const sorted = sortCharactersByName(characters)

    // Using localeCompare alphabetical ordering behavior
    expect(sorted[0].name).toBe('Alexander')
    expect(sorted[1].name).toBe('Álvaro')
    expect(sorted[2].name).toBe('Zeke')
  })

  it('should return an empty array if given an empty array', () => {
    const characters: Character[] = []
    const sorted = sortCharactersByName(characters)
    expect(sorted).toEqual([])
  })

  it('should return the same array if given a single character', () => {
    const characters: Character[] = [
      { id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human', image: '' }
    ]
    const sorted = sortCharactersByName(characters)
    expect(sorted).toEqual(characters)
  })

  it('should not mutate the original array', () => {
    const characters: Character[] = [
      { id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human', image: '' },
      { id: 2, name: 'Beth Smith', status: 'Alive', species: 'Human', image: '' }
    ]
    const copy = [...characters]
    
    sortCharactersByName(characters)
    
    expect(characters).toEqual(copy)
  })
})
