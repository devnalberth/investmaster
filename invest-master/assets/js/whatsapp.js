/**
 * Links e formulários → WhatsApp Invest Master (11 95463-3703).
 * Use data-im-whatsapp="chave" em âncoras ou data-im-whatsapp-form em formulários.
 */
(function (global) {
    const PHONE_E164 = "5511954633703";
    const PHONE_DISPLAY = "11 95463-3703";

    const MESSAGES = {
        default: "Olá! Vim pelo site da Invest Master e gostaria de falar com a equipe.",
        parceiro: "Olá! Vim pelo site da Invest Master e quero saber como ser parceiro.",
        geral: "Olá! Vim pelo site da Invest Master e gostaria de mais informações.",
        proposta: "Olá! Vim pelo site da Invest Master e gostaria de solicitar uma proposta sem compromisso.",
        contato: "Olá! Vim pelo site da Invest Master e gostaria de entrar em contato.",
        newsletter: "Olá! Vim pelo site da Invest Master e quero receber novidades."
    };

    function getUrl(messageKey, extraLines) {
        const base = MESSAGES[messageKey] || MESSAGES.default;
        const text = extraLines ? base + "\n\n" + extraLines : base;
        return "https://wa.me/" + PHONE_E164 + "?text=" + encodeURIComponent(text);
    }

    function readFormDetails(form) {
        const parts = [];
        const name = form.querySelector('[name="name"], #name')?.value?.trim();
        const phone = form.querySelector('[name="phone"]')?.value?.trim();
        const email = form.querySelector('[name="email"], #email')?.value?.trim();
        const message = form.querySelector('[name="message"], #message, textarea[name="message"]')?.value?.trim();

        if (name) parts.push("Nome: " + name);
        if (phone) parts.push("Telefone: " + phone);
        if (email) parts.push("E-mail: " + email);
        if (message) parts.push("Mensagem: " + message);
        return parts.join("\n");
    }

    function openWhatsApp(messageKey, extraLines) {
        global.open(getUrl(messageKey, extraLines), "_blank", "noopener,noreferrer");
    }

    function applyLink(el) {
        const key = el.getAttribute("data-im-whatsapp");
        if (!key) return;
        el.href = getUrl(key);
        el.target = "_blank";
        el.rel = "noopener noreferrer";
    }

    function initLinks() {
        document.querySelectorAll("[data-im-whatsapp]").forEach(applyLink);

        document.querySelectorAll('a[href^="https://wa.me/' + PHONE_E164 + '"]').forEach(function (el) {
            if (el.hasAttribute("data-im-whatsapp")) return;
            if (el.href.indexOf("text=") !== -1) return;
            el.href = getUrl("default");
            el.target = "_blank";
            el.rel = "noopener noreferrer";
        });
    }

    function initForms() {
        document.querySelectorAll("[data-im-whatsapp-form]").forEach(function (form) {
            const key = form.getAttribute("data-im-whatsapp-form") || "proposta";
            form.addEventListener("submit", function (e) {
                e.preventDefault();
                openWhatsApp(key, readFormDetails(form));
            });
        });
    }

    function initNewsletterButtons() {
        document.querySelectorAll("[data-im-whatsapp-newsletter]").forEach(function (btn) {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                const root = btn.closest(".inpur-area-main, .right-area, .cta-main-area-wrapper-one, form, .rts-cta-area-one");
                const email = root?.querySelector('input[type="email"]')?.value?.trim();
                openWhatsApp("newsletter", email ? "E-mail: " + email : "");
            });
        });
    }

    function boot() {
        initLinks();
        initForms();
        initNewsletterButtons();
    }

    global.ImWhatsApp = {
        phone: PHONE_E164,
        display: PHONE_DISPLAY,
        messages: MESSAGES,
        getUrl: getUrl,
        open: openWhatsApp
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
})(window);
