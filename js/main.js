(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  var pages = Array.prototype.slice.call(document.querySelectorAll("main section.page"));
  var navAnchors = Array.prototype.slice.call(links.querySelectorAll("a"));

  function closeMenu() {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  function showPage(id, keepScroll) {
    var page = document.getElementById(id);
    if (!page || !page.classList.contains("page")) return false;
    pages.forEach(function (p) { p.classList.toggle("is-active", p === page); });
    navAnchors.forEach(function (a) {
      a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
    });
    if (!keepScroll) window.scrollTo(0, 0);
    return true;
  }

  /* Intercept in-site anchor clicks: switch page, or scroll within the active page */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute("href").slice(1);
    if (!id) return;
    var target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    closeMenu();

    if (target.classList.contains("page")) {
      showPage(id);
      if (window.history && history.replaceState) history.replaceState(null, "", "#" + id);
    } else {
      var parent = target.closest(".page");
      if (parent && !parent.classList.contains("is-active")) showPage(parent.id, true);
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  /* Mobile menu toggle */
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  /* Shadow on nav once scrolled */
  function onScroll() { nav.classList.toggle("is-scrolled", window.scrollY > 8); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Initial page from URL hash, default to Home */
  if (!showPage((location.hash || "").slice(1))) showPage("home");

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
