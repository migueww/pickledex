import { Suspense } from 'react'
import { SearchSection } from '@/components/search-section'
import { EpisodeResultsWrapper } from '@/components/episode-results'

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
