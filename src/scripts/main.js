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

  // 2. Initialize Three.js WebGL Scene
  const canvas = document.getElementById('webgl-canvas');
  let threeScene = null;
  if (canvas) {
    threeScene = new ThreeScene(canvas);
  }

  // 3. Initialize Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.8,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

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

  // 4b. Transición Cinemática: Video + Catedral se desvanecen al bajar para dar paso al Fondo de Puro Lujo
  const heroBackdrop = document.getElementById('hero-backdrop');
  const catedralImg = document.getElementById('catedral-hero-img');
  if (heroBackdrop) {
    gsap.to(heroBackdrop, {
      opacity: 0,
      scale: 1.06,
      filter: 'blur(10px)',
      ease: 'power1.out',
      scrollTrigger: {
        trigger: '#inicio',
        start: 'top top',
        end: 'bottom 10%',
        scrub: true,
      },
    });
  }

  if (catedralImg) {
    gsap.to(catedralImg, {
      y: -80,
      ease: 'none',
      scrollTrigger: {
        trigger: '#inicio',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  // 5. Header Scroll State
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  });

  // 6. Section Reveals with GSAP
  const cards = document.querySelectorAll('.waypoint-card, .service-glass-card, .timeline-step-card, .testimonial-card');
  cards.forEach((card) => {
    gsap.fromTo(
      card,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // 7. 3D Tilt Effect on Service Cards
  const serviceCards = document.querySelectorAll('.service-glass-card');
  serviceCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (y / (rect.height / 2)) * -9;
      const rotateY = (x / (rect.width / 2)) * 9;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // 8. Animated Counters for Stats
  const statNumbers = document.querySelectorAll('.stat-num-val');
  statNumbers.forEach((stat) => {
    const target = parseInt(stat.getAttribute('data-count'), 10);
    ScrollTrigger.create({
      trigger: stat,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        let current = 0;
        const step = Math.ceil(target / 45);
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            stat.textContent = target.toLocaleString();
            clearInterval(timer);
          } else {
            stat.textContent = current.toLocaleString();
          }
        }, 30);
      },
    });
  });

  // 10. Initialize Audio & Luxury Cursor
  const audioBtn = document.getElementById('audio-toggle');
  new CabinAudio(audioBtn);
  new LuxuryCursor();

  // 11. Setup Concierge Links
  setupConcierge();

  // 12. Initialize Background Motion Video / Bokeh Loop
  new CityVideoBackground('bg-video-canvas', 'bg-video');

  // 13. Mobile Drawer Navigation Controller
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
