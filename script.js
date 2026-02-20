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

  setTheme(getTheme());
  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);

  // Prevent placeholder links
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
    const firstLink = mobileMenu.querySelector("a");
    if (firstLink) firstLink.focus({ preventScroll: true });
  };

  const closeMenu = () => {
    if (!toggleBtn || !mobileMenu) return;
    document.body.classList.remove("menu-open");
    mobileMenu.hidden = true;
    toggleBtn.setAttribute("aria-expanded", "false");
  };

  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener("click", () => isOpen() ? closeMenu() : openMenu());
    mobileMenu.addEventListener("click", (e) => {
      if (e.target instanceof HTMLElement && e.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen()) {
        closeMenu();
        toggleBtn.focus({ preventScroll: true });
      }
    });
    document.addEventListener("click", (e) => {
      if (isOpen() && !mobileMenu.contains(e.target) && !toggleBtn.contains(e.target)) closeMenu();
    });
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
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.14 });
      revealEls.forEach((el) => io.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    }
  }

  // Particle Network Animation (Enhanced)
  const initBgAnimation = () => {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [];
    const particleCount = 60;
    const maxDistance = 200;
    const mouse = { x: null, y: null, radius: 150 };

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.size = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? "rgba(124, 58, 237, 0.5)" : "rgba(6, 182, 212, 0.5)";
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Mouse interaction
        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= dx * force * 0.05;
            this.y -= dy * force * 0.05;
          }
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        if (Math.random() > 0.98) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = this.color;
        } else {
          ctx.shadowBlur = 0;
        }
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.update();
        p.draw();
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const opacity = (1 - dist / maxDistance) * 0.2;
            ctx.strokeStyle = `rgba(148, 163, 184, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animate);
    };
    animate();
  };

  initBgAnimation();
})();
