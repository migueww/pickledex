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
