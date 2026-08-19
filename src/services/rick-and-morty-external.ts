import { Episode, Character } from '@/types/rick-and-morty'

const EXTERNAL_API_URL = 'https://rickandmortyapi.com/api'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

interface CacheEntry<T> {
  data: T
  expiry: number
}

// In-memory cache stores
const episodeCache = new Map<number, CacheEntry<Episode>>()
const characterCache = new Map<number, CacheEntry<Character>>()

// Pending request stores for deduplication
const pendingEpisodes = new Map<number, Promise<Episode>>()
const pendingCharacters = new Map<string, Promise<Character[]>>()

export class UpstreamError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'UpstreamError'
  }
}

export function clearExternalCache(): void {
  episodeCache.clear()
  characterCache.clear()
  pendingEpisodes.clear()
  pendingCharacters.clear()
}

export async function fetchExternalEpisode(id: number): Promise<Episode> {
  const cached = episodeCache.get(id)
  if (cached && Date.now() < cached.expiry) {
    return cached.data
  }

  let promise = pendingEpisodes.get(id)
  if (!promise) {
    promise = (async () => {
      try {
        const res = await fetch(`${EXTERNAL_API_URL}/episode/${id}`, {
          next: { revalidate: 86400 }, // Fallback Next.js native cache
        })

        if (res.status === 404) {
          throw new UpstreamError(404, 'Episódio não encontrado')
        }

        if (res.status === 429) {
          throw new UpstreamError(429, 'Muitas requisições. Tente novamente mais tarde.')
        }

        if (!res.ok) {
          throw new UpstreamError(res.status, 'Erro ao consultar a API externa')
        }

        const data = await res.json()
        const episode: Episode = {
          id: data.id,
          name: data.name,
          episode: data.episode,
          characters: data.characters,
        }

        episodeCache.set(id, { data: episode, expiry: Date.now() + CACHE_TTL_MS })
        return episode
      } finally {
        pendingEpisodes.delete(id)
      }
    })()
    pendingEpisodes.set(id, promise)
  }

  return promise
}

export async function fetchExternalCharacters(ids: number[]): Promise<Character[]> {
  if (ids.length === 0) return []

  const result: Character[] = []
  const missingIds: number[] = []

  // Check cache first
  for (const id of ids) {
    const cached = characterCache.get(id)
    if (cached && Date.now() < cached.expiry) {
      result.push(cached.data)
    } else {
      missingIds.push(id)
    }
  }

  if (missingIds.length === 0) {
    const idMap = new Map(result.map(c => [c.id, c]))
    return ids.map(id => idMap.get(id)!).filter(Boolean)
  }

  // Deduplicate fetching of missingIds
  const missingKey = [...missingIds].sort((a, b) => a - b).join(',')
  let promise = pendingCharacters.get(missingKey)
  if (!promise) {
    promise = (async () => {
      try {
        const res = await fetch(`${EXTERNAL_API_URL}/character/${missingIds.join(',')}`, {
          next: { revalidate: 86400 },
        })

        if (res.status === 404) {
          throw new UpstreamError(404, 'Personagens não encontrados')
        }

        if (res.status === 429) {
          throw new UpstreamError(429, 'Muitas requisições. Tente novamente mais tarde.')
        }

        if (!res.ok) {
          throw new UpstreamError(res.status, 'Erro ao consultar personagens na API externa')
        }

        const responseData = await res.json()
        // If only one character requested, API returns an object instead of array
        const fetchedCharacters: Character[] = Array.isArray(responseData) ? responseData : [responseData]

        const mappedCharacters: Character[] = fetchedCharacters.map(data => ({
          id: data.id,
          name: data.name,
          status: data.status,
          species: data.species,
          image: data.image,
        }))

        // Save newly fetched characters to cache
        for (const char of mappedCharacters) {
          characterCache.set(char.id, { data: char, expiry: Date.now() + CACHE_TTL_MS })
        }

        return mappedCharacters
      } finally {
        pendingCharacters.delete(missingKey)
      }
    })()
    pendingCharacters.set(missingKey, promise)
  }

  const fetchedChars = await promise

  // Combine already cached results with the newly fetched ones
  const allChars = [...result, ...fetchedChars]
  const idMap = new Map(allChars.map(c => [c.id, c]))
  return ids.map(id => idMap.get(id)!).filter(Boolean)
}
