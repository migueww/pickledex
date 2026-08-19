import { Character, EpisodeWithCharacters } from '@/types/rick-and-morty'

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


