'use client'

import React, { useState } from 'react'

interface EpisodeSearchProps {
  onSearch: (episodeId: number) => void
  isLoading: boolean
}

export function EpisodeSearch({ onSearch, isLoading }: EpisodeSearchProps) {
  const [inputValue, setInputValue] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const trimmed = inputValue.trim()

    if (!trimmed) {
      setValidationError('Por favor, informe o número de um episódio.')
      return
    }

    // Apenas números inteiros positivos (dígitos de 0-9)
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
        <label htmlFor="episode-input" className="text-sm font-medium text-slate-300">
          Número do Episódio
        </label>
        <div className="flex gap-2">
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
            className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[90px]"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" data-testid="search-spinner"></span>
            ) : (
              'Buscar'
            )}
          </button>
        </div>
        {validationError && (
          <p className="text-sm text-red-400 mt-1 font-medium" role="alert">
            {validationError}
          </p>
        )}
      </div>
    </form>
  )
}
