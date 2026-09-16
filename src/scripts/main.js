import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createIcons, Shield, Compass, Sparkles, Clock, Phone, MapPin, ChevronRight, Check, Volume2, Car, Award, Send } from 'lucide';
import { ThreeScene } from './threeScene.js';
import { CabinAudio } from './audio.js';
import { LuxuryCursor } from './cursor.js';
import { setupConcierge } from './concierge.js';
import { CityVideoBackground } from './cityVideo.js';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  createIcons({
    icons: {
      Shield,
      Compass,
      Sparkles,
      Clock,
      Phone,
      MapPin,
      ChevronRight,
      Check,
      Volume2,
      Car,
      Award,
      Send,
    },
  });

  // 2. Initialize Three.js WebGL Scene (with safe fallback if WebGL unsupported)
  const canvas = document.getElementById('webgl-canvas');
  let threeScene = null;
  if (canvas) {
    try {
      threeScene = new ThreeScene(canvas);
    } catch (err) {
      console.warn('WebGL scene initialization skipped:', err);
    }
  }

  // 3. Initialize Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.3,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.6,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // 3b. Universal Smooth Scrolling for all internal anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId !== '#' && targetId.startsWith('#')) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          lenis.scrollTo(targetEl, { offset: -70, duration: 1.2 });
        }
      }
    });
  });

  // 4. Connect Scroll to 3D Camera Path
  ScrollTrigger.create({
    trigger: '.content-wrapper',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      if (threeScene) {
        threeScene.updateScroll(self.progress);
      }
    },
  });

  // 4b. Transición Cinemática: Video + Palacio de Bellas Artes se desvanecen al bajar para dar paso al Fondo de Puro Lujo
  const heroBackdrop = document.getElementById('hero-backdrop');
  const monumentImg = document.getElementById('hero-monument-img');
  if (heroBackdrop) {
    gsap.to(heroBackdrop, {
      opacity: 0,
      scale: 1.05,
      filter: 'blur(8px)',
      ease: 'power1.out',
      scrollTrigger: {
        trigger: '#inicio',
        start: 'top top',
        end: 'bottom 15%',
        scrub: true,
      },
    });
  }

  if (monumentImg) {
    gsap.to(monumentImg, {
      y: -60,
      ease: 'none',
      scrollTrigger: {
        trigger: '#inicio',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  // 4c. Transición Cinemática: Catedral Metropolitana Iluminada de Noche para la Sección Inferior
  const catedralBackdrop = document.getElementById('catedral-fixed-backdrop');
  const catedralFixedImg = document.getElementById('catedral-fixed-img');

  if (catedralBackdrop) {
    // Aparece con suavidad al llegar a #servicios y se mantiene visible en toda la sección inferior
    gsap.fromTo(
      catedralBackdrop,
      { opacity: 0, scale: 1.05 },
      {
        opacity: 0.95,
        scale: 1,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: '#servicios',
          start: 'top 80%',
          end: 'top 20%',
          scrub: true,
        },
      }
    );

    // Parallax majestuoso para la imagen de la Catedral
    if (catedralFixedImg) {
      gsap.fromTo(
        catedralFixedImg,
        { y: -30 },
        {
          y: 40,
          ease: 'none',
          scrollTrigger: {
            trigger: '#servicios',
            endTrigger: '#contacto',
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true,
          },
        }
      );
    }
  }

  // 5. Header Scroll State
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  }, { passive: true });

  // 6. Section Reveals with GSAP (once: true para evitar parpadeos al volver a subir)
  const cards = document.querySelectorAll('.service-glass-card, .timeline-step-card, .testimonial-card, .trust-strip-item, .policy-card, .faq-card');
  cards.forEach((card) => {
    gsap.fromTo(
      card,
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          once: true,
        },
      }
    );
  });

  // 7. 3D Tilt Effect on Service Cards (solo en mouse/desktop para no trabar táctil)
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const serviceCards = document.querySelectorAll('.service-glass-card');
    serviceCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = (y / (rect.height / 2)) * -7;
        const rotateY = (x / (rect.width / 2)) * 7;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  // 8. Initialize Audio & Luxury Cursor
  const audioBtn = document.getElementById('audio-toggle');
  new CabinAudio(audioBtn);
  new LuxuryCursor();

  // 9. Setup Concierge Links (WhatsApp)
  setupConcierge();

  // 10. Initialize Background Motion Bokeh Loop (limpio y transparente)
  new CityVideoBackground('bg-video-canvas');
  if (document.getElementById('catedral-video-canvas')) {
    new CityVideoBackground('catedral-video-canvas');
  }

  // 11. Mobile Drawer Navigation Controller
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileDrawer) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains('open');
      mobileMenuBtn.classList.toggle('active', isOpen);
      mobileDrawer.classList.toggle('open', isOpen);
      mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileDrawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    mobileMenuBtn.addEventListener('click', () => toggleMenu());

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        toggleMenu(false);
      }
    });

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          e.preventDefault();
          toggleMenu(false);
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            lenis.scrollTo(targetEl, { offset: -70, duration: 1.2 });
          }
        }
      });
    });
  }
});
