"use strict";

(function () {
  const form = document.querySelector("[data-booking]");
  if (!form) return;

  const success = document.querySelector("[data-booking-success]");
  const summary = document.querySelector("[data-success-summary]");
  const idEl = document.querySelector("[data-success-id]");
  const again = document.querySelector("[data-booking-again]");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function isoDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + d;
  }

  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + 1);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 60);

  const dateInput = form.elements.date;
  dateInput.min = isoDate(minDate);
  dateInput.max = isoDate(maxDate);

  const teaChoice = new URLSearchParams(window.location.search).get("tea");
  const teaNames = {
    "yan-gu": "岩骨 · 肉桂足火",
    "bai-lu": "白露 · 白鸡冠轻火",
    "song-feng": "松风 · 老丛水仙",
  };
  if (teaChoice && teaNames[teaChoice]) {
    form.elements.tea.value = teaNames[teaChoice];
  }

  function controlsFor(key) {
    if (key === "slot") {
      return Array.prototype.slice.call(form.querySelectorAll('input[name="slot"]'));
    }
    const field = form.elements[key];
    return field ? [field] : [];
  }

  function errorFor(key) {
    return form.querySelector('[data-error-for="' + key + '"]');
  }

  function setError(key, message) {
    const box = errorFor(key);
    if (box) box.textContent = message;
    controlsFor(key).forEach(function (control) {
      control.setAttribute("aria-invalid", "true");
      control.setAttribute("aria-describedby", "error-" + key);
    });
  }

  function clearError(key) {
    const box = errorFor(key);
    if (box) box.textContent = "";
    controlsFor(key).forEach(function (control) {
      control.removeAttribute("aria-invalid");
      control.removeAttribute("aria-describedby");
    });
  }

  form.addEventListener("input", function (event) {
    if (event.target.name) clearError(event.target.name);
  });
  form.addEventListener("change", function (event) {
    if (event.target.name) clearError(event.target.name);
  });

  function validate() {
    let firstInvalid = null;
    const name = form.elements.name.value.trim();
    const phone = form.elements.phone.value.trim();
    const dateValue = form.elements.date.value;
    const slot = form.querySelector('input[name="slot"]:checked');

    if (name.length < 2) {
      setError("name", "请填写至少两个字的称呼。");
      firstInvalid = firstInvalid || form.elements.name;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setError("phone", "请填写 11 位中国大陆手机号。");
      firstInvalid = firstInvalid || form.elements.phone;
    }
    if (!dateValue) {
      setError("date", "请选择到访日期。");
      firstInvalid = firstInvalid || form.elements.date;
    } else {
      const chosen = new Date(dateValue + "T00:00:00");
      if (chosen < minDate) {
        setError("date", "请至少提前一天预约。");
        firstInvalid = firstInvalid || form.elements.date;
      } else if (chosen > maxDate) {
        setError("date", "暂只开放未来六十天的席位。");
        firstInvalid = firstInvalid || form.elements.date;
      } else if (chosen.getDay() === 2 || chosen.getDay() === 3) {
        setError("date", "周二、周三休舍，请另选一日。");
        firstInvalid = firstInvalid || form.elements.date;
      }
    }
    if (!slot) {
      setError("slot", "请选择一个时席。");
      firstInvalid = firstInvalid || form.querySelector('input[name="slot"]');
    }

    return firstInvalid;
  }

  function formatDate(value) {
    const parts = value.split("-").map(Number);
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }).format(date);
  }

  function reservationId(value) {
    const digits = value.replace(/-/g, "").slice(2);
    const tail = String(Math.floor(1000 + Math.random() * 9000));
    return "JS-" + digits + "-" + tail;
  }

  function showSuccess(values) {
    summary.replaceChildren();
    [
      ["姓名", values.name],
      ["日期", formatDate(values.date)],
      ["席别", values.slot],
      ["人数", values.guests],
      ["茶", values.tea],
    ].forEach(function (pair) {
      const row = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = pair[0];
      dd.textContent = pair[1];
      row.append(dt, dd);
      summary.append(row);
    });
    idEl.textContent = reservationId(values.date);
    form.hidden = true;
    success.hidden = false;
    success.focus({ preventScroll: true });
    success.scrollIntoView({ block: "center", behavior: "auto" });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    ["name", "phone", "date", "slot"].forEach(clearError);
    const invalid = validate();
    if (invalid) {
      invalid.focus();
      return;
    }
    showSuccess({
      name: form.elements.name.value.trim(),
      phone: form.elements.phone.value.trim(),
      date: form.elements.date.value,
      slot: form.querySelector('input[name="slot"]:checked').value,
      guests: form.elements.guests.value,
      tea: form.elements.tea.value,
    });
  });

  if (again) {
    again.addEventListener("click", function () {
      form.reset();
      ["name", "phone", "date", "slot"].forEach(clearError);
      success.hidden = true;
      form.hidden = false;
      form.elements.name.focus();
    });
  }
})();
