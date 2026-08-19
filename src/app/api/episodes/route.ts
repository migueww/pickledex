import { NextRequest, NextResponse } from 'next/server'
import { fetchExternalEpisode, fetchExternalCharacters, UpstreamError } from '@/services/rick-and-morty-external'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const idStr = searchParams.get('id')

  if (!idStr) {
    return NextResponse.json({ error: 'Parâmetro id é obrigatório.' }, { status: 400 })
  }

  const id = parseInt(idStr, 10)
  if (isNaN(id) || id <= 0) {
    return NextResponse.json({ error: 'O id deve ser um número inteiro positivo.' }, { status: 400 })
  }

  try {
    const episode = await fetchExternalEpisode(id)
    
    const characterIds = episode.characters.map(url => {
      const parts = url.split('/')
      return parseInt(parts[parts.length - 1], 10)
    }).filter(charId => !isNaN(charId) && charId > 0)

    const characters = await fetchExternalCharacters(characterIds)

    const episodeWithCharacters = {
      id: episode.id,
      name: episode.name,
      episode: episode.episode,
      characters
    }

    return NextResponse.json(episodeWithCharacters)
  } catch (error) {
    if (error instanceof UpstreamError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
