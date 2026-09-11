/* Progressive enhancement: core content and contact links work without JS. */
(() => {
  const header = document.querySelector('header');
  const menu = document.getElementById('mobileMenu');
  const hamburger = document.querySelector('.hamburger');
  window.closeMenu = () => {
    menu.hidden = true;
    menu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  };
  window.toggleMenu = () => {
    const opening = menu.hidden;
    menu.hidden = !opening;
    menu.classList.toggle('open', opening);
    hamburger.setAttribute('aria-expanded', String(opening));
  };
  document.addEventListener('click', e => {
    if (!menu.hidden && !menu.contains(e.target) && !hamburger.contains(e.target)) closeMenu();
    document.querySelectorAll('.language-menu[open]').forEach(el => {if (!el.contains(e.target)) el.open = false;});
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (!menu.hidden) {closeMenu(); hamburger.focus();}
      document.querySelectorAll('.language-menu[open]').forEach(el => {el.open=false;el.querySelector('summary').focus();});
    }
  });
  window.toggleFaq = btn => {
    const expanded = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(expanded));
    btn.parentElement.classList.toggle('open', expanded);
  };
  const tabs = [...document.querySelectorAll('[role="tab"][data-product]')];
  function selectProduct(name, focus = false) {
    if (!tabs.some(tab => tab.dataset.product === name)) return;
    tabs.forEach(tab => {
      const selected = tab.dataset.product === name;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !selected;
      if (selected && focus) tab.focus();
    });
  }
  tabs.forEach((tab,index) => {
    tab.addEventListener('click', () => selectProduct(tab.dataset.product));
    tab.addEventListener('keydown', e => {
      let next;
      if (e.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (e.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = tabs.length - 1;
      if (next !== undefined) {e.preventDefault();selectProduct(tabs[next].dataset.product,true);}
    });
  });
  document.querySelectorAll('[data-show-product]').forEach(link => link.addEventListener('click', () => selectProduct(link.dataset.showProduct)));
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  addEventListener('scroll', onScroll, {passive:true});onScroll();
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const reveals = [...document.querySelectorAll('.reveal')];
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {entry.target.classList.add('visible');observer.unobserve(entry.target);}
    }), {threshold:0.06,rootMargin:'0px 0px 30px 0px'});
    document.body.classList.add('motion-ready');
    reveals.forEach(el => observer.observe(el));
    document.querySelectorAll('.nova-hero .reveal').forEach(el => el.classList.add('visible'));
  }
})();
