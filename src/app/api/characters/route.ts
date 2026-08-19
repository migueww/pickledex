import { NextRequest, NextResponse } from 'next/server'
import { fetchExternalCharacters, UpstreamError } from '@/services/rick-and-morty-external'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const idsStr = searchParams.get('ids')

  if (!idsStr) {
    return NextResponse.json({ error: 'Parâmetro ids é obrigatório.' }, { status: 400 })
  }

  const ids = idsStr
    .split(',')
    .map(val => parseInt(val.trim(), 10))
    .filter(val => !isNaN(val) && val > 0)

  if (ids.length === 0) {
    return NextResponse.json({ error: 'Parâmetro ids deve conter números válidos.' }, { status: 400 })
  }

  if (ids.length > 200) {
    return NextResponse.json({ error: 'Parâmetro ids não pode conter mais do que 200 números.' }, { status: 400 })
  }

  try {
    const characters = await fetchExternalCharacters(ids)
    return NextResponse.json(characters)
  } catch (error) {
    if (error instanceof UpstreamError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
