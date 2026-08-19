'use client'

import React from 'react'
import { useEpisodeSearch } from '@/hooks/use-episode-search'

interface EpisodeSearchProps {
  onSearch: (episodeId: number) => void
  isLoading: boolean
  initialValue?: string
}

export function EpisodeSearch({ onSearch, isLoading, initialValue = '' }: EpisodeSearchProps) {
  const {
    inputValue,
    validationError,
    handleInputValueChange,
    handleSubmit
  } = useEpisodeSearch({ onSearch, initialValue })

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex flex-col gap-1.5 text-left">
        <label htmlFor="episode-input" className="text-sm font-medium text-slate-700">
          Número do Episódio
        </label>
        <div className="flex gap-2">
          <input
            id="episode-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputValue}
            onChange={(e) => handleInputValueChange(e.target.value)}
            placeholder="Ex: 1"
            disabled={isLoading}
            className="flex-1 px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-600 text-sm transition-colors disabled:bg-slate-100 disabled:text-slate-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            aria-label="Buscar"
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[90px] cursor-pointer"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" data-testid="search-spinner"></span>
            ) : (
              <span>Buscar</span>
            )}
          </button>
        </div>
        {validationError && (
          <p className="text-xs text-rose-600 mt-1 font-medium" role="alert">
            {validationError}
          </p>
        )}
      </div>
    </form>
  )
}
