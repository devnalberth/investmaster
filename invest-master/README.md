# Invest Master — site estático

Site em HTML/CSS/JS. A página **Contempladas** consome dados da API Invest Master apenas via **proxy server-side** na Vercel (`/api/cartas`), para que a **API Key** nunca vá ao navegador.

## Variáveis de ambiente (Vercel)

Configure no painel do projeto (**Settings → Environment Variables**) ou com `vercel env`:

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `INVESTMASTER_API_KEY` | **Sim** | Chave do painel (formatos como `IM-…` ou `im_…`). No servidor o proxy envia **`Authorization: Bearer`** e **`X-API-Key`** com o mesmo valor, conforme a documentação do painel. **Não** commite no Git nem coloque em JS/HTML público. |
| `INVESTMASTER_API_BASE_URL` | **Sim** | URL base da API: **só** `https` + domínio (sem `/api/v1` no final). O proxy chama `{BASE}/api/v1/cartas` e, em 404, `{BASE}/api/public/cartas`. **Não há valor padrão no código** — use exatamente o host que a Invest Master indicar (manual do painel, Swagger ou suporte). |
| `INVESTMASTER_WEBHOOK_SECRET` | Não | Se definida, o POST em `/api/webhook-cartas` exige o cabeçalho `X-Investmaster-Webhook-Secret` (ou `X-Webhook-Secret`) com o **mesmo** valor. Recomendado em produção. |

### Onde obter a URL base (`INVESTMASTER_API_BASE_URL`)?

Ela **não** é inventada no site: vem do **mesmo ecossistema da API** que gerou a sua chave — página de documentação do painel, link “API” / “Base URL”, Swagger/OpenAPI ou pergunta direta ao suporte da Invest Master. Exemplo de **formato** (o domínio real é o deles): `https://api.empresa-parceira.com.br`.

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

## Deploy sem Contempladas (branch `deploy/sem-contempladas`)

Branch para publicar o site **sem** expor a vitrine de Contempladas enquanto a página aguarda aprovação dos sócios. O arquivo `contempladas.html` e os assets (`assets/js/pages/contempladas.js`, `assets/css/pages/contempladas.css`) **permanecem no repositório**.

- Links de menu, rodapé e CTAs que apontavam para `contempladas.html` foram removidos ou redirecionados (`index.html` → `partners.html` nos cards/hero; `about.html` → `contact-2.html` no hero).
- `vercel.json` redireciona `/contempladas.html` e `/contempladas` para a home (evita acesso direto por URL).

**Publicar:** faça deploy desta branch na Vercel (Production ou Preview).

**Quando Contempladas for aprovada:** faça merge de `deploy/sem-contempladas` na branch principal (ou reverta os commits desta branch), remova os redirects de `vercel.json` e restaure os links — o conteúdo da página já estará no repositório.
