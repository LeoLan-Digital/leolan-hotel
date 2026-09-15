/* Shared NOVA site header behavior — published 15 September 2026. */
(() => {
  const header = document.querySelector('[data-nova-site-header]');
  const menu = document.getElementById('mobileMenu');
  const button = header?.querySelector('.nova-site-header__menu-button');
  const languages = header?.querySelector('.nova-site-header__languages');
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
