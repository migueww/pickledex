# Rick & Morty Episode Explorer (Pickledex)

Uma aplicação web moderna e minimalista desenvolvida em Next.js para consultar episódios da API pública de Rick and Morty, visualizar os personagens que aparecem em cada episódio e listá-los em ordem alfabética.

---

## Sobre

Este projeto foi construído como parte de um desafio técnico para um processo seletivo. O foco principal é a **qualidade de código, simplicidade, legibilidade, testes automatizados e facilidade de execução** via Docker ou localmente.

---

## Stack Tecnológica

- **Next.js 14+** (App Router)
- **React 18**
- **TypeScript** (Strict Mode)
- **Tailwind CSS** (Design minimalista e responsivo)
- **Vitest** (Testes unitários e de integração rápidos)
- **Docker & Docker Compose** (Containerização simplificada)

---

## Funcionalidades

- **Busca por Número de Episódio**: Campo numérico para consulta rápida com submissão via Enter ou clique.
- **Validação Local de Inputs**: Bloqueia chamadas de API desnecessárias para campos vazios, textos, números negativos, decimais ou zero.
- **Requisições em Paralelo**: Busca concorrente de dados dos personagens utilizando `Promise.all` para maximizar o desempenho.
- **Ordenação Alfabética**: Ordena os personagens pelo nome de forma isolada e testada utilizando a lógica de `localeCompare`.
- **Feedback Visual Claro**: Estados visuais específicos para carregamento (loading), sucesso e mensagens de erro amigáveis para falhas de rede ou episódios inexistentes.

---

## Decisões Técnicas

1. **Uso de `Promise.all`**: O endpoint de episódios da API de Rick and Morty retorna apenas uma lista de URLs correspondentes aos personagens do episódio. Para obter os dados completos de cada personagem, é necessário fazer uma requisição HTTP individual. O uso de `Promise.all` permite disparar todas as requisições em paralelo no nível de rede, em vez de realizá-las sequencialmente, otimizando drasticamente o tempo total de resposta.
2. **Ordenação Isolada (`utils/sort-characters.ts`)**: A ordenação alfabética foi isolada em uma função pura e independente do componente visual. Isso garante que a lógica de ordenação possa ser facilmente testada unitariamente e reutilizada se necessário, sem a sobrecarga de renderização do React. Utilizamos `localeCompare` para lidar corretamente com acentuações e caracteres especiais no alfabeto.
3. **Tratamento de Erros Resiliente**: Centralizamos o tratamento de erros HTTP na camada de serviços. Respostas como `404` (Episódio não encontrado) e erros genéricos de rede são capturados e mapeados para mensagens em português amigáveis ao usuário, evitando crashs e exibindo o estado correto de erro na interface.
4. **Facilidade com Docker**: O uso do Docker e Docker Compose remove a barreira de instalação local do Node.js. O build é estruturado em múltiplos estágios (multi-stage) e utiliza a diretiva `output: 'standalone'` do Next.js, gerando uma imagem de produção extremamente leve e segura (rodando sob usuário não-root).
5. **Estrutura de Testes com Vitest**: Optamos pelo Vitest pela sua alta velocidade e compatibilidade imediata com ES Modules e TypeScript. Os testes cobrem a lógica crítica (ordenação alfabética em múltiplos cenários e comportamento dos serviços da API com mocks de rede).

---

## Estrutura do Projeto

```text
├── src/
│   ├── app/
│   │   ├── page.tsx            # Página principal contendo o gerenciamento de estados
│   │   ├── layout.tsx          # Layout básico global do Next.js
│   │   └── globals.css         # Estilos globais e integração do Tailwind CSS
│   │
│   ├── components/
│   │   ├── episode-search.tsx  # Input de pesquisa e validações de submit
│   │   ├── character-card.tsx  # Card visual de cada personagem
│   │   └── character-list.tsx  # Grid responsiva de exibição dos cards
│   │
│   ├── services/
│   │   └── rick-and-morty-api.ts  # Camada de comunicação com a API externa
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
