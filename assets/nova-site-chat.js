/* Shared NOVA demo chat behavior — published 15 September 2026. */
(() => {
  const root = document.querySelector('[data-nova-site-chat]');
  const toggle = document.querySelector('[data-nova-site-chat-toggle]');
  const dialog = document.getElementById('novaSiteChatDialog');
  const close = document.getElementById('novaSiteChatClose');
  const messages = document.getElementById('novaSiteChatMessages');
  const form = document.getElementById('novaSiteChatForm');
  const input = document.getElementById('novaSiteChatInput');
  const send = document.getElementById('novaSiteChatSend');
  if (!root || !toggle || !dialog || !close || !messages || !form || !input || !send) return;

  const endpoint = 'https://n8n.leolan.net/webhook/hotel-chat';
  const packageTerms = ['package', 'packages', 'paket', 'modul', 'module', 'pro', 'book', 'booking', 'buchen', 'onboarding', 'пакет', 'бронир', 'reservasi', 'แพ็กเกจ', 'จอง', 'პაკეტ', 'დაჯავშ'];
  let history = [];
  let greeted = false;
  let busy = false;
  let previousFocus = null;

  const heroControl = document.querySelector('.hero-media-control');
  const footerLanguages = document.querySelector('.nova-site-footer__languages');
  const collisionTargets = [heroControl, footerLanguages].filter(Boolean);
  const positionToggle = () => {
    const width = toggle.offsetWidth;
    const height = toggle.offsetHeight;
    const edge = innerWidth <= 600 ? 16 : 20;
    const gap = 12;
    const candidate = {
      left: innerWidth - edge - width,
      right: innerWidth - edge,
      top: innerHeight - edge - height,
      bottom: innerHeight - edge,
    };
    toggle.style.removeProperty('--nova-site-chat-right');
    toggle.style.removeProperty('--nova-site-chat-bottom');
    const collisions = collisionTargets
      .map(target => target.getBoundingClientRect())
      .filter(control => {
        const visible = control.bottom > 0 && control.top < innerHeight && control.right > 0 && control.left < innerWidth;
        return visible && candidate.left < control.right + gap && candidate.right > control.left - gap && candidate.top < control.bottom + gap && candidate.bottom > control.top - gap;
      });
    if (!collisions.length) return;
    const firstTop = Math.min(...collisions.map(control => control.top));
    toggle.style.setProperty('--nova-site-chat-bottom', `${Math.ceil(innerHeight - firstTop + gap)}px`);
  };
  if (collisionTargets.length) {
    let positioningFrame = 0;
    const schedulePosition = () => {
      cancelAnimationFrame(positioningFrame);
      positioningFrame = requestAnimationFrame(positionToggle);
    };
    addEventListener('resize', schedulePosition);
    addEventListener('scroll', schedulePosition, {passive: true});
    window.visualViewport?.addEventListener('resize', schedulePosition);
    window.visualViewport?.addEventListener('scroll', schedulePosition, {passive: true});
    addEventListener('load', schedulePosition, {once: true});
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(schedulePosition);
      collisionTargets.forEach(target => observer.observe(target));
    }
    if (heroControl) new MutationObserver(schedulePosition).observe(heroControl, {attributes: true, childList: true, characterData: true, subtree: true});
    document.fonts?.ready.then(schedulePosition);
    schedulePosition();
  }

  const isOpen = () => !root.hidden;
  const focusable = () => Array.from(dialog.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])'));
  const timestamp = () => {
    try {
      return new Intl.DateTimeFormat(root.dataset.chatLang || 'en', {hour: '2-digit', minute: '2-digit'}).format(new Date());
    } catch (_error) {
      return new Intl.DateTimeFormat('en', {hour: '2-digit', minute: '2-digit'}).format(new Date());
    }
  };
  const scrollMessages = () => {
    messages.scrollTop = messages.scrollHeight;
  };
  const shouldShowPackages = value => {
    const normalized = value.toLocaleLowerCase();
    return packageTerms.some(term => normalized.includes(term));
  };
  const appendMessage = (value, sender, allowPackageLink = true) => {
    const message = document.createElement('div');
    message.className = `nova-site-chat__message${sender === 'user' ? ' nova-site-chat__message--user' : ''}`;
    const text = document.createElement('span');
    text.textContent = value;
    message.append(text);
    if (sender === 'bot' && allowPackageLink && shouldShowPackages(value)) {
      const link = document.createElement('a');
      link.className = 'nova-site-chat__package-link';
      link.href = root.dataset.packageHref || '/#pricing';
      link.textContent = `📦 ${root.dataset.packageLabel || 'View packages'}`;
      message.append(link);
    }
    const time = document.createElement('time');
    time.dateTime = new Date().toISOString();
    time.textContent = timestamp();
    message.append(time);
    messages.append(message);
    scrollMessages();
  };
  const showTyping = () => {
    const typing = document.createElement('div');
    typing.className = 'nova-site-chat__message nova-site-chat__typing';
    typing.id = 'novaSiteChatTyping';
    typing.setAttribute('role', 'status');
    typing.setAttribute('aria-label', root.dataset.typingLabel || 'NOVA is typing…');
    typing.textContent = '•••';
    messages.append(typing);
    scrollMessages();
  };
  const hideTyping = () => document.getElementById('novaSiteChatTyping')?.remove();
  const setBusy = value => {
    busy = value;
    form.setAttribute('aria-busy', String(value));
    input.readOnly = value;
    input.setAttribute('aria-disabled', String(value));
    send.disabled = value;
  };
  const requestReply = async message => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'omit',
        cache: 'no-store',
        body: JSON.stringify({message, moduleKey: 'hotel-demo', history, lang: root.dataset.chatLang || 'en'}),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Chat request failed: ${response.status}`);
      const data = await response.json();
      const rawReply = data && (data.reply ?? data.message);
      const reply = typeof rawReply === 'string' && rawReply.trim() ? rawReply.slice(0, 12000) : (root.dataset.defaultReply || 'I’m here to help! 🏨');
      history.push({role: 'user', content: message}, {role: 'assistant', content: reply});
      if (history.length > 16) history = history.slice(-16);
      return {reply, failed: false};
    } catch (_error) {
      return {reply: root.dataset.errorReply || 'Please contact our team.', failed: true};
    } finally {
      window.clearTimeout(timeout);
    }
  };
  const fetchAndAppend = async message => {
    if (busy) return;
    setBusy(true);
    showTyping();
    const result = await requestReply(message);
    hideTyping();
    appendMessage(result.reply, 'bot', !result.failed);
    setBusy(false);
    if (isOpen()) input.focus();
  };
  const openChat = () => {
    if (isOpen()) return;
    previousFocus = document.activeElement;
    root.hidden = false;
    root.setAttribute('aria-hidden', 'false');
    toggle.hidden = true;
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nova-site-chat-open');
    input.focus();
    if (!greeted) {
      greeted = true;
      const greeting = root.dataset.defaultReply || 'I’m here to help! 🏨';
      appendMessage(greeting, 'bot', false);
      history.push({role: 'assistant', content: greeting});
    }
  };
  const closeChat = () => {
    if (!isOpen()) return;
    toggle.hidden = false;
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nova-site-chat-open');
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
    else toggle.focus();
    root.hidden = true;
    root.setAttribute('aria-hidden', 'true');
  };

  toggle.addEventListener('click', openChat);
  close.addEventListener('click', closeChat);
  root.addEventListener('click', event => {
    if (event.target === root) closeChat();
  });
  document.addEventListener('keydown', event => {
    if (!isOpen()) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeChat();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = focusable();
    if (!items.length) {
      event.preventDefault();
      dialog.focus();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    if (!dialog.contains(document.activeElement) || !items.includes(document.activeElement)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
      return;
    }
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value || busy) return;
    appendMessage(value, 'user', false);
    input.value = '';
    fetchAndAppend(value);
  });
})();
