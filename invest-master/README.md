# Invest Master — site estático

Site em HTML/CSS/JS. A página **Contempladas** consome dados da API Invest Master apenas via **proxy server-side** na Vercel (`/api/cartas`), para que a **API Key** nunca vá ao navegador.

## Variáveis de ambiente (Vercel)

Configure no painel do projeto (**Settings → Environment Variables**) ou com `vercel env`:

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `INVESTMASTER_API_KEY` | **Sim** | Chave da API (ex.: `IM-…`). Usada no servidor com `Authorization: Bearer …`. **Não** commite no Git nem coloque em JS/HTML público. |
| `INVESTMASTER_API_BASE_URL` | Não | Origem da API, **sem** path final. Padrão: `https://api.investmaster.com.br`. O proxy chama `{BASE}/api/v1/cartas` e, em caso de 404, tenta `{BASE}/api/public/cartas`. |
| `INVESTMASTER_WEBHOOK_SECRET` | Não | Se definida, o POST em `/api/webhook-cartas` exige o cabeçalho `X-Investmaster-Webhook-Secret` (ou `X-Webhook-Secret`) com o **mesmo** valor. Recomendado em produção. |

### Desenvolvimento local

1. Instale a [CLI da Vercel](https://vercel.com/docs/cli) e rode na pasta do projeto: `vercel dev`
2. Defina um `.env.local` (não versionado) com as mesmas variáveis, ou exporte no shell antes de `vercel dev`.
3. Abra `http://localhost:3000/contempladas.html` — requisições a `/api/cartas` serão atendidas pela função serverless.

Abrir o arquivo `contempladas.html` direto do disco (`file://`) **não** resolve `/api/cartas`; use sempre um servidor com a rota de API (Vercel dev ou deploy).

## Webhook (opcional)

No painel da API, use **URL de webhook** apontando para a função serverless, **não** para a página HTML:

- **Correto:** `https://investmaster-olive.vercel.app/api/webhook-cartas`
- **Incorreto:** `https://…/contempladas.html` — arquivos estáticos não processam `POST` com JSON.

O handler `api/webhook-cartas.js` responde `200` com `{ ok: true }` após validar JSON no corpo. Com `INVESTMASTER_WEBHOOK_SECRET` configurada, o painel (ou o provedor) precisa enviar o mesmo valor no cabeçalho `X-Investmaster-Webhook-Secret`. A tabela do site continua sendo alimentada pelo `GET /api/cartas` (cache curto); amplie o webhook depois se quiser invalidar cache ou registrar eventos.
