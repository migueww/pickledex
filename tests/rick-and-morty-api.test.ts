import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchEpisode } from '@/services/rick-and-morty-api'

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


})
