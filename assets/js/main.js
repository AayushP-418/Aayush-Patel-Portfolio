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
      statusEl.style.transition = 'opacity 0.35s ease';
      setInterval(function () {
        statusEl.style.opacity = '0';
        setTimeout(function () {
          si = (si + 1) % statuses.length;
          statusEl.textContent = statuses[si];
          statusEl.style.opacity = '1';
        }, 360);
      }, 3500);
    }

    /* ── Mobile menu ───────────────────────── */
    var menuToggle = document.getElementById('menuToggle');
    var primaryNav  = document.getElementById('primaryNav');
    if (menuToggle && primaryNav) {
      menuToggle.addEventListener('click', function () {
        var open = primaryNav.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(open));
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
      if (sec) sections.push({ el: sec, link: a });
    });

    function updateActive() {
      var scrollY = window.scrollY || window.pageYOffset;
      var active  = sections[0];
      sections.forEach(function (s) {
        if (scrollY + window.innerHeight * 0.32 >= s.el.getBoundingClientRect().top + scrollY)
          active = s;
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
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(function (el) { obs.observe(el); });
    } else {
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
        window.location.href =
          'mailto:apatel3088@gatech.edu' +
          '?subject=' + encodeURIComponent(subject) +
          '&body='    + encodeURIComponent('From: ' + name + '\n\n' + message);
      });
    }

    /* ── Hero canvas particle graph ────────── */
    initHeroCanvas();

  }); // ready

  /* ───────────────────────────────────────────
     Particle / node graph for hero background
  ─────────────────────────────────────────── */
  function initHeroCanvas() {
    var canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    // Skip on mobile or reduced-motion
    if (window.matchMedia('(max-width: 768px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ctx    = canvas.getContext('2d');
    var hero   = canvas.parentElement;
    var nodes  = [];
    var animId = null;
    var mouse  = { x: -9999, y: -9999 };

    /* Size canvas to hero dimensions */
    function resize() {
      canvas.width  = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
      buildNodes();
    }

    function buildNodes() {
      var count = Math.min(50, Math.floor((canvas.width * canvas.height) / 16000));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x:  Math.random() * canvas.width,
          y:  Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.38,
          vy: (Math.random() - 0.5) * 0.38,
          r:  Math.random() * 1.8 + 1.2
        });
      }
    }

    function isDark() {
      return document.documentElement.getAttribute('data-theme') !== 'light';
    }

    var EDGE_DIST = 160;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      var dark      = isDark();
      var nodeRGB   = dark ? '129,140,248' : '99,102,241';   /* indigo */
      var edgeRGB   = dark ? '34,211,238'  : '8,145,178';    /* cyan   */
      var nodeAlpha = dark ? 0.55 : 0.40;
      var edgeMax   = dark ? 0.20 : 0.13;

      /* Edges */
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var dx = nodes[i].x - nodes[j].x;
          var dy = nodes[i].y - nodes[j].y;
          var d  = Math.sqrt(dx * dx + dy * dy);
          if (d < EDGE_DIST) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = 'rgba(' + edgeRGB + ',' + ((1 - d / EDGE_DIST) * edgeMax) + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      /* Nodes */
      for (var k = 0; k < nodes.length; k++) {
        ctx.beginPath();
        ctx.arc(nodes[k].x, nodes[k].y, nodes[k].r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + nodeRGB + ',' + nodeAlpha + ')';
        ctx.fill();
      }
    }

    function update() {
      for (var i = 0; i < nodes.length; i++) {
        var n  = nodes[i];
        var dx = mouse.x - n.x;
        var dy = mouse.y - n.y;
        var d  = Math.sqrt(dx * dx + dy * dy);

        /* Gentle attraction toward cursor */
        if (d < 220 && d > 0) {
          n.vx += (dx / d) * 0.014;
          n.vy += (dy / d) * 0.014;
        }

        n.x += n.vx;
        n.y += n.vy;

        /* Soft wall bounce */
        if (n.x < 0)             { n.x = 0;             n.vx =  Math.abs(n.vx); }
        if (n.x > canvas.width)  { n.x = canvas.width;  n.vx = -Math.abs(n.vx); }
        if (n.y < 0)             { n.y = 0;             n.vy =  Math.abs(n.vy); }
        if (n.y > canvas.height) { n.y = canvas.height; n.vy = -Math.abs(n.vy); }

        /* Speed cap */
        var spd = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (spd > 1.4) { n.vx = (n.vx / spd) * 1.4; n.vy = (n.vy / spd) * 1.4; }
      }
    }

    function loop() {
      if (!document.hidden) { update(); draw(); }
      animId = requestAnimationFrame(loop);
    }

    /* Mouse tracking on hero section (canvas is pointer-events:none) */
    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener('mouseleave', function () {
      mouse.x = -9999; mouse.y = -9999;
    });

    /* Resize via ResizeObserver */
    if (window.ResizeObserver) {
      new ResizeObserver(resize).observe(hero);
    } else {
      window.addEventListener('resize', resize);
    }

    resize();
    loop();

    /* Fade canvas in after first render */
    setTimeout(function () { canvas.classList.add('active'); }, 100);

    /* Pause when tab hidden */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) cancelAnimationFrame(animId);
      else loop();
    });
  }

})();
