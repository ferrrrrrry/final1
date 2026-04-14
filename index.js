(function () {
  const canvas = document.getElementById("hero-canvas"),
    ctx = canvas.getContext("2d");
  let W, H;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  const COLOR = "126,59,237";

  let waves = [
    { x: W * 0.3, y: H * 0.4, radius: 0, speed: 1.2 },
    { x: W * 0.7, y: H * 0.6, radius: 0, speed: 0.9 },
  ];

  let t = 0;

  function draw() {
    t++;
    ctx.clearRect(0, 0, W, H);

    waves.forEach((w) => {
      w.radius += w.speed;
      if (w.radius > 260) {
        w.x = Math.random() * W;
        w.y = Math.random() * H;
        w.radius = 0;
      }
      ctx.beginPath();
      ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${COLOR},${0.12 * (1 - w.radius / 260)})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    ctx.strokeStyle = `rgba(${COLOR},0.05)`;
    ctx.lineWidth = 1;
    let sz = 65,
      ox = (t * 0.28) % sz,
      oy = (t * 0.14) % sz;
    for (let x = ox; x < W; x += sz) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = oy; y < H; y += sz) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  draw();
})();
//
const cur = document.getElementById("cur"),
  ring = document.getElementById("ring");
let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;
document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
  cur.style.left = mx + "px";
  cur.style.top = my + "px";
});
(function a() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + "px";
  ring.style.top = ry + "px";
  requestAnimationFrame(a);
})();
document.querySelectorAll("a,button").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cur.style.width = "14px";
    cur.style.height = "14px";
    ring.style.width = "54px";
    ring.style.height = "54px";
    ring.style.borderColor = "rgba(198,255,52,.75)";
  });
  el.addEventListener("mouseleave", () => {
    cur.style.width = "8px";
    cur.style.height = "8px";
    ring.style.width = "38px";
    ring.style.height = "38px";
    ring.style.borderColor = "rgba(198,255,52,.45)";
  });
});

window.addEventListener("scroll", () =>
  document.getElementById("nav").classList.toggle("scrolled", scrollY > 40),
);
// ── CENTRALIZED EVENT DELEGATION ────────────────────────────────────────────
document.addEventListener("click", function (e) {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const action = el.dataset.action;
  const modal = el.dataset.modal;

  if (action === "toggle-menu") toggleMenu();
  else if (action === "open-modal") openModal(modal);
  else if (action === "close-modal") closeModal(modal);
  else if (action === "close-modal-outside" && e.target === el) closeModal(modal);
  else if (action === "toggle-faq") toggleFaq(el);
  else if (action === "submit-form") submitForm();
});

function toggleMenu() {
  document.getElementById("ham").classList.toggle("open");
  document.getElementById("mob-menu").classList.toggle("open");
}

const obs = new IntersectionObserver(
  (es) => {
    es.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  },
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));

const sObs = new IntersectionObserver(
  (e) => {
    if (e[0].isIntersecting) {
      document.querySelectorAll("[data-target]").forEach((el) => {
        const t = +el.dataset.target;
        let s = null;
        function st(ts) {
          if (!s) s = ts;
          const p = Math.min((ts - s) / 1400, 1);
          el.textContent = Math.floor(p * t) + (p === 1 ? "+" : "");
          if (p < 1) requestAnimationFrame(st);
        }
        requestAnimationFrame(st);
      });
      sObs.disconnect();
    }
  },
  { threshold: 0.2 },
);
const ab =
  document.querySelector(".about-stats") || document.querySelector(".about");
if (ab) sObs.observe(ab);

// ── TYPEWRITER ──────────────────────────────────────────────────────────────
function typewriter(el, txt, onDone) {
  el.textContent = "";
  const cur = document.createElement("span");
  cur.className = "tw-cursor";
  cur.textContent = "|";
  el.appendChild(cur);
  let i = 0;
  const iv = setInterval(() => {
    if (i < txt.length) {
      cur.insertAdjacentText("beforebegin", txt[i++]);
    } else {
      clearInterval(iv);
      setTimeout(() => {
        cur.style.animation = "none";
        cur.style.opacity = "0";
        setTimeout(() => cur.remove(), 300);
        if (onDone) onDone();
      }, 700);
    }
  }, 50);
}

