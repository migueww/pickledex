import { Suspense } from 'react'
import { SearchSection } from '@/components/search-section'
import { CharacterList } from '@/components/character-list'
import { ClearSearchButton } from '@/components/clear-search-button'
import { fetchExternalEpisode, fetchExternalCharacters } from '@/services/rick-and-morty-external'
import { sortCharactersByName } from '@/utils/sort-characters'

async function EpisodeResults({ episodeQuery }: { episodeQuery: string }) {
  const trimmed = episodeQuery.trim()
  if (!/^\d+$/.test(trimmed)) {
    throw new Error('O campo deve aceitar somente números inteiros positivos.')
  }

  const episodeId = parseInt(trimmed, 10)
  if (episodeId <= 0) {
    throw new Error('O número do episódio deve ser maior que zero.')
  }

  const episode = await fetchExternalEpisode(episodeId)
  const characterIds = episode.characters.map(url => {
    const parts = url.split('/')
    return parseInt(parts[parts.length - 1], 10)
  }).filter(charId => !isNaN(charId) && charId > 0)

  const characters = await fetchExternalCharacters(characterIds)
  const sortedCharacters = sortCharactersByName(characters)

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-xl font-bold text-slate-900">
              {episode.name}
            </h3>
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-mono text-xs font-medium">
              {episode.episode}
            </span>
          </div>
        </div>
        <span className="text-sm font-medium text-slate-600">
          {sortedCharacters.length} personagens
        </span>
      </div>

      <div className="flex flex-col gap-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Personagens ({sortedCharacters.length})
        </h4>
        <CharacterList characters={sortedCharacters} />
      </div>
    </div>
  )
}

export async function EpisodeResultsWrapper({ episodeQuery }: { episodeQuery: string }) {
  try {
    return await EpisodeResults({ episodeQuery })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Ocorreu um erro inesperado.'
    return (
      <div className="max-w-md mx-auto bg-white border border-rose-200 rounded-lg p-6 text-center flex flex-col items-center gap-3" role="alert">
        <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 text-sm font-bold">
          !
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 text-base mb-1">Não foi possível carregar este episódio</h4>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{message}</p>
        </div>
        <ClearSearchButton />
      </div>
    )
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ episode?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const episodeQuery = resolvedSearchParams?.episode

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <header className="border-b border-slate-200 bg-white py-3 px-6 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://static.wikia.nocookie.net/rickandmorty/images/4/41/Pickle_rick_transparent_edgetrimmed.png/revision/latest?cb=20220105043415"
              alt="Pickle Rick Logo"
              className="w-7 h-7 object-contain"
            />
            <h1 className="text-base font-bold tracking-tight text-slate-900">
              PickleDex
            </h1>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Rick & Morty
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 md:py-10 flex flex-col gap-8">
        <div className="w-full flex flex-col items-center text-center gap-2 max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Personagens por Episódio
          </h2>
          <p className="text-slate-600 text-sm max-w-md">
            Digite o número de um episódio para visualizar a lista completa de personagens participantes.
          </p>
          <div className="w-full mt-4 flex justify-center">
            <SearchSection initialValue={episodeQuery || ''} />
          </div>
        </div>

        <div className="w-full border-t border-slate-200" />

        <div className="w-full min-h-[300px]">
          <Suspense
            key={episodeQuery || ''}
            fallback={
              <div className="flex flex-col items-center justify-center py-16 gap-3" data-testid="page-loading-spinner">
                <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-600 text-sm font-medium">
                  Carregando...
                </p>
              </div>
            }
          >
            {episodeQuery ? (
              <EpisodeResultsWrapper episodeQuery={episodeQuery} />
            ) : (
              <div className="text-center py-12 text-slate-500 text-sm animate-fade-in">
                Digite o número de um episódio acima para iniciar a busca.
              </div>
            )}
          </Suspense>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-500 bg-white flex flex-col gap-1">
        <p>PickleDex — Rick & Morty Episode Explorer</p>
        <p>
          Desenvolvido por{' '}
          <a
            href="https://github.com/migueww"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline font-medium text-emerald-600"
          >
            Miguel Barcellos (@migueww)
          </a>
        </p>
      </footer>
    </div>
  )
}
