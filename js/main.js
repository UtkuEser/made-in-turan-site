/* ============================================================
   MADE IN TURAN — main.js
   Modüller: Header Scroll | Hamburger Menü |
             Scroll Reveal | Nav Active State | Form Validation
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
  onScroll(); // ilk yüklemede de çalıştır


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

  // Mobil linke tıklayınca menüyü kapat
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Dışarıya tıklayınca kapat
  document.addEventListener('click', function (e) {
    if (
      mobileNav.classList.contains('open') &&
      !mobileNav.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // Escape tuşu ile kapat
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
    // IntersectionObserver desteklenmiyorsa tümünü göster
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }


  /* ----------------------------------------------------------
     4. NAV ACTIVE STATE — scroll pozisyonuna göre nav link vurgula
  ---------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();


  /* ----------------------------------------------------------
     5. FORM VALİDASYON — zorunlu alanlar için basit kontrol
  ---------------------------------------------------------- */
  const applyForm = document.getElementById('apply-form');

  if (applyForm) {
    applyForm.addEventListener('submit', function (e) {
      const requiredFields = applyForm.querySelectorAll('[required]');
      let isValid = true;

      // Önceki hata stillerini temizle
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
        // İlk hatalı alana scroll et
        const firstError = applyForm.querySelector('[style*="e05555"]');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });

    // Kullanıcı yazmaya başlayınca hata stilini kaldır
    applyForm.querySelectorAll('.form-input').forEach(function (input) {
      input.addEventListener('input', function () {
        input.style.borderColor = '';
      });
    });
  }

})();
