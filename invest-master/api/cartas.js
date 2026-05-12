/**
 * Proxy server-side para a API Invest Master (Vercel Serverless / Node).
 * Nunca exponha INVESTMASTER_API_KEY no front-end estático.
 *
 * GET /api/cartas?status=&tipo=
 * Repassa query string (status, tipo) para o upstream.
 */

const DEFAULT_BASE = "https://api.investmaster.com.br";

function stripTrailingSlash(s) {
    return String(s || "").replace(/\/+$/, "");
}

function buildUpstreamUrl(base, pathname, searchParams) {
    const root = stripTrailingSlash(base);
    const url = new URL(root + pathname);
    searchParams.forEach((value, key) => {
        url.searchParams.set(key, value);
    });
    return url.toString();
}

module.exports = async function cartasProxy(req, res) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");

    if (req.method === "OPTIONS") {
        res.status(204).end();
        return;
    }

    if (req.method !== "GET") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    const apiKey = process.env.INVESTMASTER_API_KEY;
    const baseUrl = stripTrailingSlash(process.env.INVESTMASTER_API_BASE_URL || DEFAULT_BASE);

    if (!apiKey) {
        res.status(500).json({
            error: "missing_api_key",
            message: "Configure INVESTMASTER_API_KEY nas variáveis de ambiente do deploy."
        });
        return;
    }

    const incomingUrl = new URL(req.url || "/", "https://example.internal");
    const searchParams = new URLSearchParams(incomingUrl.searchParams);
    if (req.query && typeof req.query === "object") {
        for (const [key, value] of Object.entries(req.query)) {
            if (value === undefined || value === null) continue;
            if (Array.isArray(value)) {
                value.forEach((item) => searchParams.append(key, String(item)));
            } else {
                searchParams.set(key, String(value));
            }
        }
    }

    const headers = {
        Accept: "application/json",
        Authorization: "Bearer " + apiKey
    };

    const primaryUrl = buildUpstreamUrl(baseUrl, "/api/v1/cartas", searchParams);
    let upstreamRes = await fetch(primaryUrl, { headers, method: "GET" });

    if (upstreamRes.status === 404) {
        const fallbackUrl = buildUpstreamUrl(baseUrl, "/api/public/cartas", searchParams);
        upstreamRes = await fetch(fallbackUrl, { headers, method: "GET" });
    }

    const text = await upstreamRes.text();
    let body;

    try {
        body = text ? JSON.parse(text) : null;
    } catch {
        res.status(502).json({
            error: "invalid_upstream_json",
            message: "A API retornou um corpo que não é JSON válido.",
            status: upstreamRes.status
        });
        return;
    }

    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=120");

    res.status(upstreamRes.status).json(body);
};
