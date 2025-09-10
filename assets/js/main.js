import "../css/main.css";

"use strict";

// Page loading
const pageLoading = document.querySelector(".page-loading");
// Helpers
const norm = (s) =>
  (s || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')               // separa acentos
    .replace(/\p{Diacritic}/gu, ''); // quita acentos

// Botones (usa data-filter en los <button>)
const buttons = document.querySelectorAll('.portfolio-menu [data-filter]');

// Los nodos con data-filter están en el <article>, pero el que se oculta
// es el DIV padre con clase "portfolio col-12 ..."
const nodesWithFilter = document.querySelectorAll('.portfolio-grid .portfolio [data-filter]');

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
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    // normaliza valor del botón
    const f = norm(btn.dataset.filter); // e.g. 'all', 'negocios', 'comunicacion', ...

    // acepta All/Todo/vacío como "mostrar todo"
    const showAll = (f === 'all' || f === 'todo' || f === '');

    // marca botón activo
    document.querySelector('.portfolio-menu .active')?.classList.remove('active');
    btn.classList.add('active');

    nodesWithFilter.forEach(el => {
      const gridItem = el.closest('.portfolio'); // el contenedor que se muestra/oculta
      const cat = norm(el.dataset.filter);       // categoría del artículo

      // si quieres permitir múltiples categorías separadas por espacios:
      const catList = cat.split(/\s+/);

      const match = showAll || catList.includes(f);

      // Usa tus clases .show/.hide (o cambia a Tailwind block/hidden si prefieres)
      gridItem.classList.toggle('hide', !match);
      gridItem.classList.toggle('show',  match);
      gridItem.style.removeProperty('display');  // por si quedó un inline display:none
    });
  });
});

// Estado inicial: todo visible
nodesWithFilter.forEach(el => {
  const gridItem = el.closest('.portfolio');
  gridItem.classList.remove('hide');
  gridItem.classList.add('show');
  gridItem.style.removeProperty('display');
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
document.querySelectorAll('.flip-card-odd, .flip-card-even').forEach(card => {
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


/* ===== Newsletter logic ===== */

// Data de ejemplo (reemplaza con lo que traigas de Firestore si quieres)
const NL_DATA = [
  { title: 'Boletín • Agosto 2025',  thumb: './assets/img/head.jpg',           url: '#' },
  { title: 'Boletín • Julio 2025',   thumb: './assets/img/Icono-Proposito.png', url: '#' },
  { title: 'Boletín • Junio 2025',   thumb: './assets/img/Icono-QBuscamos.png', url: '#' },
  { title: 'Boletín • Mayo 2025',    thumb: './assets/img/head.jpg',           url: '#' },
  { title: 'Boletín • Abril 2025',   thumb: './assets/img/Icono-Proposito.png', url: '#' },
];

(function initNewsletter(){
  const track   = document.getElementById('nl-track');
  const prevBtn = document.getElementById('nl-prev');
  const nextBtn = document.getElementById('nl-next');
  const caption = document.getElementById('nl-caption');

  if (!track || !prevBtn || !nextBtn) return;

  let current = 0;

  // Render miniaturas
  NL_DATA.forEach((n, i) => {
    const b = document.createElement('button');
    b.className = 'nl-thumb';
    b.type = 'button';
    b.dataset.index = i;

    const img = document.createElement('img');
    img.src = n.thumb;
    img.alt = n.title;
    b.appendChild(img);

    b.addEventListener('click', () => select(i));
    track.appendChild(b);
  });

  function select(i){
    current = Math.max(0, Math.min(i, NL_DATA.length - 1));
    caption.textContent = NL_DATA[current].title;

    // Marcar activo
    [...track.children].forEach((el, idx) => {
      el.classList.toggle('is-active', idx === current);
    });

    // Centrar seleccionado (scroll suave)
    track.children[current]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }

  prevBtn.addEventListener('click', () => select(current - 1));
  nextBtn.addEventListener('click', () => select(current + 1));

  // Estado inicial
  select(2); // el del centro como en tu captura

  // Form
  const form = document.getElementById('nl-form');
  const input = document.getElementById('nl-email');
  const msg = document.getElementById('nl-msg');

  const onlyGmail = (s) => /^[a-z0-9._%+-]+@gmail\.com$/i.test((s||'').trim());

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = input.value.trim();

    if (!onlyGmail(email)) {
      msg.textContent = 'Solo se permiten correos Gmail válidos.';
      msg.style.color = '#d33';
      return;
    }

    // Aquí podrías llamar a Firebase: guardarSuscriptor(email)
    // await guardarSuscriptor(email);

    msg.textContent = '¡Gracias por suscribirte!';
    msg.style.color = '#4caf50';
    form.reset();

    // limpiar mensaje
    setTimeout(() => { msg.textContent = ''; }, 3500);
  });
})();
