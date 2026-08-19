import { Episode, Character } from '@/types/rick-and-morty'

const API_BASE_URL = 'https://rickandmortyapi.com/api'

export async function fetchEpisode(episodeNumber: number): Promise<Episode> {
  try {
    const res = await fetch(`${API_BASE_URL}/episode/${episodeNumber}`)
    
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
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error('Erro ao buscar personagem')
    }
    const data = await res.json()
    return {
      id: data.id,
      name: data.name,
      status: data.status,
      species: data.species,
      image: data.image,
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
    const characters = await Promise.all(
      characterUrls.map(url => fetchCharacter(url))
    )
    return characters
  } catch {
    throw new Error('Erro ao buscar personagens. A consulta falhou.')
  }
}
