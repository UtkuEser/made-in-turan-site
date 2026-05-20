/* ============================================================
   MADE IN TURAN — main.js
   Modüller: Header Scroll | Hamburger Menü |
             Scroll Reveal | Nav Aktif Durum (URL) | Form Validasyon
============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. HEADER SCROLL — scroll geçince blur/arka plan uygula
  ---------------------------------------------------------- */
  const header = document.getElementById('site-header');

  function onScroll() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ----------------------------------------------------------
     2. HAMBURGER MENÜ — mobil nav aç/kapat
  ---------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMenu() {
    hamburger.classList.add('open');
    mobileNav.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    if (hamburger.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', function (e) {
    if (
      mobileNav.classList.contains('open') &&
      !mobileNav.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      closeMenu();
    }
  });


  /* ----------------------------------------------------------
     3. SCROLL REVEAL — IntersectionObserver ile .reveal
  ---------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -48px 0px',
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }


  /* ----------------------------------------------------------
     4. NAV AKTİF DURUM — URL'e göre mevcut sayfayı vurgula
  ---------------------------------------------------------- */
  const navLinks = document.querySelectorAll('.nav-link');

  (function setActiveNavByURL() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href === currentPage) {
        link.classList.add('active');
      }
    });
  })();


  /* ----------------------------------------------------------
     5. FORM VALİDASYON — zorunlu alanlar için basit kontrol
  ---------------------------------------------------------- */
  const applyForm = document.getElementById('apply-form');

  if (applyForm) {
    applyForm.addEventListener('submit', function (e) {
      const requiredFields = applyForm.querySelectorAll('[required]');
      let isValid = true;

      requiredFields.forEach(function (field) {
        field.style.borderColor = '';
      });

      requiredFields.forEach(function (field) {
        const value = field.value.trim();

        if (!value) {
          isValid = false;
          field.style.borderColor = '#e05555';
          field.focus();
        } else if (field.type === 'email') {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(value)) {
            isValid = false;
            field.style.borderColor = '#e05555';
            field.focus();
          }
        }
      });

      if (!isValid) {
        e.preventDefault();
        const firstError = applyForm.querySelector('[style*="e05555"]');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });

    applyForm.querySelectorAll('.form-input').forEach(function (input) {
      input.addEventListener('input', function () {
        input.style.borderColor = '';
      });
    });
  }

})();
