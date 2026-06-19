/* =========================================================
   RVL-CPH — interactions
   Progressive enhancement: the site is fully usable without JS.
   ========================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---- current year ---- */
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- contour draw-in on load ---- */
  const heroContours = document.querySelector(".contour-group");
  if (heroContours && !prefersReduced) {
    requestAnimationFrame(() => {
      heroContours.classList.add("contours-animate");
    });
  }

  /* ---- nav: solid background on scroll ---- */
  const nav = document.querySelector("[data-nav]");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- mobile menu ---- */
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");
  const closeMenu = () => {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    menu.hidden = true;
    if (nav) nav.classList.remove("is-menu-open");
    document.body.style.overflow = "";
  };
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      menu.hidden = open;
      if (nav) nav.classList.toggle("is-menu-open", !open);
      document.body.style.overflow = open ? "" : "hidden";
    });
    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", closeMenu)
    );
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  /* ---- scroll reveal ---- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !prefersReduced) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---- scrollspy: highlight active nav link ---- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav__link[data-navlink]");
  if ("IntersectionObserver" in window && navLinks.length) {
    const linkFor = (id) =>
      document.querySelector('.nav__link[href="#' + id + '"]');
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove("is-active"));
            const active = linkFor(entry.target.id);
            if (active) active.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---- contact form ---- */
  const form = document.querySelector("[data-contact-form]");
  if (form) {
    const status = form.querySelector("[data-form-status]");

    const setError = (name, msg) => {
      const input = form.querySelector("#" + name);
      const field = input ? input.closest(".field") : null;
      const errEl = form.querySelector('[data-error-for="' + name + '"]');
      if (field) field.classList.toggle("is-invalid", Boolean(msg));
      if (input) input.setAttribute("aria-invalid", msg ? "true" : "false");
      if (errEl) errEl.textContent = msg || "";
    };

    const validate = () => {
      let ok = true;
      const name = form.elements.name.value.trim();
      const email = form.elements.email.value.trim();
      const message = form.elements.message.value.trim();

      if (!name) { setError("name", "Please add your name."); ok = false; }
      else setError("name", "");

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!email) { setError("email", "Please add your email."); ok = false; }
      else if (!emailOk) { setError("email", "Please check this email address."); ok = false; }
      else setError("email", "");

      if (!message) { setError("message", "A short message helps me reply well."); ok = false; }
      else setError("message", "");

      return ok;
    };

    // Clear errors as the visitor corrects them.
    ["name", "email", "message"].forEach((n) => {
      const el = form.elements[n];
      if (el) el.addEventListener("input", () => {
        if (el.closest(".field").classList.contains("is-invalid")) validate();
      });
    });

    // ---------------------------------------------------------------
    // Contact delivery — FormSubmit (https://formsubmit.co)
    // No account, API key, or login. Messages are emailed to CONTACT_EMAIL.
    //
    // FIRST-TIME ACTIVATION (one click, once): the first submission makes
    // FormSubmit email a "Confirm your email" link to CONTACT_EMAIL — open it
    // and click the link. Every submission after that is delivered
    // automatically. Tip: send one test message yourself to trigger it.
    // Nothing to paste into the code.
    // ---------------------------------------------------------------
    const CONTACT_EMAIL = "rvlcopenhagen@gmail.com";
    const FORM_ENDPOINT = "https://formsubmit.co/ajax/" + CONTACT_EMAIL;
    const submitBtn = form.querySelector(".form__submit");

    const mailtoFallback = (name, email, org, message) => {
      const subject = "Inquiry via RVL-CPH — " + name;
      const body =
        "Name: " + name + "\n" +
        "Email: " + email + "\n" +
        "Affiliation: " + (org || "—") + "\n\n" +
        message;
      window.location.href =
        "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (status) { status.classList.remove("is-error"); status.textContent = ""; }

      if (!validate()) {
        if (status) {
          status.classList.add("is-error");
          status.textContent = "Please check the highlighted fields.";
        }
        const firstInvalid = form.querySelector(".field.is-invalid input, .field.is-invalid textarea");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const name = form.elements.name.value.trim();
      const email = form.elements.email.value.trim();
      const org = form.elements.organization.value.trim();
      const message = form.elements.message.value.trim();
      const honey = form.elements._honey ? form.elements._honey.value : "";

      // Send through FormSubmit — straight to the inbox, no mail app needed.
      if (submitBtn) submitBtn.disabled = true;
      if (status) { status.classList.remove("is-error"); status.textContent = "Sending…"; }

      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            name: name,
            email: email,
            Affiliation: org || "—",
            message: message,
            _subject: "New inquiry via RVL-CPH — " + name,
            _template: "table",
            _captcha: "false",
            _honey: honey,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && (data.success === true || data.success === "true")) {
          if (status) {
            status.classList.remove("is-error");
            status.textContent = "Thanks — your message has been sent. I’ll reply personally.";
          }
          form.reset();
        } else {
          throw new Error((data && data.message) || "Send failed");
        }
      } catch (err) {
        // Network/CORS issue — fall back to the visitor's email app (input preserved).
        if (status) {
          status.classList.add("is-error");
          status.textContent = "Couldn’t send just now — opening your email app instead…";
        }
        mailtoFallback(name, email, org, message);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
})();
