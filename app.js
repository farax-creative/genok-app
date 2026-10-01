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
    { name: "Pro", badge: "", price: "$9", per: "/ month", alt: '<span class="yr"><span class="yr-l">Yearly</span> <s aria-hidden="true">$108</s> <b>$79</b><span class="yr-save">Save $29</span></span><span class="yr-note">Twelve monthly payments of $9 come to $108. Yearly works out to about $6.58 a month.</span>',
      line: "Every version kept, and your phone too.",
      features: ["Everything in Lite", "Full version history", "View on your phone", "More than one of your own accounts"],
      cta: "Coming soon", href: "", disabled: true, featured: true },
    { name: "Lifetime", badge: "", price: "$149", per: "once", alt: "No subscription",
      line: "Pay once. Updates included while we run Genok.",
      features: ["Every Pro feature", "One payment", "Updates for as long as we run Genok"],
      cta: "Coming soon", href: "", disabled: true, featured: false, seats: true },
  ];
  const PLANS_KO = [
    { name: "Lite", badge: "", price: "$0", per: "", alt: "카드 입력 없음",
      line: "보고, 코멘트하고, 고쳐 받기까지 됩니다.",
      features: ["Claude Code · Codex 연결", "프로젝트 무제한", "모든 형식 · 모든 리뷰 도구", "PC에서 보기", "결과물마다 최근 10개 버전"],
      cta: "다운로드", href: "download.ko.html", disabled: false, featured: false },
    { name: "Pro", badge: "", price: "$9", per: "/ 월", alt: '<span class="yr"><span class="yr-l">연 결제</span> <s aria-hidden="true">$108</s> <b>$79</b><span class="yr-save">$29 절약</span></span><span class="yr-note">월 $9를 12번 내면 $108입니다. 연 결제는 월 $6.58꼴.</span>',
      line: "버전을 전부 보관하고, 폰에서도 봅니다.",
      features: ["Lite 전부 포함", "버전 기록 전부 보관", "폰에서 보기", "본인 계정 여러 개 연결"],
      cta: "준비 중", href: "", disabled: true, featured: true },
    { name: "Lifetime", badge: "", price: "$149", per: "한 번", alt: "구독 없음",
      line: "한 번 결제합니다. 운영하는 동안 업데이트를 포함합니다.",
      features: ["Pro 기능 전부", "한 번 결제", "Genok을 운영하는 동안 업데이트 포함"],
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
      if (form._attach) await form._attach.ready();   // an image may still be shrinking
      const data = new URLSearchParams(new FormData(form));
      // screenshots travel separately; the same id goes into the text so the two can be matched
      const att = form._attach && form._attach.count() ? form._attach : null;
      const attId = att ? att.newId() : "";
      const area = form.querySelector("textarea");
      if (att && area) data.set(area.name, data.get(area.name) + "\n[" + (KO ? "첨부 " : "Attachments ") + attId + "]");
      await fetch(action, { method: "POST", mode: "no-cors", body: data });
      const old = done.querySelector(".gf-att-fail"); if (old) old.remove();
      const sent = !att || (await att.send(attId, (n, total) => {
        msg.classList.add("gf-info");
        msg.textContent = KO ? "이미지 올리는 중 " + n + "/" + total + ". 창을 닫지 마세요." : "Uploading images " + n + "/" + total + ". Please keep this window open.";
      }));
      msg.classList.remove("gf-info"); msg.textContent = "";
      if (!sent) {
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
  const MAX_FILES = 10, CHUNK = 3, MAX_SIDE = 2560, MAX_BYTES = 1.5 * 1024 * 1024;
  const box = document.querySelector(".gf-att"), form = document.querySelector("form.gform");
  if (!box || !form || !ATTACH_URL) return;
  const KO = document.documentElement.lang === "ko";
  const T = KO ? { type: "이미지 파일만 올릴 수 있습니다 (PNG, JPEG, WebP).", many: "최대 10장까지 올릴 수 있습니다.", big: "이 이미지는 줄여도 너무 큽니다. 일부만 잘라 올려 주세요.", bad: "이 이미지를 열지 못했습니다.", del: "지우기" }
               : { type: "Only image files can be attached (PNG, JPEG, WebP).", many: "You can attach up to 10 images.", big: "This image is too large even after shrinking. Please crop it.", bad: "This image could not be opened.", del: "Remove" };
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

  let queue = Promise.resolve();
  const add = (files) => (queue = queue.then(() => addNow(files)));
  async function addNow(files) {
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
    ready: () => queue,
    count: () => items.length,
    newId: () => "G" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase(),
    // Sent a few at a time so one request stays small. true only when the script answered ok for
    // every part; a text/plain body keeps this a simple cross-origin request.
    send: async (id, progress) => {
      const all = items.slice();
      const post = async (start, part) => {
        const files = [];
        for (const it of part) files.push({ type: it.blob.type, data: await b64(it.blob) });
        const res = await fetch(ATTACH_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ id, start, files }) });
        const out = await res.json();
        return !!(out && out.ok);
      };
      for (let i = 0; i < all.length; i += CHUNK) {
        if (progress) progress(i, all.length);
        let ok = false;
        for (let n = 0; n < 2 && !ok; n++) { try { ok = await post(i, all.slice(i, i + CHUNK)); } catch (e) {} }   // one retry
        if (!ok) return false;
      }
      if (progress) progress(all.length, all.length);
      return true;
    },
    clear: () => { items.splice(0).forEach((it) => { URL.revokeObjectURL(it.url); it.li.remove(); }); msg.textContent = ""; },
  };
})();

