"use strict";

// Page loading
const pageLoading = document.querySelector(".page-loading");

// Helpers
const norm = (s) =>
  (s || "")
    .toString()
    .toLowerCase()
    .normalize("NFD") // separa acentos
    .replace(/\p{Diacritic}/gu, ""); // quita acentos

// Botones (usa data-filter en los <button>)
const buttons = document.querySelectorAll(".portfolio-menu [data-filter]");

// Los nodos con data-filter están en el <article>, pero el que se oculta
// es el DIV padre con clase "portfolio col-12 ..."
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

// Smooth scroll (con offset del header)
document.querySelectorAll(".ic-page-scroll").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const targetElement = document.querySelector(link.getAttribute("href"));
    if (targetElement) {
      const headerOffset = 74; // ajusta si cambia la altura del header
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

// Tabs genéricas (no se toca estructura; queda inactivo si no hay .tabs-link/.tabs-content)
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
    // normaliza valor del botón
    const f = norm(btn.dataset.filter); // e.g. 'all', 'negocios', 'comunicacion', ...

    // acepta All/Todo/vacío como "mostrar todo"
    const showAll = f === "all" || f === "todo" || f === "";

    // marca botón activo
    document
      .querySelector(".portfolio-menu .active")
      ?.classList.remove("active");
    btn.classList.add("active");

    nodesWithFilter.forEach((el) => {
      const gridItem = el.closest(".portfolio"); // el contenedor que se muestra/oculta
      const cat = norm(el.dataset.filter); // categoría del artículo

      // si quieres permitir múltiples categorías separadas por espacios:
      const catList = cat.split(/\s+/);

      const match = showAll || catList.includes(f);

      // Usa tus clases .show/.hide (o cambia a Tailwind block/hidden si prefieres)
      gridItem.classList.toggle("hide", !match);
      gridItem.classList.toggle("show", match);
      gridItem.style.removeProperty("display"); // por si quedó un inline display:none
    });
  });
});

// Estado inicial: todo visible
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

// Animación inicial a tarjetas
document
  .querySelectorAll(".flip-card-odd, .flip-card-even")
  .forEach((card) => {
    card.classList.add("scroll-revealed");
  });

// IntersectionObserver para marcar menú activo por sección
document.addEventListener("DOMContentLoaded", () => {
  const links = Array.from(
    document.querySelectorAll(".ic-navbar .ic-page-scroll")
  );

  // Obtiene las secciones a partir de los hrefs (#id)
  const sections = links
    .map((a) => a.getAttribute("href"))
    .filter((href) => href && href.startsWith("#") && href.length > 1)
    .map((href) => document.querySelector(href))
    .filter(Boolean);

  // Marca el link activo
  const setActive = (id) => {
    links.forEach((a) => {
      const isActive = a.getAttribute("href") === `#${id}`;
      a.classList.toggle("active", isActive);
      if (isActive) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  };

  // Observa cuándo cada sección entra al viewport
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    {
      threshold: 0.5, // ~50% visible
      rootMargin: "-10% 0px -40% 0px", // ajusta el momento del cambio
    }
  );

  sections.forEach((sec) => io.observe(sec));

  // Estado correcto si la página carga con hash
  if (location.hash) setActive(location.hash.slice(1));
});

// ===== Vendors init (CDN globales vía window.*) =====
document.addEventListener("DOMContentLoaded", () => {
  // ScrollReveal
  if (window.ScrollReveal) {
    const sr = window.ScrollReveal({
      origin: "bottom",
      distance: "16px",
      duration: 1000,
      reset: false,
    });
    sr.reveal(".scroll-revealed", { cleanup: true });
  }

  // GLightbox
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

  // Swiper
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
