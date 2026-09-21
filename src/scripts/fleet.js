// Carrusel giratorio de la flota: las tarjetas forman un anillo 3D que rota sobre su eje.

import { whatsappHref } from './concierge.js';

const AUTOPLAY_MS = 5500;
const DRAG_DEG_PER_PX = 0.28;

export function setupFleet({ reduceMotion = false } = {}) {
  const stage = document.querySelector('.fleet-stage');
  const detail = document.querySelector('.fleet-detail');
  if (!stage || !detail) return;

  const ring = stage.querySelector('.fleet-ring');
  const cards = [...ring.querySelectorAll('.fleet-card')];
  const n = cards.length;
  const step = 360 / n;

  const info = detail.querySelector('.fleet-info');
  const progress = detail.querySelector('.fleet-progress');
  const field = (name) => detail.querySelector(`[data-f="${name}"]`);
  const pad = (v) => String(v).padStart(2, '0');

  field('total').textContent = pad(n);
  progress.style.setProperty('--fleet-delay', `${AUTOPLAY_MS}ms`);

  let pos = 0;
  let radius = 0;
  let timer = null;
  let swapTimer = null;
  const state = { visible: false, hovered: false, focused: false };

  const current = () => ((Math.round(pos) % n) + n) % n;

  const setRing = (extraDeg = 0, animate = true) => {
    ring.style.transition = animate ? '' : 'none';
    ring.style.transform = `translateZ(${-radius}px) rotateY(${-pos * step + extraDeg}deg)`;
  };

  const layout = () => {
    const w = ring.offsetWidth;
    radius = Math.round(w / 2 / Math.tan(Math.PI / n) + w * 0.14);
    cards.forEach((card, i) => {
      card.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px)`;
    });
    setRing(0, false);
  };

  const fillDetail = (card, i) => {
    const name = card.querySelector('.fleet-card-name').textContent;
    field('index').textContent = pad(i + 1);
    field('cat').textContent = card.dataset.cat;
    field('name').textContent = name;
    field('desc').textContent = card.dataset.desc;
    field('pax').textContent = card.dataset.pax;
    field('bags').textContent = card.dataset.bags;
    field('bagsNote').textContent = card.dataset.bagsNote;
    const cta = field('cta');
    cta.dataset.service = `Traslado en ${name}`;
    cta.href = whatsappHref(cta.dataset.service);
  };

  const update = (animate = true) => {
    const i = current();
    cards.forEach((card, k) => {
      const d = Math.min((k - i + n) % n, (i - k + n) % n);
      card.classList.toggle('is-active', d === 0);
      card.classList.toggle('is-near', d === 1);
      card.setAttribute('aria-hidden', String(d !== 0));
      card.setAttribute('aria-label', `${k + 1} de ${n}`);
    });

    clearTimeout(swapTimer);
    if (!animate || reduceMotion) {
      fillDetail(cards[i], i);
      return;
    }
    info.classList.add('is-swapping');
    swapTimer = setTimeout(() => {
      fillDetail(cards[i], i);
      info.classList.remove('is-swapping');
    }, 380);
  };

  const shouldPlay = () => !reduceMotion && state.visible && !state.hovered && !state.focused && !document.hidden;

  const schedule = () => {
    clearTimeout(timer);
    progress.classList.remove('run');
    if (!shouldPlay()) return;
    void progress.offsetWidth; // reinicia la animación de la barra
    progress.classList.add('run');
    timer = setTimeout(() => go(1), AUTOPLAY_MS);
  };

  const go = (delta) => {
    if (!delta) {
      setRing();
      return;
    }
    pos += delta;
    setRing();
    update();
    schedule();
  };

  const goTo = (k) => {
    let delta = (k - current() + n) % n;
    if (delta > n / 2) delta -= n;
    go(delta);
  };

  // Controles
  detail.querySelectorAll('.fleet-btn').forEach((btn) => {
    btn.addEventListener('click', () => go(Number(btn.dataset.dir)));
  });

  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  });

  // Arrastre con ratón o dedo
  let startX = 0;
  let dx = 0;
  let dragging = false;

  stage.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    dragging = true;
    startX = e.clientX;
    dx = 0;
    stage.setPointerCapture(e.pointerId);
  });

  stage.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    dx = e.clientX - startX;
    if (Math.abs(dx) > 4) {
      stage.classList.add('is-dragging');
      setRing(dx * DRAG_DEG_PER_PX, false);
    }
  });

  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove('is-dragging');

    if (Math.abs(dx) <= 4) {
      // Clic: si fue sobre una tarjeta lateral, girar hacia ella
      const card = document.elementFromPoint(e.clientX, e.clientY)?.closest('.fleet-card');
      if (card && !card.classList.contains('is-active')) goTo(cards.indexOf(card));
      return;
    }

    let delta = Math.round((-dx * DRAG_DEG_PER_PX) / step);
    if (delta === 0 && Math.abs(dx) > 30) delta = dx < 0 ? 1 : -1;
    go(delta);
  };

  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  // Pausa de la rotación automática
  const section = stage.closest('section');
  [stage, detail].forEach((el) => {
    el.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { state.hovered = true; schedule(); } });
    el.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { state.hovered = false; schedule(); } });
  });
  section.addEventListener('focusin', () => { state.focused = true; schedule(); });
  section.addEventListener('focusout', (e) => {
    if (!section.contains(e.relatedTarget)) { state.focused = false; schedule(); }
  });
  document.addEventListener('visibilitychange', schedule);

  let seen = false;
  new IntersectionObserver(([entry]) => {
    state.visible = entry.isIntersecting;
    if (state.visible && !seen) {
      // Redibuja la silueta la primera vez que la sección entra en pantalla
      seen = true;
      const active = cards[current()];
      active.classList.remove('is-active');
      void active.offsetWidth;
      active.classList.add('is-active');
    }
    schedule();
  }, { threshold: 0.35 }).observe(stage);

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 150);
  }, { passive: true });

  layout();
  update(false);
}
