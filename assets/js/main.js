import { guardarSuscriptor, obtenerNewsletters } from "./firebase.js";

"use strict";

// Page loading
const pageLoading = document.querySelector(".page-loading");

// Helpers
const norm = (s) =>
  (s || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

// Botones
const buttons = document.querySelectorAll(".portfolio-menu [data-filter]");
const nodesWithFilter = document.querySelectorAll(
  ".portfolio-grid .portfolio [data-filter]"
);

if (pageLoading) {
  window.addEventListener("load", () => {
    pageLoading.classList.add("hide");
    setTimeout(() => {
      pageLoading.style.display = "none";
    }, 1000);
  });
}

// Navbar
const navbar = document.querySelector(".ic-navbar"),
  navbarToggler = navbar.querySelector("[data-web-toggle=navbar-collapse]");

navbarToggler.addEventListener("click", function () {
  const dataTarget = this.dataset.webTarget,
    targetElement = document.getElementById(dataTarget),
    isExpanded = this.ariaExpanded === "true";

  if (!targetElement) return;

  navbar.classList.toggle("menu-show");
  this.ariaExpanded = !isExpanded;
  navbarToggler.innerHTML = navbar.classList.contains("menu-show")
    ? '<i class="lni lni-close"></i>'
    : '<i class="lni lni-menu"></i>';
});

// Sticky navbar
window.addEventListener("scroll", function () {
  if (window.scrollY >= 72) {
    navbar.classList.add("sticky");
  } else {
    navbar.classList.remove("sticky");
  }
});

// Web theme
const webTheme = document.querySelector("[data-web-trigger=web-theme]");
const html = document.querySelector("html");

if (webTheme) {
  window.addEventListener("load", function () {
    let theme = localStorage.getItem("Inazuma_WebTheme");

    if (theme === "light") {
      webTheme.innerHTML = '<i class="lni lni-sun"></i>';
    } else if (theme === "dark") {
      webTheme.innerHTML = '<i class="lni lni-night"></i>';
    } else {
      theme = "light";
      localStorage.setItem("Inazuma_WebTheme", theme);
      webTheme.innerHTML = '<i class="lni lni-night"></i>';
    }

    html.dataset.webTheme = theme;
  });

  webTheme.addEventListener("click", function () {
    let theme = localStorage.getItem("Inazuma_WebTheme");

    webTheme.innerHTML =
      theme === "dark"
        ? '<i class="lni lni-sun"></i>'
        : '<i class="lni lni-night"></i>';
    theme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("Inazuma_WebTheme", theme);
    html.dataset.webTheme = theme;
  });
}

// Smooth scroll
document.querySelectorAll(".ic-page-scroll").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const targetElement = document.querySelector(link.getAttribute("href"));
    if (targetElement) {
      const headerOffset = 74;
      const y =
        targetElement.getBoundingClientRect().top +
        window.pageYOffset -
        headerOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    navbar.classList.remove("menu-show");
    navbarToggler.innerHTML = '<i class="lni lni-menu"></i>';
  });
});

// Tabs
document.querySelectorAll(".tabs").forEach((tab) => {
  const links = tab.querySelectorAll(".tabs-nav .tabs-link"),
    contents = tab.querySelectorAll(".tabs-content");

  if (!contents.length) return;

  window.addEventListener("load", () => {
    contents.forEach((c) => c.classList.add("hide"));
    links.forEach((l) => {
      l.classList.remove("active");
      l.ariaSelected = false;
    });

    links[0].classList.add("active");
    links[0].ariaSelected = true;
    document.getElementById(links[0].dataset.webTarget)?.classList.remove(
      "hide"
    );
  });

  links.forEach((link) => {
    const targetElement = document.getElementById(link.dataset.webTarget);
    if (!targetElement) {
      link.disabled = true;
      return;
    }
    link.addEventListener("click", () => {
      contents.forEach((c) => c.classList.add("hide"));
      links.forEach((l) => {
        l.classList.remove("active");
        l.ariaSelected = false;
      });
      link.classList.add("active");
      link.ariaSelected = true;
      targetElement.classList.remove("hide");
    });
  });
});

// Portfolio filter
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const f = norm(btn.dataset.filter);
    const showAll = f === "all" || f === "todo" || f === "";

    document
      .querySelector(".portfolio-menu .active")
      ?.classList.remove("active");
    btn.classList.add("active");

    nodesWithFilter.forEach((el) => {
      const gridItem = el.closest(".portfolio");
      const cat = norm(el.dataset.filter);
      const catList = cat.split(/\s+/);
      const match = showAll || catList.includes(f);

      gridItem.classList.toggle("hide", !match);
      gridItem.classList.toggle("show", match);
      gridItem.style.removeProperty("display");
    });
  });
});

// Estado inicial
nodesWithFilter.forEach((el) => {
  const gridItem = el.closest(".portfolio");
  gridItem.classList.remove("hide");
  gridItem.classList.add("show");
  gridItem.style.removeProperty("display");
});

