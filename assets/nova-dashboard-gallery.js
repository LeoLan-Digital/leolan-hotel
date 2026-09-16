(() => {
  document.querySelectorAll('[data-dashboard-gallery]').forEach(gallery => {
    const tabs = [...gallery.querySelectorAll('[role="tab"][data-product]')];
    const previous = gallery.querySelector('[data-gallery-prev]');
    const next = gallery.querySelector('[data-gallery-next]');
    const progress = gallery.querySelector('.dashboard-gallery-progress');
    if (!tabs.length || !previous || !next || !progress) return;

    const screenLabel = gallery.dataset.galleryScreen || 'Screen';
    const update = () => {
      const index = Math.max(0, tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true'));
      const current = tabs[index];
      progress.innerHTML = `<span>${index + 1} / ${tabs.length}</span><strong>${current.textContent.trim()}</strong>`;
      current.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest', inline: 'center'});
      gallery.setAttribute('aria-label', `${screenLabel} ${index + 1} / ${tabs.length}: ${current.textContent.trim()}`);
    };
    const move = amount => {
      const index = Math.max(0, tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true'));
      tabs[(index + amount + tabs.length) % tabs.length].click();
      update();
    };
    previous.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    tabs.forEach(tab => tab.addEventListener('click', () => requestAnimationFrame(update)));
    new MutationObserver(update).observe(gallery, {subtree:true, attributes:true, attributeFilter:['aria-selected']});
    update();
  });
})();
