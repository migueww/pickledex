import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchEpisode, fetchCharacter, fetchEpisodeCharacters } from '@/services/rick-and-morty-api'

describe('Rick & Morty API Service (BFF Client)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('fetchEpisode', () => {
    it('should return episode data with characters aggregated on successful response', async () => {
      const mockEpisode = {
        id: 1,
        name: 'Pilot',
        episode: 'S01E01',
        characters: [
          { id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human', image: 'url' }
        ],
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockEpisode,
      } as Response)

      const result = await fetchEpisode(1)
      expect(result).toEqual(mockEpisode)
      expect(fetch).toHaveBeenCalledWith('/api/episodes?id=1')
    })

    it('should throw "Episódio não encontrado" when response status is 404', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response)

      await expect(fetchEpisode(999)).rejects.toThrow('Episódio não encontrado')
    })

    it('should throw "Não foi possível consultar a API. Tente novamente em alguns instantes." when response is not ok', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response)

      await expect(fetchEpisode(1)).rejects.toThrow('Não foi possível consultar a API. Tente novamente em alguns instantes.')
    })

    it('should throw generic error when fetch fails due to network', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

      await expect(fetchEpisode(1)).rejects.toThrow('Não foi possível consultar a API. Tente novamente em alguns instantes.')
    })
  })

  describe('fetchCharacter', () => {
    it('should fetch and return simplified character data', async () => {
      const mockApiResponse = {
        id: 1,
        name: 'Rick Sanchez',
        status: 'Alive',
        species: 'Human',
        image: 'image_url',
        gender: 'Male',
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => [mockApiResponse],
      } as Response)

      const result = await fetchCharacter('https://rickandmortyapi.com/api/character/1')
      expect(result).toEqual({
        id: 1,
        name: 'Rick Sanchez',
        status: 'Alive',
        species: 'Human',
        image: 'image_url',
      })
      expect(fetch).toHaveBeenCalledWith('/api/characters?ids=1')
    })

    it('should throw error when character fetch fails', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response)

      await expect(fetchCharacter('https://rickandmortyapi.com/api/character/1')).rejects.toThrow('Erro ao buscar personagens')
    })
  })

  describe('fetchEpisodeCharacters', () => {
    it('should fetch multiple characters in a single batch', async () => {
      const mockChar1 = { id: 1, name: 'Rick', status: 'Alive', species: 'Human', image: 'url1' }
      const mockChar2 = { id: 2, name: 'Morty', status: 'Alive', species: 'Human', image: 'url2' }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => [mockChar1, mockChar2],
      } as Response)

      const result = await fetchEpisodeCharacters([
        'https://rickandmortyapi.com/api/character/1',
        'https://rickandmortyapi.com/api/character/2',
      ])

      expect(result).toEqual([
        { id: 1, name: 'Rick', status: 'Alive', species: 'Human', image: 'url1' },
        { id: 2, name: 'Morty', status: 'Alive', species: 'Human', image: 'url2' },
      ])
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith('/api/characters?ids=1,2')
    })

    it('should return empty array when character list is empty', async () => {
      const result = await fetchEpisodeCharacters([])
      expect(result).toEqual([])
      expect(fetch).not.toHaveBeenCalled()
    })

    it('should throw error if characters fetch fails', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response)

      await expect(
        fetchEpisodeCharacters([
          'https://rickandmortyapi.com/api/character/1',
          'https://rickandmortyapi.com/api/character/2',
        ])
      ).rejects.toThrow('Erro ao buscar personagens. A consulta falhou.')
    })
  })
})
