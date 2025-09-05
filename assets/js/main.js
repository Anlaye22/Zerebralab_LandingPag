"use strict";

// Page loading
const pageLoading = document.querySelector(".page-loading");

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

// Scrollspy
function scrollspy() {
  const links = document.querySelectorAll(".ic-page-scroll");
  const scrollpos = window.pageYOffset || document.documentElement.scrollTop;

  for (const currentLink of links) {
    const dataTarget = currentLink.getAttribute("href");
    const targetElement = document.querySelector(dataTarget);
    const topminus = scrollpos + 74;

    if (targetElement) {
      if (
        targetElement.offsetTop <= topminus &&
        targetElement.offsetTop + targetElement.offsetHeight > topminus
      ) {
        document.querySelector(".ic-page-scroll.active")?.classList.remove("active");
        currentLink.classList.add("active");
      } else {
        currentLink.classList.remove("active");
      }
    }
  }
}

document.addEventListener("scroll", scrollspy);

// Smooth scroll
document.querySelectorAll(".ic-page-scroll").forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const targetElement = document.querySelector(link.getAttribute("href"));
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", offsetTop: 1 - 74 });
    }
    navbar.classList.remove("menu-show");
    navbarToggler.innerHTML = '<i class="lni lni-menu"></i>';
  });
});

// Tabs
document.querySelectorAll(".tabs").forEach(tab => {
  const links = tab.querySelectorAll(".tabs-nav .tabs-link"),
    contents = tab.querySelectorAll(".tabs-content");

  if (!contents.length) return;

  window.addEventListener("load", () => {
    contents.forEach(c => c.classList.add("hide"));
    links.forEach(l => {
      l.classList.remove("active");
      l.ariaSelected = false;
    });

    links[0].classList.add("active");
    links[0].ariaSelected = true;
    document.getElementById(links[0].dataset.webTarget)?.classList.remove("hide");
  });

  links.forEach(link => {
    const targetElement = document.getElementById(link.dataset.webTarget);
    if (!targetElement) {
      link.disabled = true;
      return;
    }
    link.addEventListener("click", () => {
      contents.forEach(c => c.classList.add("hide"));
      links.forEach(l => {
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
document.querySelectorAll(".portfolio-menu button").forEach(filter => {
  filter.addEventListener("click", function () {
    document.querySelector(".portfolio-menu button.active")?.classList.remove("active");
    this.classList.add("active");

    const selected = filter.getAttribute("data-filter");
    let itemsToShow = document.querySelectorAll(
      `.portfolio-grid .portfolio [data-filter="${selected}"]`
    );

    if (selected === "all") {
      itemsToShow = document.querySelectorAll(".portfolio-grid .portfolio [data-filter]");
    }

    document.querySelectorAll(".portfolio-grid .portfolio [data-filter]").forEach(el => {
      const parent = el.parentElement;
      if (selected === "all" || el.getAttribute("data-filter") === selected) {
        parent.classList.remove("hide");
        parent.classList.add("show");
      } else {
        parent.classList.remove("show");
        parent.classList.add("hide");
      }
    });
  });
});

// Scroll to top
const scrollTopBtn = document.querySelector("[data-web-trigger=scroll-top]");
if (scrollTopBtn) {
  window.onscroll = function () {
    scrollTopBtn.classList.toggle(
      "is-hided",
      !(document.body.scrollTop > 50 || document.documentElement.scrollTop > 50)
    );
  };

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Animación inicial a tarjetas
document.querySelectorAll('.flip-card').forEach(card => {
  card.classList.add('scroll-revealed');
});

// 🔽 Cargar newsletters (lazy load)
document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("newsletter-list");
  if (!contenedor) return;

  const observer = new IntersectionObserver(async (entries, obs) => {
    if (entries[0].isIntersecting) {
      obs.disconnect();
      contenedor.innerHTML = `<p class="text-sm text-gray-500 animate-pulse">Cargando boletines…</p>`;

      try {
        const { obtenerNewsletters } = await import("./firebase.js");
        const boletines = await obtenerNewsletters();

        contenedor.innerHTML = "";

      boletines
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)) // orden descendente por fecha
        .forEach(b => {
          const div = document.createElement("div");
          div.className = "bg-white p-4 shadow rounded text-left";

          div.innerHTML = `
            <h3 class="text-lg font-semibold">${b.titulo}</h3>
            <p class="text-sm text-gray-600 mb-2">Publicado: ${b.fecha}</p>
            <p class="text-sm text-gray-800 mb-2">${b.extracto ?? "Resumen no disponible."}</p>
            <a href="${b.link}" target="_blank" class="text-blue-600 hover:underline">Ver boletín completo</a>
          `;

          contenedor.appendChild(div);
        });

      } catch (err) {
        contenedor.innerHTML = `<p class="text-red-600">Error al cargar boletines.</p>`;
        console.error("Error al obtener newsletters:", err);
      }
    }
  });

  observer.observe(contenedor);
});
