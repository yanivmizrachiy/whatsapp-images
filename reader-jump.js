(() => {
  const book = document.getElementById('book');
  const selector = document.getElementById('page-selector');
  const legacyCounter = document.getElementById('counter');
  if (!book || !selector) return;

  const FADE_MS = 180;
  // SSOT §28.2: the reader shows either the unnumbered cover or a numbered page. COVER is that
  // explicit state; it is never a page number, so choosing any page (page 1 too) from the cover
  // is a real selector change and always navigates.
  const COVER = 'cover';
  const COVER_LABEL = 'שער החוברת';
  let pages = [];
  let raf = 0;
  let jumping = false;

  const getPages = () => [...book.querySelectorAll('.page')];
  // The cover is part of the reader only while it is shown (internal paged QA mode hides it).
  const getCover = () => {
    const cover = book.querySelector('.cover-sheet');
    return cover && !cover.hidden ? cover : null;
  };
  const clamp = (n) => Math.max(1, Math.min(pages.length || 1, Number(n) || 1));
  const pageHash = (n) => `${location.pathname}${location.search}#page=${n}`;

  // The selector always shows the current state: COVER or page n.
  const setState = (state, syncHash = false) => {
    if (!pages.length) return;
    if (state === COVER && selector.querySelector(`option[value="${COVER}"]`)) {
      if (selector.value !== COVER) selector.value = COVER;
      selector.setAttribute('aria-label', `בחירת עמוד — ${COVER_LABEL}`);
      if (syncHash && /page=/.test(location.hash)) history.replaceState(null, '', `${location.pathname}${location.search}`);
      return;
    }
    const n = clamp(state);
    const value = String(n);
    if (selector.value !== value) selector.value = value;
    selector.setAttribute('aria-label', `בחירת עמוד — עמוד ${n} מתוך ${pages.length}`);
    if (legacyCounter) legacyCounter.textContent = `${n} / ${pages.length}`;
    if (syncHash) history.replaceState(null, '', pageHash(n));
  };

  // Current state from the scroll position: the sheet (cover or page) whose top is nearest
  // the line just below the sticky bar.
  const stateFromScroll = () => {
    if (!pages.length) return 1;
    const cover = getCover();
    const sheets = cover ? [cover, ...pages] : pages;
    const header = document.querySelector('.reader');
    const top = (header?.getBoundingClientRect().bottom || 0) + 12;
    let best = 0;
    let bestDistance = Infinity;
    sheets.forEach((sheet, i) => {
      const distance = Math.abs(sheet.getBoundingClientRect().top - top);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    });
    if (cover) return best === 0 ? COVER : best;
    return best + 1;
  };

  const syncFromScroll = () => {
    if (jumping || raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      setState(stateFromScroll(), true);
    });
  };

  const scrollInstant = (target) => {
    const root = document.documentElement;
    const body = document.body;
    const prevRootBehavior = root.style.scrollBehavior;
    const prevBodyBehavior = body.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    body.style.scrollBehavior = 'auto';
    target.scrollIntoView({ block: 'start', behavior: 'auto' });
    root.style.scrollBehavior = prevRootBehavior;
    body.style.scrollBehavior = prevBodyBehavior;
  };

  const targetOf = (state) => (state === COVER ? getCover() : pages[clamp(state) - 1]);

  const jumpTo = (state, { syncHash = true } = {}) => {
    if (!pages.length) return;
    if (state !== COVER) state = clamp(state);
    const target = targetOf(state);
    if (!target) return;

    jumping = true;
    setState(state, syncHash);
    book.classList.add('reader-fading');

    window.setTimeout(() => {
      scrollInstant(target);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        book.classList.remove('reader-fading');
        window.setTimeout(() => { jumping = false; syncFromScroll(); }, FADE_MS);
      }));
    }, Math.round(FADE_MS / 2));
  };

  // Deep links open directly at the requested page without entering a transient faded state.
  // The fade is reserved for an explicit selector change by the user.
  const openDeepLink = () => {
    const match = location.hash.match(/page=(\d+)/);
    if (!match) return false;
    const n = clamp(match[1]);
    setState(n);
    requestAnimationFrame(() => {
      const target = pages[n - 1];
      if (target) scrollInstant(target);
      syncFromScroll();
    });
    return true;
  };

  const init = (attempt = 0) => {
    pages = getPages();
    if (!pages.length) {
      if (attempt < 80) window.setTimeout(() => init(attempt + 1), 50);
      return;
    }

    const coverOption = book.querySelector('.cover-sheet')
      ? `<option value="${COVER}" disabled>${COVER_LABEL}</option>`
      : '';
    selector.innerHTML = coverOption + pages.map((_, i) => {
      const n = i + 1;
      return `<option value="${n}">עמוד ${n} מתוך ${pages.length}</option>`;
    }).join('');

    selector.addEventListener('change', () => jumpTo(selector.value === COVER ? COVER : selector.value));
    window.addEventListener('scroll', syncFromScroll, { passive: true });
    window.addEventListener('resize', syncFromScroll, { passive: true });
    window.addEventListener('hashchange', openDeepLink);

    if (!openDeepLink()) syncFromScroll();
  };

  init();
})();
