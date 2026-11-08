/* PluTek — forms: inline validation, optional multi-step flow, Netlify Forms submission.
   Without JavaScript every form still posts natively to Netlify and lands on its success page. */
(() => {
  const WHATSAPP = "27624930297";
  const forms = document.querySelectorAll("form[data-form]");
  if (!forms.length) return;

  const messages = {
    valueMissing: (f) => f.dataset.required || "This field is required.",
    typeMismatch: (f) => (f.type === "email" ? "Enter an email address like name@company.co.za." : f.type === "url" ? "Enter a full link, starting with https://" : "Check this value."),
    patternMismatch: (f) => f.dataset.pattern || "Check the format of this value.",
    tooLong: (f) => `Keep this under ${f.maxLength} characters.`,
    rangeUnderflow: () => "Choose a date from today onwards.",
  };

  const fieldOf = (input) => input.closest(".field") || input.closest("fieldset");
  const errorOf = (input) => fieldOf(input)?.querySelector(".field__error");

  function fileProblem(input) {
    const file = input.files?.[0];
    if (!file) return "";
    const maxMb = Number(input.dataset.maxMb || 8);
    if (file.size > maxMb * 1024 * 1024) return `This file is ${(file.size / 1048576).toFixed(1)} MB. The limit is ${maxMb} MB.`;
    const allowed = (input.accept || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (allowed.length && !allowed.includes(ext)) return `Upload a ${allowed.join(", ").replace(/\./g, "").toUpperCase()} file.`;
    return "";
  }

  function validate(input) {
    if (input.type === "file") input.setCustomValidity(fileProblem(input));
    const ok = input.checkValidity();
    const field = fieldOf(input);
    const err = errorOf(input);
    // For radio groups, mark every radio in the group.
    const group = input.type === "radio" ? input.form.querySelectorAll(`input[name="${CSS.escape(input.name)}"]`) : [input];
    group.forEach((el) => el.setAttribute("aria-invalid", String(!ok)));
    field?.classList.toggle("has-error", !ok);
    if (err) {
      if (ok) err.textContent = "";
      else {
        const key = Object.keys(messages).find((k) => input.validity[k]);
        err.textContent = input.validationMessage && input.validity.customError ? input.validationMessage : key ? messages[key](input) : input.validationMessage;
      }
    }
    return ok;
  }

  function validateAll(scope) {
    const inputs = [...scope.querySelectorAll("input, select, textarea")].filter((el) => el.name && !el.disabled && el.type !== "hidden" && !el.closest(".hp-field"));
    const seen = new Set();
    let firstBad = null;
    for (const el of inputs) {
      if (el.type === "radio") { if (seen.has(el.name)) continue; seen.add(el.name); }
      if (!validate(el) && !firstBad) firstBad = el;
    }
    if (firstBad) firstBad.focus({ preventScroll: false });
    return !firstBad;
  }

  function wire(form) {
    form.noValidate = true;
    const steps = [...form.querySelectorAll("[data-step]")];
    const progress = form.querySelectorAll("[data-progress] li");
    const submit = form.querySelector('[type="submit"]');
    const error = form.querySelector("[data-form-error]");
    let current = 0;

    // Prefill from the URL, e.g. /consultation.html?service=Website%20Development
    const params = new URLSearchParams(location.search);
    for (const [key, value] of params) {
      const target = form.querySelector(`[data-prefill="${CSS.escape(key)}"]`);
      if (!target) continue;
      if (target.tagName === "SELECT") {
        const opt = [...target.options].find((o) => o.value.toLowerCase() === value.toLowerCase());
        if (opt) target.value = opt.value;
      } else if (target.matches("[data-prefill-group]")) {
        const radio = [...target.querySelectorAll("input")].find((i) => i.value.toLowerCase() === value.toLowerCase());
        if (radio) radio.checked = true;
      } else if (!target.value) {
        target.value = value;
      }
    }

    // Earliest selectable date = today (local).
    form.querySelectorAll('input[type="date"][data-min-today]').forEach((d) => {
      const t = new Date(); t.setMinutes(t.getMinutes() - t.getTimezoneOffset());
      d.min = t.toISOString().slice(0, 10);
    });

    // Character counters.
    form.querySelectorAll("textarea[maxlength]").forEach((ta) => {
      const out = ta.closest(".field")?.querySelector(".field__count");
      if (!out) return;
      const update = () => { out.textContent = `${ta.value.length} / ${ta.maxLength}`; };
      ta.addEventListener("input", update); update();
    });

    // Validate on blur once touched, and live once an error is showing.
    form.addEventListener("focusout", (e) => {
      const el = e.target;
      if (!el.name || el.type === "radio" || el.closest(".hp-field")) return;
      // Leaving a field by pressing a button: that button validates everything itself. Validating here would
      // insert an error above the button and move it between press and release, swallowing the click.
      if (e.relatedTarget?.closest?.("button")) return;
      if (el.value !== "" || fieldOf(el)?.classList.contains("has-error")) validate(el);
    });
    form.addEventListener("input", (e) => { if (fieldOf(e.target)?.classList.contains("has-error")) validate(e.target); });
    form.addEventListener("change", (e) => { if (e.target.type === "radio" || e.target.type === "file" || e.target.type === "checkbox") validate(e.target); });

    function show(i, { focus = true } = {}) {
      current = i;
      steps.forEach((s, n) => { s.hidden = n !== i; });
      progress.forEach((li, n) => {
        li.classList.toggle("is-current", n === i);
        li.classList.toggle("is-done", n < i);
        if (n === i) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
      });
      if (focus) {
        const title = steps[i].querySelector(".form-step__title");
        title?.setAttribute("tabindex", "-1");
        title?.focus({ preventScroll: true });
        form.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      }
    }
    if (steps.length > 1) {
      show(0, { focus: false });
      form.addEventListener("click", (e) => {
        if (e.target.closest("[data-next]")) { if (validateAll(steps[current])) show(current + 1); }
        if (e.target.closest("[data-back]")) show(current - 1);
      });
      // Enter in a text field moves forward instead of submitting a half-finished form.
      form.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" || e.target.tagName === "TEXTAREA" || e.target.type === "submit" || e.target.closest("button")) return;
        if (current < steps.length - 1) { e.preventDefault(); form.querySelector(`[data-step="${current}"] [data-next]`)?.click(); }
      });
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (error) error.hidden = true;
      if (!validateAll(form)) {
        // On a multi-step form, jump back to the first step that has a problem.
        const bad = steps.findIndex((s) => s.querySelector('[aria-invalid="true"]'));
        if (bad > -1 && bad !== current) { show(bad); validateAll(steps[bad]); }
        return;
      }
      const label = submit.textContent;
      submit.disabled = true; submit.setAttribute("aria-disabled", "true"); submit.textContent = "Sending…";
      try {
        const data = new FormData(form);
        const hasFile = [...form.querySelectorAll('input[type="file"]')].some((f) => f.files?.length);
        const res = await fetch("/", {
          method: "POST",
          body: hasFile ? data : new URLSearchParams(data),
          headers: hasFile ? undefined : { "Content-Type": "application/x-www-form-urlencoded" },
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        succeed(form, data);
      } catch (err) {
        if (error) { error.hidden = false; error.focus?.(); }
        submit.disabled = false; submit.removeAttribute("aria-disabled"); submit.textContent = label;
      }
    });
  }

  function succeed(form, data) {
    const tpl = document.getElementById(form.dataset.success);
    const panel = form.closest("[data-form-panel]") || form;
    if (!tpl) { form.reset(); return; }
    const node = tpl.content.cloneNode(true);
    const first = String(data.get("name") || "").trim().split(/\s+/)[0];
    node.querySelectorAll("[data-first-name]").forEach((el) => { el.textContent = first ? `, ${first}` : ""; });
    const wa = node.querySelector("[data-wa-summary]");
    if (wa) {
      const lines = [`Hi PluTek, I've just sent a ${form.dataset.summaryLabel || "message"} on your website.`];
      for (const [k, v] of data) {
        if (v instanceof File || !String(v).trim() || ["form-name", "bot-field", "consent"].includes(k)) continue;
        lines.push(`${k.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase())}: ${v}`);
      }
      wa.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`;
    }
    panel.replaceChildren(node);
    const heading = panel.querySelector("h2");
    heading?.setAttribute("tabindex", "-1");
    heading?.focus();
  }

  forms.forEach(wire);
})();
