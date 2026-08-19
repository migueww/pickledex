# Rick & Morty Episode Explorer (Pickledex)

Aplicação web para consultar episódios da API do Rick and Morty e listar os personagens participantes em ordem alfabética.

## Tech Stack

- Next.js 16.3.1 (App Router)
- React 19.2.8
- TypeScript 5
- Tailwind CSS 4
- Vitest 4.1.11
- Docker (Node 22-alpine)

## Architecture

A aplicação está dividida nas seguintes camadas:

* `src/app/`: Roteamento e Server Components. Contém o layout global e a página principal (`page.tsx`) responsável por orquestrar a busca e renderização inicial.
* `src/components/`: Componentes visuais. Isola lógicas de interface, dividindo componentes de servidor (`CharacterList`) e de cliente (`EpisodeSearch`, `CharacterCard`).
* `src/hooks/`: Custom hooks (`use-episode-search.ts`). Isola a gestão de estado e validação de formulários da camada de UI.
* `src/services/`: Camada de acesso a dados (`rick-and-morty-external.ts`). Responsável por realizar o *fetch* na API externa, gerenciar o cache em memória e o agrupamento de requisições.
* `src/utils/`: Funções puras (`sort-characters.ts`), focadas na ordenação alfabética, sem dependências do React.
* `src/types/`: Tipagem estrita das entidades da API (`rick-and-morty.ts`).

**Fluxo de dados:** A busca inicia via formulário no cliente (atualizando a URL via query parameters). O Next.js executa o Server Component (`page.tsx`), que invoca a camada `services` para recuperar e mapear os dados da API externa. Em seguida, a camada `utils` ordena os resultados e a UI é gerada nativamente no servidor antes de ser enviada ao navegador.

## Performance

* **Cache de respostas:** O serviço mantém em memória os episódios (`episodeCache`) e personagens (`characterCache`) com TTL de 24 horas, evitando chamadas repetidas à API para o mesmo ID.
* **Deduplicação de requests:** Durante o *fetch*, mapeamentos locais (`pendingEpisodes`, `pendingCharacters`) retêm as `Promises` pendentes, impedindo chamadas paralelas idênticas para a mesma URL externa.
* **Lazy loading:** Uso do atributo `loading="lazy"` nas imagens do componente `CharacterCard` para adiar o carregamento de imagens fora do *viewport*.
* **Otimização de imagens:** Configurada com `unoptimized: true` no `next.config.ts`. Isso evita erros na conversão de imagens em containers Alpine simples que não possuem bibliotecas nativas de manipulação de imagem (ex: `sharp`), reduzindo tempo e tamanho do build.

## Error Handling

* **Erros da API externa:** Uma classe específica (`UpstreamError`) mapeia status HTTP falhos (ex: `404`, `429`, `500`) lançando exceções tipadas no servidor.
* **Tratamento de `429` (Too Many Requests):** O erro 429 é explicitamente interceptado pela classe `UpstreamError`, lançando uma mensagem clara recomendando tentar novamente.
* **Falhas de carregamento na UI:** O erro lançado pelo serviço é capturado no Server Component base por um `try/catch` (via `EpisodeResultsWrapper`), renderizando um alerta contextualizado na página em vez de falhar a aplicação inteira.
* **Estados vazios:** Se um episódio não possuir personagens mapeados, o componente `CharacterList` exibe um bloco visual explícito indicando ausência de registros.
* **Erro de imagem:** O `CharacterCard` escuta falhas pontuais de renderização (`onError`) substituindo a imagem quebrada pela inicial do nome do personagem.

## Testing

* **Framework:** Vitest integrado com React Testing Library e JSDom.
* **Cobertura:** Testes unitários para ordenação (`sort-characters.ts`), custom hook de busca (`use-episode-search.ts`), serviço de cache/deduplicação (`services.test.ts`), componentes visuais (`components.test.tsx`) e fluxo de integração de UI (`integration.test.tsx`).
* **Testes unitários vs. integração:** Lógicas de domínio, hooks e serviços são validados de forma unitária. Renderizações de árvore de componentes e comportamentos integrados de requisição e fallbacks na página são validados na árvore DOM de integração.

## Security

* **Validação de entrada:** O input do usuário é validado via Expressões Regulares (`/^\d+$/`) garantindo exclusivamente números inteiros e positivos antes de chegar na camada de I/O.
* **Ausência de secrets:** A URL base da API é gerida isoladamente por variáveis de ambiente (`RICK_AND_MORTY_API_URL`).
* **Segurança do Container:** O container de produção executa sob o usuário `nextjs` (UID 1001) ao invés do usuário `root` (padrão), o que reduz as permissões caso a aplicação sofra comprometimento.

## Project Structure

```text
├── src/
│   ├── app/          # Roteamento do Next.js App Router (Server Components e layout global)
│   ├── components/   # Componentes visuais React (Client e Server Components isolados)
│   ├── hooks/        # Custom Hooks para separação de lógica de estado (business logic)
│   ├── services/     # Camada de comunicação com a API externa (fetch, cache e tratamento de erros)
│   ├── utils/        # Funções utilitárias puras e helpers sem dependência direta do React
│   └── types/        # Tipagem estrita TypeScript e interfaces de dados da aplicação
│
├── tests/            # Configurações do Vitest e suíte de testes automatizados (unitários e de tela)
│
├── Dockerfile        # Build multi-stage focado em segurança e performance (Standalone mode)
└── docker-compose.yml# Orquestração do serviço web para facilitar o setup e a execução
```

## Getting Started

### Docker

Para rodar via container:

```bash
docker compose up -d --build
```
A aplicação iniciará em http://localhost:3000

### Local

Requisitos: Node.js 22 e npm.

```bash
# 1. Instalar as dependências
npm install

# 2. Iniciar o servidor em ambiente de desenvolvimento
npm run dev
```
Acessar em http://localhost:3000

## Available Scripts

* `npm run dev`: Inicia o servidor Next.js em modo desenvolvimento.
* `npm run build`: Compila a aplicação para produção.
* `npm start`: Inicia o servidor de produção (requer compilação prévia via `build`).
* `npm run lint`: Executa a análise estática no código (ESLint).
* `npm test`: Roda a suíte de testes (Vitest) no modo de observação contínua (*watch*).
* `npm run test:run`: Executa todos os testes uma única vez (indicado para esteiras de CI/CD).

## Production Build

A aplicação é configurada para **Standalone Mode** no `next.config.ts`. Ao rodar `npm run build`, o framework cria a pasta `.next/standalone` empacotando unicamente as dependências vitais necessárias (descartando dependências de desenvolvimento) em conjunto com um próprio `server.js` leve.

O deploy utiliza orquestração via Docker (Multi-stage build). O `Dockerfile` possui 3 fases isoladas:
1. `deps`: Prepara as dependências via `npm ci`.
2. `builder`: Roda o build standalone otimizado do Next.js.
3. `runner`: Constrói a imagem final mínima copiando estritamente diretórios estáticos e `.next/standalone` da fase de build, executando a aplicação com privilégios reduzidos.
