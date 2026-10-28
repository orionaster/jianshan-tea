# 見山 JIANSHAN

虚构武夷岩茶品牌官网 · 作品集项目（Fictional Wuyi rock-tea brand — portfolio concept site）

**这是一个虚构品牌的作品集演示项目。** 品牌、山场、茶品、批次、价格、地址与联系方式均为设计内容，不存在真实经营主体，无法订购或到访。
This is a portfolio concept piece. The brand, tea gardens, products, batch numbers, prices, address and contact details are design content. There is no real business behind it; nothing can be ordered or booked.

## Pages

| Page | What it does |
| --- | --- |
| `index.html` | Brand landing — mountain-source story, collection, packaging system with label proofs |
| `tea.html?tea=yan-gu\|bai-lu\|song-feng` | Product detail driven by one data source: roast log, batch dossier, label proof, order draft |
| `brew.html` | Signature brewing ritual — sticky stage, accessible timer, scroll-driven steps |
| `visit.html` | Visit flow — opening hours, tea-selection prefill, booking form with validation |
| `case-study.html` | Process write-up: decisions, what was removed, what was verified |

## Stack

Plain HTML/CSS/JavaScript. No framework, no build step, no runtime dependencies, no third-party scripts.

- Self-hosted subset fonts (Instrument Serif / Noto Serif SC, generated with fontTools)
- Native scrolling only — no scroll libraries, no custom cursor, no magnetic effects
- CSS sticky stage + a small scroll-progress state machine for the brew page
- Batch data (`LOT 26-A/B/C`, pick dates, roast curves) lives in one JS module shared by the product page, label proof and order email

## Run locally

Any static server works, e.g.:

```
python -m http.server 8080
```

Open <http://localhost:8080/>.

## Verified

Desktop 1440px, mobile 320–430px, reduced-motion, keyboard-only operation, form validation, console/network cleanliness, and scroll performance under 4× CPU throttle (median frame time ~16.7ms, no long tasks).
