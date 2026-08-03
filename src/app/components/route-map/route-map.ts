import { Component, ElementRef, AfterViewInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';

interface RouteDetail {
  origin: string;
  destination: string;
  time: string;
  distance: string;
  cargo: string;
}

@Component({
  selector: 'app-route-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="route" class="section-padding position-relative overflow-hidden">
      <div class="container position-relative z-3">
        <div class="row align-items-center g-5">
          <!-- Left: WebGL Canvas Container -->
          <div class="col-lg-7 position-relative">
            <span class="section-subtitle">Nuestra Cobertura</span>
            <h2 class="section-title text-white mb-2">Conectando Bolivia y Chile</h2>
            <p class="text-secondary mb-4">
              Visualice nuestro corredor logístico 3D. Operamos rutas directas y eficientes desde los centros productivos de Bolivia hacia los principales puertos del Pacífico chileno.
            </p>
            
            <div class="canvas-container glass-panel overflow-hidden border-neon-blue" #rendererContainer>
              <!-- Three.js Canvas -->
              <canvas #mapCanvas class="w-100 h-100"></canvas>
              
              <!-- Custom 3D Legend -->
              <div class="canvas-legend position-absolute bottom-0 start-0 m-3 p-3 glass-panel">
                <div class="d-flex align-items-center mb-2 small text-white">
                  <span class="dot-legend bg-orange me-2"></span> Bolivia (Origen / Destino)
                </div>
                <div class="d-flex align-items-center small text-white">
                  <span class="dot-legend bg-blue me-2"></span> Chile (Puertos Pacífico)
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Interactive Routes List -->
          <div class="col-lg-5">
            <h3 class="text-white fw-bold mb-4">Corredores Logísticos Principales</h3>
            <div class="d-flex flex-column gap-3">
              <div class="route-item glass-panel p-4" *ngFor="let route of routes; let i = index" [ngClass]="{'active-route border-neon-orange': i === activeRouteIndex}" (click)="setActiveRoute(i)">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="badge bg-dark-orange px-3 py-2 text-neon-orange border border-neon-orange-glow small fw-bold">Corredor #0{{ i+1 }}</span>
                  <span class="text-white small fw-bold"><i class="fa-solid fa-truck-moving text-neon-orange me-2"></i>{{ route.cargo }}</span>
                </div>
                <h4 class="text-white fw-bold mb-2 d-flex align-items-center">
                  {{ route.origin }} 
                  <i class="fa-solid fa-arrow-right-arrow-left mx-3 fs-6 text-neon-blue"></i> 
                  {{ route.destination }}
                </h4>
                <div class="d-flex gap-4 mt-3 pt-3 border-top border-glass text-secondary small">
                  <div>
                    <i class="fa-solid fa-clock text-neon-blue me-1"></i> Tiempo Est.: <strong>{{ route.time }}</strong>
                  </div>
                  <div>
                    <i class="fa-solid fa-road text-neon-orange me-1"></i> Distancia: <strong>{{ route.distance }}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    #route {
      background-color: var(--bg-primary);
      z-index: 2;
    }

    .canvas-container {
      height: 480px;
      position: relative;
      background: radial-gradient(circle at center, #0a0f24 0%, #030712 100%);
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
    }

    .dot-legend {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
      
      &.bg-orange {
        background-color: var(--neon-orange);
        box-shadow: 0 0 8px var(--neon-orange);
      }
      
      &.bg-blue {
        background-color: var(--neon-blue);
        box-shadow: 0 0 8px var(--neon-blue);
      }
    }

    .canvas-legend {
      background: rgba(3, 7, 18, 0.7);
      backdrop-filter: blur(5px);
      border: 1px solid var(--border-glass);
      z-index: 5;
    }

    /* Route List Styling */
    .route-item {
      cursor: pointer;
      transition: var(--transition-smooth);
      
      &:hover {
        background: var(--bg-card-hover);
        transform: translateX(5px);
      }
    }

    .active-route {
      background: rgba(255, 107, 0, 0.05);
      box-shadow: 0 0 25px rgba(255, 107, 0, 0.08);
    }

    .bg-dark-orange {
      background-color: rgba(255, 107, 0, 0.1);
    }

    .border-glass {
      border-color: rgba(255, 255, 255, 0.05) !important;
    }

    @media (max-width: 991.98px) {
      .canvas-container {
        height: 350px;
      }
    }
  `]
})
export class RouteMapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapCanvas') private canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('rendererContainer') private containerRef!: ElementRef<HTMLDivElement>;

  // ThreeJS objects
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animationFrameId!: number;
  
  // Custom mesh arrays
  private nodes: THREE.Mesh[] = [];
  private curves: THREE.QuadraticBezierCurve3[] = [];
  private routeLines: THREE.Line[] = [];
  private flowParticles: { mesh: THREE.Mesh; curve: THREE.QuadraticBezierCurve3; progress: number; speed: number }[] = [];
  private starField!: THREE.Points;

  activeRouteIndex = 0;

  routes: RouteDetail[] = [
    {
      origin: 'Santa Cruz (BO)',
      destination: 'Arica / Iquique (CL)',
      time: '36 - 48 Hrs',
      distance: '1,450 Km',
      cargo: 'Soya & Contenedores'
    },
    {
      origin: 'La Paz / Oruro (BO)',
      destination: 'Arica (CL)',
      time: '18 - 24 Hrs',
      distance: '510 Km',
      cargo: 'Minerales & Mercadería'
    },
    {
      origin: 'Cochabamba (BO)',
      destination: 'Iquique (CL)',
      time: '30 - 36 Hrs',
      distance: '950 Km',
      cargo: 'Carga General & Repuestos'
    }
  ];

  setActiveRoute(index: number) {
    this.activeRouteIndex = index;
    // Highlight route in ThreeJS
    this.routeLines.forEach((line, i) => {
      const material = line.material as THREE.LineBasicMaterial;
      if (i === index) {
        material.color.setHex(0xff6b00); // orange
        material.linewidth = 3;
      } else {
        material.color.setHex(0x3b82f6); // standard blue
        material.linewidth = 1;
      }
    });
  }

  ngAfterViewInit() {
    this.initThree();
    this.buildScene();
    this.animate();
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    // Clean up ThreeJS resources to avoid memory leaks
    if (this.renderer) {
      this.renderer.dispose();
    }
    this.nodes.forEach(node => {
      node.geometry.dispose();
      (node.material as THREE.Material).dispose();
    });
    this.routeLines.forEach(line => {
      line.geometry.dispose();
      (line.material as THREE.Material).dispose();
    });
    this.flowParticles.forEach(p => {
      p.mesh.geometry.dispose();
      (p.mesh.material as THREE.Material).dispose();
    });
    if (this.starField) {
      this.starField.geometry.dispose();
      (this.starField.material as THREE.Material).dispose();
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

  private initThree() {
    const canvas = this.canvasRef.nativeElement;
    const width = this.containerRef.nativeElement.clientWidth;
    const height = this.containerRef.nativeElement.clientHeight;

    // Create scene with fog
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x030712, 0.08);

    // Create camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 0, 10);

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private buildScene() {
    // Add ambient and point light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f0ff, 1.5, 20);
    pointLight.position.set(5, 5, 5);
    this.scene.add(pointLight);

    // Create cyberspace stars grid
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 300;
    const posArray = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starsMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x64748b,
      transparent: true,
      opacity: 0.6
    });
    this.starField = new THREE.Points(starsGeo, starsMat);
    this.scene.add(this.starField);

    // Define Node Positions (Stylized)
    // Left sides (Pacific Ports in Chile) - Cyan color
    const arica = new THREE.Vector3(-2.2, 0.8, 0);
    const iquique = new THREE.Vector3(-2.4, -0.6, 0);
    
    // Right sides (Cities in Bolivia) - Orange color
    const laPaz = new THREE.Vector3(-0.2, 1.2, 0.2);
    const oruro = new THREE.Vector3(-0.4, 0.2, 0.1);
    const cochabamba = new THREE.Vector3(0.5, 0.6, 0.3);
    const santaCruz = new THREE.Vector3(2.0, 0.4, 0.5);

    // Create Nodes
    this.addNode(arica, 0x00f0ff, 'Arica');
    this.addNode(iquique, 0x00f0ff, 'Iquique');
    this.addNode(laPaz, 0xff6b00, 'La Paz');
    this.addNode(oruro, 0xff6b00, 'Oruro');
    this.addNode(cochabamba, 0xff6b00, 'Cochabamba');
    this.addNode(santaCruz, 0xff6b00, 'Santa Cruz');

    // Create quadratic bezier curves for routes
    // Route 1: Santa Cruz -> Oruro -> Iquique/Arica
    this.createBezierRoute(santaCruz, IquiqueMid(santaCruz, oruro), oruro);
    this.createBezierRoute(oruro, IquiqueMid(oruro, iquique), iquique);
    
    // Route 2: La Paz -> Arica
    this.createBezierRoute(laPaz, IquiqueMid(laPaz, arica), arica);
    
    // Route 3: Cochabamba -> Oruro -> Iquique
    this.createBezierRoute(cochabamba, IquiqueMid(cochabamba, oruro), oruro);

    // Render routes lines
    this.curves.forEach((curve, index) => {
      const points = curve.getPoints(50);
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      // Highlight the first route by default
      const color = index === 0 ? 0xff6b00 : 0x3b82f6;
      const lineMaterial = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.75,
      });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      this.scene.add(line);
      this.routeLines.push(line);

      // Create a glowing particle flowing along the route
      const particleGeo = new THREE.SphereGeometry(0.06, 16, 16);
      const particleMat = new THREE.MeshBasicMaterial({
        color: 0xff8c3a,
        transparent: true,
        opacity: 0.9,
      });
      const particleMesh = new THREE.Mesh(particleGeo, particleMat);
      this.scene.add(particleMesh);
      
      this.flowParticles.push({
        mesh: particleMesh,
        curve: curve,
        progress: Math.random(), // Random initial offset so they aren't synced
        speed: 0.005 + Math.random() * 0.005
      });
    });

    // Sub-function to find midpoint and bend it upwards (3D Arc)
    function IquiqueMid(v1: THREE.Vector3, v2: THREE.Vector3): THREE.Vector3 {
      const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
      mid.z += 0.8; // Bend outwards towards the screen
      mid.y += 0.3; // Bend slightly upwards
      return mid;
    }
  }

  private addNode(pos: THREE.Vector3, color: number, name: string) {
    // Outer glow ring
    const ringGeo = new THREE.RingGeometry(0.12, 0.16, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(pos);
    this.scene.add(ring);

    // Inner solid core
    const sphereGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({ color: color });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.copy(pos);
    this.scene.add(sphere);

    this.nodes.push(sphere);
    this.nodes.push(ring as any);
  }

  private createBezierRoute(v1: THREE.Vector3, control: THREE.Vector3, v2: THREE.Vector3) {
    const curve = new THREE.QuadraticBezierCurve3(v1, control, v2);
    this.curves.push(curve);
  }

  private animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    // Slow rotate starfield for ambiance
    if (this.starField) {
      this.starField.rotation.y += 0.0005;
      this.starField.rotation.x += 0.0002;
    }

    // Pulse node rings
    this.nodes.forEach((node, i) => {
      // Every even index is a ring mesh
      if (i % 2 === 1) {
        const scale = 1 + Math.sin(Date.now() * 0.003 + i) * 0.25;
        node.scale.set(scale, scale, 1);
        const mat = node.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.5 - (scale - 1) * 2;
      }
    });

    // Update and animate the flow particles along the curves
    this.flowParticles.forEach(p => {
      p.progress += p.speed;
      if (p.progress > 1) {
        p.progress = 0;
      }
      const position = p.curve.getPointAt(p.progress);
      p.mesh.position.copy(position);

      // Pulse particle size slightly
      const scale = 0.8 + Math.sin(Date.now() * 0.01 + p.speed * 1000) * 0.2;
      p.mesh.scale.set(scale, scale, scale);
    });

    // Render scene
    this.renderer.render(this.scene, this.camera);
  }
}
