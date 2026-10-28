"use strict";

(function () {
  const teas = window.JIANSHAN_TEAS;
  if (!teas) return;

  const params = new URLSearchParams(window.location.search);
  const slug = teas[params.get("tea")] ? params.get("tea") : "yan-gu";
  const tea = teas[slug];
  const others = Object.keys(teas).filter(function (key) {
    return key !== slug;
  });

  function setField(name, value) {
    document.querySelectorAll('[data-tea-field="' + name + '"]').forEach(function (el) {
      el.textContent = value;
    });
  }

  function setHTML(name, value) {
    document.querySelectorAll('[data-tea-field="' + name + '"]').forEach(function (el) {
      el.innerHTML = value;
    });
  }

  setField("index", tea.index);
  setField("name", tea.name);
  setField("en", tea.en);
  setField("type", tea.typeLabel);
  setField("price", tea.price);
  setField("tagline", tea.tagline);
  setField("notes", tea.notes.join(" / "));
  setField("intro", tea.intro);
  setField("aroma", tea.aroma);
  setField("texture", tea.texture);
  setField("leaf", tea.leaf);
  setField("origin", tea.origin);
  setField("craft", tea.craft);
  setField("brewIntro", tea.brewIntro);
  setField("tinCaption", tea.tinCaption);
  setField("liquorLabel", tea.liquorLabel);
  setField("roast", tea.roast);
  setField("rest", tea.rest);
  setField("lot", tea.lot);
  setField("pickDate", tea.pickDate);
  setField("batchWeight", tea.batchWeight);
  setHTML("originTitle", tea.originTitle);

  document.querySelectorAll("[data-tea-proof]").forEach(function (proof) {
    proof.style.setProperty("--tin", tea.tinColor);
  });

  const tin = document.querySelector("[data-tea-tin]");
  if (tin) {
    tin.src = tea.tin;
    tin.alt = tea.tinAlt;
  }

  const hero = document.querySelector("[data-tea-hero]");
  if (hero) {
    hero.src = tea.hero;
    hero.alt = tea.heroAlt;
  }

  const originImg = document.querySelector("[data-tea-origin-img]");
  if (originImg) {
    originImg.src = tea.originImg;
    originImg.alt = tea.originAlt;
  }

  const liquor = document.querySelector("[data-tea-liquor]");
  if (liquor) liquor.style.background = tea.liquor;

  const meta = document.querySelector("[data-tea-meta]");
  if (meta) {
    meta.replaceChildren();
    tea.meta.forEach(function (item) {
      const cell = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = item.label;
      dd.textContent = item.value;
      cell.append(dt, dd);
      meta.append(cell);
    });
  }

  const flavor = document.querySelector("[data-tea-flavor]");
  if (flavor) {
    flavor.replaceChildren();
    tea.flavor.forEach(function (item) {
      const row = document.createElement("div");
      row.className = "flavor__row";
      row.innerHTML =
        '<span class="flavor__name"></span>' +
        '<span class="flavor__track"><i></i></span>' +
        '<span class="flavor__level"></span>';
      row.querySelector(".flavor__name").textContent = item.name;
      row.querySelector(".flavor__level").textContent = item.level;
      const fill = row.querySelector(".flavor__track i");
      fill.style.width = item.value + "%";
      flavor.append(row);
    });
  }

  const brew = document.querySelector("[data-tea-brew]");
  if (brew) {
    brew.replaceChildren();
    tea.brew.forEach(function (item) {
      const cell = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = item.label;
      dd.textContent = item.value;
      cell.append(dt, dd);
      brew.append(cell);
    });
  }

  const steeps = document.querySelector("[data-tea-steeps]");
  if (steeps) {
    steeps.replaceChildren();
    tea.steeps.forEach(function (row) {
      const tr = document.createElement("tr");
      const th = document.createElement("th");
      const td = document.createElement("td");
      th.scope = "row";
      th.textContent = row[0];
      td.textContent = row[1];
      tr.append(th, td);
      steeps.append(tr);
    });
  }

  const cross = document.querySelector("[data-tea-cross]");
  if (cross) {
    cross.replaceChildren();
    others.forEach(function (key) {
      const item = teas[key];
      const link = document.createElement("a");
      link.className = "cross-card";
      link.href = "tea.html?tea=" + key;
      link.innerHTML =
        '<span class="cross-card__media"><img loading="lazy" width="640" height="800" alt=""></span>' +
        '<span class="cross-card__body">' +
        '<span class="cross-card__eyebrow"></span>' +
        '<span class="cross-card__name"></span>' +
        '<span class="cross-card__type"></span>' +
        '<span class="cross-card__notes"></span>' +
        '<span class="cross-card__tagline"></span>' +
        '<span class="cross-card__foot"><span></span><span class="cross-card__arrow">→</span></span>' +
        "</span>";
      const img = link.querySelector("img");
      img.src = item.tin;
      img.alt = item.tinAlt;
      link.querySelector(".cross-card__eyebrow").textContent = item.index + " / " + item.en;
      link.querySelector(".cross-card__name").textContent = item.name;
      link.querySelector(".cross-card__type").textContent = item.typeLabel;
      link.querySelector(".cross-card__notes").textContent = item.notes.join(" / ");
      link.querySelector(".cross-card__tagline").textContent = item.tagline;
      link.querySelector(".cross-card__foot span").textContent = item.price + " / 50g";
      cross.append(link);
    });
  }

  document.querySelectorAll("[data-switch]").forEach(function (link) {
    const active = link.getAttribute("data-switch") === slug;
    link.classList.toggle("is-active", active);
    if (active) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  document.querySelectorAll("[data-book-link]").forEach(function (link) {
    link.href = "visit.html?tea=" + slug + "#booking";
  });

  const orderSubject = "订购 " + tea.name + " · " + tea.lot;
  const orderBody = [
    "你好，我想订购一罐" + tea.name + "（" + tea.typeLabel + "，50g，" + tea.lot + "）。",
    "",
    "数量：1 罐",
    "价格：" + tea.price,
    "收件信息："
  ].join(String.fromCharCode(10));

  document.querySelectorAll("[data-order-link]").forEach(function (link) {
    link.href =
      "mailto:tea@jianshan.co?subject=" +
      encodeURIComponent(orderSubject) +
      "&body=" +
      encodeURIComponent(orderBody);
    link.setAttribute("aria-label", "邮件订购 " + tea.name + " 50g（" + tea.lot + "）");
    link.setAttribute("title", "邮件订购 · 微信 JIANSHAN-TEA");
  });

  const chart = document.querySelector("[data-roast-chart]");
  if (chart && Array.isArray(tea.roastLog)) {
    const NS = "http://www.w3.org/2000/svg";
    const px = function (day) {
      return 34 + (day / 21) * 296;
    };
    const py = function (temp) {
      return 142 - ((temp - 60) / 60) * 114;
    };
    const points = tea.roastLog.map(function (point) {
      return { label: point.label, temp: point.temp, x: px(point.day), y: py(point.temp) };
    });
    const line = chart.querySelector("[data-roast-path]");
    if (line) {
      line.setAttribute(
        "d",
        points
          .map(function (point, i) {
            return (i ? "L" : "M") + point.x.toFixed(1) + " " + point.y.toFixed(1);
          })
          .join("")
      );
    }
    const group = chart.querySelector("[data-roast-points]");
    if (group) {
      group.replaceChildren();
      points.forEach(function (point) {
        const g = document.createElementNS(NS, "g");
        const dot = document.createElementNS(NS, "circle");
        dot.setAttribute("cx", point.x.toFixed(1));
        dot.setAttribute("cy", point.y.toFixed(1));
        dot.setAttribute("r", "2.6");
        dot.setAttribute("class", "roast-chart__point");
        const text = document.createElementNS(NS, "text");
        text.setAttribute("x", point.x.toFixed(1));
        text.setAttribute("y", Math.max(12, point.y - 9).toFixed(1));
        text.setAttribute("class", "roast-chart__plabel");
        text.textContent = point.label + " " + point.temp + "°";
        g.append(dot, text);
        group.append(g);
      });
    }
    chart.setAttribute(
      "aria-label",
      tea.name +
        " 的炭焙温度记录：" +
        points.map(function (point) {
          return point.label + " " + point.temp + " 度";
        }).join("，")
    );
    const chartTitle = chart.querySelector("title");
    if (chartTitle) chartTitle.textContent = tea.name + " 焙火温度记录";
  }

  document.title = "見山 JIANSHAN — " + tea.name + " " + tea.en;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) {
    desc.setAttribute(
      "content",
      tea.name + "，" + tea.typeLabel + "，来自武夷山慧苑坑。" + tea.tagline + " 50g 铁罐。"
    );
  }
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute("content", "見山 JIANSHAN — " + tea.name + " " + tea.en);
})();
