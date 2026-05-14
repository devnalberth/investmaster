/**
 * Contempladas — dados via proxy same-origin `/api/cartas` (chave só no servidor).
 */

const API_CARTAS = "/api/cartas";
const DEFAULT_WHATSAPP_E164 = "5511954633703";

let contempladasData = [];

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
});

const numberFormatter = new Intl.NumberFormat("pt-BR");

const adminLogos = {
    Embracon: {
        src: "assets/images/logo/logo-embracon.png",
        alt: "Logo Consórcio Embracon"
    }
};

const state = {
    search: "",
    term: "all",
    entryRange: "all",
    sort: "credit-desc",
    apiStatus: "all",
    apiTipo: "all",
    selectedIds: new Set(),
    loading: false,
    loadError: ""
};

const elements = {
    search: document.getElementById("im-search"),
    status: document.getElementById("im-status-filter"),
    tipo: document.getElementById("im-type-filter"),
    term: document.getElementById("im-term-filter"),
    entry: document.getElementById("im-entry-filter"),
    sort: document.getElementById("im-sort-filter"),
    reset: document.getElementById("im-reset-filters"),
    sum: document.getElementById("im-sum-cotas"),
    exportExcel: document.getElementById("im-export-excel"),
    exportPdf: document.getElementById("im-export-pdf"),
    tableBody: document.getElementById("im-table-body"),
    cardsGrid: document.getElementById("im-cards-grid"),
    emptyState: document.getElementById("im-empty-state"),
    emptyTitle: document.getElementById("im-empty-title"),
    emptyDetail: document.getElementById("im-empty-detail"),
    results: document.getElementById("im-results-status"),
    selectionPanel: document.getElementById("im-selection-panel"),
    selectionText: document.getElementById("im-selection-text"),
    selectionLink: document.getElementById("im-selection-link"),
    detailModal: document.getElementById("im-detail-modal"),
    detailModalDialog: document.querySelector("#im-detail-modal .im-modal__dialog"),
    detailModalClose: document.getElementById("im-detail-modal-close"),
    detailVendida: document.getElementById("im-detail-vendida")
};

function extractCartasArray(payload) {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.cartas)) return payload.cartas;
    if (Array.isArray(payload.data)) return payload.data;
    if (Array.isArray(payload.items)) return payload.items;
    if (Array.isArray(payload.results)) return payload.results;
    return [];
}

