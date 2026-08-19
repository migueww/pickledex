import { Episode, Character, EpisodeWithCharacters } from '@/types/rick-and-morty'

export async function fetchEpisode(episodeNumber: number): Promise<EpisodeWithCharacters> {
  try {
    const res = await fetch(`/api/episodes?id=${episodeNumber}`)
    
    if (res.status === 404) {
      throw new Error('Episódio não encontrado')
    }
    
    if (!res.ok) {
      throw new Error('Não foi possível consultar a API')
    }
    
    return await res.json()
  } catch (error) {
    if (error instanceof Error && error.message === 'Episódio não encontrado') {
      throw error
    }
    throw new Error('Não foi possível consultar a API. Tente novamente em alguns instantes.')
  }
}

export async function fetchCharacter(url: string): Promise<Character> {
  try {
    const parts = url.split('/')
    const id = parts[parts.length - 1]
    
    const res = await fetch(`/api/characters?ids=${id}`)
    if (!res.ok) {
      throw new Error('Erro ao buscar personagem')
    }
    const data = await res.json()
    const char = data[0]
    return {
      id: char.id,
      name: char.name,
      status: char.status,
      species: char.species,
      image: char.image,
    }
  } catch {
    throw new Error('Erro ao buscar personagens')
  }
}

export async function fetchEpisodeCharacters(characterUrls: string[]): Promise<Character[]> {
  if (characterUrls.length === 0) {
    return []
  }
  
  try {
    const ids = characterUrls.map(url => {
      const parts = url.split('/')
      return parts[parts.length - 1]
    }).join(',')

    const res = await fetch(`/api/characters?ids=${ids}`)
    if (!res.ok) {
      throw new Error('Erro ao buscar personagens')
    }
    return await res.json()
  } catch {
    throw new Error('Erro ao buscar personagens. A consulta falhou.')
  }
}
