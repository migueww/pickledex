export type Episode = {
  id: number
  name: string
  episode: string
  characters: string[]
}

export type Character = {
  id: number
  name: string
  status: string
  species: string
  image: string
}

export type EpisodeWithCharacters = Omit<Episode, 'characters'> & {
  characters: Character[]
}

