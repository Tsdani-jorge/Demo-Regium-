import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setupConcierge } from './concierge.js';
import { setupFleet } from './fleet.js';

gsap.registerPlugin(ScrollTrigger);

document.documentElement.classList.add('js');

// Envuelve cada palabra en una máscara para que suba desde abajo
const splitWords = (el) => {
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(' '));
            return;
          }
          const mask = document.createElement('span');
          mask.className = 'w';
          const inner = document.createElement('span');
          inner.className = 'wi';
          inner.textContent = part;
          mask.appendChild(inner);
          frag.appendChild(mask);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
        walk(child);
      }
    });
  };
  walk(el);
  return el.querySelectorAll('.wi');
};

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const header = document.getElementById('site-header');
  const headerOffset = () => -(header?.offsetHeight || 0);

  setupConcierge();
  setupFleet({ reduceMotion });

  const year = document.getElementById('current-year');
  if (year) year.textContent = new Date().getFullYear();

  // Desplazamiento suave
  let lenis = null;
  if (!reduceMotion) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const scrollToTarget = (el) => {
    if (lenis) {
      lenis.scrollTo(el, { offset: headerOffset(), duration: 1.2 });
    } else {
      el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  };

  // Menú móvil
  const menuBtn = document.getElementById('menu-btn');
  const drawer = document.getElementById('drawer');

  const toggleMenu = (open) => {
    if (!menuBtn || !drawer) return;
    const isOpen = open ?? !drawer.classList.contains('open');
    drawer.classList.toggle('open', isOpen);
    if (isOpen) header?.classList.remove('hidden');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    menuBtn.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    drawer.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (lenis) isOpen ? lenis.stop() : lenis.start();
  };

  menuBtn?.addEventListener('click', () => toggleMenu());
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer?.classList.contains('open')) toggleMenu(false);
  });

  // Enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (drawer?.classList.contains('open')) toggleMenu(false);
      scrollToTarget(target);
    });
  });

  // Encabezado: fondo al desplazarse, se oculta al bajar y reaparece al subir
  const mobileBar = document.querySelector('.mobile-bar');
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 40);
    const goingDown = y > lastY && y > window.innerHeight * 0.6;
    if (!drawer?.classList.contains('open')) header?.classList.toggle('hidden', goingDown);
    mobileBar?.classList.toggle('visible', y > window.innerHeight * 0.7);
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Sección activa en la navegación
  const navLinks = [...document.querySelectorAll('.nav a')];
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === id));
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((s) => observer.observe(s));

  const intro = document.querySelector('.intro');
  if (reduceMotion) {
    intro?.remove();
    return;
  }

  // Titulares: preparar las palabras antes del primer cuadro
  const heroTitle = document.querySelector('.hero-title');
  heroTitle.classList.remove('reveal');
  const heroWords = splitWords(heroTitle);
  gsap.set(heroWords, { yPercent: 115 });

  const closingTitle = document.querySelector('.closing-title');
  closingTitle?.classList.remove('reveal');
  document.querySelector('.quote')?.classList.remove('reveal');

  document.querySelectorAll('.h2, .closing-title, .quote p').forEach((el) => {
    const words = splitWords(el);
    gsap.set(words, { yPercent: 115 });
    gsap.to(words, {
      yPercent: 0,
      duration: 1.2,
      ease: 'power4.out',
      stagger: 0.045,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  // Portada: telón de entrada (una vez por sesión) y luego el titular
  const heroIntro = gsap.timeline({ paused: true });
  heroIntro
    .fromTo('#hero-img', { scale: 1.12 }, { scale: 1, duration: 2.6, ease: 'power2.out' }, 0)
    .from(header, { yPercent: -100, opacity: 0, duration: 1.1, ease: 'power3.out', clearProps: 'transform,opacity' }, 0.2)
    .to('.hero .kicker', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 0.25)
    .to(heroWords, { yPercent: 0, duration: 1.3, ease: 'power4.out', stagger: 0.07 }, 0.35)
    .to(['.hero .hero-lead', '.hero .hero-actions', '.hero .hero-facts'], { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', stagger: 0.12 }, 0.9);

  const showIntro = intro && !root.classList.contains('intro-seen');
  if (showIntro) {
    try { sessionStorage.setItem('rg-intro', '1'); } catch (e) { /* almacenamiento no disponible */ }
    lenis?.stop();
    gsap.timeline({
      onComplete: () => {
        intro.remove();
        lenis?.start();
      },
    })
      .fromTo('.intro-word, .intro-logo', { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 1.3, ease: 'power3.out' })
      .to('.intro-line', { scaleX: 1, duration: 0.9, ease: 'power3.inOut' }, 0.35)
      .to(['.intro-word', '.intro-logo', '.intro-line'], { opacity: 0, y: -12, duration: 0.5, ease: 'power2.in' }, '+=0.25')
      .to(intro, { yPercent: -100, duration: 1.1, ease: 'power4.inOut' }, '-=0.1')
      .add(() => heroIntro.play(), '-=0.75');
  } else {
    intro?.remove();
    heroIntro.play();
  }

  // Paralaje lento en las fotografías
  gsap.to('.hero-media img', {
    yPercent: 10,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });

  // Cierre: la fotografía se abre como una ventana al llegar
  gsap.fromTo(
    '.closing-media',
    { clipPath: 'inset(14% 8% 14% 8%)' },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      ease: 'none',
      scrollTrigger: { trigger: '.closing', start: 'top bottom', end: 'top 15%', scrub: true },
    }
  );

  gsap.fromTo(
    '.closing-media img',
    { yPercent: -8, scale: 1.1 },
    {
      yPercent: 0,
      scale: 1,
      ease: 'none',
      scrollTrigger: { trigger: '.closing', start: 'top bottom', end: 'bottom bottom', scrub: true },
    }
  );

  // Líneas finas que se dibujan de izquierda a derecha
  document.querySelectorAll('.principle, .service, .faq-item, .policy-table > div').forEach((el) => {
    gsap.to(el, {
      '--rule': '100%',
      duration: 1.6,
      ease: 'power3.inOut',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    });
  });

  // Aparición de bloques al entrar en pantalla, escalonada por grupo
  ScrollTrigger.batch('.reveal:not(.hero .reveal)', {
    start: 'top 90%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.1 }),
  });

  // Recalcular posiciones cuando carguen las fuentes
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
});
