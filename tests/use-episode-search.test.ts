import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useEpisodeSearch } from '@/hooks/use-episode-search'

describe('useEpisodeSearch Hook', () => {
  it('should initialize with default states', () => {
    const mockOnSearch = vi.fn()
    const { result } = renderHook(() => useEpisodeSearch({ onSearch: mockOnSearch }))

    expect(result.current.inputValue).toBe('')
    expect(result.current.validationError).toBeNull()
  })

  it('should initialize with provided initialValue', () => {
    const mockOnSearch = vi.fn()
    const { result } = renderHook(() => useEpisodeSearch({ onSearch: mockOnSearch, initialValue: '12' }))

    expect(result.current.inputValue).toBe('12')
  })

  it('should update input value and clear validation error on input change', () => {
    const mockOnSearch = vi.fn()
    const { result } = renderHook(() => useEpisodeSearch({ onSearch: mockOnSearch }))

    act(() => {
      const mockEvent = { preventDefault: vi.fn() } as any
      result.current.handleSubmit(mockEvent)
    })
    expect(result.current.validationError).toBe('Por favor, informe o número de um episódio.')

    act(() => {
      result.current.handleInputValueChange('5')
    })
    expect(result.current.inputValue).toBe('5')
    expect(result.current.validationError).toBeNull()
  })

  it('should validate and throw error if submitting empty string', () => {
    const mockOnSearch = vi.fn()
    const { result } = renderHook(() => useEpisodeSearch({ onSearch: mockOnSearch }))

    act(() => {
      const mockEvent = { preventDefault: vi.fn() } as any
      result.current.handleSubmit(mockEvent)
    })
    expect(result.current.validationError).toBe('Por favor, informe o número de um episódio.')
    expect(mockOnSearch).not.toHaveBeenCalled()
  })

  it('should validate and throw error if submitting non-numeric input', () => {
    const mockOnSearch = vi.fn()
    const { result } = renderHook(() => useEpisodeSearch({ onSearch: mockOnSearch, initialValue: 'abc' }))

    act(() => {
      const mockEvent = { preventDefault: vi.fn() } as any
      result.current.handleSubmit(mockEvent)
    })
    expect(result.current.validationError).toBe('O campo deve aceitar somente números inteiros positivos.')
    expect(mockOnSearch).not.toHaveBeenCalled()
  })

  it('should validate and throw error if submitting zero or negative', () => {
    const mockOnSearch = vi.fn()
    const { result } = renderHook(() => useEpisodeSearch({ onSearch: mockOnSearch, initialValue: '0' }))

    act(() => {
      const mockEvent = { preventDefault: vi.fn() } as any
      result.current.handleSubmit(mockEvent)
    })
    expect(result.current.validationError).toBe('O número do episódio deve ser maior que zero.')
    expect(mockOnSearch).not.toHaveBeenCalled()
  })

  it('should call onSearch with parsed integer on successful submit', () => {
    const mockOnSearch = vi.fn()
    const { result } = renderHook(() => useEpisodeSearch({ onSearch: mockOnSearch, initialValue: '  42   ' }))

    act(() => {
      const mockEvent = { preventDefault: vi.fn() } as any
      result.current.handleSubmit(mockEvent)
    })
    expect(result.current.validationError).toBeNull()
    expect(mockOnSearch).toHaveBeenCalledWith(42)
  })

  it('should sync local state if initialValue changes dynamically', () => {
    const mockOnSearch = vi.fn()
    const { result, rerender } = renderHook(
      ({ initialValue }) => useEpisodeSearch({ onSearch: mockOnSearch, initialValue }),
      { initialProps: { initialValue: '1' } }
    )

    expect(result.current.inputValue).toBe('1')

    rerender({ initialValue: '2' })
    expect(result.current.inputValue).toBe('2')
  })
})
