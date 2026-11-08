/* PluTek — shared behaviour: header state, mobile menu, screenshot reveal. */
(() => {
  const root = document.documentElement;
  root.classList.add("js");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Header border once the page has scrolled. One passive listener, rAF-throttled.
  const header = document.querySelector("[data-header]");
  if (header) {
    let ticking = false;
    const update = () => { header.classList.toggle("is-scrolled", window.scrollY > 8); ticking = false; };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  // Mobile menu: button controls the nav panel; Escape and link clicks close it; focus returns to the button.
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.getElementById("site-nav");
  if (toggle && nav) {
    const desktop = window.matchMedia("(min-width: 900px)");
    const setOpen = (open, { focusToggle = false } = {}) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector(".menu-toggle__label").textContent = open ? "Close" : "Menu";
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
      if (open) nav.querySelector("a")?.focus({ preventScroll: true });
      if (!open && focusToggle) toggle.focus();
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) setOpen(false, { focusToggle: true });
    });
    desktop.addEventListener("change", (e) => { if (e.matches) setOpen(false); });
  }

  // Screenshot frames rise into place once — the only scroll-triggered motion on the site.
  const revealables = document.querySelectorAll("[data-reveal]");
  if (revealables.length && !reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
      }
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
    revealables.forEach((el) => {
      // Elements already in view at load stay visible: no flash, no delayed content.
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) return;
      el.classList.add("reveal");
      io.observe(el);
    });
  }

  // Keep the floating WhatsApp button off the footer and away from open forms on small screens.
  const wa = document.querySelector(".wa-float");
  const footer = document.querySelector(".site-footer");
  if (wa && footer && "IntersectionObserver" in window) {
    // Hidden on the opening screen (where the page's own buttons sit) and over the footer (which lists WhatsApp).
    let nearTop = true, overFooter = false;
    const sync = () => wa.classList.toggle("is-hidden", nearTop || overFooter);
    new IntersectionObserver(([entry]) => { overFooter = entry.isIntersecting; sync(); }).observe(footer);
    let ticking = false;
    const check = () => { nearTop = window.scrollY < window.innerHeight * 0.5; sync(); ticking = false; };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(check); } }, { passive: true });
    check();
  }
})();
