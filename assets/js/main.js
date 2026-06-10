(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {

    /* ── Footer year ───────────────────────── */
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ── Theme toggle ──────────────────────── */
    var themeToggle = document.getElementById('themeToggle');
    var themeIcon   = themeToggle && themeToggle.querySelector('.theme-icon');
    var currentTheme = localStorage.getItem('theme') || 'dark';

    function applyTheme(t) {
      document.documentElement.setAttribute('data-theme', t);
      if (themeIcon) themeIcon.textContent = t === 'dark' ? '🌙' : '☀️';
    }
    applyTheme(currentTheme);

    if (themeToggle) {
      themeToggle.addEventListener('click', function () {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
      });
    }

    /* ── Typed.js hero title ───────────────── */
    var titleEl = document.getElementById('typing-title');
    if (titleEl && typeof Typed !== 'undefined') {
      setTimeout(function () {
        new Typed('#typing-title', {
          strings: ["Hi, I'm Aayush Patel."],
          typeSpeed: 65,
          showCursor: true,
          cursorChar: '|',
          autoInsertCss: true
        });
      }, 300);
    }

    /* ── Status bar rotation ───────────────── */
    var statuses = [
      'Directing 11 AI/ML teams at Georgia Tech',
      'Teaching 200+ students CS 2340: Objects & Design',
      'Building production RAG systems with pgvector + Claude API',
      'Researching evolutionary AutoML at the EMADE Lab'
    ];
    var statusEl = document.getElementById('status-text');
    if (statusEl) {
      var si = 0;
      statusEl.textContent = statuses[0];
      setInterval(function () {
        statusEl.style.opacity = '0';
        setTimeout(function () {
          si = (si + 1) % statuses.length;
          statusEl.textContent = statuses[si];
          statusEl.style.opacity = '1';
        }, 350);
      }, 3500);
      statusEl.style.transition = 'opacity 0.35s ease';
    }

    /* ── Mobile menu toggle ────────────────── */
    var menuToggle = document.getElementById('menuToggle');
    var primaryNav  = document.getElementById('primaryNav');
    if (menuToggle && primaryNav) {
      menuToggle.addEventListener('click', function () {
        var isOpen = primaryNav.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
      });
      primaryNav.addEventListener('click', function (e) {
        if (e.target && e.target.tagName === 'A') {
          primaryNav.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    /* ── Scrollspy ─────────────────────────── */
    var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    var sections = [];
    navLinks.forEach(function (a) {
      var id  = a.getAttribute('href').replace('#', '');
      var sec = document.getElementById(id);
      if (sec) sections.push({ id: id, el: sec, link: a });
    });

    function updateActive() {
      var scrollY = window.scrollY || window.pageYOffset;
      var winH    = window.innerHeight;
      var active  = sections[0];

      sections.forEach(function (s) {
        var top = s.el.getBoundingClientRect().top + scrollY;
        if (scrollY + winH * 0.35 >= top) active = s;
      });

      sections.forEach(function (s) {
        s.link.classList.toggle('active', s === active);
      });
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();

    /* ── Scroll reveal ─────────────────────── */
    var revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
      var revealObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      revealEls.forEach(function (el) { revealObs.observe(el); });
    } else {
      /* Fallback for old browsers */
      revealEls.forEach(function (el) { el.classList.add('revealed'); });
    }

    /* ── Contact form ──────────────────────── */
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var name    = document.getElementById('c-name').value.trim();
        var subject = document.getElementById('c-subject').value.trim();
        var message = document.getElementById('c-message').value.trim();
        var body    = encodeURIComponent('From: ' + name + '\n\n' + message);
        window.location.href =
          'mailto:apatel3088@gatech.edu' +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + body;
      });
    }

  });
})();
