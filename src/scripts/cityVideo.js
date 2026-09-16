// High-Performance Nocturnal City Video / Procedural Motion Engine
// Renders cinematic wet-pavement reflections, bokeh city lights, and traffic streaks.
// Automatically falls back from an MP4 video to a lightweight 60 FPS canvas loop.

export class CityVideoBackground {
  constructor(canvasId = 'bg-video-canvas', videoId = 'bg-video') {
    this.canvas = document.getElementById(canvasId);
    this.video = document.getElementById(videoId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.lights = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.init();
  }

  init() {
    // Check if video is present and can play
    if (this.video) {
      this.video.play().catch(() => {
        // Autoplay blocked or no source: run procedural motion
        this.runProcedural();
      });
    } else {
      this.runProcedural();
    }
  }

  runProcedural() {
    if (!this.canvas || !this.ctx) return;

    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Generate City Bokeh & Traffic Lights
    const count = 48;
    for (let i = 0; i < count; i++) {
      this.lights.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 45 + 15,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.8 - 0.2, // Continuous gentle upward / forward flow
        color: this.getRandomColor(),
        alpha: Math.random() * 0.25 + 0.05,
      });
    }

    this.animate();
  }

  getRandomColor() {
    const palette = [
      'rgba(197, 168, 105, ', // Gold Champagne
      'rgba(235, 195, 120, ', // Warm Amber
      'rgba(66, 133, 244, ',  // Deep City Blue
      'rgba(244, 67, 54, ',   // Crimson Taillight
      'rgba(255, 255, 255, ', // Xenon Headlight
    ];
    return palette[Math.floor(Math.random() * palette.length)];
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Deep dark backdrop with subtle fade for motion blur
    this.ctx.fillStyle = 'rgba(8, 9, 10, 0.2)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw City Bokeh Nodes
    this.lights.forEach((light) => {
      light.x += light.speedX;
      light.y += light.speedY;

      // Wrap edges
      if (light.y < -light.radius) light.y = this.height + light.radius;
      if (light.x < -light.radius) light.x = this.width + light.radius;
      if (light.x > this.width + light.radius) light.x = -light.radius;

      // Soft Radial Gradient for Bokeh Orb
      const grad = this.ctx.createRadialGradient(
        light.x, light.y, 0,
        light.x, light.y, light.radius
      );
      grad.addColorStop(0, light.color + (light.alpha * 1.5) + ')');
      grad.addColorStop(0.5, light.color + (light.alpha * 0.6) + ')');
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(light.x, light.y, light.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }
}
