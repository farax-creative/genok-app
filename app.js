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
    { name: "Lite", badge: "", price: "$0", per: "", alt: "You don't enter a card",
      line: "The full loop works.",
      features: ["Claude Code and Codex", "Unlimited projects", "Every format, every review tool", "View on your PC", "Latest 10 versions of each result"],
      cta: "Download", href: "download.html", disabled: false, featured: false },
    { name: "Pro", badge: "", price: "$9", per: "/ month", alt: "or $79 a year",
      line: "Every version kept, and your phone too.",
      features: ["Everything in Lite", "Full version history", "View on your phone", "More than one of your own accounts"],
      cta: "Coming soon", href: "", disabled: true, featured: true },
    { name: "Lifetime", badge: "", price: "$149", per: "once", alt: "No subscription",
      line: "Pay once. Every later update included.",
      features: ["Every Pro feature", "One payment", "Every later update, no time limit"],
      cta: "Coming soon", href: "", disabled: true, featured: false, seats: true },
  ];
  const PLANS_KO = [
    { name: "Lite", badge: "", price: "$0", per: "", alt: "카드 입력 없음",
      line: "보고, 코멘트하고, 고쳐 받기까지 됩니다.",
      features: ["Claude Code · Codex 연결", "프로젝트 무제한", "모든 형식 · 모든 리뷰 도구", "PC에서 보기", "결과물마다 최근 10개 버전"],
      cta: "다운로드", href: "download.ko.html", disabled: false, featured: false },
    { name: "Pro", badge: "", price: "$9", per: "/ 월", alt: "또는 연 $79",
      line: "버전을 전부 보관하고, 폰에서도 봅니다.",
      features: ["Lite 전부 포함", "버전 기록 전부 보관", "폰에서 보기", "본인 계정 여러 개 연결"],
      cta: "준비 중", href: "", disabled: true, featured: true },
    { name: "Lifetime", badge: "", price: "$149", per: "한 번", alt: "구독 없음",
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
      <div class="seatbar" role="progressbar" aria-valuemin="0" aria-valuemax="${SEATS_TOTAL}" aria-valuenow="${taken}" aria-label="${KO ? "Lifetime 자리" : "Lifetime seats"}">
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

  function init() { chrome(); renderPlans(); }
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

(function () {
  const form = document.getElementById("notify-form"); if (!form) return;
  const KO = document.documentElement.lang === "ko";
  const input = document.getElementById("notify-email");
  const msg = document.getElementById("notify-msg");
  const btn = form.querySelector("button");
  const MAIL = '<a href="mailto:support@genok.app">support@genok.app</a>';
  const FAIL = KO ? "보내지 못했습니다. " + MAIL + "으로 메일 주세요." : "That didn't go through. Please e-mail " + MAIL + ".";
  const BADMAIL = KO ? "메일 주소 형식을 확인해 주세요. 예: name@example.com" : "Check the e-mail address. Example: name@example.com";
  const isMail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const say = (html, bad) => { msg.innerHTML = html; msg.classList.toggle("bad", !!bad); };
  // checked on leaving the field, never while typing
  input.addEventListener("blur", () => {
    const v = input.value.trim();
    if (v && !isMail(v)) { say(BADMAIL, true); input.setAttribute("aria-invalid", "true"); }
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (!isMail(v)) {
      say(BADMAIL, true);
      input.setAttribute("aria-invalid", "true"); input.focus(); return;
    }
    const action = form.getAttribute("action");
    if (!action) { say(FAIL, true); return; }
    btn.disabled = true;
    try {
      // The reply from Google is opaque here: only a network failure can be told apart.
      await fetch(action, { method: "POST", mode: "no-cors", body: new URLSearchParams(new FormData(form)) });
      form.reset();
      say(KO ? "신청됐습니다. 정식으로 열리면 메일로 알려 드립니다." : "You're on the list. We'll e-mail you when Genok opens.");
    } catch (err) { say(FAIL, true); }
    btn.disabled = false;
  });
  input.addEventListener("input", () => { if (msg.classList.contains("bad")) say(""); input.removeAttribute("aria-invalid"); });
})();

(function () {
  const form = document.querySelector("form.gform"); if (!form) return;
  const KO = document.documentElement.lang === "ko";
  const done = document.querySelector(".gf-done");
  const msg = form.querySelector(".gf-msg");
  const btn = form.querySelector('button[type="submit"]');
  const MAIL = '<a href="mailto:support@genok.app">support@genok.app</a>';
  const FAIL = KO ? "보내지 못했습니다. " + MAIL + "으로 메일 주세요." : "That didn't go through. Please e-mail " + MAIL + ".";
  const TXT = KO ? { need: "이 항목을 채워 주세요.", pick: "하나 이상 골라 주세요.", mail: "메일 주소 형식을 확인해 주세요. 예: name@example.com", other: "기타 내용을 적어 주세요." }
                 : { need: "Please fill this in.", pick: "Choose at least one.", mail: "Check the e-mail address. Example: name@example.com", other: "Type what the other one is." };
  const isMail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  // the app opens feedback(.ko).html?v=0.1.46 so the version is already filled in; digits and dots only
  const ver = new URLSearchParams(location.search).get("v") || "";
  const verField = form.querySelector('[name="entry.1002962770"]');
  if (verField && /^[0-9.]{1,12}$/.test(ver)) verField.setAttribute("value", ver);

  // the "other" choice opens its own text field
  form.querySelectorAll("input[data-other]").forEach((box) => {
    const field = document.getElementById(box.dataset.other);
    const sync = () => { field.hidden = !box.checked; field.disabled = !box.checked; if (box.checked) field.focus(); };
    field.disabled = true;
    box.closest(".gf-q").addEventListener("change", (e) => { if (e.target === box || e.target.type === "radio") sync(); });
  });

  function check(q) {
    const err = q.querySelector(".gf-err");
    const kind = q.dataset.kind, req = q.dataset.req === "1";
    let bad = "", focus = null;
    if (kind === "radio" || kind === "check") {
      const on = [...q.querySelectorAll(".gf-opts input:checked")];
      const other = q.querySelector(".gf-other");
      focus = q.querySelector(".gf-opts input");
      if (req && !on.length) bad = TXT.pick;
      else if (other && !other.hidden && !other.value.trim()) { bad = TXT.other; focus = other; }
    } else {
      const f = q.querySelector("input, textarea"); focus = f;
      const v = f.value.trim();
      if (req && !v) bad = TXT.need;
      else if (kind === "email" && v && !isMail(v)) bad = TXT.mail;
      f.toggleAttribute("aria-invalid", !!bad);
    }
    err.textContent = bad;
    return bad ? focus : null;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.innerHTML = "";
    const firstBad = [...form.querySelectorAll(".gf-q")].map(check).find(Boolean);
    if (firstBad) { firstBad.focus(); return; }
    const action = form.getAttribute("action");
    if (!action) { msg.innerHTML = FAIL; return; }
    btn.disabled = true;
    try {
      // The reply from Google is opaque here: only a network failure can be told apart.
      const data = new URLSearchParams(new FormData(form));
      // screenshots travel separately; the same id goes into the text so the two can be matched
      const att = form._attach && form._attach.count() ? form._attach : null;
      const attId = att ? att.newId() : "";
      const area = form.querySelector("textarea");
      if (att && area) data.set(area.name, data.get(area.name) + "\n[" + (KO ? "첨부 " : "Attachments ") + attId + "]");
      await fetch(action, { method: "POST", mode: "no-cors", body: data });
      const old = done.querySelector(".gf-att-fail"); if (old) old.remove();
      if (att && !(await att.send(attId))) {
        const p = document.createElement("p"); p.className = "gf-att-fail";
        p.innerHTML = KO ? "글은 전달됐지만 이미지는 보내지 못했습니다. 이미지는 " + MAIL + "으로 보내 주세요." : "Your note went through, but the images did not. Please e-mail them to " + MAIL + ".";
        done.querySelector("h2").after(p);
      }
      form.hidden = true; done.hidden = false; done.focus();
    } catch (err) { msg.innerHTML = FAIL; }
    btn.disabled = false;
  });
  form.addEventListener("input", (e) => { const q = e.target.closest(".gf-q"); if (q && q.querySelector(".gf-err").textContent) check(q); });
  form.addEventListener("change", (e) => { const q = e.target.closest(".gf-q"); if (q && q.querySelector(".gf-err").textContent) check(q); });
  // an e-mail field is checked when you leave it; an empty one waits for the submit
  form.addEventListener("focusout", (e) => {
    const q = e.target.closest('.gf-q[data-kind="email"]');
    if (q && e.target.value.trim()) check(q);
  });
  const again = done.querySelector("[data-again]");
  if (again) again.addEventListener("click", () => {
    form.reset(); if (form._attach) form._attach.clear(); form.querySelectorAll(".gf-other").forEach((f) => { f.hidden = true; f.disabled = true; });
    done.hidden = true; form.hidden = false; form.querySelector("textarea, input").focus();
  });
})();

(function () {
  // marks the section being read in the help page's contents list
  const links = [...document.querySelectorAll(".help .legal-toc a")]; if (!links.length || !("IntersectionObserver" in window)) return;
  const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.removeAttribute("aria-current"));
      byId.get(e.target.id).setAttribute("aria-current", "true");
    });
  }, { rootMargin: "-90px 0px -65% 0px" });
  byId.forEach((a, id) => { const h = document.getElementById(id); if (h) io.observe(h); });
})();

