# Rick & Morty Episode Explorer (Pickledex)

Uma aplicação web moderna e premium desenvolvida em Next.js para consultar episódios da API pública de Rick and Morty, visualizar os personagens que aparecem em cada episódio e listá-los em ordem alfabética.

A interface possui uma estética inspirada em portais de ficção científica da série, abandonando o design genérico e fornecendo uma experiência fluida, responsiva e de alto desempenho.

---

## Recursos & Diferenciais

- **Sincronização com a URL**: A barra de busca e a URL da página são sincronizadas em tempo real (`?episode=X`). Isso serve como fonte única de verdade (Single Source of Truth), permitindo que o estado da busca e os resultados persistam ao recarregar a página ou compartilhar o link.
- **Design Interativo & Portal Cósmico**:
  - Plano de fundo dinâmico com nebulosas espaciais em gradiente radial e grade de malha futurista.
  - Animação de Portal SVG giratório para buscas vazias com atalhos e sugestões de episódios mais acessados.
  - Cards com efeito de glassmorphism, vinheta e zoom suave no hover da imagem.
  - Badges de estado com sinalizador de batimento pulsante (*Alive* com ponto verde piscando, *Dead* com vermelho, *unknown* com cinza).
- **Validação Local de Inputs**: Bloqueia chamadas de API desnecessárias para campos vazios, textos, números negativos, decimais ou zero.
- **BFF (Backend-For-Frontend) com Cache e Desduplicação**:
  - Rotas de API dedicadas no Next.js (`/api/episodes` e `/api/characters`) para desonerar o cliente.
  - Cache em memória otimizado com tempo de vida útil (TTL) de 24 horas para episódios e personagens.
  - Deduplicação de requisições concorrentes idênticas no nível de rede para economizar chamadas HTTP repetidas à API externa de Rick & Morty.
  - Busca paralela utilizando `Promise.all` para maximizar o desempenho.
- **Ordenação Alfabética**: Ordena os personagens pelo nome utilizando lógica testada baseada em `localeCompare`.
- **Favicon Personalizado**: Favicon temático integrado via metadados nativos do Next.js.

---

## Stack Tecnológica

- **Next.js 16+** (App Router - Standalone mode)
- **React 19**
- **TypeScript** (Strict Mode)
- **Tailwind CSS v4** (Variáveis nativas de `@theme`, gradientes avançados e animações customizadas)
- **Vitest** (Testes unitários e de integração rápidos)
- **Docker & Docker Compose** (Containerização simplificada em múltiplos estágios)

---

## Decisões Técnicas

1. **Uso de `Promise.all`**: O endpoint de episódios da API de Rick and Morty retorna apenas uma lista de URLs correspondentes aos personagens do episódio. Para obter os dados completos de cada personagem, é necessário fazer uma requisição HTTP individual. O uso de `Promise.all` permite disparar todas as requisições em paralelo no nível de rede, otimizando o tempo total de resposta.
2. **Encapsulamento de Componentes Clientes com `<Suspense>`**: Para evitar avisos de pré-renderização estática do Next.js ao ler parâmetros de busca via `useSearchParams()`, o layout da página principal foi segmentado em componentes de fluxo de hidratação cliente e encapsulado em `<Suspense>`.
3. **Ordenação Isolada (`utils/sort-characters.ts`)**: A ordenação alfabética foi isolada em uma função pura e independente do componente visual. Isso garante que a lógica de ordenação possa ser facilmente testada unitariamente e reutilizada se necessário, sem a sobrecarga de renderização do React. Utilizamos `localeCompare` para lidar corretamente com acentuações e caracteres especiais no alfabeto.
4. **Tratamento de Erros Resiliente**: Centralizamos o tratamento de erros HTTP na camada de serviços. Respostas como `404` (Episódio não encontrado) e erros genéricos de rede são capturados e mapeados para mensagens em português amigáveis ao usuário, evitando crashs e exibindo o estado correto de erro na interface.
5. **Estrutura de Testes com Vitest**: Testes cobrem a lógica crítica (ordenação alfabética em múltiplos cenários e comportamento dos serviços da API com mocks de rede), garantindo segurança total em refatorações estéticas.

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
