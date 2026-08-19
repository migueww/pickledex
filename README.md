# Rick & Morty Episode Explorer (Pickledex)

Uma aplicação web moderna e premium desenvolvida em Next.js para consultar episódios da API pública de Rick and Morty, visualizar os personagens que aparecem em cada episódio e listá-los em ordem alfabética.

---

## Tech Stack

- **Next.js 16+** (App Router - Standalone mode)
- **React 19**
- **TypeScript** (Strict Mode)
- **Tailwind CSS v4** (Variáveis nativas de `@theme`, gradientes avançados e animações customizadas)
- **Vitest** (Testes unitários e de integração rápidos)
- **Docker & Docker Compose** (Containerização simplificada em múltiplos estágios)


---

## Estrutura do Projeto

```text
├── src/
│   ├── app/
│   │   ├── page.tsx            # Página principal com fluxo de estados e Suspense
│   │   ├── layout.tsx          # Layout global e injeção do Favicon nos metadados
│   │   └── globals.css         # Estilos globais, temas e animações do Tailwind CSS v4
│   │
│   ├── components/
│   │   ├── episode-search.tsx  # Input de busca responsivo com sincronismo de estado
│   │   ├── character-card.tsx  # Card visual de cada personagem com glow e badge pulsante
│   │   └── character-list.tsx  # Grid responsivo e animações de fade-in
│   │
│   ├── services/
│   │   ├── rick-and-morty-api.ts      # Cliente de consumo local (BFF)
│   │   └── rick-and-morty-external.ts # Lógica upstream de fetch, cache e deduplicação
│   │
│   ├── utils/
│   │   └── sort-characters.ts  # Lógica pura de ordenação alfabética
│   │
│   └── types/
│       └── rick-and-morty.ts   # Tipos TypeScript estritos para a API
│
├── tests/
│   ├── setup.ts                # Arquivo de setup do Vitest / Testing Library
│   ├── sort-characters.test.ts # Testes unitários do utilitário de ordenação
│   └── rick-and-morty-api.test.ts # Testes mockados do serviço de API
│
├── Dockerfile                  # Build multi-stage de produção
├── docker-compose.yml          # Definição do serviço web do container
├── vitest.config.ts            # Arquivo de configuração do Vitest
└── next.config.ts              # Configuração do Next.js (Standalone build & unoptimized images)
```

---

## Como Executar

### 1. Com Docker (Recomendado)

Certifique-se de ter o Docker e o Docker Compose instalados em sua máquina.

1. Suba o container da aplicação:
   ```bash
   docker compose up --build
   ```
2. A aplicação estará disponível na porta `3000`:
   ```text
   http://localhost:3000
   ```

### 2. Localmente (Sem Docker)

Certifique-se de utilizar o **Node.js (versão 18 ou superior)** e o **npm**.

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Abra o navegador em:
   ```text
   http://localhost:3000
   ```

---

## Como Executar os Testes

Para rodar a suite de testes automatizados com o Vitest:

1. Executar os testes em modo watch (interativo):
   ```bash
   npm test
   ```
2. Executar os testes uma única vez (modo CI/produção):
   ```bash
   npm run test:run
   ```
