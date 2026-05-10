const contempladasData = [
    { id: "7041-38605821", group: 7041, product: "Imovel", admin: "Embracon", credit: 38605821, entry: 14465146, term: 85, installment: 520218, balance: 44218530, entryPercent: 37.47 },
    { id: "8025-38373370", group: 8025, product: "Imovel", admin: "Embracon", credit: 38373370, entry: 14959334, term: 18, installment: 1878816, balance: 33818688, entryPercent: 38.98 },
    { id: "7034-37661800", group: 7034, product: "Imovel", admin: "Embracon", credit: 37661800, entry: 19759708, term: 90, installment: 293300, balance: 26397000, entryPercent: 52.47 },
    { id: "7266-23152759", group: 7266, product: "Imovel", admin: "Embracon", credit: 23152759, entry: 9377819, term: 231, installment: 130931, balance: 30245061, entryPercent: 40.50 },
    { id: "7259-21483076", group: 7259, product: "Imovel", admin: "Embracon", credit: 21483076, entry: 8700077, term: 182, installment: 133556, balance: 24307192, entryPercent: 40.50 },
    { id: "7252-20485393", group: 7252, product: "Imovel", admin: "Embracon", credit: 20485393, entry: 8502135, term: 216, installment: 114521, balance: 24736536, entryPercent: 41.50 },
    { id: "7030-18951740", group: 7030, product: "Imovel", admin: "Embracon", credit: 18951740, entry: 7637104, term: 135, installment: 150900, balance: 20371500, entryPercent: 40.30 },
    { id: "7255-18754499", group: 7255, product: "Imovel", admin: "Embracon", credit: 18754499, entry: 8468862, term: 141, installment: 159628, balance: 22507548, entryPercent: 45.16 },
    { id: "7258-18188320", group: 7258, product: "Imovel", admin: "Embracon", credit: 18188320, entry: 7366708, term: 236, installment: 105886, balance: 24989096, entryPercent: 40.50 },
    { id: "7018-17709311", group: 7018, product: "Imovel", admin: "Embracon", credit: 17709311, entry: 6642733, term: 60, installment: 286264, balance: 17175840, entryPercent: 37.51 },
    { id: "7018-17296158", group: 7018, product: "Imovel", admin: "Embracon", credit: 17296158, entry: 6432404, term: 60, installment: 313385, balance: 18803100, entryPercent: 37.19 },
    { id: "7252-17060582", group: 7252, product: "Imovel", admin: "Embracon", credit: 17060582, entry: 6909515, term: 216, installment: 94604, balance: 20434464, entryPercent: 40.50 },
    { id: "7025-16776620", group: 7025, product: "Imovel", admin: "Embracon", credit: 16776620, entry: 6506597, term: 106, installment: 167000, balance: 17702000, entryPercent: 38.78 },
    { id: "7018-16605430", group: 7018, product: "Imovel", admin: "Embracon", credit: 16605430, entry: 7496326, term: 61, installment: 213200, balance: 13005200, entryPercent: 45.14 },
    { id: "7252-16519401", group: 7252, product: "Imovel", admin: "Embracon", credit: 16519401, entry: 6690985, term: 227, installment: 91908, balance: 20863116, entryPercent: 40.50 },
    { id: "751-16093122", group: 751, product: "Imovel", admin: "Embracon", credit: 16093122, entry: 7302328, term: 58, installment: 246791, balance: 14313878, entryPercent: 45.38 },
    { id: "7018-15910600", group: 7018, product: "Imovel", admin: "Embracon", credit: 15910600, entry: 6904636, term: 61, installment: 216000, balance: 13176000, entryPercent: 43.40 },
    { id: "7248-15769620", group: 7248, product: "Imovel", admin: "Embracon", credit: 15769620, entry: 7936177, term: 184, installment: 78700, balance: 14480800, entryPercent: 50.33 },
    { id: "7248-15749480", group: 7248, product: "Imovel", admin: "Embracon", credit: 15749480, entry: 6342880, term: 170, installment: 114782, balance: 19512940, entryPercent: 40.27 },
    { id: "8001-15283194", group: 8001, product: "Imovel", admin: "Embracon", credit: 15283194, entry: 5382080, term: 47, installment: 317739, balance: 14933733, entryPercent: 35.22 },
    { id: "7248-14561220", group: 7248, product: "Imovel", admin: "Embracon", credit: 14561220, entry: 5573673, term: 170, installment: 101800, balance: 17306000, entryPercent: 38.28 },
    { id: "7253-13154587", group: 7253, product: "Imovel", admin: "Embracon", credit: 13154587, entry: 5327865, term: 220, installment: 75760, balance: 16667200, entryPercent: 40.50 },
    { id: "8001-11476459", group: 8001, product: "Imovel", admin: "Embracon", credit: 11476459, entry: 4386911, term: 47, installment: 211957, balance: 9961979, entryPercent: 38.23 },
    { id: "8001-11346008", group: 8001, product: "Imovel", admin: "Embracon", credit: 11346008, entry: 4383650, term: 47, installment: 221065, balance: 10390055, entryPercent: 38.64 },
    { id: "782-10366138", group: 782, product: "Imovel", admin: "Embracon", credit: 10366138, entry: 3859153, term: 24, installment: 357597, balance: 8582328, entryPercent: 37.23 },
    { id: "7024-10140102", group: 7024, product: "Imovel", admin: "Embracon", credit: 10140102, entry: 3353503, term: 95, installment: 117735, balance: 11184825, entryPercent: 33.07 },
    { id: "7255-9650263", group: 7255, product: "Imovel", admin: "Embracon", credit: 9650263, entry: 3908257, term: 219, installment: 55720, balance: 12202680, entryPercent: 40.50 },
    { id: "7017-8631142", group: 7017, product: "Imovel", admin: "Embracon", credit: 8631142, entry: 4055779, term: 59, installment: 125091, balance: 7380369, entryPercent: 46.99 },
    { id: "727-8555644", group: 727, product: "Imovel", admin: "Embracon", credit: 8555644, entry: 4263891, term: 51, installment: 128953, balance: 6576603, entryPercent: 49.84 },
    { id: "7024-7512421", group: 7024, product: "Imovel", admin: "Embracon", credit: 7512421, entry: 3377811, term: 95, installment: 67331, balance: 6396445, entryPercent: 44.96 }
];

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
    selectedIds: new Set()
};

