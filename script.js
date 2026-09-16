// =========================
// Akshay.dev — Interactions
// =========================

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const backTop = document.querySelector("#back-top");
  const form = document.querySelector("#contact-form");

  // Sticky header + Back-to-top button
  const handleScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
    backTop.classList.toggle("show", window.scrollY > 500);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Mobile navigation
  const closeMenu = () => {
    navMenu.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  });

  navLinks.forEach((link) => link.addEventListener("click", closeMenu));

  // Active navigation indicator
  const sections = document.querySelectorAll("main section[id]");
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px" }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  // Reveal sections/cards on scroll
  const revealItems = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  // Back to top
  backTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Contact form validation + backend submission
  if (form) {
    const fields = {
      name: {
        input: document.querySelector("#name"),
        error: document.querySelector("#name-error"),
        validate: (value) => value.trim().length > 0,
        message: "Please enter your name."
      },
      email: {
        input: document.querySelector("#email"),
        error: document.querySelector("#email-error"),
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
        message: "Please enter a valid email address."
      },
      subject: {
        input: document.querySelector("#subject"),
        error: document.querySelector("#subject-error"),
        validate: (value) => value.trim().length > 0,
        message: "Please enter a subject."
      },
      message: {
        input: document.querySelector("#message"),
        error: document.querySelector("#message-error"),
        validate: (value) => value.trim().length >= 10,
        message: "Message should be at least 10 characters."
      }
    };

    const validateField = (field) => {
      const valid = field.validate(field.input.value);
      const wrapper = field.input.closest(".form-field");

      wrapper.classList.toggle("invalid", !valid);
      field.error.textContent = valid ? "" : field.message;
      field.input.setAttribute("aria-invalid", String(!valid));

      return valid;
    };

    Object.values(fields).forEach((field) => {
      field.input.addEventListener("blur", () => validateField(field));
      field.input.addEventListener("input", () => {
        if (field.input.value.trim()) validateField(field);
      });
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const status = document.querySelector("#form-status");
      const results = Object.values(fields).map(validateField);

      if (!results.every(Boolean)) {
        status.textContent = "Please fix the highlighted fields and try again.";
        status.className = "form-status error";
        return;
      }

      const submitButton = form.querySelector(".submit-btn");
      const originalButtonText = submitButton.innerHTML;

      submitButton.disabled = true;
      submitButton.innerHTML = "Sending... <span>↗</span>";
      status.textContent = "Sending your message...";
      status.className = "form-status";

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fields.name.input.value,
            email: fields.email.input.value,
            subject: fields.subject.input.value,
            message: fields.message.input.value
          })
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.errors) {
            Object.entries(data.errors).forEach(([key, message]) => {
              const field = fields[key];
              if (field) {
                field.input.closest(".form-field").classList.add("invalid");
                field.error.textContent = message;
                field.input.setAttribute("aria-invalid", "true");
              }
            });
          }
          throw new Error(data.message || "Unable to send the message.");
        }

        status.textContent = data.message || "Message sent successfully!";
        status.className = "form-status success";
        form.reset();

        Object.values(fields).forEach((field) => {
          field.input.removeAttribute("aria-invalid");
          field.error.textContent = "";
          field.input.closest(".form-field").classList.remove("invalid");
        });
      } catch (error) {
        status.textContent =
          error.message ||
          "The server could not be reached. Make sure the backend is running.";
        status.className = "form-status error";
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }
    });
  }
});
