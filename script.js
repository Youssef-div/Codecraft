
document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      menuButton.textContent = isOpen ? "✕" : "☰";
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
        menuButton.textContent = "☰";
      });
    });

    // Close the menu when the user taps anywhere outside the navigation.
    document.addEventListener("click", event => {
      const clickedInsideNavigation = nav.contains(event.target);
      const clickedMenuButton = menuButton.contains(event.target);

      if (!clickedInsideNavigation && !clickedMenuButton && nav.classList.contains("open")) {
        nav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
        menuButton.textContent = "☰";
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        nav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.textContent = "☰";
      }
    });
  }

  const themeButtons = document.querySelectorAll(".theme-toggle");
  const savedTheme = localStorage.getItem("codecraft-theme");
  if (savedTheme === "light") document.body.classList.add("light-theme");

  function updateThemeButtons() {
    const light = document.body.classList.contains("light-theme");
    themeButtons.forEach(button => {
      button.textContent = light ? "☾" : "☼";
      button.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
      button.title = light ? "Switch to dark mode" : "Switch to light mode";
    });
  }
  updateThemeButtons();

  themeButtons.forEach(button => {
    button.addEventListener("click", () => {
      document.body.classList.toggle("light-theme");
      localStorage.setItem("codecraft-theme", document.body.classList.contains("light-theme") ? "light" : "dark");
      updateThemeButtons();
    });
  });

  document.querySelectorAll("[data-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  const form = document.querySelector("#contact-form");
  if (form) {
    const feedback = form.querySelector(".form-feedback");
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      if (feedback) {
        feedback.textContent = "Thanks! The form is validated. Connect a backend or email service to receive real submissions.";
      }
    });
    form.addEventListener("reset", () => {
      if (feedback) feedback.textContent = "";
    });
  }
});


// Single-file preview navigation: swap page sections without loading other files.
document.addEventListener("DOMContentLoaded", () => {
  const sections = [...document.querySelectorAll("[data-page-section]")];
  const navLinks = [...document.querySelectorAll("[data-page]")];

  function showPage(page) {
    if (!sections.some(section => section.dataset.pageSection === page)) page = "home";
    sections.forEach(section => {
      section.hidden = section.dataset.pageSection !== page;
    });
    document.body.classList.toggle("home-page", page === "home");
    document.querySelectorAll(".main-nav a").forEach(link => {
      link.classList.toggle("active", link.dataset.page === page);
    });
    // Close the mobile menu after choosing a page.
    const nav = document.querySelector(".main-nav");
    const menuButton = document.querySelector(".menu-toggle");
    if (nav) nav.classList.remove("open");
    if (menuButton) {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "☰";
      menuButton.setAttribute("aria-label", "Open navigation");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "CodeCraft | " + page.charAt(0).toUpperCase() + page.slice(1);
    if (location.hash !== "#" + page) history.replaceState(null, "", "#" + page);
  }

  navLinks.forEach(link => {
    link.addEventListener("click", event => {
      const page = link.dataset.page;
      if (page) {
        event.preventDefault();
        showPage(page);
      }
    });
  });

  window.addEventListener("hashchange", () => showPage(location.hash.slice(1) || "home"));
  const initial = location.hash.slice(1) || "home";
  showPage(initial);
});
