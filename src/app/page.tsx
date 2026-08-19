'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { EpisodeSearch } from '@/components/episode-search'
import { CharacterList } from '@/components/character-list'
import { fetchEpisode } from '@/services/rick-and-morty-api'
import { sortCharactersByName } from '@/utils/sort-characters'
import { EpisodeWithCharacters } from '@/types/rick-and-morty'

function SVGPortal() {
  return (
    <div className="relative w-48 h-48 sm:w-64 sm:h-64 mx-auto my-6 animate-float flex items-center justify-center">
      <svg className="absolute w-full h-full animate-portal-spin text-emerald-500/30" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5, 8" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="20, 5" />
      </svg>
      <svg className="absolute w-5/6 h-5/6 animate-[portal-spin_15s_linear_infinite_reverse] text-lime-400/40" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="15, 10" />
        <path d="M 50 8 A 42 42 0 0 1 92 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <div className="w-2/3 h-2/3 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-lime-400 animate-portal-pulse opacity-90 shadow-[0_0_50px_rgba(16,185,129,0.6)] flex items-center justify-center">
        <div className="w-11/12 h-11/12 rounded-full bg-slate-950/80 flex items-center justify-center text-4xl select-none">
          🌀
        </div>
      </div>
    </div>
  )
}

function PickleDexApp() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const episodeQuery = searchParams.get('episode')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [episode, setEpisode] = useState<EpisodeWithCharacters | null>(null)

  useEffect(() => {
    if (episodeQuery) {
      const trimmed = episodeQuery.trim()
      if (/^\d+$/.test(trimmed)) {
        const episodeId = parseInt(trimmed, 10)
        if (episodeId > 0) {
          const loadEpisode = async () => {
            setIsLoading(true)
            setError(null)
            setEpisode(null)
            try {
              const episodeData = await fetchEpisode(episodeId)
              setEpisode(episodeData)
            } catch (err) {
              const message = err instanceof Error ? err.message : 'Ocorreu um erro inesperado.'
              setError(message)
            } finally {
              setIsLoading(false)
            }
          }
          loadEpisode()
        } else {
          setError('O número do episódio deve ser maior que zero.')
          setEpisode(null)
        }
      } else {
        setError('O campo deve aceitar somente números inteiros positivos.')
        setEpisode(null)
      }
    } else {
      setEpisode(null)
      setError(null)
    }
  }, [episodeQuery])

  const handleSearch = (episodeId: number) => {
    router.push(`${pathname}?episode=${episodeId}`)
  }

  const sortedCharacters = episode ? sortCharactersByName(episode.characters) : []

  const SUGGESTED_EPISODES = [
    { id: 1, name: 'Pilot (S01E01)' },
    { id: 10, name: 'Close Rick-counters (S01E10)' },
    { id: 28, name: 'The Ricklantis Mixup (S03E07)' },
    { id: 41, name: 'Star Mort (S04E10)' }
  ]

  return (
    <div className="min-h-screen text-slate-100 font-sans flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
      <header className="border-b border-slate-900 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-50 py-4 px-6 transition-all duration-300">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-lime-400 rounded-xl flex items-center justify-center font-black text-slate-950 text-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-pulse">
              RM
            </div>
            <div>
              <h1 className="text-xl font-black tracking-wider uppercase bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Pickledex
              </h1>
              <p className="text-[10px] uppercase font-mono tracking-widest text-slate-500">
                Rick & Morty Episode Portal
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-900/60 border border-slate-800 rounded-full text-xs font-mono text-emerald-400/80">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>SYSTEM ONLINE</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 md:py-12 flex flex-col items-center gap-10">
        <div className="w-full flex flex-col items-center text-center gap-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-1">
            ⚡ Portal Transdimensional
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Explore os <span className="bg-gradient-to-r from-emerald-400 to-lime-300 bg-clip-text text-transparent">Episódios</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-lg leading-relaxed">
            Abra portais dimensionais. Digite um número de episódio para invocar a lista completa de personagens participantes.
          </p>
          <div className="w-full mt-4 flex justify-center">
            <EpisodeSearch 
              onSearch={handleSearch} 
              isLoading={isLoading} 
              initialValue={episodeQuery || ''} 
            />
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

        <div className="w-full min-h-[300px]">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4" data-testid="page-loading-spinner">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-emerald-500/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-emerald-400 font-mono text-sm tracking-widest animate-pulse mt-2">
                ESTABELECENDO CANAL PORTAL...
              </p>
            </div>
          )}

          {error && (
            <div className="max-w-md mx-auto bg-rose-950/20 border border-rose-500/30 rounded-2xl p-8 text-center flex flex-col items-center gap-4 backdrop-blur-md shadow-[0_0_30px_rgba(244,63,94,0.05)]" role="alert">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 text-xl font-bold">
                ⚠️
              </div>
              <div>
                <h4 className="font-bold text-rose-400 text-lg mb-1">Erro de Conexão</h4>
                <p className="text-rose-200/80 text-sm leading-relaxed whitespace-pre-line">{error}</p>
              </div>
              <button 
                onClick={() => router.push(pathname)}
                className="mt-2 text-xs font-semibold px-4 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 transition-all active:scale-95"
              >
                Limpar Busca
              </button>
            </div>
          )}

          {!isLoading && !error && episode && (
            <div className="flex flex-col gap-8 animate-fade-in">
              <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
                <div className="flex flex-col gap-2">
                  <div className="inline-flex self-start px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-bold tracking-wider uppercase">
                    {episode.episode}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    {episode.name}
                  </h3>
                </div>
                <div className="bg-slate-950/80 px-5 py-3 rounded-xl border border-slate-800/80 flex flex-col items-end gap-0.5 min-w-[120px] self-start sm:self-center">
                  <span className="text-slate-500 text-[10px] font-mono tracking-wider uppercase">Personagens</span>
                  <span className="text-white font-extrabold text-xl font-mono text-emerald-400">
                    {sortedCharacters.length}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 border-b border-slate-900 pb-3">
                  <span className="text-lg">👥</span>
                  <h4 className="text-xl font-extrabold text-white tracking-tight uppercase">
                    Characters
                  </h4>
                </div>
                <CharacterList characters={sortedCharacters} />
              </div>
            </div>
          )}

          {!isLoading && !error && !episode && (
            <div className="text-center py-8 flex flex-col items-center gap-6 animate-fade-in">
              <SVGPortal />
              <div className="max-w-md mx-auto">
                <h4 className="text-lg font-bold text-slate-200">Pronto para Teletransporte</h4>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  Insira o código do universo acima ou clique em uma das sugestões rápidas de episódios mais acessados do portal:
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {SUGGESTED_EPISODES.map((sug) => (
                    <button
                      key={sug.id}
                      onClick={() => handleSearch(sug.id)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900/50 hover:bg-emerald-500/10 border border-slate-800 hover:border-emerald-500/30 text-slate-300 hover:text-emerald-400 transition-all duration-200 active:scale-95 cursor-pointer"
                    >
                      {sug.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600 bg-slate-950/20 font-mono">
        <p>PICKLEDEX PORTAL SYSTEM V2.6 • ALL REALITIES COVERED</p>
      </footer>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center flex-col gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-mono text-emerald-400 animate-pulse uppercase tracking-widest">Sincronizando portal...</p>
        </div>
      }
    >
      <PickleDexApp />
    </Suspense>
  )
}
