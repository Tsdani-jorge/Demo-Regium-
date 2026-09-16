// Luxury Custom Cursor & Magnetic Button Physics

export class LuxuryCursor {
  constructor() {
    this.dot = document.querySelector('.custom-cursor');
    this.follower = document.querySelector('.custom-cursor-follower');

    if (!this.dot || !this.follower) return;
    // Skip entirely on touch / coarse pointer devices to save battery
    if (window.matchMedia('(pointer: coarse)').matches) return;

    this.pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.mouse = { x: this.pos.x, y: this.pos.y };
    this.followerPos = { x: this.pos.x, y: this.pos.y };

    this.init();
  }

  init() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    }, { passive: true });

    // Hover detection on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .service-glass-card, .timeline-step-card');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // Magnetic buttons (only on desktop with fine mouse pointer)
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const magneticBtns = document.querySelectorAll('.magnetic-btn');
      magneticBtns.forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
        });

        btn.addEventListener('mouseleave', () => {
          btn.style.transform = 'translate(0px, 0px)';
        });
      });
    }

    this.render();
  }

  render() {
    // Smooth lerp follower position
    this.followerPos.x += (this.mouse.x - this.followerPos.x) * 0.14;
    this.followerPos.y += (this.mouse.y - this.followerPos.y) * 0.14;

    this.dot.style.transform = `translate(${this.mouse.x}px, ${this.mouse.y}px)`;
    this.follower.style.transform = `translate(${this.followerPos.x}px, ${this.followerPos.y}px)`;

    requestAnimationFrame(() => this.render());
  }
}