function parseReaisToCents(value) {
    if (value == null || value === "") return 0;
    if (typeof value === "string") {
        const t = value.trim().replace(/[^\d,.-]/g, "");
        if (!t) return 0;
        const normalized = t.includes(",")
            ? t.replace(/\./g, "").replace(",", ".")
            : /^\d{1,3}(\.\d{3})+$/.test(t)
              ? t.replace(/\./g, "")
              : t;
        const n = Number(normalized);
        return Number.isFinite(n) ? Math.round(n * 100) : 0;
    }
    const n = Number(value);
    return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

function pickCents(raw, base) {
    const centKey = base + "Centavos";
    if (raw[centKey] != null && raw[centKey] !== "") {
        const n = Math.round(Number(raw[centKey]));
        return Number.isFinite(n) ? n : 0;
    }
    return parseReaisToCents(raw[base]);
}

function normalizeTipoKey(raw) {
    const t = String(raw || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    if (t.includes("imovel") || t === "imóvel") return "imovel";
    if (t.includes("veiculo") || t.includes("veículo")) return "veiculo";
    if (t.includes("servico") || t.includes("serviço")) return "servico";
    return "outro";
}

function normalizeProductInternal(tipoKey) {
    if (tipoKey === "imovel") return "Imovel";
    if (tipoKey === "veiculo") return "Veiculo";
    if (tipoKey === "servico") return "Servico";
    return "Outro";
}

function normalizeStatusKey(raw) {
    const t = String(raw || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    if (t.includes("dispon")) return "disponivel";
    if (t.includes("reserv")) return "reservada";
    if (t.includes("vend")) return "vendida";
    return "outro";
}

function statusLabel(key) {
    switch (key) {
        case "disponivel":
            return "Disponível";
        case "reservada":
            return "Reservada";
        case "vendida":
            return "Vendida";
        default:
            return "Outro";
    }
}

function statusPillClass(key) {
    if (key === "disponivel") return "is-disponivel";
    if (key === "reservada") return "is-reservada";
    if (key === "vendida") return "is-vendida";
    return "is-outro";
}

function firstDefined(raw, keys) {
    for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        if (raw[k] != null && raw[k] !== "") {
            return raw[k];
        }
    }
    return null;
}

function parsePercentLoose(value) {
    if (value == null || value === "") {
        return null;
    }
    if (typeof value === "number" && Number.isFinite(value)) {
        if (value > 0 && value <= 1) {
            return value * 100;
        }
        return value;
    }
    const s = String(value)
        .trim()
        .replace(/\s/g, "")
        .replace(/%/g, "");
    if (!s) {
        return null;
    }
    const normalized = s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s.replace(",", ".");
    const n = Number(normalized);
    if (!Number.isFinite(n)) {
        return null;
    }
    if (n > 0 && n <= 1) {
        return n * 100;
    }
    return n;
}

function formatPercentBrFromNumber(n, fractionDigits) {
    if (n == null || !Number.isFinite(n)) {
        return "—";
    }
    const fd = typeof fractionDigits === "number" ? fractionDigits : 2;
    return (
        new Intl.NumberFormat("pt-BR", {
            minimumFractionDigits: 0,
            maximumFractionDigits: fd
        }).format(n) + "%"
    );
}

function formatDateBr(value) {
    if (value == null || value === "") {
        return "—";
    }
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) {
        return "—";
    }
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function padIntDisplay(value, width) {
    const n = Math.round(Number(value));
    if (!Number.isFinite(n) || n < 0) {
        return "—";
    }
    return String(n).padStart(width, "0");
}

function parseJsonMaybe(value) {
    if (typeof value !== "string") {
        return value;
    }
    const trimmed = value.trim();
    if (!trimmed || (!trimmed.startsWith("[") && !trimmed.startsWith("{"))) {
        return value;
    }
    try {
        return JSON.parse(trimmed);
    } catch {
        return value;
    }
}

function asPhaseArray(value) {
    const parsed = parseJsonMaybe(value);
    if (Array.isArray(parsed)) {
        return parsed;
    }
    if (parsed && typeof parsed === "object") {
        if (Array.isArray(parsed.fases)) return parsed.fases;
        if (Array.isArray(parsed.items)) return parsed.items;
        return [parsed];
    }
    if (typeof parsed === "string" && parsed.trim()) {
        return splitPhaseLabel(parsed);
    }
    return [];
}

function splitPhaseLabel(value) {
    const label = String(value || "").trim();
    if (!label) return [];
    const parts = label.split(/\s*(?:\+|\be\b|;|\n)\s*/i).map((part) => part.trim()).filter(Boolean);
    if (parts.length > 1 && parts.every((part) => /\d+\s*x/i.test(part))) {
        return parts;
    }
    return [label];
}

function parsePositiveInteger(value) {
    if (value == null || value === "") return 0;
    const match = String(value).match(/\d+/);
    if (!match) return 0;
    const n = Math.round(Number(match[0]));
    return Number.isFinite(n) && n > 0 ? n : 0;
}

function pickPhaseCount(phase) {
    if (!phase || typeof phase !== "object") {
        const match = String(phase || "").match(/(\d+)\s*x/i);
        return match ? parsePositiveInteger(match[1]) : 0;
    }
    return parsePositiveInteger(
        firstDefined(phase, [
            "parcelas",
            "quantidade",
            "quantidadeParcelas",
            "qtd",
            "qtdParcelas",
            "numeroParcelas",
            "nParcelas",
            "prazo",
            "meses",
            "count"
        ])
    );
}

function pickPhaseAmountCents(phase) {
    if (!phase || typeof phase !== "object") {
        return 0;
    }
    const cents = firstDefined(phase, ["valorParcelaCentavos", "valorCentavos", "parcelaCentavos", "amountCents"]);
    if (cents != null) {
        const n = Math.round(Number(cents));
        return Number.isFinite(n) ? n : 0;
    }
    return parseReaisToCents(firstDefined(phase, ["valorParcela", "valor", "parcela", "valorMensal", "amount"]));
}

function normalizeInstallmentPhases(raw, fallbackCount, fallbackAmountCents) {
    const phaseSource = firstDefined(raw, [
        "parcelasFases",
        "parcelas_fases",
        "parcelasFasesTexto",
        "parcelas_fases_texto",
        "parcelasFasesLabel",
        "parcelas_fases_label",
        "parcelasResumo",
        "parcelas_resumo",
        "parcelasDescricao",
        "parcelas_descricao",
        "resumoParcelas",
        "resumo_parcelas",
        "parcelasPorFase",
        "parcelas_por_fase",
        "fasesParcelas",
        "fases_parcelas",
        "fases",
        "parcelamento",
        "parcelamentoFases",
        "parcelamento_fases",
        "planoParcelas",
        "planoParcelasTexto",
        "plano_parcelas_texto"
    ]);
    let rawPhases = asPhaseArray(phaseSource);

    if (!rawPhases.length && typeof raw.parcelas === "string" && /\d+\s*x/i.test(raw.parcelas)) {
        rawPhases = asPhaseArray(raw.parcelas);
    }

    if (!rawPhases.length && Array.isArray(raw.parcelas)) {
        rawPhases = raw.parcelas;
    }

    if (!rawPhases.length && raw.parcelas && typeof raw.parcelas === "object") {
        rawPhases = asPhaseArray(raw.parcelas);
    }

    if (!rawPhases.length) {
        rawPhases = asPhaseArray(
            firstDefined(raw, [
                "descricaoParcelas",
                "descricao_parcelas",
                "textoParcelas",
                "texto_parcelas"
            ])
        );
    }

    const phases = rawPhases
        .map((phase) => {
            if (typeof phase === "string") {
                const label = phase.trim();
                return label ? { count: pickPhaseCount(label), amountCents: 0, label } : null;
            }
            const count = pickPhaseCount(phase);
            const amountCents = pickPhaseAmountCents(phase);
            const customLabel = firstDefined(phase || {}, ["label", "descricao", "descrição", "texto", "description"]);
            const label =
                count > 0 && amountCents > 0
                    ? numberFormatter.format(count) + "x " + formatCurrencyFromCents(amountCents)
                    : customLabel
                      ? String(customLabel).trim()
                      : "";
            return label ? { count, amountCents, label } : null;
        })
        .filter(Boolean);

    if (phases.length) {
        return phases;
    }

    if (fallbackCount > 0 && fallbackAmountCents > 0) {
        return [
            {
                count: fallbackCount,
                amountCents: fallbackAmountCents,
                label: numberFormatter.format(fallbackCount) + "x " + formatCurrencyFromCents(fallbackAmountCents)
            }
        ];
    }

    return [];
}

function mapApiCard(raw) {
    const grupo = Number(raw.grupoNumero ?? raw.grupo ?? 0) || 0;
    const cotaRaw = firstDefined(raw, ["cotaNumero", "cota", "cota_numero"]);
    const cota = cotaRaw != null ? String(cotaRaw) : "";
    const id = String(raw.id || raw.numero || `g${grupo}${cota ? "-c" + cota : ""}`);
    const tipoKey = normalizeTipoKey(raw.tipo);
    const product = normalizeProductInternal(tipoKey);
    const admin = String(raw.administradora || "—").trim() || "—";
    const credit = pickCents(raw, "valor");
    const entry = pickCents(raw, "entrada");
    const baseInstallment = pickCents(raw, "valorParcela");
    const term = Math.round(Number(raw.prazo) || 0);
    const parcelasValue = firstDefined(raw, ["parcelas", "quantidadeParcelas", "qtdParcelas"]);
    const parcelas = Array.isArray(parcelasValue) ? 0 : Math.round(Number(parcelasValue) || 0);
    let balance = 0;
    if (raw.saldoCentavos != null && raw.saldoCentavos !== "") {
        const n = Math.round(Number(raw.saldoCentavos));
        balance = Number.isFinite(n) ? n : 0;
    } else {
        const v = raw.saldo ?? raw.saldoDevedor ?? raw.saldo_devedor;
        balance = parseReaisToCents(v);
    }
    if (!balance && credit > 0 && raw.saldo == null && raw.saldoDevedor == null && raw.saldo_devedor == null && raw.saldoCentavos == null) {
        balance = Math.max(0, credit - entry);
    }
    const computedEntryPercent = credit > 0 ? (entry / credit) * 100 : 0;
    const apiEntryPercent = parsePercentLoose(firstDefined(raw, ["entradaPercent", "percentualEntrada", "entrada_percent"]));
    const entryPercent = apiEntryPercent != null ? apiEntryPercent : computedEntryPercent;
    const statusKey = normalizeStatusKey(raw.status);
    let whatsappUrl = raw.whatsappUrl;
    if (typeof whatsappUrl === "string") {
        whatsappUrl = whatsappUrl.trim();
        if (!whatsappUrl || whatsappUrl === "null") {
            whatsappUrl = null;
        }
    } else {
        whatsappUrl = null;
    }

    const taxaNum = parsePercentLoose(
        firstDefined(raw, ["taxa", "taxaAdmin", "taxaAdministracao", "taxaAdministrativa", "taxa_admin", "taxa_administrativa"])
    );
    const taxaPt = taxaNum != null ? formatPercentBrFromNumber(taxaNum, 2) : "—";

    const reducaoNum = parsePercentLoose(firstDefined(raw, ["reducao", "reducaoLance", "lancePercentual", "reducao_percent"]));
    const reducaoPt = reducaoNum != null ? formatPercentBrFromNumber(reducaoNum, 2) : "—";

    const dataContemplacaoRaw = firstDefined(raw, ["dataContemplacao", "data_contemplacao", "contempladoEm", "contemplado_em"]);
    const dataContemplacaoPt = formatDateBr(dataContemplacaoRaw);

    const vendidoParaName = (() => {
        const v = firstDefined(raw, ["vendidoPara", "compradorNome", "clienteNome", "nomeComprador", "buyerName"]);
        if (v == null || v === "") {
            return "";
        }
        return String(v).trim();
    })();
    const vendidoEmRaw = firstDefined(raw, ["vendidoEm", "dataVenda", "vendido_em", "data_venda"]);
    const vendidoEmPt = formatDateBr(vendidoEmRaw);

    const grupoPadded = padIntDisplay(grupo, 4);
    const cotaTrim = cota.trim();
    let cotaPadded = "—";
    if (cotaTrim) {
        if (/^\d+$/.test(cotaTrim)) {
            cotaPadded = padIntDisplay(Number(cotaTrim), 3);
        } else {
            cotaPadded = cotaTrim;
        }
    }

    const countLine = parcelas > 0 ? parcelas : term;
    const installmentPhases = normalizeInstallmentPhases(raw, countLine, baseInstallment);
    const installment = installmentPhases.find((phase) => phase.amountCents > 0)?.amountCents || baseInstallment;
    const installmentPhasesText = installmentPhases.length ? installmentPhases.map((phase) => phase.label).join(" + ") : "—";
    const subParcelasText = installmentPhasesText !== "—" ? installmentPhasesText + "/mês" : "—";

    const tipoLabel = formatProductLabel(product);

    return {
        id,
        numero: raw.numero != null ? String(raw.numero) : id,
        group: grupo,
        grupoNumeroPadded: grupoPadded,
        cotaNumero: cota,
        cotaNumeroPadded: cotaPadded,
        parcelas,
        product,
        tipoKey,
        tipoLabel,
        admin,
        credit,
        entry,
        balance,
        installment,
        installmentPhases,
        installmentPhasesText,
        term,
        entryPercent,
        entradaPercentPt: formatPercentBrFromNumber(entryPercent, 2),
        taxaPt: taxaPt,
        reducaoPt: reducaoPt,
        dataContemplacaoPt: dataContemplacaoPt,
        subParcelasText: subParcelasText,
        vendidoParaName: vendidoParaName,
        vendidoEmPt: vendidoEmPt,
        statusKey,
        statusLabel: statusLabel(statusKey),
        whatsappUrl
    };
}

function formatCurrencyFromCents(cents) {
    return currencyFormatter.format(cents / 100);
}

function formatProductLabel(product) {
    if (product === "Imovel") return "Imóvel";
    if (product === "Veiculo") return "Veículo";
    if (product === "Servico") return "Serviço";
    return product;
}

function getAdminLogo(admin) {
    return adminLogos[admin] || null;
}

function buildApiQuery() {
    const params = new URLSearchParams();
    if (state.apiStatus && state.apiStatus !== "all") {
        params.set("status", state.apiStatus);
    }
    if (state.apiTipo && state.apiTipo !== "all") {
        params.set("tipo", state.apiTipo);
    }
    const q = params.toString();
    return q ? "?" + q : "";
}

async function fetchCartas() {
    state.loading = true;
    state.loadError = "";
    updateResults(getVisibleRows());
    try {
        const res = await fetch(API_CARTAS + buildApiQuery(), {
            method: "GET",
            headers: { Accept: "application/json" },
            credentials: "same-origin"
        });
        const body = await res.json().catch(() => null);
        if (!res.ok) {
            const msg =
                (body && (body.message || body.error)) ||
                "Não foi possível carregar as cartas (" + res.status + ").";
            throw new Error(msg);
        }
        const list = extractCartasArray(body);
        contempladasData = list.map(mapApiCard);
        state.selectedIds.clear();
    } catch (err) {
        contempladasData = [];
        state.loadError = err && err.message ? err.message : "Erro ao carregar dados.";
    } finally {
        state.loading = false;
        render();
    }
}

function filterRows() {
    const query = state.search.trim().toLowerCase();

    return contempladasData.filter((row) => {
        const matchesSearch =
            !query ||
            String(row.group).includes(query) ||
            row.product.toLowerCase().includes(query) ||
            row.admin.toLowerCase().includes(query) ||
            row.numero.toLowerCase().includes(query) ||
            row.statusLabel.toLowerCase().includes(query);

        const matchesTerm =
            state.term === "all" ||
            (state.term === "short" && row.term <= 60) ||
            (state.term === "medium" && row.term >= 61 && row.term <= 120) ||
            (state.term === "long" && row.term >= 121);

        const matchesEntry =
            state.entryRange === "all" ||
            (state.entryRange === "low" && row.entryPercent <= 40) ||
            (state.entryRange === "mid" && row.entryPercent > 40 && row.entryPercent <= 45) ||
            (state.entryRange === "high" && row.entryPercent > 45);

        return matchesSearch && matchesTerm && matchesEntry;
    });
}

function sortRows(rows) {
    return [...rows].sort((left, right) => {
        switch (state.sort) {
            case "entry-asc":
                return left.entry - right.entry;
            case "installment-asc":
                return left.installment - right.installment;
            case "term-desc":
                return right.term - left.term;
            case "credit-desc":
            default:
                return right.credit - left.credit;
        }
    });
}

function getVisibleRows() {
    return sortRows(filterRows());
}

function getExportRows() {
    return getVisibleRows().map((row) => ({
        administradora: row.admin,
        produto: formatProductLabel(row.product),
        status: row.statusLabel,
        grupo: numberFormatter.format(row.group),
        credito: formatCurrencyFromCents(row.credit),
        entrada: formatCurrencyFromCents(row.entry),
        prazo: numberFormatter.format(row.term),
        parcelas: row.installmentPhasesText || "—"
    }));
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function buildExportTableMarkup(rows) {
    const headings = [
        "Administradora",
        "Produto",
        "Status",
        "Grupo",
        "Valor do crédito",
        "Entrada",
        "Prazo",
        "Parcelas / fases"
    ];
    const bodyRows = rows
        .map(
            (row) => `
        <tr>
            <td>${escapeHtml(row.administradora)}</td>
            <td>${escapeHtml(row.produto)}</td>
            <td>${escapeHtml(row.status)}</td>
            <td>${escapeHtml(row.grupo)}</td>
            <td>${escapeHtml(row.credito)}</td>
            <td>${escapeHtml(row.entrada)}</td>
            <td>${escapeHtml(row.prazo)}</td>
            <td>${escapeHtml(row.parcelas)}</td>
        </tr>
    `
        )
        .join("");

    return `
        <table>
            <thead>
                <tr>${headings.map((heading) => `<th>${escapeHtml(heading)}</th>`).join("")}</tr>
            </thead>
            <tbody>${bodyRows}</tbody>
        </table>
    `;
}

function downloadBlob(content, mimeType, filename) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

function exportToExcel() {
    const rows = getExportRows();
    const tableMarkup = buildExportTableMarkup(rows);
    const excelDocument = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <style>
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #d9d9d9; padding: 8px 10px; text-align: left; }
                th { background: #dd8a1f; color: #fff; }
            </style>
        </head>
        <body>${tableMarkup}</body>
        </html>
    `;

    downloadBlob(excelDocument, "application/vnd.ms-excel;charset=utf-8", "cartas-contempladas.xls");
}

function exportToPdf() {
    const rows = getExportRows();
    const tableMarkup = buildExportTableMarkup(rows);
    const printWindow = window.open("", "_blank", "width=1120,height=780");

    if (!printWindow) {
        elements.results.textContent = "Permita pop-ups para exportar em PDF.";
        return;
    }

    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Cartas contempladas - Invest Master</title>
            <style>
                @page { margin: 18mm; }
                body { color: #152030; font-family: Arial, sans-serif; }
                h1 { margin: 0 0 16px; font-size: 22px; }
                table { border-collapse: collapse; width: 100%; font-size: 12px; }
                th, td { border: 1px solid #d8dde7; padding: 8px; text-align: left; }
                th { background: #dd8a1f; color: #fff; }
            </style>
        </head>
        <body>
            <h1>Cartas contempladas - Invest Master</h1>
            ${tableMarkup}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}

function buildWhatsAppFallbackText(rows) {
    const headline =
        rows.length > 1
            ? "Olá, quero avaliar uma composição de cotas contempladas."
            : "Olá, quero receber detalhes desta carta contemplada.";

    const details = rows.map((row) => {
        return [
            "Carta " + row.numero,
            "Grupo " + numberFormatter.format(row.group),
            "Status " + row.statusLabel,
            "Administradora " + row.admin,
            "Crédito " + formatCurrencyFromCents(row.credit),
            "Entrada " + formatCurrencyFromCents(row.entry),
            "Prazo " + numberFormatter.format(row.term) + " meses",
            "Parcelas/fases " + (row.installmentPhasesText || "—")
        ].join(" | ");
    }).join("\n");

    return headline + "\n\n" + details;
}

function buildWhatsAppFallbackLink(rows) {
    return "https://wa.me/" + DEFAULT_WHATSAPP_E164 + "?text=" + encodeURIComponent(buildWhatsAppFallbackText(rows));
}

function negociarHref(row) {
    const u = row.whatsappUrl;
    if (typeof u === "string" && /^https?:\/\//i.test(u)) {
        return u;
    }
    return buildWhatsAppFallbackLink([row]);
}

function buildSelectionWhatsAppLink(rows) {
    if (rows.length === 1) {
        return negociarHref(rows[0]);
    }
    const allHaveCustom = rows.every((r) => typeof r.whatsappUrl === "string" && /^https?:\/\//i.test(r.whatsappUrl));
    if (allHaveCustom && rows.every((r) => r.whatsappUrl === rows[0].whatsappUrl)) {
        return rows[0].whatsappUrl;
    }
    return buildWhatsAppFallbackLink(rows);
}

let detailModalOpen = false;
let detailModalLastFocus = null;

function getFocusableInDetailDialog() {
    const dialog = elements.detailModalDialog;
    if (!dialog) {
        return [];
    }
    return Array.from(
        dialog.querySelectorAll(
            "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex=\"-1\"])"
        )
    ).filter((el) => {
        if (el.closest("[hidden]")) {
            return false;
        }
        return el.getAttribute("aria-hidden") !== "true";
    });
}

function onDetailModalKeydown(e) {
    if (!detailModalOpen) {
        return;
    }
    if (e.key === "Escape") {
        e.preventDefault();
        closeDetailModal();
        return;
    }
    if (e.key !== "Tab") {
        return;
    }
    const list = getFocusableInDetailDialog();
    if (!list.length) {
        return;
    }
    const first = list[0];
    const last = list[list.length - 1];
    if (e.shiftKey) {
        if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
        }
    } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
}

function setDetailText(id, text) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = text;
    }
}

function renderInstallmentPhases(row) {
    const phases = Array.isArray(row.installmentPhases) && row.installmentPhases.length ? row.installmentPhases : [];
    if (!phases.length) {
        return `<span class="im-phase-empty">—</span>`;
    }
    return `
        <span class="im-phase-stack" aria-label="${escapeHtml(row.installmentPhasesText || "Parcelas não informadas")}">
            ${phases
                .map((phase, index) => {
                    const tone = index === 0 ? "is-first" : "is-next";
                    const separator = index > 0 ? `<span class="im-phase-separator" aria-hidden="true">+</span>` : "";
                    return `${separator}<span class="im-phase-chip ${tone}">${escapeHtml(phase.label)}</span>`;
                })
                .join("")}
        </span>
    `;
}

function fillDetailModal(row) {
    const badge = document.getElementById("im-detail-hero-badge");
    if (badge) {
        badge.textContent = row.tipoLabel || "—";
    }
    setDetailText("im-detail-numero", row.numero || "—");
    setDetailText("im-detail-valor", formatCurrencyFromCents(row.credit));
    setDetailText("im-detail-subparcelas", row.subParcelasText || "—");
    setDetailText("im-detail-grupo", row.grupoNumeroPadded || "—");
    setDetailText("im-detail-cota", row.cotaNumeroPadded || "—");
    setDetailText("im-detail-admin", row.admin || "—");
    setDetailText("im-detail-taxa", row.taxaPt || "—");
    setDetailText("im-detail-entrada", formatCurrencyFromCents(row.entry));
    setDetailText("im-detail-pct-entrada", row.entradaPercentPt || "—");
    setDetailText("im-detail-saldo", formatCurrencyFromCents(row.balance));
    setDetailText("im-detail-prazo", row.term > 0 ? numberFormatter.format(row.term) + " meses" : "—");
    setDetailText("im-detail-reducao", row.reducaoPt || "—");
    setDetailText("im-detail-contemplado", row.dataContemplacaoPt || "—");

    const foot = elements.detailVendida;
    if (foot) {
        const showVendida =
            row.statusKey === "vendida" && Boolean((row.vendidoParaName && row.vendidoParaName.trim()) || row.vendidoEmPt !== "—");
        foot.hidden = !showVendida;
        if (showVendida) {
            setDetailText("im-detail-vendido-nome", (row.vendidoParaName && row.vendidoParaName.trim()) || "—");
            setDetailText("im-detail-vendido-data", row.vendidoEmPt || "—");
        }
    }
}

function openDetailModal(rowId) {
    const row = contempladasData.find((r) => r.id === rowId);
    if (!row || !elements.detailModal) {
        return;
    }
    detailModalLastFocus = document.activeElement;
    fillDetailModal(row);
    elements.detailModal.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    detailModalOpen = true;
    document.addEventListener("keydown", onDetailModalKeydown, true);
    requestAnimationFrame(() => {
        if (elements.detailModalClose) {
            elements.detailModalClose.focus();
        }
    });
}

function closeDetailModal() {
    if (!detailModalOpen || !elements.detailModal) {
        return;
    }
    elements.detailModal.setAttribute("hidden", "");
    document.body.style.overflow = "";
    detailModalOpen = false;
    document.removeEventListener("keydown", onDetailModalKeydown, true);
    if (detailModalLastFocus && typeof detailModalLastFocus.focus === "function") {
        try {
            detailModalLastFocus.focus();
        } catch {
            /* ignore */
        }
    }
    detailModalLastFocus = null;
}

function syncUrl() {
    const params = new URLSearchParams();

    if (state.search) params.set("q", state.search);
    if (state.term !== "all") params.set("prazo", state.term);
    if (state.entryRange !== "all") params.set("entrada", state.entryRange);
    if (state.sort !== "credit-desc") params.set("ordem", state.sort);
    if (state.apiStatus !== "all") params.set("status", state.apiStatus);
    if (state.apiTipo !== "all") params.set("tipo", state.apiTipo);

    const nextUrl = window.location.pathname + (params.toString() ? "?" + params.toString() : "") + window.location.hash;
    window.history.replaceState({}, "", nextUrl);
}

function hydrateFromUrl() {
    const params = new URLSearchParams(window.location.search);

    state.search = params.get("q") || "";
    state.term = params.get("prazo") || "all";
    state.entryRange = params.get("entrada") || "all";
    state.sort = params.get("ordem") || "credit-desc";
    state.apiStatus = params.get("status") || "all";
    state.apiTipo = params.get("tipo") || "all";

    elements.search.value = state.search;
    elements.term.value = state.term;
    elements.entry.value = state.entryRange;
    elements.sort.value = state.sort;
    if (elements.status) {
        const allowed = ["all", "disponivel,reservada,vendida", "disponivel", "reservada", "vendida"];
        elements.status.value = allowed.includes(state.apiStatus) ? state.apiStatus : "all";
        state.apiStatus = elements.status.value;
    }
    if (elements.tipo) {
        const allowedT = ["all", "imovel", "veiculo", "servico"];
        elements.tipo.value = allowedT.includes(state.apiTipo) ? state.apiTipo : "all";
        state.apiTipo = elements.tipo.value;
    }
}

function updateSelectionPanel() {
    const selectedRows = contempladasData.filter((row) => state.selectedIds.has(row.id));

    if (!selectedRows.length) {
        elements.selectionPanel.hidden = true;
        elements.selectionText.textContent = "Nenhuma cota selecionada.";
        elements.selectionLink.href = "https://wa.me/" + DEFAULT_WHATSAPP_E164;
        return;
    }

    const totalCredit = selectedRows.reduce((sum, row) => sum + row.credit, 0);
    const totalEntry = selectedRows.reduce((sum, row) => sum + row.entry, 0);

    elements.selectionPanel.hidden = false;
    elements.selectionText.textContent =
        selectedRows.length === 1
            ? "1 cota selecionada | Crédito " +
              formatCurrencyFromCents(totalCredit) +
              " | Entrada " +
              formatCurrencyFromCents(totalEntry)
            : numberFormatter.format(selectedRows.length) +
              " cotas selecionadas | Crédito " +
              formatCurrencyFromCents(totalCredit) +
              " | Entrada " +
              formatCurrencyFromCents(totalEntry);
    elements.selectionLink.href = buildSelectionWhatsAppLink(selectedRows);
}

function updateResults(rows) {
    if (state.loading) {
        elements.results.textContent = "Carregando cartas…";
        elements.emptyState.hidden = true;
        return;
    }
    if (state.loadError) {
        elements.results.textContent = state.loadError;
        elements.emptyState.hidden = false;
        if (elements.emptyTitle) elements.emptyTitle.textContent = "Não foi possível carregar as cartas";
        if (elements.emptyDetail) {
            const hint =
                "Dicas: na Vercel, confira INVESTMASTER_API_KEY e INVESTMASTER_API_BASE_URL (URL exata da API, conforme documentação do painel). Em desenvolvimento local, use `vercel dev` para existir a rota /api/cartas.";
            elements.emptyDetail.textContent = state.loadError + " " + hint;
        }
        return;
    }
    const total = contempladasData.length;
    const shown = rows.length;
    elements.results.textContent =
        "Exibindo " + numberFormatter.format(shown) + " de " + numberFormatter.format(total) + " cartas.";
    elements.emptyState.hidden = shown > 0;
    if (elements.emptyTitle) elements.emptyTitle.textContent = "Nenhuma carta encontrada";
    if (elements.emptyDetail) {
        elements.emptyDetail.textContent = "Ajuste os filtros ou os critérios de status/tipo na API para exibir outras opções.";
    }
}

function renderTable(rows) {
    elements.tableBody.innerHTML = rows
        .map((row) => {
            const selected = state.selectedIds.has(row.id);
            const actionHref = negociarHref(row);
            const adminLogo = getAdminLogo(row.admin);
            const productLabel = formatProductLabel(row.product);
            const pillClass = statusPillClass(row.statusKey);

            return `
            <tr class="${selected ? "is-selected" : ""}">
                <td class="im-select-cell">
                    <input class="im-checkbox" type="checkbox" data-row-id="${escapeHtml(row.id)}" aria-label="Selecionar carta ${escapeHtml(row.numero)} para juntar cotas" ${selected ? "checked" : ""}>
                </td>
                <th scope="row">
                    <div class="im-group-cell">
                        ${adminLogo ? `<img class="im-admin-logo" src="${adminLogo.src}" alt="${escapeHtml(adminLogo.alt)}" width="112" height="60">` : `<span translate="no">${escapeHtml(row.admin)}</span>`}
                    </div>
                </th>
                <td><span class="im-product-pill">${escapeHtml(productLabel)}</span></td>
                <td><span class="im-status-pill ${pillClass}">${escapeHtml(row.statusLabel)}</span></td>
                <td class="im-money-cell im-number">${formatCurrencyFromCents(row.credit)}</td>
                <td class="im-money-cell im-number">${formatCurrencyFromCents(row.entry)}</td>
                <td class="im-term-cell im-number">${numberFormatter.format(row.term)}</td>
                <td class="im-installment-cell im-number">${renderInstallmentPhases(row)}</td>
                <td class="im-detail-cell">
                    <button type="button" class="im-eye-btn" data-im-open-detail="${escapeHtml(row.id)}" aria-label="Ver detalhes da carta ${escapeHtml(row.numero)}">
                        <i class="far fa-eye" aria-hidden="true"></i>
                    </button>
                </td>
                <td class="im-row-action">
                    <div class="im-row-actions">
                        <a class="im-action-btn" href="${escapeHtml(actionHref)}" target="_blank" rel="noopener noreferrer">Negociar</a>
                    </div>
                </td>
            </tr>
        `;
        })
        .join("");
}

function renderCards(rows) {
    elements.cardsGrid.innerHTML = rows
        .map((row) => {
            const selected = state.selectedIds.has(row.id);
            const actionHref = negociarHref(row);
            const adminLogo = getAdminLogo(row.admin);
            const productLabel = formatProductLabel(row.product);
            const pillClass = statusPillClass(row.statusKey);

            return `
            <article class="im-card">
                <div class="im-card-top">
                    <div>
                        <h3 class="im-card-title im-number">Grupo ${numberFormatter.format(row.group)}</h3>
                        <span class="im-card-subtitle" translate="no">${escapeHtml(row.numero)}</span>
                    </div>
                    <input class="im-checkbox" type="checkbox" data-row-id="${escapeHtml(row.id)}" aria-label="Selecionar carta ${escapeHtml(row.numero)}" ${selected ? "checked" : ""}>
                </div>
                ${adminLogo ? `<img class="im-card-admin-logo" src="${adminLogo.src}" alt="${escapeHtml(adminLogo.alt)}" width="120" height="64">` : `<p class="im-card-subtitle" translate="no">${escapeHtml(row.admin)}</p>`}
                <span class="im-product-pill">${escapeHtml(productLabel)}</span>
                <span class="im-status-pill ${pillClass}">${escapeHtml(row.statusLabel)}</span>
                <dl class="im-card-grid">
                    <div>
                        <dt>Crédito</dt>
                        <dd class="im-number">${formatCurrencyFromCents(row.credit)}</dd>
                    </div>
                    <div>
                        <dt>Entrada</dt>
                        <dd class="im-number">${formatCurrencyFromCents(row.entry)}</dd>
                    </div>
                    <div>
                        <dt>Prazo</dt>
                        <dd class="im-number">${numberFormatter.format(row.term)} meses</dd>
                    </div>
                    <div>
                        <dt>Parcelas</dt>
                        <dd class="im-number im-card-phases">${renderInstallmentPhases(row)}</dd>
                    </div>
                </dl>
                <div class="im-card-actions">
                    <button type="button" class="im-eye-btn" data-im-open-detail="${escapeHtml(row.id)}" aria-label="Ver detalhes da carta ${escapeHtml(row.numero)}">
                        <i class="far fa-eye" aria-hidden="true"></i>
                    </button>
                    <a class="im-action-btn" href="${escapeHtml(actionHref)}" target="_blank" rel="noopener noreferrer">Negociar</a>
                </div>
            </article>
        `;
        })
        .join("");
}

function render() {
    const filteredRows = getVisibleRows();
    updateResults(filteredRows);
    if (!state.loading && !state.loadError) {
        renderTable(filteredRows);
        renderCards(filteredRows);
    } else if (state.loadError) {
        elements.tableBody.innerHTML = "";
        elements.cardsGrid.innerHTML = "";
    } else {
        elements.tableBody.innerHTML = "";
        elements.cardsGrid.innerHTML = "";
    }
    updateSelectionPanel();
    syncUrl();
}

function updateStateFromForm() {
    state.search = elements.search.value.trim();
    state.term = elements.term.value;
    state.entryRange = elements.entry.value;
    state.sort = elements.sort.value;
    render();
}

function updateApiFiltersFromForm() {
    state.apiStatus = elements.status.value;
    state.apiTipo = elements.tipo.value;
    fetchCartas();
}

if (elements.detailModal) {
    elements.detailModal.addEventListener("click", (event) => {
        if (event.target.closest("[data-im-modal-close]")) {
            event.preventDefault();
            closeDetailModal();
        }
    });
}

document.addEventListener("click", (event) => {
    const openBtn = event.target.closest("[data-im-open-detail]");
    if (!openBtn) {
        return;
    }
    event.preventDefault();
    const rid = openBtn.getAttribute("data-im-open-detail");
    if (rid) {
        openDetailModal(rid);
    }
});

hydrateFromUrl();
fetchCartas();

elements.search.addEventListener("input", updateStateFromForm);
elements.term.addEventListener("change", updateStateFromForm);
elements.entry.addEventListener("change", updateStateFromForm);
elements.sort.addEventListener("change", updateStateFromForm);
elements.status.addEventListener("change", updateApiFiltersFromForm);
elements.tipo.addEventListener("change", updateApiFiltersFromForm);
elements.exportExcel.addEventListener("click", exportToExcel);
elements.exportPdf.addEventListener("click", exportToPdf);

elements.reset.addEventListener("click", () => {
    state.search = "";
    state.term = "all";
    state.entryRange = "all";
    state.sort = "credit-desc";
    state.apiStatus = "all";
    state.apiTipo = "all";

    elements.search.value = "";
    elements.term.value = "all";
    elements.entry.value = "all";
    elements.sort.value = "credit-desc";
    elements.status.value = "all";
    elements.tipo.value = "all";

    fetchCartas();
});

elements.sum.addEventListener("click", () => {
    if (state.selectedIds.size) {
        elements.selectionLink.focus();
        return;
    }

    elements.tableBody.querySelector("[data-row-id]")?.focus();
});

document.addEventListener("change", (event) => {
    const checkbox = event.target.closest("[data-row-id]");

    if (!checkbox) return;

    const rowId = checkbox.getAttribute("data-row-id");

    if (checkbox.checked) {
        state.selectedIds.add(rowId);
    } else {
        state.selectedIds.delete(rowId);
    }

    render();
});
