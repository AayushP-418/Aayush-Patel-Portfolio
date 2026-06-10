(function () {
  'use strict';

  var ENDPOINT = '/api/chat';
  var MAX_HISTORY = 6;

  var state = {
    open: false,
    messages: [],
    loading: false
  };

  /* ── Build widget DOM ───────────────────── */
  function buildWidget() {
    var btn = document.createElement('button');
    btn.id = 'chat-launcher';
    btn.className = 'chat-launcher';
    btn.setAttribute('aria-label', 'Ask my portfolio');
    btn.innerHTML =
      '<span class="chat-launcher-icon">✦</span>' +
      '<span class="chat-launcher-text">Ask my portfolio</span>';

    var panel = document.createElement('div');
    panel.id = 'chat-panel';
    panel.className = 'chat-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', "Ask Aayush's Portfolio");
    panel.setAttribute('aria-hidden', 'true');
    panel.innerHTML =
      '<div class="chat-header">' +
        '<div class="chat-header-info">' +
          '<div class="chat-avatar">AP</div>' +
          '<div>' +
            '<div class="chat-header-title">Ask Aayush\'s Portfolio</div>' +
            '<div class="chat-header-sub">Powered by Claude</div>' +
          '</div>' +
        '</div>' +
        '<button class="chat-close" id="chat-close" aria-label="Close">&#10005;</button>' +
      '</div>' +
      '<div class="chat-messages" id="chat-messages"></div>' +
      '<div class="chat-input-row">' +
        '<input type="text" class="chat-input" id="chat-input" ' +
          'placeholder="Ask about projects, skills, experience…" ' +
          'autocomplete="off" maxlength="500">' +
        '<button class="chat-send" id="chat-send" aria-label="Send">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
            '<line x1="22" y1="2" x2="11" y2="13"/>' +
            '<polygon points="22 2 15 22 11 13 2 9 22 2"/>' +
          '</svg>' +
        '</button>' +
      '</div>';

    document.body.appendChild(btn);
    document.body.appendChild(panel);
  }

  /* ── Render messages ────────────────────── */
  function renderMessages() {
    var container = document.getElementById('chat-messages');
    if (!container) return;
    container.innerHTML = '';

    if (state.messages.length === 0) {
      var ph = document.createElement('div');
      ph.className = 'chat-placeholder';
      ph.textContent = 'Ask me anything — what projects has Aayush built? What\'s his strongest ML stack?';
      container.appendChild(ph);
    } else {
      state.messages.forEach(function (msg) {
        var bubble = document.createElement('div');
        bubble.className = 'chat-bubble chat-bubble-' + msg.role;
        bubble.textContent = msg.content;
        container.appendChild(bubble);
      });
    }

    if (state.loading) {
      var dots = document.createElement('div');
      dots.className = 'chat-bubble chat-bubble-assistant chat-dots';
      dots.innerHTML = '<span></span><span></span><span></span>';
      container.appendChild(dots);
    }

    container.scrollTop = container.scrollHeight;
  }

  /* ── Send message ───────────────────────── */
  function sendMessage() {
    var input = document.getElementById('chat-input');
    if (!input) return;
    var text = input.value.trim();
    if (!text || state.loading) return;

    input.value = '';
    state.messages.push({ role: 'user', content: text });
    state.loading = true;
    renderMessages();

    var history = state.messages.slice(-MAX_HISTORY - 1, -1);

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history: history })
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        state.loading = false;
        state.messages.push({
          role: 'assistant',
          content: data.reply || 'Something went wrong, try again.'
        });
        renderMessages();
      })
      .catch(function () {
        state.loading = false;
        state.messages.push({
          role: 'assistant',
          content: 'Something went wrong, try again.'
        });
        renderMessages();
      });
  }

  /* ── Open / close panel ─────────────────── */
  function openPanel() {
    state.open = true;
    var panel = document.getElementById('chat-panel');
    var launcher = document.getElementById('chat-launcher');
    if (panel) { panel.classList.add('open'); panel.setAttribute('aria-hidden', 'false'); }
    if (launcher) launcher.classList.add('active');
    renderMessages();
    setTimeout(function () {
      var input = document.getElementById('chat-input');
      if (input) input.focus();
    }, 240);
  }

  function closePanel() {
    state.open = false;
    var panel = document.getElementById('chat-panel');
    var launcher = document.getElementById('chat-launcher');
    if (panel) { panel.classList.remove('open'); panel.setAttribute('aria-hidden', 'true'); }
    if (launcher) launcher.classList.remove('active');
  }

  /* ── Init ───────────────────────────────── */
  function init() {
    buildWidget();

    document.getElementById('chat-launcher').addEventListener('click', function () {
      state.open ? closePanel() : openPanel();
    });
    document.getElementById('chat-close').addEventListener('click', closePanel);
    document.getElementById('chat-send').addEventListener('click', sendMessage);
    document.getElementById('chat-input').addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && state.open) closePanel();
    });
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
