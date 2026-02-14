(function () {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ----- Mobile nav toggle -----
  const topbar = document.querySelector(".topbar");
  const toggle = document.querySelector(".navToggle");
  const panel = document.querySelector(".navPanel");
  const mobileLinks = document.querySelectorAll(".nav--mobile .nav__link");

  function setNavOpen(open) {
    if (!topbar || !toggle || !panel) return;
    topbar.dataset.open = open ? "true" : "false";
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    panel.hidden = !open;
  }

  if (toggle && panel && topbar) {
    setNavOpen(false);

    toggle.addEventListener("click", () => {
      const open = topbar.dataset.open === "true";
      setNavOpen(!open);
    });

    mobileLinks.forEach((a) => a.addEventListener("click", () => setNavOpen(false)));

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setNavOpen(false);
    });
  }

  // ----- Theme latch at a single threshold -----
  const overview = document.getElementById("overview");
  if (!overview) return;

  const CHECKPOINT = 0.35; // 35% down viewport
  let ticking = false;

  function setTheme(theme) {
    const current = document.body.getAttribute("data-theme") || "light";
    if (theme !== current) document.body.setAttribute("data-theme", theme);
  }

  function computeTheme() {
    const y = window.innerHeight * CHECKPOINT;
    const r = overview.getBoundingClientRect();

    // Key idea:
    // Once overview's TOP goes above the checkpoint line, you're "past" the threshold.
    // That should stay dark until you come back up (overview top goes below checkpoint again).
    const pastThreshold = (r.top <= y);
    setTheme(pastThreshold ? "dark" : "light");
  }

  function onScrollOrResize() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      computeTheme();
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize, { passive: true });

  computeTheme();
})();
