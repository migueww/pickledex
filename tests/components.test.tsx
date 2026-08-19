import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EpisodeSearch } from '@/components/episode-search'
import { CharacterCard } from '@/components/character-card'
import { CharacterList } from '@/components/character-list'
import { Character } from '@/types/rick-and-morty'
import React from 'react'

// Mock Next.js Image component to render a standard img tag for simplicity
vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: unknown; priority?: unknown }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fill, sizes, priority, ...imgProps } = props;
    return (
      // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
      <img
        {...imgProps}
      />
    )
  }
}))

describe('EpisodeSearch Component', () => {
  it('renders input, labels and submit button correctly', () => {
    render(<EpisodeSearch onSearch={vi.fn()} isLoading={false} />)

    expect(screen.getByLabelText('Número do Episódio')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ex: 1')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeInTheDocument()
  })

  it('shows error validation when submitting empty input', () => {
    render(<EpisodeSearch onSearch={vi.fn()} isLoading={false} />)

    const input = screen.getByPlaceholderText('Ex: 1')
    const form = input.closest('form')!
    fireEvent.submit(form)

    expect(screen.getByRole('alert')).toHaveTextContent('Por favor, informe o número de um episódio.')
  })

  it('shows error validation when submitting non-numeric input', () => {
    render(<EpisodeSearch onSearch={vi.fn()} isLoading={false} />)

    const input = screen.getByPlaceholderText('Ex: 1')
    fireEvent.change(input, { target: { value: 'abc' } })

    const form = input.closest('form')!
    fireEvent.submit(form)

    expect(screen.getByRole('alert')).toHaveTextContent('O campo deve aceitar somente números inteiros positivos.')
  })

  it('shows error validation when submitting zero or negative input', () => {
    render(<EpisodeSearch onSearch={vi.fn()} isLoading={false} />)

    const input = screen.getByPlaceholderText('Ex: 1')
    fireEvent.change(input, { target: { value: '0' } })

    const form = input.closest('form')!
    fireEvent.submit(form)

    expect(screen.getByRole('alert')).toHaveTextContent('O número do episódio deve ser maior que zero.')
  })

  it('submits valid episode number and calls onSearch', () => {
    const mockOnSearch = vi.fn()
    render(<EpisodeSearch onSearch={mockOnSearch} isLoading={false} />)

    const input = screen.getByPlaceholderText('Ex: 1')
    fireEvent.change(input, { target: { value: '5' } })

    const form = input.closest('form')!
    fireEvent.submit(form)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(mockOnSearch).toHaveBeenCalledWith(5)
  })

  it('disables input and button and shows spinner during loading', () => {
    render(<EpisodeSearch onSearch={vi.fn()} isLoading={true} />)

    expect(screen.getByPlaceholderText('Ex: 1')).toBeDisabled()
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByTestId('search-spinner')).toBeInTheDocument()
  })
})

describe('CharacterCard Component', () => {
  const mockCharacterAlive: Character = {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg'
  }

  const mockCharacterDead: Character = {
    id: 2,
    name: 'Morty Smith',
    status: 'Dead',
    species: 'Human',
    image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg'
  }

  const mockCharacterUnknown: Character = {
    id: 3,
    name: 'No-Name Ghost',
    status: 'unknown',
    species: 'Ghost',
    image: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg'
  }

  it('renders character information correctly', () => {
    render(<CharacterCard character={mockCharacterAlive} />)

    expect(screen.getByRole('heading', { name: 'Rick Sanchez' })).toBeInTheDocument()
    expect(screen.getByText('Human')).toBeInTheDocument()
    expect(screen.getByText('Alive')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Rick Sanchez' })).toBeInTheDocument()
  })

  it('displays Alive status badge with correct styling classes', () => {
    render(<CharacterCard character={mockCharacterAlive} />)
    const badge = screen.getByText('Alive')
    expect(badge).toHaveClass('bg-emerald-500/20')
    expect(badge).toHaveClass('text-emerald-400')
  })

  it('displays Dead status badge with correct styling classes', () => {
    render(<CharacterCard character={mockCharacterDead} />)
    const badge = screen.getByText('Dead')
    expect(badge).toHaveClass('bg-rose-500/20')
    expect(badge).toHaveClass('text-rose-400')
  })

  it('displays unknown status badge with correct styling classes', () => {
    render(<CharacterCard character={mockCharacterUnknown} />)
    const badge = screen.getByText('unknown')
    expect(badge).toHaveClass('bg-slate-500/20')
    expect(badge).toHaveClass('text-slate-400')
  })

  it('renders a fallback initials avatar when image loading fails', () => {
    render(<CharacterCard character={mockCharacterAlive} />)
    const img = screen.getByRole('img', { name: 'Rick Sanchez' })

    // Simulate image error event
    fireEvent.error(img)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByText('R')).toBeInTheDocument()
    expect(screen.getByText('R')).toHaveClass('bg-slate-900')
  })

  it('renders fallback initials avatar immediately if image URL is empty', () => {
    const characterNoImage = { ...mockCharacterAlive, image: '' }
    render(<CharacterCard character={characterNoImage} />)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByText('R')).toBeInTheDocument()
  })
})

describe('CharacterList Component', () => {
  const mockCharacters: Character[] = [
    { id: 1, name: 'Rick', status: 'Alive', species: 'Human', image: '' },
    { id: 2, name: 'Morty', status: 'Alive', species: 'Human', image: '' }
  ]

  it('renders character cards correctly when characters list is provided', () => {
    render(<CharacterList characters={mockCharacters} />)

    expect(screen.getByRole('heading', { name: 'Rick' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Morty' })).toBeInTheDocument()
  })

  it('renders correct empty message when list of characters is empty', () => {
    render(<CharacterList characters={[]} />)

    expect(screen.getByText('Nenhum personagem encontrado para este episódio.')).toBeInTheDocument()
  })
})
