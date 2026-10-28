(function () {
  "use strict";

  const doc = document;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* header state */
  const header = doc.querySelector("[data-header]");
  function paintHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  paintHeader();
  window.addEventListener("scroll", paintHeader, { passive: true });

  /* Wuyi clock */
  const clocks = doc.querySelectorAll("[data-clock]");
  if (clocks.length) {
    const fmt = new Intl.DateTimeFormat("zh-CN", {
      timeZone: "Asia/Shanghai",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tick = function () {
      const time = fmt.format(new Date());
      clocks.forEach(function (el) {
        el.textContent = "武夷山 · " + time;
      });
    };
    tick();
    window.setInterval(tick, 30000);
  }

  /* reveal on view */
  const reveals = Array.prototype.slice.call(doc.querySelectorAll("[data-reveal]"));
  if (reveals.length) {
    if ("IntersectionObserver" in window && !reduceMotion.matches) {
      const io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
      );
      reveals.forEach(function (el) {
        io.observe(el);
      });
    } else {
      reveals.forEach(function (el) {
        el.classList.add("is-in");
      });
    }
  }

  /* craft steps on the landing page */
  const craft = doc.querySelector("[data-craft]");
  if (craft) {
    const steps = Array.prototype.slice.call(craft.querySelectorAll("[data-craft-step]"));
    if ("IntersectionObserver" in window) {
      const stepIO = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            steps.forEach(function (step) {
              step.classList.toggle("is-active", step === entry.target);
            });
          });
        },
        { rootMargin: "-40% 0px -46% 0px", threshold: 0 }
      );
      steps.forEach(function (step) {
        stepIO.observe(step);
      });
    }
  }

  /* mobile menu */
  const menu = doc.getElementById("menu");
  const openBtn = doc.querySelector("[data-menu-open]");
  const main = doc.querySelector("main");
  const footer = doc.querySelector(".site-footer");
  let lastFocus = null;
  let closeTimer = null;

  function focusableInMenu() {
    if (!menu) return [];
    return Array.prototype.filter.call(
      menu.querySelectorAll('a[href], button:not([disabled])'),
      function (el) {
        return el.offsetParent !== null;
      }
    );
  }

  function openMenu() {
    if (!menu || !openBtn) return;
    window.clearTimeout(closeTimer);
    lastFocus = doc.activeElement;
    menu.hidden = false;
    menu.setAttribute("aria-hidden", "false");
    doc.body.classList.add("menu-open");
    if (main) main.setAttribute("inert", "");
    if (footer) footer.setAttribute("inert", "");
    openBtn.setAttribute("aria-expanded", "true");
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        menu.classList.add("is-open");
        const close = menu.querySelector(".menu__close");
        if (close) close.focus();
      });
    });
  }

  function closeMenu(restore) {
    if (!menu || menu.hidden) return;
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    if (openBtn) openBtn.setAttribute("aria-expanded", "false");
    doc.body.classList.remove("menu-open");
    if (main) main.removeAttribute("inert");
    if (footer) footer.removeAttribute("inert");
    if (restore !== false && lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
    closeTimer = window.setTimeout(function () {
      menu.hidden = true;
    }, reduceMotion.matches ? 0 : 470);
  }

  if (menu && openBtn) {
    openBtn.addEventListener("click", openMenu);
    Array.prototype.forEach.call(menu.querySelectorAll("[data-menu-close]"), function (btn) {
      btn.addEventListener("click", function () {
        closeMenu();
      });
    });
    Array.prototype.forEach.call(menu.querySelectorAll("a[href]"), function (link) {
      link.addEventListener("click", function () {
        closeMenu(false);
      });
    });
    doc.addEventListener("keydown", function (e) {
      if (menu.hidden) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusableInMenu();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && doc.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && doc.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900 && !menu.hidden) closeMenu(false);
    });
  }

  /* year */
  doc.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
