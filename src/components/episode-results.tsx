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
