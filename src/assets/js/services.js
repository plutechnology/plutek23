/* PluTek — services index: highlight the section in view, open a service when linked to directly. */
(() => {
  const toc = document.querySelector("[data-svc-toc]");
  const items = [...document.querySelectorAll(".svc[id]")];
  if (!toc || !items.length) return;
  const links = new Map([...toc.querySelectorAll("a")].map((a) => [a.hash.slice(1), a]));

  // Open the service named in the URL hash (and when a contents link is used).
  const openFromHash = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    const el = id ? document.getElementById(id) : null;
    if (el?.matches("details.svc")) el.open = true;
  };
  openFromHash();
  window.addEventListener("hashchange", openFromHash);

  // Highlight the service closest to the top of the viewport.
  let active = null;
  const setActive = (id) => {
    if (id === active) return;
    links.get(active)?.classList.remove("is-active");
    links.get(id)?.classList.add("is-active");
    active = id;
    // On small screens the contents is a horizontal strip: keep the active chip in view.
    const a = links.get(id);
    if (a && toc.scrollWidth > toc.clientWidth) {
      toc.scrollTo({ left: a.offsetLeft - 16, behavior: "smooth" });
    }
  };
  const io = new IntersectionObserver((entries) => {
    const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visible[0]) setActive(visible[0].target.id);
  }, { rootMargin: "-30% 0px -60% 0px" });
  items.forEach((el) => io.observe(el));
})();
