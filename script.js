(() => {
  // Enable JS-only styles (reveal animations, etc.)
  document.documentElement.classList.add("js");

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Theme toggle
  const themeToggle = document.querySelector('[data-js="theme-toggle"]');
  const THEME_KEY = "portfolio-theme";
  const THEME_DARK = "dark";
  const THEME_LIGHT = "light";

  const getTheme = () => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === THEME_LIGHT || saved === THEME_DARK) return saved;
    // Default to dark theme
    return THEME_DARK;
  };

  const setTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    if (themeToggle) {
      themeToggle.setAttribute("aria-label", `Switch to ${theme === THEME_DARK ? "light" : "dark"} theme`);
    }
  };

  const toggleTheme = () => {
    const current = getTheme();
    const newTheme = current === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    setTheme(newTheme);
  };

  // Initialize theme on page load
  setTheme(getTheme());

  // Handle theme toggle click
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  // Prevent placeholder links from navigating
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const placeholderLink = target.closest("a[data-placeholder-href]");
    if (!placeholderLink) return;
    e.preventDefault();
  });

  // Mobile navigation
  const toggleBtn = document.querySelector('[data-js="nav-toggle"]');
  const mobileMenu = document.querySelector('[data-js="mobile-menu"]');

  const isOpen = () => document.body.classList.contains("menu-open");

  const openMenu = () => {
    if (!toggleBtn || !mobileMenu) return;
    document.body.classList.add("menu-open");
    mobileMenu.hidden = false;
    toggleBtn.setAttribute("aria-expanded", "true");
    toggleBtn.setAttribute("aria-label", "Close menu");

    // Move focus to first link for keyboard users
    const firstLink = mobileMenu.querySelector("a");
    if (firstLink) firstLink.focus({ preventScroll: true });
  };

  const closeMenu = () => {
    if (!toggleBtn || !mobileMenu) return;
    document.body.classList.remove("menu-open");
    mobileMenu.hidden = true;
    toggleBtn.setAttribute("aria-expanded", "false");
    toggleBtn.setAttribute("aria-label", "Open menu");
  };

  const toggleMenu = () => {
    if (isOpen()) closeMenu();
    else openMenu();
  };

  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener("click", toggleMenu);

    // Close on any menu link click
    mobileMenu.addEventListener("click", (e) => {
      const target = e.target;
      if (target instanceof HTMLElement && target.closest("a")) closeMenu();
    });

    // Close on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen()) {
        closeMenu();
        toggleBtn.focus({ preventScroll: true });
      }
    });

    // Close if clicking outside header/menu
    document.addEventListener("click", (e) => {
      if (!isOpen()) return;
      const target = e.target;
      if (!(target instanceof Node)) return;
      if (mobileMenu.contains(target) || toggleBtn.contains(target)) return;
      closeMenu();
    });

    // Close when resizing to desktop
    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 961px)").matches && isOpen()) closeMenu();
    });
  }

  // Reveal on scroll
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  if (revealEls.length) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    } else if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
      );
      revealEls.forEach((el) => io.observe(el));
    } else {
      // Fallback: no IO support
      revealEls.forEach((el) => el.classList.add("is-visible"));
    }
  }
})();

