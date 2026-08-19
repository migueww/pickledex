'use client'

import { useState } from 'react'
import { EpisodeSearch } from '@/components/episode-search'
import { CharacterList } from '@/components/character-list'
import { fetchEpisode } from '@/services/rick-and-morty-api'
import { sortCharactersByName } from '@/utils/sort-characters'
import { EpisodeWithCharacters, Character } from '@/types/rick-and-morty'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [episode, setEpisode] = useState<EpisodeWithCharacters | null>(null)
  const [characters, setCharacters] = useState<Character[] | null>(null)

  const handleSearch = async (episodeId: number) => {
    setIsLoading(true)
    setError(null)
    setEpisode(null)
    setCharacters(null)

    try {
      // 1. Consultar o episódio e personagens na API do BFF (uma única chamada)
      const episodeData = await fetchEpisode(episodeId)
      setEpisode(episodeData)

      // 2. Ordenar alfabeticamente pelo nome
      const sortedCharacters = sortCharactersByName(episodeData.characters)
      setCharacters(sortedCharacters)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ocorreu um erro inesperado.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col">
      {/* Cabeçalho */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 py-6 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-slate-950 text-xl shadow-md shadow-emerald-500/20">
              RM
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Pickledex</h1>
              <p className="text-xs text-slate-400">Rick & Morty Episode Explorer</p>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 flex flex-col items-center gap-8">
        <div className="w-full flex flex-col items-center text-center gap-3 max-w-xl">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-emerald-400">
            Explore os Episódios
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Informe o número de um episódio para visualizar todos os personagens que apareceram nele, ordenados alfabeticamente.
          </p>
          <EpisodeSearch onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Divisor */}
        <hr className="w-full border-slate-800 my-4" />

        {/* Área de Resultados e Feedbacks */}
        <div className="w-full">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" data-testid="page-loading-spinner"></div>
              <p className="text-slate-400 font-medium">Carregando dados do episódio e personagens...</p>
            </div>
          )}

          {error && (
            <div className="max-w-md mx-auto bg-rose-500/10 border border-rose-500/30 rounded-lg p-6 text-center flex flex-col gap-2" role="alert">
              <span className="text-rose-400 text-3xl font-bold">⚠️</span>
              <p className="text-rose-200 font-medium whitespace-pre-line">{error}</p>
            </div>
          )}

          {!isLoading && !error && episode && characters && (
            <div className="flex flex-col gap-6">
              {/* Informações do Episódio */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="text-emerald-400 font-mono text-sm font-semibold tracking-wider uppercase">
                    {episode.episode}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    {episode.name}
                  </h3>
                </div>
                <div className="bg-slate-800 px-4 py-2 rounded-md border border-slate-700 text-right self-start sm:self-center">
                  <span className="text-slate-400 text-xs block">Personagens</span>
                  <span className="text-white font-bold text-lg">{characters.length}</span>
                </div>
              </div>

              {/* Seção de Personagens */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xl font-bold text-slate-200 border-b border-slate-800 pb-2">
                  Characters
                </h4>
                <CharacterList characters={characters} />
              </div>
            </div>
          )}

          {!isLoading && !error && !episode && (
            <div className="text-center py-16 text-slate-500 flex flex-col items-center gap-2">
              <div className="w-16 h-16 border-2 border-dashed border-slate-700 rounded-full flex items-center justify-center text-2xl">
                🔍
              </div>
              <p className="font-medium mt-2">Nenhum episódio consultado ainda.</p>
              <p className="text-xs text-slate-600">Use a busca acima para encontrar um episódio.</p>
            </div>
          )}
        </div>
      </main>

      {/* Rodapé */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500 bg-slate-900/10">
        <p>Pickledex © 2026. Desenvolvido para o desafio técnico.</p>
      </footer>
    </div>
  )
}
