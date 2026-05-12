/**
 * Webhook Invest Master — recebe POST quando o status de uma carta muda.
 *
 * Configure no painel a URL: https://<seu-dominio>/api/webhook-cartas
 * (não use a página .html; o navegador não executa POST em arquivo estático.)
 *
 * Segurança opcional: defina INVESTMASTER_WEBHOOK_SECRET na Vercel e envie o mesmo
 * valor no cabeçalho: X-Investmaster-Webhook-Secret: <segredo>
 */

module.exports = async function webhookCartas(req, res) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");

    if (req.method === "OPTIONS") {
        res.status(204).end();
        return;
    }

    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    const secret = process.env.INVESTMASTER_WEBHOOK_SECRET;
    if (secret) {
        const sent =
            req.headers["x-investmaster-webhook-secret"] ||
            req.headers["x-webhook-secret"] ||
            "";
        if (String(sent) !== secret) {
            res.status(401).json({ error: "unauthorized", message: "Segredo do webhook inválido ou ausente." });
            return;
        }
    }

    try {
        const chunks = [];
        for await (const chunk of req) {
            chunks.push(chunk);
        }
        const raw = Buffer.concat(chunks).toString("utf8");
        if (raw) JSON.parse(raw);
    } catch {
        res.status(400).json({ error: "invalid_json", message: "Corpo deve ser JSON." });
        return;
    }

    // Primeira versão: apenas confirma recebimento. Evolução: invalidar cache, gravar log, etc.
    res.status(200).json({
        ok: true,
        receivedAt: new Date().toISOString(),
        hint: "A lista pública continua sendo atualizada pelo GET /api/cartas (cache curto). Amplie este handler se precisar de ações imediatas."
    });
};