// Scroll to top
const scrollTopBtn = document.querySelector("[data-web-trigger=scroll-top]");
if (scrollTopBtn) {
  window.onscroll = function () {
    scrollTopBtn.classList.toggle(
      "is-hided",
      !(
        document.body.scrollTop > 50 || document.documentElement.scrollTop > 50
      )
    );
  };

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Animación inicial
document
  .querySelectorAll(".flip-card-odd, .flip-card-even")
  .forEach((card) => {
    card.classList.add("scroll-revealed");
  });

// IntersectionObserver menú activo
document.addEventListener("DOMContentLoaded", () => {
  const links = Array.from(
    document.querySelectorAll(".ic-navbar .ic-page-scroll")
  );

  const sections = links
    .map((a) => a.getAttribute("href"))
    .filter((href) => href && href.startsWith("#") && href.length > 1)
    .map((href) => document.querySelector(href))
    .filter(Boolean);

  const setActive = (id) => {
    links.forEach((a) => {
      const isActive = a.getAttribute("href") === `#${id}`;
      a.classList.toggle("active", isActive);
      if (isActive) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    {
      threshold: 0.5,
      rootMargin: "-10% 0px -40% 0px",
    }
  );

  sections.forEach((sec) => io.observe(sec));

  if (location.hash) setActive(location.hash.slice(1));
});

// Vendors init
document.addEventListener("DOMContentLoaded", () => {
  if (window.ScrollReveal) {
    const sr = window.ScrollReveal({
      origin: "bottom",
      distance: "16px",
      duration: 1000,
      reset: false,
    });
    sr.reveal(".scroll-revealed", { cleanup: true });
  }

  if (window.GLightbox) {
    window.GLightbox({
      selector: ".video-popup",
      href: "https://www.youtube.com/watch?v=r44RKWyfcFw",
      type: "video",
      source: "youtube",
      width: 900,
      autoplayVideos: true,
    });
    window.GLightbox({
      selector: ".portfolio-box",
      type: "image",
      width: 900,
    });
  }

  if (window.Swiper) {
    new window.Swiper(".testimonial-carousel", {
      slidesPerView: 1,
      spaceBetween: 30,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 30 },
        1024: { slidesPerView: 3, spaceBetween: 30 },
        1280: { slidesPerView: 3, spaceBetween: 30 },
      },
    });
  }
});

/* ===========================
   Newsletter (Firestore)
   =========================== */
document.addEventListener('DOMContentLoaded', async () => {
  const track   = document.getElementById('nl-track');
  const prevBtn = document.getElementById('nl-prev');
  const nextBtn = document.getElementById('nl-next');
  const caption = document.getElementById('nl-caption');

  const form    = document.getElementById('nl-form');
  const input   = document.getElementById('nl-email');
  const msg     = document.getElementById('nl-msg');

  const EMAIL_RE = /^[A-Za-z0-9](?:[A-Za-z0-9._%+-]{0,63})@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z]{2,})+$/i;
  const isValidEmail = (s) => EMAIL_RE.test((s || '').trim());

  // 1) Obtener boletines
  let data = [];
  try {
    data = await obtenerNewsletters();
    data = data.map(n => ({
      title: n.title || n.titulo || 'Boletín',
      thumb: n.thumb || n.miniatura || '',
      url:   n.url   || '',
      fecha: (n.fecha && (n.fecha.toDate ? n.fecha.toDate() : new Date(n.fecha))) || new Date(0)
    })).sort((a,b) => b.fecha - a.fecha);
  } catch (err) {
    console.error('Error cargando newsletters:', err);
  }

  // 2) Render carrusel
  if (track) {
    track.innerHTML = '';
    data.forEach((n, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'nl-thumb';
      b.dataset.index = i;

      const img = document.createElement('img');
      img.src = n.thumb;
      img.alt = n.title;
      b.appendChild(img);

      b.addEventListener('click', () => select(i));
      b.addEventListener('dblclick', () => { if (data[i]?.url) window.open(data[i].url, '_blank', 'noopener'); });

      track.appendChild(b);
    });
  }

  let current = 0;
  function select(i){
    if (!data.length) return;
    current = Math.max(0, Math.min(i, data.length - 1));
    if (caption) caption.textContent = data[current].title || '';
    [...(track?.children || [])].forEach((el, idx) => el.classList.toggle('is-active', idx === current));
    track?.children[current]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
  prevBtn?.addEventListener('click', () => select(current - 1));
  nextBtn?.addEventListener('click', () => select(current + 1));
  select(0);

  // 3) Suscripción
  form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = (input?.value || '').trim();

  const html5Ok = input ? input.checkValidity() : true;
  if (!html5Ok || !isValidEmail(email)) {
    if (msg) {
      msg.textContent = 'Ingresa un correo válido (ej. usuario@dominio.tld)';
      msg.style.color = '#d33';
    }
    input?.focus();
    return;
  }

  try {
    await guardarSuscriptor(email);

    if (msg) {
      msg.textContent = '¡Gracias por suscribirte!';
      msg.style.color = '#4caf50';
      msg.style.fontWeight = 'bold';
      msg.style.fontFamily = "'MillionDesign', sans-serif";
    }

    form.reset();
    setTimeout(() => { if (msg) msg.textContent = ''; }, 3500);

  } catch (e) {
    console.error('Firestore error:', e.code, e.message);

    // 🟥 Mostrar el error real en pantalla
    if (msg) {
      msg.textContent = `Error [${e.code || 'desconocido'}]: ${e.message || 'No se pudo guardar la suscripción'}`;
      msg.style.color = '#d33';
    }
  }
});
});
