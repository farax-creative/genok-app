/* Genok site — image-driven. Vanilla JS, no build.
   The page shows real screenshots of the app; this file only wires the header,
   scroll reveals, and the data-driven pricing block. */
(() => {
  "use strict";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- pricing (data-driven, one block) ------------------------------ */
  // Lifetime is sold as a fixed number of seats. SEATS_TAKEN is filled from the
  // payment provider once billing is live; keep it 0 until then (no fake urgency).
  const SEATS_TOTAL = 100;
  const SEATS_TAKEN = 0;

  const KO = document.documentElement.lang === "ko";
  const PLANS_EN = [
    { name: "Free", badge: "", price: "$0", per: "", alt: "You don't enter a card",
      line: "The full loop works.",
      features: ["Claude Code and Codex", "Unlimited projects", "Every format, every review tool", "View on your PC", "Recent versions kept"],
      cta: "Download", href: "download.html", disabled: false, featured: false },
    { name: "Pro", badge: "", price: "$9", per: "/ month", alt: "or $79 a year",
      line: "Every version kept, and your phone too.",
      features: ["Everything in Free", "Full version history", "View on your phone", "More than one account"],
      cta: "Coming soon", href: "", disabled: true, featured: true },
    { name: "Lifetime", badge: "", price: "$149", per: "once", alt: "No subscription",
      line: "Pay once. Every later update included.",
      features: ["Every Pro feature", "One payment", "Every later update, no time limit"],
      cta: "Coming soon", href: "", disabled: true, featured: false, seats: true },
  ];
  const PLANS_KO = [
    { name: "무료", badge: "", price: "$0", per: "", alt: "카드 입력 없음",
      line: "보고, 코멘트하고, 고쳐 받기까지 됩니다.",
      features: ["Claude Code · Codex 연결", "프로젝트 무제한", "모든 형식 · 모든 리뷰 도구", "PC에서 보기", "최근 버전 보관"],
      cta: "다운로드", href: "download.ko.html", disabled: false, featured: false },
    { name: "Pro", badge: "", price: "$9", per: "/ 월", alt: "또는 연 $79",
      line: "버전을 전부 보관하고, 폰에서도 봅니다.",
      features: ["무료판 전부 포함", "버전 기록 전부 보관", "폰에서 보기", "여러 계정 연결"],
      cta: "준비 중", href: "", disabled: true, featured: true },
    { name: "평생", badge: "", price: "$149", per: "한 번", alt: "구독 없음",
      line: "한 번 결제합니다. 이후 업데이트를 모두 포함합니다.",
      features: ["Pro 기능 전부", "한 번 결제", "이후 업데이트 모두, 기간 제한 없음"],
      cta: "준비 중", href: "", disabled: true, featured: false, seats: true },
  ];
  const PLANS = KO ? PLANS_KO : PLANS_EN;
  const check = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function seatBlock() {
    const taken = Math.max(0, Math.min(SEATS_TOTAL, SEATS_TAKEN));
    const pct = Math.round((taken / SEATS_TOTAL) * 100);
    return `<div class="seats">
      <div class="seatbar" role="progressbar" aria-valuemin="0" aria-valuemax="${SEATS_TOTAL}" aria-valuenow="${taken}" aria-label="${KO ? "평생판 자리" : "Lifetime seats"}">
        <div class="seatfill" style="width:${pct}%"></div>
      </div>
      <p class="seat-txt">${KO ? `${SEATS_TOTAL}자리 중 <b>${taken}자리</b> 판매됨` : `<b>${taken}</b> of ${SEATS_TOTAL} seats taken`}</p>
    </div>`;
  }

  function renderPlans() {
    const el = document.getElementById("plans"); if (!el) return;
    el.innerHTML = PLANS.map((p) => `
      <div class="plan${p.featured ? " featured" : ""}">
        <div class="plan-top"><span class="plan-name">${p.name}</span>${p.badge ? `<span class="badge">${p.badge}</span>` : ""}</div>
        <div class="price"><span class="amt">${p.price}</span>${p.per ? `<span class="per">${p.per}</span>` : ""}</div>
        <div class="price-alt">${p.alt || ""}</div>
        <div class="plan-line">${p.line}</div>
        ${p.seats ? seatBlock() : ""}
        <ul>${p.features.map((f) => `<li>${check}<span>${f}</span></li>`).join("")}</ul>
        <div class="plan-cta">${p.disabled
          ? `<button class="btn btn-ghost btn-block" disabled aria-disabled="true">${p.cta}</button>`
          : `<a class="btn btn-primary btn-block" href="${p.href}">${p.cta}</a>`}</div>
      </div>`).join("");
  }

  /* ---- header, nav, reveal ------------------------------------------ */
  function chrome() {
    const header = document.getElementById("header");
    if (header) {
      const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
      onScroll(); addEventListener("scroll", onScroll, { passive: true });
    }
    const burger = document.getElementById("burger");
    const menu = document.getElementById("mobile-menu");
    if (burger && menu) {
      const setOpen = (o) => { burger.setAttribute("aria-expanded", String(o)); menu.hidden = !o; document.body.classList.toggle("menu-open", o); };
      burger.addEventListener("click", () => setOpen(menu.hidden));
      menu.addEventListener("click", (e) => { if (e.target.tagName === "A") setOpen(false); });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) { setOpen(false); burger.focus(); } });
      matchMedia("(min-width: 761px)").addEventListener("change", (e) => { if (e.matches) setOpen(false); });
    }
    if (reduce) document.querySelectorAll("video[autoplay]").forEach((v) => { v.removeAttribute("autoplay"); v.pause(); v.controls = true; });
    if (!reduce && "IntersectionObserver" in window) {
      const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }, { threshold: 0.14 });
      document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    } else {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
    }
  }

  /* ---- invite-code gate (MOCK) ---------------------------------------
     This only shows the flow. A check in the browser is not a lock: the real
     site must verify the code on a server and hand back the installer link. */
  function gate() {
    const form = document.getElementById("gate-form"); if (!form) return;
    const input = document.getElementById("gate-code");
    const msg = document.getElementById("gate-msg");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const code = input.value.trim().toUpperCase();
      if (!code) { msg.textContent = KO ? "베타 키를 입력하세요." : "Enter your beta key."; input.setAttribute("aria-invalid", "true"); input.focus(); return; }
      // DEMO VALUE ONLY: never put a real beta key in this file, it is public.
      if (code !== "GENOK-BETA") {
        msg.textContent = KO ? "키가 맞지 않습니다. 받은 키를 다시 확인해 주세요." : "That key doesn't match. Check the one we sent you.";
        input.setAttribute("aria-invalid", "true"); input.focus(); return;
      }
      document.getElementById("gate").hidden = true;
      document.getElementById("gate-dl").hidden = false;
      const dl = document.querySelector("#gate-dl a"); if (dl) dl.focus();
    });
    input.addEventListener("input", () => { msg.textContent = ""; input.removeAttribute("aria-invalid"); });
  }

  function init() { chrome(); renderPlans(); gate(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

/* language menu: closes on outside click and Escape */
(() => {
  const m = document.querySelector(".lang-menu"); if (!m) return;
  document.addEventListener("click", (e) => { if (m.open && !m.contains(e.target)) m.open = false; });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && m.open) { m.open = false; m.querySelector("summary").focus(); } });
})();

/* header menus: only one open at a time; outside click and Escape close the use-case list */
(() => {
  const all = [...document.querySelectorAll(".lang-menu, .nav-menu")];
  const m = document.querySelector(".nav-menu"); if (!m) return;
  all.forEach((d) => d.addEventListener("toggle", () => { if (d.open) all.forEach((o) => { if (o !== d) o.open = false; }); }));
  document.addEventListener("click", (e) => { if (m.open && !m.contains(e.target)) m.open = false; });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && m.open) { m.open = false; m.querySelector("summary").focus(); } });
})();
