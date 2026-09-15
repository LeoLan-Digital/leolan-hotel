/* Shared NOVA site header behavior — published 15 September 2026. */
(() => {
  const header = document.querySelector('[data-nova-site-header]');
  const menu = document.getElementById('mobileMenu');
  const button = header?.querySelector('.nova-site-header__menu-button');
  const languages = header?.querySelector('.nova-site-header__languages');

  const languageScrollKey = 'nova-language-scroll-v1';
  const languageLinkSelector = '.nova-site-header__languages a, .nova-site-footer__languages a';
  const sharedSectionIds = new Set(['nova-universe', 'product', 'workflow', 'features', 'difference', 'pricing', 'nova-world', 'faq', 'contact']);
  const maxScroll = () => Math.max(
    document.documentElement.scrollHeight,
    document.body?.scrollHeight || 0,
  ) - innerHeight;
  const visibleAnchor = element => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && (rect.width > 0 || rect.height > 0);
  };
  const currentAnchor = () => {
    const reference = scrollY + (header?.offsetHeight || 0) + 16;
    const anchors = Array.from(sharedSectionIds, id => document.getElementById(id))
      .filter(Boolean)
      .filter(visibleAnchor)
      .map(element => ({element, top: scrollY + element.getBoundingClientRect().top}))
      .filter(item => item.top <= reference)
      .sort((a, b) => b.top - a.top);
    const match = anchors[0];
    return match ? {id: match.element.id, offset: scrollY - match.top} : {id: '', offset: 0};
  };
  const rememberLanguageScroll = event => {
    const target = event.target instanceof Element ? event.target.closest(languageLinkSelector) : null;
    if (!target) return;
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (target.getAttribute('aria-current')) {
      event.preventDefault();
      return;
    }
    const destination = new URL(target.href, location.href);
    if (destination.origin !== location.origin) return;
    const limit = Math.max(0, maxScroll());
    const anchor = currentAnchor();
    const fromFooter = Boolean(target.closest('.nova-site-footer__languages'));
    const state = {
      targetPath: destination.pathname,
      createdAt: Date.now(),
      mode: fromFooter ? 'bottom' : 'position',
      y: scrollY,
      ratio: limit > 0 ? scrollY / limit : 0,
      bottomOffset: Math.max(0, limit - scrollY),
      controlTop: target.getBoundingClientRect().top,
      anchorId: anchor.id,
      anchorOffset: anchor.offset,
    };
    try {
      sessionStorage.setItem(languageScrollKey, JSON.stringify(state));
    } catch (_error) {
      // The language link still works when browser storage is unavailable.
    }
  };
  document.addEventListener('click', rememberLanguageScroll, true);

  const takeLanguageScroll = () => {
    try {
      const value = sessionStorage.getItem(languageScrollKey);
      sessionStorage.removeItem(languageScrollKey);
      return value ? JSON.parse(value) : null;
    } catch (_error) {
      return null;
    }
  };
  const savedScroll = takeLanguageScroll();
  if (savedScroll && savedScroll.targetPath === location.pathname && Date.now() - savedScroll.createdAt < 30000) {
    let cancelled = false;
    const restore = () => {
      if (cancelled) return;
      const limit = Math.max(0, maxScroll());
      let destination = Number(savedScroll.y) || 0;
      if (savedScroll.mode === 'bottom') {
        const activeLanguage = document.querySelector('.nova-site-footer__languages a[aria-current]');
        destination = activeLanguage && visibleAnchor(activeLanguage)
          ? scrollY + activeLanguage.getBoundingClientRect().top - (Number(savedScroll.controlTop) || 0)
          : limit - (Number(savedScroll.bottomOffset) || 0);
      } else if (savedScroll.anchorId) {
        const anchor = document.getElementById(savedScroll.anchorId);
        if (anchor && visibleAnchor(anchor)) {
          destination = scrollY + anchor.getBoundingClientRect().top + (Number(savedScroll.anchorOffset) || 0);
        } else if (Number.isFinite(Number(savedScroll.ratio))) {
          destination = limit * Number(savedScroll.ratio);
        }
      } else if (Number.isFinite(Number(savedScroll.ratio))) {
        destination = limit * Number(savedScroll.ratio);
      }
      const root = document.documentElement;
      const previousBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      scrollTo(0, Math.max(0, Math.min(limit, destination)));
      root.style.scrollBehavior = previousBehavior;
    };
    const scheduleRestore = () => requestAnimationFrame(() => requestAnimationFrame(restore));
    const cancelRestore = () => {
      cancelled = true;
    };
    scheduleRestore();
    addEventListener('load', scheduleRestore, {once: true});
    document.fonts?.ready.then(scheduleRestore);
    const timers = [150, 400, 900].map(delay => setTimeout(restore, delay));
    const interactionTypes = ['wheel', 'touchstart', 'pointerdown', 'keydown'];
    interactionTypes.forEach(type => addEventListener(type, cancelRestore, {once: true, passive: type !== 'keydown'}));
    setTimeout(() => {
      cancelled = true;
      timers.forEach(clearTimeout);
      interactionTypes.forEach(type => removeEventListener(type, cancelRestore));
    }, 1200);
  }

  if (!header || !menu || !button) return;

  const closeMenu = (restoreFocus = false) => {
    menu.hidden = true;
    menu.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', button.dataset.openLabel || 'Open menu');
    document.body.classList.remove('nova-site-menu-open');
    if (restoreFocus) button.focus();
  };
  const openMenu = () => {
    menu.hidden = false;
    menu.classList.add('open');
    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-label', button.dataset.closeLabel || 'Close menu');
    document.body.classList.add('nova-site-menu-open');
    if (languages) languages.open = false;
    menu.querySelector('a')?.focus();
  };

  button.addEventListener('click', () => {
    if (menu.hidden) openMenu(); else closeMenu();
  });
  menu.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('click', event => {
    if (!menu.hidden && !menu.contains(event.target) && !button.contains(event.target)) closeMenu();
    if (languages?.open && !languages.contains(event.target)) languages.open = false;
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (!menu.hidden) closeMenu(true);
    if (languages?.open) {
      languages.open = false;
      languages.querySelector('summary')?.focus();
    }
  }, true);
  const desktopQuery = matchMedia('(min-width: 1001px)');
  const handleDesktop = event => {
    if (event.matches) closeMenu();
  };
  if (desktopQuery.addEventListener) desktopQuery.addEventListener('change', handleDesktop);
  else desktopQuery.addListener(handleDesktop);
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  addEventListener('scroll', onScroll, {passive: true});
  onScroll();
})();
