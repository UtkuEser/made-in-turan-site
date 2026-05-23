/* ============================================================
   MADE IN TURAN — main.js
   Modüller: Header Scroll | Hamburger Menü |
             Scroll Reveal | Nav Aktif Durum (URL) | Form Validasyon
============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. HEADER SCROLL — scroll geçince açık arka plan uygula
     Ana sayfada hero video üzerinde header transparan başlar.
     Alt sayfalarda (hero yok) header anında scrolled olur.
  ---------------------------------------------------------- */
  const header = document.getElementById('site-header');
  const hasDarkHero = !!document.querySelector('.hero');

  function onScroll() {
    if (!hasDarkHero || window.scrollY > 20) {
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


  /* ----------------------------------------------------------
     6. HERO SLIDER — otomatik geçiş + dot/ok kontrolü
  ---------------------------------------------------------- */
  const heroSlider = document.getElementById('hero-slider');

  if (heroSlider) {
    const slides  = heroSlider.querySelectorAll('.hero-slide');
    const dots    = document.querySelectorAll('.hero-dot');
    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');
    const heroSection = document.getElementById('hero');

    /* Slide veya dot yoksa sessizce çık */
    if (!slides.length || dots.length !== slides.length) {
      /* no-op */
    } else {

      let current   = 0;
      let autoTimer = null;
      const INTERVAL = 5500;

      function goTo(index) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        dots[current].setAttribute('aria-selected', 'false');

        current = (index + slides.length) % slides.length;

        slides[current].classList.add('active');
        dots[current].classList.add('active');
        dots[current].setAttribute('aria-selected', 'true');
      }

      function startAuto() {
        autoTimer = setInterval(function () { goTo(current + 1); }, INTERVAL);
      }

      function stopAuto() { clearInterval(autoTimer); }

      function resetAuto() { stopAuto(); startAuto(); }

      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          goTo(parseInt(dot.getAttribute('data-slide'), 10));
          resetAuto();
        });
      });

      if (prevBtn) {
        prevBtn.addEventListener('click', function () { goTo(current - 1); resetAuto(); });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', function () { goTo(current + 1); resetAuto(); });
      }

      /* Hover pause — #hero bölümü üzerinde (dots dahil) */
      if (heroSection) {
        heroSection.addEventListener('mouseenter', stopAuto);
        heroSection.addEventListener('mouseleave', startAuto);
      }

      heroSlider.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft')  { goTo(current - 1); resetAuto(); }
        if (e.key === 'ArrowRight') { goTo(current + 1); resetAuto(); }
      });

      startAuto();
    }
  }


  /* ----------------------------------------------------------
     7. TEMSİLCİLİK HARİTA — hotspot toggle + mobil accordion
  ---------------------------------------------------------- */
  const mapHotspotTR  = document.getElementById('map-hotspot-tr');
  const mapCalloutTR  = document.getElementById('map-callout-tr');
  const repPanelTR    = document.getElementById('turkiye-representatives');

  if (mapHotspotTR && repPanelTR) {
    mapHotspotTR.addEventListener('click', function () {
      const isActive = mapHotspotTR.classList.contains('is-active');

      /* Şu an sadece TR hotspot var; birden fazla olunca burası döngüye alınır */
      mapHotspotTR.classList.toggle('is-active', !isActive);
      mapHotspotTR.setAttribute('aria-pressed', String(!isActive));

      if (mapCalloutTR) {
        mapCalloutTR.classList.toggle('is-active', !isActive);
      }

      repPanelTR.classList.toggle('is-open', !isActive);
      repPanelTR.setAttribute('aria-hidden', String(isActive));
    });
  }

  /* Mobil accordion */
  const mobileRegionTR = document.getElementById('mobile-region-tr');
  const mobileTRReps   = document.getElementById('mobile-tr-reps');

  if (mobileRegionTR && mobileTRReps) {
    mobileRegionTR.addEventListener('click', function () {
      const isExpanded = mobileRegionTR.getAttribute('aria-expanded') === 'true';
      const chevron    = mobileRegionTR.querySelector('.mobile-region-chevron');

      mobileRegionTR.setAttribute('aria-expanded', String(!isExpanded));
      mobileTRReps.classList.toggle('is-open', !isExpanded);
      if (chevron) chevron.classList.toggle('is-open', !isExpanded);
    });
  }


  /* ----------------------------------------------------------
     8. HARITA TEMSİLCİLİK — tooltip + tıkla/panel
  ---------------------------------------------------------- */
  console.log('[MIT] temsilcilikler module loaded');

  var _panel     = document.querySelector('#country-panel');
  var _tooltip   = document.getElementById('map-tooltip');
  var _countries = document.querySelectorAll('.map-country[data-country]');

  console.log('[MIT] country count:', _countries.length);
  console.log('[MIT] panel:', _panel);

  if (_panel && _countries.length > 0) {

    var COUNTRY_DATA = {
      turkiye: {
        title: 'Türkiye Temsilcilikleri',
        desc:  'Türkiye genelinde iş geliştirme ve bölgesel temsil ağı.',
        code:  'TR',
        reps: [
          { name: 'Suat Ebçin',    role: 'Ankara Temsilcisi',                  email: 'suatebcin@madeinturan.com'    },
          { name: 'Gökhan Öztürk', role: 'Başkan Yrd. / İzmir İl Temsilcisi',  email: 'gokhanozturk@madeinturan.com' },
          { name: 'Berkan Akıllı', role: 'Başkan Yrd. / Ankara İl Temsilcisi', email: 'berkanakilli@madeinturan.com' },
          { name: 'Serdar Dilmen', role: 'İstanbul Temsilcisi',                 email: 'serdardilmen@madeinturan.com' }
        ]
      }
    };

    var SOON_COUNTRIES = {
      azerbaycan:   { name: 'Azerbaycan',   code: 'AZ' },
      kazakistan:   { name: 'Kazakistan',   code: 'KZ' },
      ozbekistan:   { name: 'Özbekistan',   code: 'UZ' },
      kirgizistan:  { name: 'Kırgızistan',  code: 'KG' },
      turkmenistan: { name: 'Türkmenistan', code: 'TM' },
      bae:          { name: 'Dubai / BAE',  code: 'AE' },
      kktc:         { name: 'KKTC',         code: 'KK' }
    };

    var activeKey = null;

    function getInitials(name) {
      return name.split(' ').map(function (p) { return p[0]; }).join('').slice(0, 2).toUpperCase();
    }

    function renderPanel(key) {
      var data = COUNTRY_DATA[key];
      var soon = SOON_COUNTRIES[key];

      if (!data && !soon) { return; }

      if (data) {
        var repsHTML = data.reps.map(function (rep) {
          return '<div class="country-rep-card">' +
            '<div class="country-rep-avatar">' + getInitials(rep.name) + '</div>' +
            '<div class="country-rep-name">'   + rep.name  + '</div>' +
            '<div class="country-rep-role">'   + rep.role  + '</div>' +
            '<a class="country-rep-email" href="mailto:' + rep.email + '">' + rep.email + '</a>' +
            '</div>';
        }).join('');

        _panel.innerHTML =
          '<div class="country-panel-header">' +
            '<span class="country-panel-badge">' + data.code  + '</span>' +
            '<h3 class="country-panel-title">'   + data.title + '</h3>' +
            '<span class="country-panel-desc">'  + data.desc  + '</span>' +
          '</div>' +
          '<div class="country-panel-body">' +
            '<div class="country-rep-list">' + repsHTML + '</div>' +
          '</div>';
      } else {
        _panel.innerHTML =
          '<div class="country-panel-header">' +
            '<span class="country-panel-badge">' + soon.code + '</span>' +
            '<h3 class="country-panel-title">'   + soon.name + ' Temsilcilikleri</h3>' +
          '</div>' +
          '<div class="country-panel-soon">' +
            '<div class="country-panel-soon-icon">&#127760;</div>' +
            '<div class="country-panel-soon-text">Bu bölgeye ait temsilcilik bilgileri hazırlanıyor.</div>' +
          '</div>';
      }

      /* Animasyonu her tıklamada yeniden tetikle */
      _panel.classList.remove('is-visible');
      void _panel.offsetHeight;
      _panel.classList.add('is-visible');
    }

    function setActiveCountry(key) {
      /* Önceki aktif: desktop path + mobil kart */
      if (activeKey) {
        var prevPath = document.querySelector('.map-country[data-country="' + activeKey + '"]');
        var prevCard = document.querySelector('.mobile-country-card[data-country="' + activeKey + '"]');
        if (prevPath) { prevPath.classList.remove('is-active'); }
        if (prevCard) { prevCard.classList.remove('is-active'); }
      }
      activeKey = key;
      /* Yeni aktif: desktop path + mobil kart */
      var newPath = document.querySelector('.map-country[data-country="' + key + '"]');
      var newCard = document.querySelector('.mobile-country-card[data-country="' + key + '"]');
      if (newPath) { newPath.classList.add('is-active'); }
      if (newCard) { newCard.classList.add('is-active'); }
      renderPanel(key);
    }

    _countries.forEach(function (country) {

      country.addEventListener('mouseenter', function () {
        if (!_tooltip) { return; }
        _tooltip.textContent = country.getAttribute('data-country-name');
        _tooltip.classList.add('is-visible');
      });

      country.addEventListener('mousemove', function (e) {
        if (!_tooltip) { return; }
        _tooltip.style.left = e.clientX + 'px';
        _tooltip.style.top  = e.clientY + 'px';
      });

      country.addEventListener('mouseleave', function () {
        if (!_tooltip) { return; }
        _tooltip.classList.remove('is-visible');
      });

      country.addEventListener('click', function () {
        console.log('[MIT] desktop clicked:', this.dataset.country);
        setActiveCountry(this.dataset.country);
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            _panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        });
      });
    });

    /* Mobil ülke kartları */
    var _mobileCards = document.querySelectorAll('.mobile-country-card[data-country]');
    console.log('[MIT] mobile card count:', _mobileCards.length);

    _mobileCards.forEach(function (card) {
      card.addEventListener('click', function () {
        console.log('[MIT] mobile clicked:', this.dataset.country);
        setActiveCountry(this.dataset.country);
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            _panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        });
      });
    });

    /* Sayfa yüklenince Türkiye default aktif */
    if (document.querySelector('.map-country[data-country="turkiye"]') ||
        document.querySelector('.mobile-country-card[data-country="turkiye"]')) {
      setActiveCountry('turkiye');
    }
  }



})();