const elements = {
    search: document.getElementById("im-search"),
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
    results: document.getElementById("im-results-status"),
    selectionPanel: document.getElementById("im-selection-panel"),
    selectionText: document.getElementById("im-selection-text"),
    selectionLink: document.getElementById("im-selection-link")
};

function formatCurrencyFromCents(cents) {
    return currencyFormatter.format(cents / 100);
}

function formatProductLabel(product) {
    return product === "Imovel" ? "Imóvel" : product;
}

function getAdminLogo(admin) {
    return adminLogos[admin] || null;
}

function filterRows() {
    const query = state.search.trim().toLowerCase();

    return contempladasData.filter((row) => {
        const matchesSearch = !query
            || String(row.group).includes(query)
            || row.product.toLowerCase().includes(query)
            || row.admin.toLowerCase().includes(query);

        const matchesTerm = state.term === "all"
            || (state.term === "short" && row.term <= 60)
            || (state.term === "medium" && row.term >= 61 && row.term <= 120)
            || (state.term === "long" && row.term >= 121);

        const matchesEntry = state.entryRange === "all"
            || (state.entryRange === "low" && row.entryPercent <= 40)
            || (state.entryRange === "mid" && row.entryPercent > 40 && row.entryPercent <= 45)
            || (state.entryRange === "high" && row.entryPercent > 45);

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
        credito: formatCurrencyFromCents(row.credit),
        entrada: formatCurrencyFromCents(row.entry),
        prazo: numberFormatter.format(row.term),
        parcela: formatCurrencyFromCents(row.installment)
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
    const headings = ["Administradora", "Produto", "Valor do crédito", "Entrada", "Prazo", "Valor da parcela"];
    const bodyRows = rows.map((row) => `
        <tr>
            <td>${escapeHtml(row.administradora)}</td>
            <td>${escapeHtml(row.produto)}</td>
            <td>${escapeHtml(row.credito)}</td>
            <td>${escapeHtml(row.entrada)}</td>
            <td>${escapeHtml(row.prazo)}</td>
            <td>${escapeHtml(row.parcela)}</td>
        </tr>
    `).join("");

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

function buildWhatsAppLink(rows) {
    const headline = rows.length > 1
        ? "Olá, quero avaliar uma composição de cotas contempladas."
        : "Olá, quero receber detalhes desta carta contemplada.";

    const details = rows.map((row) => {
        return [
            "Administradora " + row.admin,
            "Crédito " + formatCurrencyFromCents(row.credit),
            "Entrada " + formatCurrencyFromCents(row.entry),
            "Prazo " + numberFormatter.format(row.term),
            "Parcela " + formatCurrencyFromCents(row.installment)
        ].join(" | ");
    }).join("\n");

    return "https://wa.me/5511954633703?text=" + encodeURIComponent(headline + "\n\n" + details);
}

function syncUrl() {
    const params = new URLSearchParams();

    if (state.search) params.set("q", state.search);
    if (state.term !== "all") params.set("prazo", state.term);
    if (state.entryRange !== "all") params.set("entrada", state.entryRange);
    if (state.sort !== "credit-desc") params.set("ordem", state.sort);

    const nextUrl = window.location.pathname + (params.toString() ? "?" + params.toString() : "") + window.location.hash;
    window.history.replaceState({}, "", nextUrl);
}

function hydrateFromUrl() {
    const params = new URLSearchParams(window.location.search);

    state.search = params.get("q") || "";
    state.term = params.get("prazo") || "all";
    state.entryRange = params.get("entrada") || "all";
    state.sort = params.get("ordem") || "credit-desc";

    elements.search.value = state.search;
    elements.term.value = state.term;
    elements.entry.value = state.entryRange;
    elements.sort.value = state.sort;
}

function updateSelectionPanel() {
    const selectedRows = contempladasData.filter((row) => state.selectedIds.has(row.id));

    if (!selectedRows.length) {
        elements.selectionPanel.hidden = true;
        elements.selectionText.textContent = "Nenhuma cota selecionada.";
        elements.selectionLink.href = "https://wa.me/5511954633703";
        return;
    }

    const totalCredit = selectedRows.reduce((sum, row) => sum + row.credit, 0);
    const totalEntry = selectedRows.reduce((sum, row) => sum + row.entry, 0);

    elements.selectionPanel.hidden = false;
    elements.selectionText.textContent = selectedRows.length === 1
        ? "1 cota selecionada | Crédito " + formatCurrencyFromCents(totalCredit) + " | Entrada " + formatCurrencyFromCents(totalEntry)
        : numberFormatter.format(selectedRows.length) + " cotas selecionadas | Crédito " + formatCurrencyFromCents(totalCredit) + " | Entrada " + formatCurrencyFromCents(totalEntry);
    elements.selectionLink.href = buildWhatsAppLink(selectedRows);
}

function updateResults(rows) {
    elements.results.textContent = rows.length ? "Lista atualizada" : "Nenhuma carta encontrada";
    elements.emptyState.hidden = rows.length > 0;
}

function renderTable(rows) {
    elements.tableBody.innerHTML = rows.map((row) => {
        const selected = state.selectedIds.has(row.id);
        const actionHref = buildWhatsAppLink([row]);
        const adminLogo = getAdminLogo(row.admin);
        const productLabel = formatProductLabel(row.product);

        return `
            <tr class="${selected ? "is-selected" : ""}">
                <td class="im-select-cell">
                    <input class="im-checkbox" type="checkbox" data-row-id="${row.id}" aria-label="Selecionar grupo ${row.group} para juntar cotas" ${selected ? "checked" : ""}>
                </td>
                <th scope="row">
                    <div class="im-group-cell">
                        ${adminLogo ? `<img class="im-admin-logo" src="${adminLogo.src}" alt="${adminLogo.alt}" width="112" height="60">` : `<span translate="no">${row.admin}</span>`}
                    </div>
                </th>
                <td><span class="im-product-pill">${productLabel}</span></td>
                <td class="im-money-cell im-number">${formatCurrencyFromCents(row.credit)}</td>
                <td class="im-money-cell im-number">${formatCurrencyFromCents(row.entry)}</td>
                <td class="im-term-cell im-number">${numberFormatter.format(row.term)}</td>
                <td class="im-money-cell im-number">${formatCurrencyFromCents(row.installment)}</td>
                <td class="im-row-action">
                    <a class="im-action-btn" href="${actionHref}" target="_blank" rel="noopener noreferrer">Negociar</a>
                </td>
            </tr>
        `;
    }).join("");
}

function renderCards(rows) {
    elements.cardsGrid.innerHTML = rows.map((row) => {
        const selected = state.selectedIds.has(row.id);
        const actionHref = buildWhatsAppLink([row]);
        const adminLogo = getAdminLogo(row.admin);
        const productLabel = formatProductLabel(row.product);

        return `
            <article class="im-card">
                <div class="im-card-top">
                    <div>
                        <h3 class="im-card-title">Administradora</h3>
                        ${adminLogo ? `<img class="im-card-admin-logo" src="${adminLogo.src}" alt="${adminLogo.alt}" width="120" height="64">` : `<span class="im-card-subtitle" translate="no">${row.admin}</span>`}
                    </div>
                    <input class="im-checkbox" type="checkbox" data-row-id="${row.id}" aria-label="Selecionar grupo ${row.group} para juntar cotas" ${selected ? "checked" : ""}>
                </div>
                <span class="im-product-pill">${productLabel}</span>
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
                        <dd class="im-number">${numberFormatter.format(row.term)}</dd>
                    </div>
                    <div>
                        <dt>Parcela</dt>
                        <dd class="im-number">${formatCurrencyFromCents(row.installment)}</dd>
                    </div>
                </dl>
                <a class="im-action-btn" href="${actionHref}" target="_blank" rel="noopener noreferrer">Negociar</a>
            </article>
        `;
    }).join("");
}

function render() {
    const filteredRows = getVisibleRows();
    updateResults(filteredRows);
    renderTable(filteredRows);
    renderCards(filteredRows);
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

hydrateFromUrl();
render();

elements.search.addEventListener("input", updateStateFromForm);
elements.term.addEventListener("change", updateStateFromForm);
elements.entry.addEventListener("change", updateStateFromForm);
elements.sort.addEventListener("change", updateStateFromForm);
elements.exportExcel.addEventListener("click", exportToExcel);
elements.exportPdf.addEventListener("click", exportToPdf);

elements.reset.addEventListener("click", () => {
    state.search = "";
    state.term = "all";
    state.entryRange = "all";
    state.sort = "credit-desc";

    elements.search.value = "";
    elements.term.value = "all";
    elements.entry.value = "all";
    elements.sort.value = "credit-desc";

    render();
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

