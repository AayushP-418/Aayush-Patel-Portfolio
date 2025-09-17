// Mobile navigation toggle and small UX helpers
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') { fn(); } else { document.addEventListener('DOMContentLoaded', fn); }
  }

  ready(function () {
    // Footer year
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Theme toggle functionality
    var themeToggle = document.getElementById('themeToggle');
    var themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;
    
    if (themeToggle && themeIcon) {
      // Get saved theme or default to dark
      var currentTheme = localStorage.getItem('theme') || 'dark';
      document.documentElement.setAttribute('data-theme', currentTheme);
      
      // Update icon based on current theme
      updateThemeIcon(currentTheme);
      
      // Theme toggle click handler
      themeToggle.addEventListener('click', function() {
        var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        currentTheme = newTheme;
      });
      
      function updateThemeIcon(theme) {
        if (themeIcon) {
          themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
        }
      }
    }

    // Typing animation for title using Typed.js
    var titleEl = document.getElementById('typing-title');
    if (titleEl) {
      // Start typing animation after a short delay
      setTimeout(function() {
        var typed = new Typed('#typing-title', {
          strings: ["Hi, I'm Aayush Patel."],
          typeSpeed: 100,
          showCursor: false,
          autoInsertCss: true
        });
      }, 500);
    }

    // Mobile menu toggle
    var toggle = document.getElementById('menuToggle');
    var nav = document.getElementById('primaryNav');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        var isOpen = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });

      // Close on link click (mobile)
      nav.addEventListener('click', function (e) {
        var target = e.target;
        if (target && target.tagName === 'A' && nav.classList.contains('open')) {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });
})();


