import { useState, FormEvent } from 'react'

interface UseEpisodeSearchOptions {
  onSearch: (episodeId: number) => void
  initialValue?: string
}

export function useEpisodeSearch({ onSearch, initialValue = '' }: UseEpisodeSearchOptions) {
  const [inputValue, setInputValue] = useState(initialValue)
  const [prevInitialValue, setPrevInitialValue] = useState(initialValue)
  const [validationError, setValidationError] = useState<string | null>(null)

  if (initialValue !== prevInitialValue) {
    setPrevInitialValue(initialValue)
    setInputValue(initialValue)
  }

  const handleInputValueChange = (value: string) => {
    setInputValue(value)
    if (validationError) {
      setValidationError(null)
    }
  }

  const handleSubmit = (e: FormEvent) => {
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

  return {
    inputValue,
    validationError,
    handleInputValueChange,
    handleSubmit,
  }
}
