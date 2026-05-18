/**
 * Envio de formulários e newsletter por e-mail via FormSubmit.co
 * Destino: jonathan.henrique@investmaisparcerias.com.br
 */
(function () {
    const ENDPOINT = "https://formsubmit.co/ajax/jonathan.henrique@investmaisparcerias.com.br";

    function showMsg(el, type, text) {
        if (!el) return;
        el.className = "im-form-feedback im-form-feedback--" + type;
        el.textContent = text;
        el.hidden = false;
        if (type === "success") {
            setTimeout(function () { el.hidden = true; }, 6000);
        }
    }

    /* ── Formulário de contato ────────────────────────────── */
    var contactForm = document.getElementById("contact-form");
    if (contactForm && !contactForm.hasAttribute("data-im-whatsapp-form")) {
        var msgEl = document.getElementById("form-messages");

        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            var btn = contactForm.querySelector('[type="submit"]');
            var btnOrigText = btn ? btn.textContent : "";
            if (btn) { btn.disabled = true; btn.textContent = "Enviando…"; }

            var name    = (contactForm.querySelector('[name="name"]')?.value    || "").trim();
            var email   = (contactForm.querySelector('[name="email"]')?.value   || "").trim();
            var message = (contactForm.querySelector('[name="message"]')?.value || "").trim();

            var payload = {
                _subject: "Contato pelo site – Invest Master",
                _captcha: "false",
                _template: "table",
                Nome: name,
                Email: email,
                Mensagem: message
            };

            fetch(ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(payload)
            })
            .then(function (r) { return r.json(); })
            .then(function (data) {
                if (data && data.success === "true") {
                    showMsg(msgEl, "success", "Mensagem enviada com sucesso! Entraremos em contato em breve.");
                    contactForm.reset();
                } else {
                    showMsg(msgEl, "error", "Erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.");
                }
            })
            .catch(function () {
                showMsg(msgEl, "error", "Erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.");
            })
            .finally(function () {
                if (btn) { btn.disabled = false; btn.textContent = btnOrigText; }
            });
        });
    }

    /* ── Newsletter ───────────────────────────────────────── */
    document.querySelectorAll("[data-im-newsletter-email]").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            e.preventDefault();

            var root  = btn.closest(".inpur-area-main, .right-area, .cta-main-area-wrapper-one, form, .rts-cta-area-one");
            var input = root ? root.querySelector('input[type="email"]') : null;
            var email = input ? input.value.trim() : "";

            if (!email) {
                var fb = root ? root.querySelector(".im-form-feedback") : null;
                showMsg(fb, "error", "Informe um e-mail válido.");
                return;
            }

            var btnOrigText = btn.textContent;
            btn.disabled = true;
            btn.textContent = "Enviando…";

            fetch(ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({
                    _subject: "Nova inscrição na newsletter – Invest Master",
                    _captcha: "false",
                    _template: "table",
                    Email: email
                })
            })
            .then(function (r) { return r.json(); })
            .then(function (data) {
                var fb = root ? root.querySelector(".im-form-feedback") : null;
                if (data && data.success === "true") {
                    showMsg(fb, "success", "Inscrição realizada com sucesso!");
                    if (input) input.value = "";
                } else {
                    showMsg(fb, "error", "Erro ao inscrever. Tente novamente.");
                }
            })
            .catch(function () {
                var fb = root ? root.querySelector(".im-form-feedback") : null;
                showMsg(fb, "error", "Erro ao inscrever. Tente novamente.");
            })
            .finally(function () {
                btn.disabled = false;
                btn.textContent = btnOrigText;
            });
        });
    });
})();
