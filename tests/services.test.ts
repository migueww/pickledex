import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  fetchExternalEpisode,
  fetchExternalCharacters,
  clearExternalCache,
  UpstreamError
} from '@/services/rick-and-morty-external'

describe('Rick & Morty External Service', () => {
  beforeEach(() => {
    clearExternalCache()
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should fetch and return an episode correctly', async () => {
    const mockResponse = {
      id: 1,
      name: 'Pilot',
      episode: 'S01E01',
      characters: [
        'https://rickandmortyapi.com/api/character/1',
        'https://rickandmortyapi.com/api/character/2'
      ]
    }

    const mockFetch = vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    } as Response)

    const episode = await fetchExternalEpisode(1)

    expect(episode.id).toBe(1)
    expect(episode.name).toBe('Pilot')
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('should use in-memory cache for consecutive episode fetches', async () => {
    const mockResponse = {
      id: 1,
      name: 'Pilot',
      episode: 'S01E01',
      characters: []
    }

    const mockFetch = vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    } as Response)

    const ep1 = await fetchExternalEpisode(1)
    const ep2 = await fetchExternalEpisode(1)

    expect(ep1).toEqual(ep2)
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('should deduplicate parallel matching episode requests', async () => {
    const mockResponse = {
      id: 2,
      name: 'Lawnmower Dog',
      episode: 'S01E02',
      characters: []
    }

    const mockFetch = vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    } as Response)

    const [ep1, ep2] = await Promise.all([
      fetchExternalEpisode(2),
      fetchExternalEpisode(2)
    ])

    expect(ep1).toEqual(ep2)
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('should throw UpstreamError 404 when episode is not found', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response)

    await expect(fetchExternalEpisode(999)).rejects.toThrowError(
      new UpstreamError(404, 'Episódio não encontrado')
    )
  })

  it('should throw UpstreamError 429 when rate limit is exceeded', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 429,
    } as Response)

    await expect(fetchExternalEpisode(1)).rejects.toThrowError(
      new UpstreamError(429, 'Muitas requisições. Tente novamente mais tarde.')
    )
  })

  it('should return empty list immediately if character ids array is empty', async () => {
    const chars = await fetchExternalCharacters([])
    expect(chars).toEqual([])
    expect(fetch).not.toHaveBeenCalled()
  })

  it('should fetch multiple characters and cache them individually', async () => {
    const mockResponse = [
      { id: 1, name: 'Rick', status: 'Alive', species: 'Human', image: 'https://rickandmortyapi.com/avatar.png' },
      { id: 2, name: 'Morty', status: 'Alive', species: 'Human', image: 'https://rickandmortyapi.com/avatar.png' }
    ]

    const mockFetch = vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    } as Response)

    const characters = await fetchExternalCharacters([1, 2])
    expect(characters).toHaveLength(2)
    expect(characters[0].name).toBe('Rick')
    expect(mockFetch).toHaveBeenCalledTimes(1)

    const char1 = await fetchExternalCharacters([1])
    expect(char1[0].name).toBe('Rick')
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })
})
