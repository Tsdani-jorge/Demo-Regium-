import * as THREE from 'three';

export class ThreeScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.particles = null;
    this.targetCameraPos = new THREE.Vector3(0, 0, 14);
    this.currentCameraPos = new THREE.Vector3(0, 0, 14);
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.startTime = performance.now();

    this.init();
  }

  init() {
    // 1. Scene & Depth Fog
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x08090a, 0.02);

    // 2. Camera
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.camera.position.copy(this.currentCameraPos);

    // 3. Transparent WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Subtle Luxury Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambient);

    // 5. Floating Luxury Gold Dust Particles
    this.createLuxuryParticles();

    // 6. Event Listeners
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));

    this.animate();
  }

  createLuxuryParticles() {
    const pCount = 380;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(pCount * 3);
    const pScales = new Float32Array(pCount);

    for (let i = 0; i < pCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 45;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 35;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 35;
      pScales[i] = Math.random() * 0.15 + 0.05;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.18,
      color: 0xc5a869, // Gold champagne
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });

    this.particles = new THREE.Points(pGeo, pMat);
    this.scene.add(this.particles);
  }

  updateScroll(progress) {
    // Sutil desplazamiento de la cámara según el scroll
    this.targetCameraPos.y = -progress * 8;
    this.targetCameraPos.z = 14 + progress * 4;
  }

  onMouseMove(e) {
    this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    this.mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const time = (performance.now() - this.startTime) * 0.001;

    // Inercia del mouse para paralaje sutil
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.04;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.04;

    this.currentCameraPos.lerp(this.targetCameraPos, 0.05);

    this.camera.position.x = this.currentCameraPos.x + this.mouse.x * 0.8;
    this.camera.position.y = this.currentCameraPos.y - this.mouse.y * 0.6;
    this.camera.position.z = this.currentCameraPos.z;
    this.camera.lookAt(0, this.currentCameraPos.y * 0.5, 0);

    if (this.particles) {
      this.particles.rotation.y = time * 0.015;
      this.particles.rotation.x = Math.sin(time * 0.02) * 0.02;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
