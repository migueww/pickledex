import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { GET as getEpisode } from '@/app/api/episodes/route'
import { GET as getCharacters } from '@/app/api/characters/route'
import { clearExternalCache, fetchExternalEpisode, fetchExternalCharacters } from '@/services/rick-and-morty-external'
import { NextRequest } from 'next/server'

describe('BFF Layer (Services & Route Handlers)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    clearExternalCache()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('External API Service Caching & Fetching', () => {
    it('should successfully fetch and cache episodes', async () => {
      const mockEpisode = { id: 1, name: 'Pilot', episode: 'S01E01', characters: [] }
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockEpisode,
      } as Response)

      // First call (cache miss)
      const data1 = await fetchExternalEpisode(1)
      expect(data1).toEqual(mockEpisode)
      expect(fetch).toHaveBeenCalledTimes(1)

      // Second call (cache hit)
      const data2 = await fetchExternalEpisode(1)
      expect(data2).toEqual(mockEpisode)
      expect(fetch).toHaveBeenCalledTimes(1) // Should not call fetch again
    })

    it('should throw UpstreamError 404 when episode is not found', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response)

      await expect(fetchExternalEpisode(999)).rejects.toThrow('Episódio não encontrado')
    })

    it('should throw UpstreamError 429 when rate limited', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 429,
      } as Response)

      await expect(fetchExternalEpisode(1)).rejects.toThrow('Muitas requisições. Tente novamente mais tarde.')
    })

    it('should successfully fetch, batch, and cache characters', async () => {
      const mockChar1 = { id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human', image: 'img1' }
      const mockChar2 = { id: 2, name: 'Morty Smith', status: 'Alive', species: 'Human', image: 'img2' }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => [mockChar1, mockChar2],
      } as Response)

      // First call (cache miss)
      const chars = await fetchExternalCharacters([1, 2])
      expect(chars).toHaveLength(2)
      expect(chars[0]).toEqual(mockChar1)
      expect(chars[1]).toEqual(mockChar2)
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character/1,2', expect.any(Object))

      // Second call (all cached)
      const cachedChars = await fetchExternalCharacters([1, 2])
      expect(cachedChars).toHaveLength(2)
      expect(fetch).toHaveBeenCalledTimes(1) // Not incremented

      // Third call (partial cache hit: 1 is cached, 3 is missing)
      const mockChar3 = { id: 3, name: 'Summer Smith', status: 'Alive', species: 'Human', image: 'img3' }
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockChar3,
      } as Response)

      const mixedChars = await fetchExternalCharacters([1, 3])
      expect(mixedChars).toHaveLength(2)
      expect(mixedChars[0].id).toBe(1)
      expect(mixedChars[1].id).toBe(3)
      expect(fetch).toHaveBeenCalledTimes(2) // Incremented once
      expect(fetch).toHaveBeenLastCalledWith('https://rickandmortyapi.com/api/character/3', expect.any(Object))
    })
  })

  describe('Route Handlers', () => {
    describe('GET /api/episodes', () => {
      it('should return 200 and episode data with characters aggregated', async () => {
        const mockEpisode = { id: 1, name: 'Pilot', episode: 'S01E01', characters: ['https://rickandmortyapi.com/api/character/1', 'https://rickandmortyapi.com/api/character/2'] }
        const mockChars = [
          { id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human', image: 'img1' },
          { id: 2, name: 'Morty Smith', status: 'Alive', species: 'Human', image: 'img2' }
        ]

        vi.mocked(fetch)
          .mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => mockEpisode,
          } as Response)
          .mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => mockChars,
          } as Response)

        const req = new NextRequest('http://localhost/api/episodes?id=1')
        const res = await getEpisode(req)
        expect(res.status).toBe(200)
        expect(await res.json()).toEqual({
          id: 1,
          name: 'Pilot',
          episode: 'S01E01',
          characters: mockChars
        })
      })

      it('should return 400 when id parameter is missing', async () => {
        const req = new NextRequest('http://localhost/api/episodes')
        const res = await getEpisode(req)
        expect(res.status).toBe(400)
        expect(await res.json()).toEqual({ error: 'Parâmetro id é obrigatório.' })
      })

      it('should return 400 when id parameter is invalid', async () => {
        const req = new NextRequest('http://localhost/api/episodes?id=-5')
        const res = await getEpisode(req)
        expect(res.status).toBe(400)
        expect(await res.json()).toEqual({ error: 'O id deve ser um número inteiro positivo.' })
      })

      it('should handle 404 error from upstream API', async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
          ok: false,
          status: 404,
        } as Response)

        const req = new NextRequest('http://localhost/api/episodes?id=999')
        const res = await getEpisode(req)
        expect(res.status).toBe(404)
        expect(await res.json()).toEqual({ error: 'Episódio não encontrado' })
      })

      it('should handle 429 rate limit error from upstream API', async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
          ok: false,
          status: 429,
        } as Response)

        const req = new NextRequest('http://localhost/api/episodes?id=1')
        const res = await getEpisode(req)
        expect(res.status).toBe(429)
        expect(await res.json()).toEqual({ error: 'Muitas requisições. Tente novamente mais tarde.' })
      })
    })

    describe('GET /api/characters', () => {
      it('should return 200 and characters data', async () => {
        const mockChars = [{ id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human', image: 'img1' }]
        vi.mocked(fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockChars,
        } as Response)

        const req = new NextRequest('http://localhost/api/characters?ids=1')
        const res = await getCharacters(req)
        expect(res.status).toBe(200)
        expect(await res.json()).toEqual(mockChars)
      })

      it('should return 400 when ids parameter is missing', async () => {
        const req = new NextRequest('http://localhost/api/characters')
        const res = await getCharacters(req)
        expect(res.status).toBe(400)
        expect(await res.json()).toEqual({ error: 'Parâmetro ids é obrigatório.' })
      })

      it('should return 400 when ids parameter is invalid', async () => {
        const req = new NextRequest('http://localhost/api/characters?ids=abc')
        const res = await getCharacters(req)
        expect(res.status).toBe(400)
        expect(await res.json()).toEqual({ error: 'Parâmetro ids deve conter números válidos.' })
      })
    })
  })
})