// Hero subtitle + fine — цепочкой
const heroSub = document.querySelector(".hero-sub");
const heroFine = document.querySelector(".hero-fine");
const subTxt = heroSub ? heroSub.textContent.trim() : "";
const fineTxt = heroFine ? heroFine.textContent.trim() : "";
if (heroSub) heroSub.textContent = "\u00A0";
if (heroFine) heroFine.textContent = "\u00A0";
setTimeout(() => {
  if (heroSub)
    typewriter(heroSub, subTxt, () => {
      if (heroFine) setTimeout(() => typewriter(heroFine, fineTxt), 150);
    });
}, 1150);

// Section tags — при появлении в viewport
const twObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !e.target.dataset.twDone) {
        e.target.dataset.twDone = "1";
        const txt = e.target.dataset.twOrig;
        setTimeout(() => typewriter(e.target, txt), 350);
        twObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 },
);
document.querySelectorAll(".section-tag").forEach((el) => {
  el.dataset.twOrig = el.textContent.trim();
  el.textContent = "";
  twObs.observe(el);
});

// ── HERO TITLE MARQUEE (бесшовный через rAF) ────────────────────────────────
(function initHeroMarquee() {
  const wrap = document.querySelector(".hero-title-ticker");
  const track = document.querySelector(".hero-title-track");
  if (!wrap || !track) return;

  const SPEED = 90; // px/s — меняй тут

  document.fonts.ready.then(() => {
    // Измеряем ширину одного «блока» (текст + стрелка)
    const unit = Array.from(track.children).reduce(
      (sum, el) => sum + el.offsetWidth,
      0,
    );
    if (!unit) return;

    // Клонируем столько копий, чтобы перекрыть экран с запасом
    const copies = Math.ceil((window.innerWidth * 3) / unit) + 2;
    const orig = Array.from(track.children).map((el) => el.cloneNode(true));
    track.innerHTML = "";
    for (let i = 0; i < copies; i++)
      orig.forEach((el) => track.appendChild(el.cloneNode(true)));

    let pos = 0;
    let last = null;

    function step(ts) {
      if (last === null) last = ts;
      pos -= (SPEED * (ts - last)) / 1000;
      last = ts;
      // Сдвигаем ровно на один блок — никакого «начала заново»
      if (pos <= -unit) pos += unit;
      track.style.transform = `translateX(${pos}px)`;
      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  });
})();

// ── SHOPS MOBILE SLIDER ──────────────────────────────────────────────────────
(function initShopSlider() {
  const grid = document.querySelector(".shops-grid");
  const dotsEl = document.getElementById("shops-dots");
  if (!grid || !dotsEl) return;

  let scrollHandler = null;

  function setup() {
    dotsEl.innerHTML = "";
    if (window.innerWidth > 640) return;

    const cards = Array.from(grid.querySelectorAll(".shop-card"));
    cards.forEach((_, i) => {
      const d = document.createElement("div");
      d.className = "shops-dot" + (i === 0 ? " active" : "");
      d.addEventListener("click", () => {
        cards[i].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      });
      dotsEl.appendChild(d);
    });

    if (scrollHandler) grid.removeEventListener("scroll", scrollHandler);
    scrollHandler = () => {
      const center = grid.scrollLeft + grid.offsetWidth / 2;
      let idx = 0,
        minD = Infinity;
      cards.forEach((c, i) => {
        const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
        if (d < minD) {
          minD = d;
          idx = i;
        }
      });
      dotsEl
        .querySelectorAll(".shops-dot")
        .forEach((d, i) => d.classList.toggle("active", i === idx));
    };
    grid.addEventListener("scroll", scrollHandler, { passive: true });
  }

  setup();
  window.addEventListener("resize", setup);
})();

// ── LIGHTBOX ─────────────────────────────────────────────────────────────────
(function initLightbox() {
  const lb     = document.getElementById("lightbox");
  const lbImg  = document.getElementById("lightbox-img");
  const btnPrev = document.getElementById("lb-prev");
  const btnNext = document.getElementById("lb-next");
  if (!lb || !lbImg) return;

  let images = [];
  let current = 0;

  function getUniqueReviewImgs() {
    // grab only the first set (not aria-hidden duplicates)
    return Array.from(
      document.querySelectorAll(".reviews-track .reviews-img:not([aria-hidden])")
    );
  }

  function show(idx) {
    current = (idx + images.length) % images.length;
    lbImg.style.transform = "scale(0.88)";
    lbImg.src = images[current].src;
    lbImg.alt = images[current].alt;
    setTimeout(() => { lbImg.style.transform = ""; }, 20);
  }

  function open(img) {
    images = getUniqueReviewImgs();
    current = images.indexOf(img);
    if (current === -1) current = 0;
    lbImg.src = images[current].src;
    lbImg.alt = images[current].alt;
    lb.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lb.classList.remove("active");
    document.body.style.overflow = "";
  }

  // open on click
  document.querySelector(".reviews-marquee").addEventListener("click", (e) => {
    const img = e.target.closest(".reviews-img");
    if (!img || img.getAttribute("aria-hidden")) return;
    open(img);
  });

  btnPrev.addEventListener("click", (e) => { e.stopPropagation(); show(current - 1); });
  btnNext.addEventListener("click", (e) => { e.stopPropagation(); show(current + 1); });

  // close on backdrop click
  lb.addEventListener("click", (e) => {
    if (e.target === lb) close();
  });
  document.querySelector(".lightbox-close").addEventListener("click", close);

  // keyboard
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("active")) return;
    if (e.key === "Escape")     close();
    if (e.key === "ArrowLeft")  show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  // swipe on mobile
  let touchX = 0;
  lb.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend",   (e) => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) show(dx < 0 ? current + 1 : current - 1);
  });
})();

