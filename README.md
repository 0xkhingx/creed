# Creed — a two-sided intelligence layer for Bags creators and holders

Creators see real-time fee earnings and holder loyalty scores. Holders form **Packs** around creators they believe in and earn proportionally when the token grows. Groq reasons in the middle.

## How it works

- **Creator side:** enter a token mint → the server reads on-chain lifetime fees and claim events via the Bags SDK and returns earnings.
- **Holder side:** the dashboard renders fee analysis skeletons, loyalty scores, and Pack formation around creators.
- **AI layer:** Groq analysis runs **server-side** (`src/services/groq.ts` via `server/`) so API keys never reach the browser.

## Repo layout

| Dir | Stack | Contents |
|---|---|---|
| `server/` | Express + TypeScript | Bags SDK + Solana connection, `/api/fees/:mint` and analysis routes (`server/src/index.ts`) |
| `src/` | React 19 + Vite + Tailwind | Dashboard page (`src/pages/dashboard.tsx`), Bags + Groq clients (`src/services/bags.ts`, `groq.ts`), hooks, types |

## Run it locally

Requires Node 20+. You need a Solana RPC URL, a Bags API key, and a Groq API key in a root `.env` (see `.env.example`):

```bash
# terminal 1 — API server
cd server && npm ci && npm run dev

# terminal 2 — dashboard (http://localhost:5173)
npm ci && npm run dev
```

```bash
npm run build    # tsc + vite build
npm run lint     # eslint .
```

## API sketch

- `GET /api/fees/:mint` → `{ mint, lifetimeFees, totalClaimed }` (lamports → SOL)
- Analysis routes wrap Groq so keys stay server-side.

## Status

Working pipeline (real on-chain data → Groq analysis → loyalty scores), pre-deployment. No live URL yet.

## License

MIT — see [LICENSE](LICENSE).
