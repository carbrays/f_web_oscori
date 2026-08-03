import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import * as THREE from 'three';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section id="hero" class="hero-section d-flex align-items-center position-relative overflow-hidden" #heroContainer>
      <!-- Three.js Canvas for 3D Cinematic Road and Andes background -->
      <canvas #threeCanvas class="position-absolute top-0 start-0 w-100 h-100 canvas-3d"></canvas>
      
      <!-- Sunset gradient overlay -->
      <div class="sunset-overlay"></div>
      
      <!-- Foreground HD Trailer Overlay (OSCORI Premium Truck) -->
      <div class="truck-foreground-wrap position-absolute bottom-0 end-0 z-2 pe-md-5 pb-3">
        <img 
          src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1000&auto=format&fit=crop&q=80" 
          alt="Transportes OSCORI Trailer" 
          class="truck-foreground img-fluid opacity-0"
          id="hero-truck-img"
        >
      </div>

      <div class="container position-relative z-3 text-start">
        <div class="row">
          <div class="col-lg-8">
            <span class="badge-premium mb-3 d-inline-block opacity-0" id="hero-badge">
              <i class="fa-solid fa-earth-americas text-neon-blue me-2"></i>LOGÍSTICA TRANSFRONTERIZA PREMIUM
            </span>
            
            <h1 class="hero-title mb-4 opacity-0" id="hero-main-title">
              Potencia y Precisión <br>
              de <span class="text-gradient-blue">Bolivia a Chile</span>
            </h1>
            
            <p class="hero-subtitle mb-5 opacity-0" id="hero-subtitle">
              <span>{{ typedText }}</span><span class="typing-cursor">|</span>
            </p>
            
            <div class="d-flex flex-wrap gap-3 opacity-0" id="hero-ctas">
              <!-- Redirects to internal pages using Angular routerLink -->
              <a routerLink="/contacto" class="btn-neon-orange d-flex align-items-center decoration-none">
                <i class="fa-solid fa-file-invoice-dollar me-2"></i>Solicitar Cotización
              </a>
              <a routerLink="/seguimiento" class="btn-neon-outline d-flex align-items-center decoration-none">
                <i class="fa-solid fa-magnifying-glass me-2"></i>Rastrear Envío
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Bottom highlights card -->
      <div class="container position-absolute bottom-0 start-50 translate-middle-x z-3 d-none d-lg-block mb-4 opacity-0" id="hero-highlights">
        <div class="row justify-content-center w-100">
          <div class="col-12 col-xl-10">
            <div class="glass-panel p-3 d-flex justify-content-around text-center border-neon-blue-glow">
              <div class="d-flex align-items-center gap-3">
                <div class="icon-wrap-neon blue"><i class="fa-solid fa-truck-moving"></i></div>
                <div class="text-start">
                  <h6 class="mb-0 fw-bold text-white small">Flota de Tractocamiones</h6>
                  <p class="mb-0 text-muted x-small">Unidades Volvo y Scania de última generación</p>
                </div>
              </div>
              <div class="vr bg-secondary opacity-25"></div>
              <div class="d-flex align-items-center gap-3">
                <div class="icon-wrap-neon blue"><i class="fa-solid fa-satellite-dish"></i></div>
                <div class="text-start">
                  <h6 class="mb-0 fw-bold text-white small">Monitoreo Satelital</h6>
                  <p class="mb-0 text-muted x-small">Rastreo GPS en tiempo real y alertas continuas</p>
                </div>
              </div>
              <div class="vr bg-secondary opacity-25"></div>
              <div class="d-flex align-items-center gap-3">
                <div class="icon-wrap-neon blue"><i class="fa-solid fa-route"></i></div>
                <div class="text-start">
                  <h6 class="mb-0 fw-bold text-white small">Corredores del Pacífico</h6>
                  <p class="mb-0 text-muted x-small">Conexión directa Arica/Iquique con Bolivia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      min-height: 100vh;
      padding-top: 100px;
      background-color: var(--bg-primary);
    }

    .canvas-3d {
      z-index: 1;
    }

    .sunset-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        to right,
        rgba(17, 24, 39, 0.95) 20%,
        rgba(7, 30, 61, 0.6) 60%,
        rgba(17, 24, 39, 0.2) 100%
      );
      z-index: 2;
      pointer-events: none;
    }

    .badge-premium {
      background: rgba(0, 184, 255, 0.1);
      border: 1px solid rgba(0, 184, 255, 0.3);
      padding: 8px 18px;
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: #ffffff;
      backdrop-filter: blur(5px);
      box-shadow: 0 4px 15px rgba(0, 184, 255, 0.05);
    }

    .hero-title {
      font-size: 4rem;
      font-weight: 900;
      line-height: 1.15;
      letter-spacing: -1px;
      color: #ffffff;
      text-shadow: 0 4px 20px rgba(0,0,0,0.8);
    }

    .text-gradient-blue {
      background: linear-gradient(135deg, #fff 10%, var(--neon-blue) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-subtitle {
      font-size: 1.4rem;
      font-weight: 400;
      color: var(--text-secondary);
      min-height: 2.2rem;
      letter-spacing: 0.5px;
      text-shadow: 0 2px 10px rgba(0,0,0,0.5);
    }

    .typing-cursor {
      color: var(--neon-blue);
      font-weight: bold;
      animation: blink 0.7s infinite;
    }

    .border-neon-blue-glow {
      box-shadow: 0 8px 32px 0 rgba(0, 184, 255, 0.05), inset 0 0 15px rgba(0, 184, 255, 0.05);
      border-color: rgba(0, 184, 255, 0.15) !important;
    }

    .decoration-none {
      text-decoration: none;
    }

    .icon-wrap-neon {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      
      &.blue {
        background: rgba(0, 184, 255, 0.15);
        color: var(--neon-blue);
        border: 1px solid rgba(0, 184, 255, 0.3);
        box-shadow: 0 0 10px rgba(0, 184, 255, 0.1);
      }
    }

    /* Foreground HD Truck */
    .truck-foreground-wrap {
      max-width: 45%;
      pointer-events: none;
    }
    .truck-foreground {
      filter: drop-shadow(0 10px 30px rgba(0,0,0,0.8)) contrast(1.1);
      transform: translate3d(50px, 0, 0);
      transition: transform 1.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.5s ease-out;
    }

    .x-small {
      font-size: 0.65rem;
      letter-spacing: 0.5px;
    }

    @keyframes blink {
      0%, 100% { opacity: 0; }
      50% { opacity: 1; }
    }

    @media (max-width: 991.98px) {
      .hero-section {
        padding-top: 120px;
        min-height: 85vh;
      }
      .hero-title {
        font-size: 2.6rem;
      }
      .hero-subtitle {
        font-size: 1.1rem;
        min-height: 3rem;
      }
      .truck-foreground-wrap {
        max-width: 75%;
        opacity: 0.3;
      }
    }
  `]
})
export class HeroComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('threeCanvas', { static: true }) private canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('heroContainer', { static: true }) private containerRef!: ElementRef<HTMLDivElement>;

  typedText = '';
  private fullText = 'Especialistas en Importación y Exportación de Carga Pesada Bolivia - Chile.';
  private typingSpeed = 50;
  private typingTimer: any;

  // ThreeJS objects
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animationFrameId!: number;
  
  // Custom meshes
  private roadPlane!: THREE.Mesh;
  private roadMarkings: THREE.Mesh[] = [];
  private mountainMeshes: THREE.Mesh[] = [];
  private starPoints!: THREE.Points;
  private cloudMeshes: THREE.Mesh[] = [];

  // Mouse interaction
  private mouseX = 0;
  private mouseY = 0;

  ngOnInit() {
    this.startTypingAnimation();
  }

  ngAfterViewInit() {
    this.initThree();
    this.buildThreeScene();
    this.animateThree();

    // GSAP Entrances
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl.to('#hero-badge', { opacity: 1, y: 0, duration: 0.8, delay: 0.3 })
      .to('#hero-main-title', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
      .to('#hero-subtitle', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
      .to('#hero-ctas', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
      .to('#hero-highlights', { opacity: 1, y: 0, duration: 1 }, '-=0.3')
      .to('#hero-truck-img', { opacity: 0.9, x: 0, duration: 1.5, ease: 'power4.out' }, '-=1');
  }

  ngOnDestroy() {
    if (this.typingTimer) clearTimeout(this.typingTimer);
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  @HostListener('window:resize')
  onResize() {
    const width = this.containerRef.nativeElement.clientWidth;
    const height = this.containerRef.nativeElement.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Normalize mouse coords (-1 to 1)
    this.mouseX = (event.clientX / width) * 2 - 1;
    this.mouseY = -(event.clientY / height) * 2 + 1;
  }

  startTypingAnimation() {
    let index = 0;
    const type = () => {
      if (index < this.fullText.length) {
        this.typedText += this.fullText.charAt(index);
        index++;
        this.typingTimer = setTimeout(type, this.typingSpeed);
      } else {
        // Pause at the end before restarting
        this.typingTimer = setTimeout(() => {
          this.typedText = '';
          index = 0;
          type();
        }, 5000);
      }
    };
    type();
  }

  private initThree() {
    const canvas = this.canvasRef.nativeElement;
    const width = this.containerRef.nativeElement.clientWidth;
    const height = this.containerRef.nativeElement.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x071e3d, 0.05); // Fog styled in deep blue

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    // Positioned slightly above the road looking down
    this.camera.position.set(0, 1.5, 8);

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private buildThreeScene() {
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffaa66, 0.5); // Warm ambient light
    this.scene.add(ambientLight);

    const sunsetLight = new THREE.DirectionalLight(0xff6b00, 1.5);
    sunsetLight.position.set(0, 2, -15);
    this.scene.add(sunsetLight);

    // 1. Road base plane extending in Z
    const roadGeo = new THREE.PlaneGeometry(10, 100);
    // Dark asphalt texture color
    const roadMat = new THREE.MeshBasicMaterial({
      color: 0x0c1322,
      side: THREE.DoubleSide
    });
    this.roadPlane = new THREE.Mesh(roadGeo, roadMat);
    this.roadPlane.rotation.x = -Math.PI / 2;
    this.roadPlane.position.set(0, 0, -40);
    this.scene.add(this.roadPlane);

    // 2. Road markings (dashed white stripes in the middle)
    const markingGeo = new THREE.PlaneGeometry(0.12, 3);
    const markingMat = new THREE.MeshBasicMaterial({
      color: 0x00b8ff, // glowing cyber cyan markings!
      side: THREE.DoubleSide
    });

    for (let i = 0; i < 20; i++) {
      const marking = new THREE.Mesh(markingGeo, markingMat);
      marking.rotation.x = -Math.PI / 2;
      // Position along the road plane
      marking.position.set(0, 0.01, -i * 6 + 10);
      this.scene.add(marking);
      this.roadMarkings.push(marking);
    }

    // 3. Andes Mountain Silhouettes (Low-poly pyramids in the far Z background)
    const mountainGeo = new THREE.ConeGeometry(8, 12, 4);
    const mountainMat = new THREE.MeshBasicMaterial({
      color: 0x040f24 // Very dark blue cone shadow
    });

    for (let i = 0; i < 6; i++) {
      const mt = new THREE.Mesh(mountainGeo, mountainMat);
      // Positioned in the far background
      const posX = (Math.random() - 0.5) * 35;
      const posZ = -45 - Math.random() * 15;
      mt.position.set(posX, 2, posZ);
      mt.rotation.y = Math.random() * Math.PI;
      this.scene.add(mt);
      this.mountainMeshes.push(mt);
    }

    // 4. Moving Cloud meshes (large flat circular meshes high up)
    const cloudGeo = new THREE.DodecahedronGeometry(5, 1);
    const cloudMat = new THREE.MeshBasicMaterial({
      color: 0xff8c00, // sunset illuminated clouds
      transparent: true,
      opacity: 0.15
    });

    for (let i = 0; i < 8; i++) {
      const cloud = new THREE.Mesh(cloudGeo, cloudMat);
      const posX = (Math.random() - 0.5) * 40;
      const posY = 6 + Math.random() * 4;
      const posZ = -10 - Math.random() * 30;
      cloud.position.set(posX, posY, posZ);
      this.scene.add(cloud);
      this.cloudMeshes.push(cloud);
    }

    // 5. Sparks particles flying towards the viewer (simulating road speed/dust)
    const starGeo = new THREE.BufferGeometry();
    const starCount = 150;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 15;      // X
      starPos[i + 1] = Math.random() * 4 + 0.1;     // Y (above road)
      starPos[i + 2] = -Math.random() * 40;         // Z
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x00b8ff,
      transparent: true,
      opacity: 0.8
    });
    this.starPoints = new THREE.Points(starGeo, starMat);
    this.scene.add(this.starPoints);
  }

  private animateThree() {
    this.animationFrameId = requestAnimationFrame(() => this.animateThree());

    // 1. Move road markings to create driving illusion
    this.roadMarkings.forEach(marking => {
      marking.position.z += 0.25; // Speed factor
      if (marking.position.z > 15) {
        // Reset to horizon
        marking.position.z = -80;
      }
    });

    // 2. Move star points (sparks) towards screen
    const positions = this.starPoints.geometry.attributes['position'].array as Float32Array;
    for (let i = 2; i < positions.length; i += 3) {
      positions[i] += 0.35; // Move speed in Z
      if (positions[i] > 10) {
        positions[i] = -40; // Reset Z
        positions[i - 1] = Math.random() * 4 + 0.1; // random new Y
        positions[i - 2] = (Math.random() - 0.5) * 15; // random new X
      }
    }
    this.starPoints.geometry.attributes['position'].needsUpdate = true;

    // 3. Slow movement of clouds (wind)
    this.cloudMeshes.forEach(cloud => {
      cloud.position.x += 0.002;
      if (cloud.position.x > 25) {
        cloud.position.x = -25;
      }
    });

    // 4. Camera Parallax based on mouse coordinate targets
    const targetX = this.mouseX * 0.5;
    const targetY = 1.5 + this.mouseY * 0.2;
    
    // Smooth interpolation (lerp)
    this.camera.position.x += (targetX - this.camera.position.x) * 0.05;
    this.camera.position.y += (targetY - this.camera.position.y) * 0.05;
    this.camera.lookAt(new THREE.Vector3(0, 1.0, -10));

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  }
}