(function () {
  // "App version" on the feedback page: a dropdown. The newest version comes from the app's own
  // update feed, older ones from the public release list. If neither can be read, the plain text field stays.
  const RELEASES_URL = "https://api.github.com/repos/farax-creative/genok-app/releases?per_page=12";
  const LATEST_URL = "https://genok.app/update/latest.json";
  const input = document.querySelector('form.gform [name="entry.1002962770"]'); if (!input) return;
  const form = input.form, q = input.closest(".gf-q");
  const KO = document.documentElement.lang === "ko";
  const T = KO ? { latest: "최신", unsure: "잘 모르겠어요", pick: "버전 고르기", hint: "설정 화면에 보이는 숫자 · 최신은 " }
               : { latest: "latest", unsure: "Not sure", pick: "Choose a version", hint: "The number shown in Settings · the latest is " };
  const num = (v) => v.split(".").map(Number);
  const newer = (a, b) => { const x = num(a), y = num(b); for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return y[i] - x[i]; return 0; };

  const ver = (t) => (/^v?(\d+\.\d+\.\d+)$/.exec(String(t || "")) || [])[1];
  async function get(url, opts) {
    const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), 5000);
    try { const res = await fetch(url, Object.assign({ signal: ctl.signal }, opts)); if (!res.ok) throw new Error(url + " " + res.status); return await res.json(); }
    finally { clearTimeout(timer); }
  }
  async function versions() {
    try { const c = JSON.parse(sessionStorage.getItem("genok-versions") || "null"); if (c && Array.isArray(c.list) && c.list.length) return c; } catch (e) {}
    const [feed, rel] = await Promise.allSettled([get(LATEST_URL, { cache: "no-store" }), get(RELEASES_URL, { headers: { Accept: "application/vnd.github+json" } })]);
    const set = new Set();
    const fed = feed.status === "fulfilled" ? ver(feed.value && feed.value.version) : "";
    if (fed) set.add(fed);
    if (rel.status === "fulfilled" && Array.isArray(rel.value)) rel.value.filter((r) => !r.draft && !r.prerelease).forEach((r) => { const v = ver(r.tag_name); if (v) set.add(v); });
    const list = [...set].sort(newer);
    if (!list.length) throw new Error("no versions");
    const out = { list: list, latest: fed || list[0] };
    try { sessionStorage.setItem("genok-versions", JSON.stringify(out)); } catch (e) {}
    return out;
  }

  function build(found) {
    const all = found.list, latest = found.latest;
    const opts = all.slice(0, 5).map((v) => ({ value: v, tag: v === latest ? T.latest : "" }));
    // the app opens this page with ?v=<its version>; keep it even if it is not in the list yet
    const given = input.value.trim();
    if (/^\d+\.\d+\.\d+$/.test(given) && !opts.some((o) => o.value === given)) { opts.push({ value: given, tag: "" }); opts.sort((a, b) => newer(a.value, b.value)); }
    opts.push({ value: T.unsure, tag: "", sep: true });
    const first = opts.some((o) => o.value === given) ? given : "";

    const id = input.id;
    const wrap = document.createElement("div"); wrap.className = "gf-sel";
    const btn = document.createElement("button"); btn.type = "button"; btn.className = "gf-sel-btn"; btn.id = id + "-btn";
    btn.setAttribute("aria-haspopup", "listbox"); btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-controls", id + "-list");
    btn.innerHTML = '<span class="gf-sel-val"></span><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 6l4.5 4.5L12.5 6"/></svg>';
    const val = btn.firstChild;
    const list = document.createElement("ul"); list.className = "gf-sel-list"; list.id = id + "-list"; list.tabIndex = -1; list.setAttribute("role", "listbox");
    const label = q.querySelector("label");
    label.id = id + "-label"; label.htmlFor = btn.id; list.setAttribute("aria-labelledby", label.id);
    const text = (o) => o.value + (o.tag ? "<small>" + o.tag + "</small>" : "");
    const items = opts.map((o, i) => {
      const li = document.createElement("li"); li.id = id + "-o" + i; li.setAttribute("role", "option"); li.innerHTML = text(o);
      if (o.sep) li.classList.add("gf-sel-sep");
      li.addEventListener("click", () => { choose(i); close(true); });
      li.addEventListener("pointermove", () => mark(i));
      list.appendChild(li); return li;
    });
    let at = -1, picked = -1;
    function mark(i) { at = i; items.forEach((li, k) => li.classList.toggle("on", k === i)); if (i >= 0) { list.setAttribute("aria-activedescendant", items[i].id); items[i].scrollIntoView({ block: "nearest" }); } }
    function choose(i) {
      picked = i; items.forEach((li, k) => li.setAttribute("aria-selected", String(k === i)));
      input.value = i < 0 ? "" : opts[i].value;
      val.innerHTML = i < 0 ? T.pick : text(opts[i]); btn.toggleAttribute("data-empty", i < 0);
    }
    const isOpen = () => list.classList.contains("open");
    function open() { list.classList.add("open"); btn.setAttribute("aria-expanded", "true"); mark(picked < 0 ? 0 : picked); list.focus({ preventScroll: true }); }
    function close(back) { list.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); if (back) btn.focus(); }
    btn.addEventListener("click", () => (isOpen() ? close(true) : open()));
    btn.addEventListener("keydown", (e) => { if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); open(); } });
    list.addEventListener("keydown", (e) => {
      const k = e.key;
      if (k === "ArrowDown") { e.preventDefault(); mark(Math.min(items.length - 1, at + 1)); }
      else if (k === "ArrowUp") { e.preventDefault(); mark(Math.max(0, at - 1)); }
      else if (k === "Home") { e.preventDefault(); mark(0); }
      else if (k === "End") { e.preventDefault(); mark(items.length - 1); }
      else if (k === "Enter" || k === " ") { e.preventDefault(); choose(at); close(true); }
      else if (k === "Escape") { e.preventDefault(); e.stopPropagation(); close(true); }
      else if (k === "Tab") close(false);
    });
    document.addEventListener("pointerdown", (e) => { if (isOpen() && !wrap.contains(e.target)) close(false); });
    form.addEventListener("reset", () => setTimeout(() => choose(first ? opts.findIndex((o) => o.value === first) : -1)));

    input.type = "hidden"; input.removeAttribute("id");
    wrap.append(btn, list); input.before(wrap);
    choose(first ? opts.findIndex((o) => o.value === first) : -1);
    const hint = q.querySelector(".gf-hint"); if (hint) hint.textContent = T.hint + latest;
  }

  versions().then(build).catch(() => {});
})();