(function () {
  // Screenshots on the feedback page. Stays hidden until the Apps Script address is set.
  const ATTACH_URL = "";
  const MAX_FILES = 5, MAX_SIDE = 2560, MAX_BYTES = 1.5 * 1024 * 1024;
  const box = document.querySelector(".gf-att"), form = document.querySelector("form.gform");
  if (!box || !form || !ATTACH_URL) return;
  const KO = document.documentElement.lang === "ko";
  const T = KO ? { type: "이미지 파일만 올릴 수 있습니다 (PNG, JPEG, WebP).", many: "최대 5장까지 올릴 수 있습니다.", big: "이 이미지는 줄여도 너무 큽니다. 일부만 잘라 올려 주세요.", bad: "이 이미지를 열지 못했습니다.", del: "지우기" }
               : { type: "Only image files can be attached (PNG, JPEG, WebP).", many: "You can attach up to 5 images.", big: "This image is too large even after shrinking. Please crop it.", bad: "This image could not be opened.", del: "Remove" };
  const input = box.querySelector(".gf-att-in"), drop = box.querySelector(".gf-drop"), list = box.querySelector(".gf-thumbs"), msg = box.querySelector(".gf-att-msg");
  const items = [];   // { blob, url, li }
  box.hidden = false;

  async function shrink(file) {
    const bmp = await createImageBitmap(file);
    const k = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(bmp.width * k)); c.height = Math.max(1, Math.round(bmp.height * k));
    const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); g.drawImage(bmp, 0, 0, c.width, c.height);
    for (const type of ["image/webp", "image/jpeg"]) {
      for (const q of [0.9, 0.8, 0.7, 0.6, 0.5]) {
        const blob = await new Promise((r) => c.toBlob(r, type, q));
        if (!blob || blob.type !== type) break;   // this browser cannot write that type
        if (blob.size <= MAX_BYTES) return blob;
      }
    }
    return null;
  }

  function render(it) {
    const li = document.createElement("li");
    const img = document.createElement("img"); img.src = it.url; img.alt = "";
    const size = document.createElement("small"); size.textContent = Math.max(1, Math.round(it.blob.size / 1024)) + " KB";
    const del = document.createElement("button"); del.type = "button"; del.setAttribute("aria-label", T.del);
    del.innerHTML = '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M2 2l8 8M10 2l-8 8"/></svg>';
    del.addEventListener("click", () => { URL.revokeObjectURL(it.url); items.splice(items.indexOf(it), 1); li.remove(); msg.textContent = ""; });
    li.append(img, size, del); list.appendChild(li); it.li = li;
  }

  async function add(files) {
    msg.textContent = "";
    for (const f of files) {
      if (!/^image\/(png|jpeg|webp)$/.test(f.type)) { msg.textContent = T.type; continue; }
      if (items.length >= MAX_FILES) { msg.textContent = T.many; break; }
      try {
        const blob = await shrink(f);
        if (!blob) { msg.textContent = T.big; continue; }
        if (items.length >= MAX_FILES) { msg.textContent = T.many; break; }
        const it = { blob, url: URL.createObjectURL(blob) }; items.push(it); render(it);
      } catch (e) { msg.textContent = T.bad; }
    }
  }

  box.querySelector(".gf-att-pick").addEventListener("click", () => input.click());
  input.addEventListener("change", () => { add([...input.files]); input.value = ""; });
  drop.addEventListener("dragover", (e) => { e.preventDefault(); drop.classList.add("over"); });
  drop.addEventListener("dragleave", () => drop.classList.remove("over"));
  drop.addEventListener("drop", (e) => { e.preventDefault(); drop.classList.remove("over"); add([...e.dataTransfer.files]); });
  document.addEventListener("paste", (e) => {
    if (form.hidden) return;
    const files = [...(e.clipboardData ? e.clipboardData.files : [])].filter((f) => f.type.startsWith("image/"));
    if (files.length) { e.preventDefault(); add(files); }
  });

  const b64 = (blob) => new Promise((ok, no) => { const r = new FileReader(); r.onload = () => ok(String(r.result).split(",")[1]); r.onerror = no; r.readAsDataURL(blob); });

  // used by the form's submit handler
  form._attach = {
    count: () => items.length,
    newId: () => "G" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase(),
    // true only when the script answered ok; a text/plain body keeps this a simple cross-origin request
    send: async (id) => {
      try {
        const files = [];
        for (const it of items) files.push({ type: it.blob.type, data: await b64(it.blob) });
        const res = await fetch(ATTACH_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ id, files }) });
        const out = await res.json();
        return !!(out && out.ok);
      } catch (e) { return false; }
    },
    clear: () => { items.splice(0).forEach((it) => { URL.revokeObjectURL(it.url); it.li.remove(); }); msg.textContent = ""; },
  };
})();
