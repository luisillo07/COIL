/* Fonda & Carroza Fest. Build-free, progressively enhanced ES6+. */
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Explicit offset prevents the visitor's timezone from changing the event instant.
  // Santiago observes UTC−03:00 on January 18, 2027. The shared countdown uses
  // America/Santiago; that instant is January 17, 22:00 in America/Bogota.
  const FESTIVAL_TIME_ZONE = 'America/Santiago';
  const EVENT_START = Date.parse('2027-01-18T00:00:00-03:00');
  const EVENT_END = Date.parse('2027-01-19T00:00:00-03:00');
  let countdownInterval;
  let eventPhase = '';

  function updateCountdown(now = Date.now()) {
    const remaining = Math.max(0, Math.floor((EVENT_START - now) / 1000));
    const units = {
      days: Math.floor(remaining / 86400),
      hours: Math.floor(remaining / 3600) % 24,
      minutes: Math.floor(remaining / 60) % 60,
      seconds: remaining % 60
    };
    Object.entries(units).forEach(([id, value]) => {
      const element = $(`#${id}`);
      if (element) element.textContent = String(value).padStart(2, '0');
    });
    const phase = now < EVENT_START ? 'upcoming' : now < EVENT_END ? 'today' : 'completed';
    if (phase !== eventPhase) {
      eventPhase = phase;
      const message = phase === 'today'
        ? "It's festival day! Two nations, one celebration."
        : phase === 'completed'
          ? 'The celebration lives on. Keep exploring our cultures.'
          : 'A little closer to the celebration';
      $('#countdown-label').textContent = message;
      $('.countdown').setAttribute('aria-label', phase === 'upcoming'
        ? `Time until January 18, 2027, midnight in ${FESTIVAL_TIME_ZONE}` : message);
      if (phase !== 'upcoming') $('#event-status').textContent = message;
    }
    if (phase === 'completed') window.clearInterval(countdownInterval);
  }
  updateCountdown();
  if (Date.now() < EVENT_END) countdownInterval = window.setInterval(updateCountdown, 1000);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) updateCountdown();
  });

  // The navigation remains ordinary anchor links, including under file://.
  const header = $('.site-header');
  const menuButton = $('.menu-toggle');
  const navigation = $('#primary-nav');
  const desktopQuery = window.matchMedia('(min-width: 701px)');

  function setMenu(open, returnFocus = false) {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    navigation.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    if (returnFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });
  document.addEventListener('keydown', event => {
    if (menuButton.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') setMenu(false, true);
    if (event.key === 'Tab') {
      const links = $$('a', navigation);
      if (!event.shiftKey && document.activeElement === links.at(-1)) {
        event.preventDefault(); menuButton.focus();
      } else if (event.shiftKey && document.activeElement === menuButton) {
        event.preventDefault(); links.at(-1).focus();
      }
    }
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) setMenu(false);
  });
  desktopQuery.addEventListener('change', () => setMenu(false));

  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const target = document.getElementById(link.getAttribute('href').slice(1));
      if (!target) return;
      event.preventDefault();
      const menuWasOpen = menuButton.getAttribute('aria-expanded') === 'true';
      setMenu(false);
      if (target instanceof HTMLDetailsElement) target.open = true;
      target.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
      // Native hash links move the focus context; preserve that behavior.
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      try { history.pushState(null, '', link.getAttribute('href')); } catch { /* file URL restrictions */ }
      if (menuWasOpen) document.body.classList.remove('menu-open');
    });
  });

  const trackedSections = ['origins', 'fusion', 'eco-practice', 'eco-tourism'].map(id => document.getElementById(id));
  let scrollScheduled = false;
  function updateScrollState() {
    header.classList.toggle('is-scrolled', window.scrollY > 15);
    let current = '';
    trackedSections.forEach(section => {
      if (section.getBoundingClientRect().top <= window.innerHeight * 0.38) current = section.id;
    });
    $$('.primary-nav a:not(.nav-cta)').forEach(link => {
      if (link.hash === `#${current}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scrollScheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollScheduled) { scrollScheduled = true; requestAnimationFrame(updateScrollState); }
  }, { passive: true });
  window.addEventListener('resize', updateScrollState, { passive: true });
  updateScrollState();

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('is-pending');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px 35px 0px' });
    $$('.reveal').forEach(element => { element.classList.add('is-pending'); observer.observe(element); });
    document.documentElement.classList.add('js-ready');
  }

  $$('.discover-button').forEach(button => {
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open));
      document.getElementById(button.getAttribute('aria-controls')).hidden = !open;
      button.firstChild.textContent = open ? 'Discover Less ' : 'Discover More ';
    });
  });

  const tabs = $$('[role="tab"]');
  function activateTab(selected, moveFocus = false) {
    tabs.forEach(tab => {
      const active = tab === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
    });
    if (moveFocus) selected.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); activateTab(tabs[next], true); }
    });
  });

  // Use verified Commons filenames. CSS artwork is visible while photos load.
  const photoPaths = {
    'Carroza de carnaval de Pasto 6 de enero 01.jpg': 'c/c4',
    "Fiestas Patrias O'Higgins Park 2018.jpg": '7/74',
    'Laguna de la Cocha.JPG': '0/03',
    'Cajon del Maipo - Flickr - Casper Abrilot.jpg': '4/48',
    'Volantines en los Dominicos.jpg': '7/73'
  };
  $$('img[data-fallback]').forEach(img => {
    function fallback() {
      if (img.classList.contains('is-fallback')) return;
      img.classList.add('is-fallback');
      img.removeAttribute('srcset');
      img.src = img.dataset.fallback;
      img.alt = img.dataset.fallback.includes('landscape')
        ? 'Concept illustration of Andean mountains and a highland lake'
        : 'Concept illustration of a colorful carnival mask with Andean patterns';
      const figure = img.closest('figure');
      if (figure) {
        const caption = $('figcaption', figure);
        if (caption) caption.textContent = img.dataset.fallback.includes('landscape')
          ? 'The Andes, imagined · Concept illustration'
          : 'A celebration of imagination · Concept illustration';
      }
    }
    img.addEventListener('error', fallback);
    const filename = encodeURIComponent(img.dataset.commons.replaceAll(' ', '_')).replaceAll("'", '%27');
    const base = `https://upload.wikimedia.org/wikipedia/commons/thumb/${photoPaths[img.dataset.commons]}/${filename}/`;
    img.src = `${base}960px-${filename}`;
    img.srcset = `${base}640px-${filename} 640w, ${base}960px-${filename} 960w`;
    img.sizes = img.closest('.hero-photo') ? '(max-width: 700px) 90vw, 45vw'
      : img.closest('.craft-image') ? '(max-width: 700px) 85vw, 210px' : '(max-width: 700px) 90vw, 45vw';
    if (img.complete && img.naturalWidth === 0) fallback();
  });

  // Self-contained QR Model 2 encoder: byte mode, error correction L, versions
  // 1–10, Reed–Solomon blocks, mask 0, and a four-module white quiet zone.
  // No external QR API receives the page URL; no dependency or key is needed.
  function createQrSvg(value) {
    const configurations = [null, [[1,26,19]], [[1,44,34]], [[1,70,55]], [[1,100,80]],
      [[1,134,108]], [[2,86,68]], [[2,98,78]], [[2,121,97]], [[2,146,116]], [[2,86,68],[2,87,69]]];
    const alignment = [[],[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50]];
    // URL.href is ASCII percent encoded, so byte mode needs no ECI indicator.
    const bytes = [...value].map(char => char.charCodeAt(0));
    let version = 1;
    const capacity = v => configurations[v].reduce((sum, [count,,data]) => sum + count * data, 0);
    while (version <= 10 && 4 + (version < 10 ? 8 : 16) + bytes.length * 8 > capacity(version) * 8) version++;
    if (version > 10) throw new Error('This address is too long for the built-in QR encoder.');
    const bits = [];
    const append = (number, length) => { for (let i = length - 1; i >= 0; i--) bits.push((number >>> i) & 1); };
    append(4, 4); append(bytes.length, version < 10 ? 8 : 16);
    bytes.forEach(byte => append(byte, 8));
    const maxBits = capacity(version) * 8;
    append(0, Math.min(4, maxBits - bits.length));
    while (bits.length % 8) bits.push(0);
    const data = [];
    for (let i = 0; i < bits.length; i += 8) data.push(bits.slice(i, i + 8).reduce((n,b) => n * 2 + b, 0));
    for (let pad = 0; data.length < capacity(version); pad++) data.push(pad % 2 ? 0x11 : 0xec);

    function multiply(a, b) {
      let result = 0;
      while (b) { if (b & 1) result ^= a; a <<= 1; if (a & 0x100) a ^= 0x11d; b >>>= 1; }
      return result;
    }
    function errorCorrection(block, degree) {
      let generator = [1], root = 1;
      for (let i = 0; i < degree; i++) {
        const next = Array(generator.length + 1).fill(0);
        generator.forEach((coefficient, j) => { next[j] ^= coefficient; next[j + 1] ^= multiply(coefficient, root); });
        generator = next; root = multiply(root, 2);
      }
      const remainder = Array(degree).fill(0);
      block.forEach(byte => {
        const factor = byte ^ remainder.shift(); remainder.push(0);
        for (let j = 0; j < degree; j++) remainder[j] ^= multiply(generator[j + 1], factor);
      });
      return remainder;
    }
    const blocks = [], corrections = [];
    let offset = 0;
    configurations[version].forEach(([count, total, length]) => {
      for (let i = 0; i < count; i++) {
        const block = data.slice(offset, offset + length); offset += length;
        blocks.push(block); corrections.push(errorCorrection(block, total - length));
      }
    });
    const codewords = [];
    [blocks, corrections].forEach(group => {
      const longest = Math.max(...group.map(block => block.length));
      for (let i = 0; i < longest; i++) group.forEach(block => { if (i < block.length) codewords.push(block[i]); });
    });
    const size = version * 4 + 17;
    const matrix = Array.from({ length: size }, () => Array(size).fill(false));
    const reserved = Array.from({ length: size }, () => Array(size).fill(false));
    function set(x, y, dark) {
      if (x >= 0 && x < size && y >= 0 && y < size) { matrix[y][x] = Boolean(dark); reserved[y][x] = true; }
    }
    for (let i = 0; i < size; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
    [[3,3],[size - 4,3],[3,size - 4]].forEach(([cx,cy]) => {
      for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
        const distance = Math.max(Math.abs(dx), Math.abs(dy));
        set(cx + dx, cy + dy, distance !== 2 && distance !== 4);
      }
    });
    const centers = alignment[version];
    centers.forEach((x, i) => centers.forEach((y, j) => {
      const last = centers.length - 1;
      if ((i === 0 && j === 0) || (i === 0 && j === last) || (i === last && j === 0)) return;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }));
    // Format information: L = 01, mask = 000; BCH(15,5), XOR 0x5412.
    let remainder = 8;
    for (let i = 0; i < 10; i++) remainder = (remainder << 1) ^ ((remainder >>> 9) * 0x537);
    const format = ((8 << 10) | remainder) ^ 0x5412;
    const formatBit = i => (format >>> i) & 1;
    for (let i = 0; i <= 5; i++) set(8, i, formatBit(i));
    set(8, 7, formatBit(6)); set(8, 8, formatBit(7)); set(7, 8, formatBit(8));
    for (let i = 9; i < 15; i++) set(14 - i, 8, formatBit(i));
    for (let i = 0; i < 8; i++) set(size - 1 - i, 8, formatBit(i));
    for (let i = 8; i < 15; i++) set(8, size - 15 + i, formatBit(i));
    set(8, size - 8, true);
    if (version >= 7) {
      let rem = version;
      for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
      const information = (version << 12) | rem;
      for (let i = 0; i < 18; i++) {
        const a = size - 11 + i % 3, b = Math.floor(i / 3), bit = (information >>> i) & 1;
        set(a, b, bit); set(b, a, bit);
      }
    }
    let bitIndex = 0;
    for (let right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let vertical = 0; vertical < size; vertical++) {
        const y = ((right + 1) & 2) === 0 ? size - 1 - vertical : vertical;
        for (let j = 0; j < 2; j++) {
          const x = right - j;
          if (reserved[y][x]) continue;
          const bit = bitIndex < codewords.length * 8 ? (codewords[bitIndex >>> 3] >>> (7 - (bitIndex & 7))) & 1 : 0;
          matrix[y][x] = Boolean(bit ^ ((x + y) % 2 === 0 ? 1 : 0));
          bitIndex++;
        }
      }
    }
    let path = '';
    matrix.forEach((row,y) => row.forEach((dark,x) => { if (dark) path += `M${x+4},${y+4}h1v1h-1z`; }));
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${size + 8} ${size + 8}`);
    svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', 'Scannable QR code linking to this festival');
    svg.setAttribute('shape-rendering', 'crispEdges');
    svg.innerHTML = `<rect width="100%" height="100%" fill="white"/><path d="${path}" fill="#000"/>`;
    return svg;
  }

  function publicPageUrl() {
    const url = new URL(window.location.href);
    if (!['https:', 'http:'].includes(url.protocol)) return null;
    if (['localhost', '127.0.0.1', '[::1]', '0.0.0.0'].includes(url.hostname)) return null;
    url.hash = ''; url.search = '';
    return url.href;
  }
  const shareUrl = publicPageUrl();
  if (shareUrl) {
    try { $('#qr-code').append(createQrSvg(shareUrl)); }
    catch {
      $('#qr-code').textContent = 'Use the share button';
      $('#qr-note').textContent = 'This address exceeds the QR size limit. The share button still works.';
    }
    const ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url'); ogUrl.content = shareUrl; document.head.append(ogUrl);
  } else {
    $('#qr-code').textContent = 'Your QR appears when this site is deployed.';
    $('#qr-note').textContent = 'Publish to an HTTPS address to share a link that others can open.';
  }

  async function copyFestivalLink(url) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(url);
      $('#share-status').textContent = 'Festival link copied. Pass the joy along!';
    } catch {
      $('#manual-share').hidden = false;
      $('#share-url').value = url; $('#share-url').focus(); $('#share-url').select();
      $('#share-status').textContent = 'Select and copy the link below to share it.';
    }
  }
  $('#share-button').addEventListener('click', async () => {
    if (!shareUrl) {
      $('#share-status').textContent = 'Publish this site first to share a public festival link.';
      return;
    }
    const data = { title: 'Fonda & Carroza Fest', text: 'Two nations. One unforgettable celebration. January 18, 2027.', url: shareUrl };
    if (navigator.share) {
      try { await navigator.share(data); $('#share-status').textContent = 'Thanks for sharing the celebration!'; return; }
      catch (error) { if (error.name === 'AbortError') return; }
    }
    await copyFestivalLink(shareUrl);
  });
  $('#copyright-year').textContent = new Date().getFullYear();

  // Keep core functionality independent from the optional icon CDN.
  if (window.lucide?.createIcons) window.lucide.createIcons();
})();
