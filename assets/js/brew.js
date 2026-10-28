"use strict";

(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const narrow = window.matchMedia("(max-width: 900px)");

  /* scroll-driven ritual */
  const ritual = document.querySelector("[data-ritual]");
  if (ritual) {
    const layout = ritual.querySelector(".ritual__layout");
    const stage = ritual.querySelector("[data-ritual-stage]");
    const steps = Array.prototype.slice.call(ritual.querySelectorAll("[data-ritual-step]"));
    const num = ritual.querySelector("[data-ritual-num]");
    const title = ritual.querySelector("[data-ritual-title]");
    const en = ritual.querySelector("[data-ritual-en]");
    const param = ritual.querySelector("[data-ritual-param]");
    const progress = ritual.querySelector("[data-ritual-progress]");
    let current = -1;
    let queued = false;

    function setStep(index) {
      if (index === current || !steps[index]) return;
      current = index;
      const step = steps[index];
      stage.dataset.stage = String(index);
      num.textContent = String(index + 1).padStart(2, "0");
      title.textContent = step.dataset.title;
      en.textContent = step.dataset.en;
      param.textContent = step.dataset.param;
      steps.forEach(function (item, i) {
        item.classList.toggle("is-active", i === index);
      });
    }

    function update() {
      queued = false;
      if (reduceMotion.matches || narrow.matches) {
        setStep(3);
        return;
      }
      const rect = layout.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      const p = Math.min(1, Math.max(0, -rect.top / total));
      progress.style.transform = "scaleX(" + p + ")";
      const cutoff = window.innerHeight * 0.55;
      let index = 0;
      steps.forEach(function (step, i) {
        if (step.getBoundingClientRect().top <= cutoff) index = i;
      });
      setStep(index);
    }

    function schedule() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    if (typeof reduceMotion.addEventListener === "function") {
      reduceMotion.addEventListener("change", schedule);
      narrow.addEventListener("change", schedule);
    }
    update();
  }

  /* guide tabs */
  const tablist = document.querySelector(".guide__tabs");
  if (tablist) {
    const tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    const panels = tabs.map(function (tab) {
      return document.getElementById(tab.getAttribute("aria-controls"));
    });

    function selectTab(tab, moveFocus) {
      const index = tabs.indexOf(tab);
      tabs.forEach(function (item, i) {
        const selected = item === tab;
        item.setAttribute("aria-selected", selected ? "true" : "false");
        item.tabIndex = selected ? 0 : -1;
        if (panels[i]) panels[i].hidden = !selected;
      });
      if (moveFocus) tab.focus();
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        selectTab(tab, false);
      });
      tab.addEventListener("keydown", function (event) {
        let next = index;
        if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
        else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = tabs.length - 1;
        else return;
        event.preventDefault();
        selectTab(tabs[next], true);
      });
    });
  }

  /* steep timer */
  const timer = document.querySelector("[data-timer]");
  if (timer) {
    const ring = timer.querySelector("[data-timer-ring]");
    const value = timer.querySelector("[data-timer-value]");
    const startBtn = timer.querySelector("[data-timer-start]");
    const hint = timer.querySelector("[data-timer-hint]");
    const presets = Array.prototype.slice.call(timer.querySelectorAll("[data-timer-preset]"));
    const circumference = 2 * Math.PI * 96;
    const hints = { 8: "第一泡 · 8 秒", 12: "第四泡 · 12 秒", 20: "第七泡 · 20 秒" };
    let duration = 8000;
    let remaining = 8000;
    let running = false;
    let endAt = 0;
    let frame = null;

    hint.setAttribute("aria-live", "polite");
    ring.style.strokeDasharray = String(circumference);

    function paint(ms) {
      value.textContent = String(Math.ceil(ms / 1000));
      const ratio = duration > 0 ? ms / duration : 0;
      ring.style.strokeDashoffset = String(circumference * (1 - ratio));
    }

    function stopFrame() {
      running = false;
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
        frame = null;
      }
    }

    function tick() {
      const left = Math.max(0, endAt - Date.now());
      paint(left);
      if (left <= 0) {
        stopFrame();
        remaining = 0;
        timer.classList.add("is-finished");
        startBtn.textContent = "重新开始";
        hint.textContent = "出汤";
        return;
      }
      frame = window.requestAnimationFrame(tick);
    }

    function reset() {
      stopFrame();
      remaining = duration;
      timer.classList.remove("is-finished");
      startBtn.textContent = "开始计时";
      hint.textContent = hints[duration / 1000] || "";
      paint(remaining);
    }

    presets.forEach(function (button) {
      button.addEventListener("click", function () {
        duration = Number(button.getAttribute("data-timer-preset")) * 1000;
        presets.forEach(function (item) {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", active ? "true" : "false");
        });
        reset();
      });
    });

    startBtn.addEventListener("click", function () {
      if (running) {
        remaining = Math.max(0, endAt - Date.now());
        stopFrame();
        startBtn.textContent = "继续";
        hint.textContent = "已暂停";
        return;
      }
      if (remaining <= 0) {
        remaining = duration;
        timer.classList.remove("is-finished");
        paint(remaining);
      }
      endAt = Date.now() + remaining;
      running = true;
      startBtn.textContent = "暂停";
      hint.textContent = "计时中…";
      tick();
    });

    reset();
  }
})();