// ── GRAPHS MOBILE SLIDER ─────────────────────────────────────────────────────
(function initGraphSlider() {
  const grid = document.querySelector(".graphs-grid");
  const dotsEl = document.getElementById("graphs-dots");
  if (!grid || !dotsEl) return;

  let scrollHandler = null;

  function setup() {
    dotsEl.innerHTML = "";
    if (window.innerWidth > 640) return;

    const items = Array.from(grid.querySelectorAll(".graph-item"));
    items.forEach((_, i) => {
      const d = document.createElement("div");
      d.className = "shops-dot" + (i === 0 ? " active" : "");
      d.addEventListener("click", () => {
        items[i].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      });
      dotsEl.appendChild(d);
    });

    if (scrollHandler) grid.removeEventListener("scroll", scrollHandler);
    scrollHandler = () => {
      const center = grid.scrollLeft + grid.offsetWidth / 2;
      let idx = 0, minD = Infinity;
      items.forEach((c, i) => {
        const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
        if (d < minD) { minD = d; idx = i; }
      });
      dotsEl.querySelectorAll(".shops-dot").forEach((d, i) => d.classList.toggle("active", i === idx));
    };
    grid.addEventListener("scroll", scrollHandler, { passive: true });
  }

  setup();
  window.addEventListener("resize", setup);
})();

// ── MODALS ──────────────────────────────────────────────────────────────────
function openModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}
function closeModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.remove("active");
  document.body.style.overflow = "";
}
function closeModalOutside(e, id) {
  if (e.target === e.currentTarget) closeModal(id);
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape")
    document.querySelectorAll(".modal-overlay.active").forEach((m) =>
      closeModal(m.id)
    );
});

function toggleFaq(btn) {
  const item = btn.closest(".faq-item"),
    open = item.classList.contains("open");
  document
    .querySelectorAll(".faq-item.open")
    .forEach((i) => i.classList.remove("open"));
  if (!open) item.classList.add("open");
}

function submitForm() {
  const n = document.getElementById("f-name").value.trim(),
    p = document.getElementById("f-phone").value.trim(),
    t = document.getElementById("f-tg").value.trim(),
    f = document.getElementById("f-format").value;
  if (!n || !p || !t || !f) {
    alert("Пожалуйста, заполни все поля");
    return;
  }
  document.getElementById("form-success").style.display = "block"; // .form-success-msg управляется через style т.к. нужен программный toggle
  ["f-name", "f-phone", "f-tg"].forEach(
    (id) => (document.getElementById(id).value = ""),
  );
  document.getElementById("f-format").value = "";
}
document.getElementById("f-phone").addEventListener("input", function () {
  let v = this.value.replace(/\D/g, "");
  if (v.startsWith("7") || v.startsWith("8")) v = v.slice(1);
  let r = "";
  if (v.length > 0) r = "+7 (" + v.slice(0, 3);
  if (v.length >= 4) r += ") " + v.slice(3, 6);
  if (v.length >= 7) r += "-" + v.slice(6, 8);
  if (v.length >= 9) r += "-" + v.slice(8, 10);
  this.value = r;
});
