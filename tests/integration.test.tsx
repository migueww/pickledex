import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EpisodeResultsWrapper } from '@/components/episode-results'
import { clearExternalCache } from '@/services/rick-and-morty-external'
import React from 'react'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => '/',
}))

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  }
}))

describe('UI Integration Flow (EpisodeResultsWrapper)', () => {
  beforeEach(() => {
    clearExternalCache()
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should fetch, sort, and render episode characters correctly', async () => {
    const mockEpisodeResponse = {
      id: 1,
      name: 'Pilot Episode',
      episode: 'S01E01',
      characters: [
        'https://rickandmortyapi.com/api/character/2',
        'https://rickandmortyapi.com/api/character/1'
      ]
    }

    const mockCharactersResponse = [
      { id: 2, name: 'Morty Smith', status: 'Alive', species: 'Human', image: '' },
      { id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human', image: '' }
    ]

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockEpisodeResponse,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockCharactersResponse,
      } as Response)

    const jsx = await EpisodeResultsWrapper({ episodeQuery: '1' })
    render(jsx)

    expect(screen.getByText('Pilot Episode')).toBeInTheDocument()
    expect(screen.getByText('S01E01')).toBeInTheDocument()

    expect(screen.getByRole('heading', { name: 'Morty Smith' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Rick Sanchez' })).toBeInTheDocument()
  })

  it('should display error UI if the episode fetch fails (e.g. 404)', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response)

    const jsx = await EpisodeResultsWrapper({ episodeQuery: '999' })
    render(jsx)

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Não foi possível carregar este episódio')).toBeInTheDocument()
    expect(screen.getByText('Episódio não encontrado')).toBeInTheDocument()
  })
})
