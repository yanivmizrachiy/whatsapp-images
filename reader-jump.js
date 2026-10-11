(() => {
  const book = document.getElementById('book');
  const selector = document.getElementById('page-selector');
  const legacyCounter = document.getElementById('counter');
  if (!book || !selector) return;

  const FADE_MS = 180;
  let pages = [];
  let raf = 0;
  let jumping = false;

  const getPages = () => [...book.querySelectorAll('.page')];
  const clamp = (n) => Math.max(1, Math.min(pages.length || 1, Number(n) || 1));

  const setSelected = (n, syncHash = false) => {
    if (!pages.length) return;
    n = clamp(n);
    const value = String(n);
    if (selector.value !== value) selector.value = value;
    selector.setAttribute('aria-label', `בחירת עמוד — עמוד ${n} מתוך ${pages.length}`);
    if (legacyCounter) legacyCounter.textContent = `${n} / ${pages.length}`;
    if (syncHash) history.replaceState(null, '', `${location.pathname}${location.search}#page=${n}`);
  };

  const pageNearestHeader = () => {
    if (!pages.length) return 1;
    const header = document.querySelector('.reader');
    const top = (header?.getBoundingClientRect().bottom || 0) + 12;
    let best = 0;
    let bestDistance = Infinity;
    pages.forEach((page, i) => {
      const rect = page.getBoundingClientRect();
      const distance = Math.abs(rect.top - top);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    });
    return best + 1;
  };

  const syncFromScroll = () => {
    if (jumping) return;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      setSelected(pageNearestHeader(), true);
    });
  };

  const jumpTo = (n, { syncHash = true } = {}) => {
    if (!pages.length) return;
    n = clamp(n);
    const target = pages[n - 1];
    if (!target) return;

    jumping = true;
    setSelected(n, syncHash);
    book.classList.add('reader-fading');

    window.setTimeout(() => {
      const root = document.documentElement;
      const body = document.body;
      const prevRootBehavior = root.style.scrollBehavior;
      const prevBodyBehavior = body.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      body.style.scrollBehavior = 'auto';
      target.scrollIntoView({ block: 'start', behavior: 'auto' });

      requestAnimationFrame(() => requestAnimationFrame(() => {
        root.style.scrollBehavior = prevRootBehavior;
        body.style.scrollBehavior = prevBodyBehavior;
        book.classList.remove('reader-fading');
        window.setTimeout(() => { jumping = false; syncFromScroll(); }, FADE_MS);
      }));
    }, Math.round(FADE_MS / 2));
  };

  const init = (attempt = 0) => {
    pages = getPages();
    if (!pages.length) {
      if (attempt < 80) window.setTimeout(() => init(attempt + 1), 50);
      return;
    }

    selector.innerHTML = pages.map((_, i) => {
      const n = i + 1;
      return `<option value="${n}">עמוד ${n} מתוך ${pages.length}</option>`;
    }).join('');

    selector.addEventListener('change', () => jumpTo(selector.value));
    window.addEventListener('scroll', syncFromScroll, { passive: true });
    window.addEventListener('resize', syncFromScroll, { passive: true });

    const match = location.hash.match(/page=(\d+)/);
    const initial = match ? clamp(match[1]) : 1;
    setSelected(initial, !match);
    if (match) requestAnimationFrame(() => jumpTo(initial, { syncHash: false }));
    else syncFromScroll();
  };

  init();
})();
