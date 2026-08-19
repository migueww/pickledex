'use client'

import React, { useState, useEffect } from 'react'

interface EpisodeSearchProps {
  onSearch: (episodeId: number) => void
  isLoading: boolean
  initialValue?: string
}

export function EpisodeSearch({ onSearch, isLoading, initialValue = '' }: EpisodeSearchProps) {
  const [inputValue, setInputValue] = useState(initialValue)
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    setInputValue(initialValue)
  }, [initialValue])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const trimmed = inputValue.trim()

    if (!trimmed) {
      setValidationError('Por favor, informe o número de um episódio.')
      return
    }

    if (!/^\d+$/.test(trimmed)) {
      setValidationError('O campo deve aceitar somente números inteiros positivos.')
      return
    }

    const episodeNum = parseInt(trimmed, 10)

    if (episodeNum <= 0) {
      setValidationError('O número do episódio deve ser maior que zero.')
      return
    }

    setValidationError(null)
    onSearch(episodeNum)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex flex-col gap-2">
        <label htmlFor="episode-input" className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase self-start">
          Número do Episódio
        </label>
        <div className="flex gap-2 p-1.5 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl focus-within:border-emerald-500/50 focus-within:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-300">
          <input
            id="episode-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              if (validationError) setValidationError(null)
            }}
            placeholder="Ex: 1"
            disabled={isLoading}
            className="flex-1 px-3 py-2 bg-transparent text-white placeholder-slate-600 focus:outline-none text-base border-none"
          />
          <button
            type="submit"
            disabled={isLoading}
            aria-label="Buscar"
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-lg transition-all duration-200 focus:outline-none active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px] shadow-[0_0_12px_rgba(16,185,129,0.25)] hover:shadow-[0_0_18px_rgba(16,185,129,0.45)] cursor-pointer"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" data-testid="search-spinner"></span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs tracking-wider uppercase">
                <span>Buscar</span>
                <span>⚡</span>
              </span>
            )}
          </button>
        </div>
        {validationError && (
          <p className="text-xs text-rose-400 mt-1 font-mono font-semibold text-left" role="alert">
            ⚡ {validationError}
          </p>
        )}
      </div>
    </form>
  )
}
