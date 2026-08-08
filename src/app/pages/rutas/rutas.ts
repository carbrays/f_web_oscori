import { Component, OnInit, AfterViewInit, OnDestroy, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, RouteDetail } from '../../services/api.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-page-rutas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rutas-page bg-grafito min-vh-100 pt-5 pb-5">
      <!-- Title Header -->
      <section class="banner-section position-relative py-4 border-bottom border-glass mb-4">
        <div class="container text-center pt-5">
          <span class="badge-premium mb-2 d-inline-block">CORREDORES INTERNACIONALES</span>
          <h1 class="text-white fw-black mb-1">Mapa de Rutas e Itinerarios</h1>
          <p class="text-secondary small mb-0">Seleccione un corredor para ver los tiempos de tránsito, kilómetros y pasos fronterizos autorizados.</p>
        </div>
      </section>

      <div class="container">
        <div class="row g-4 align-items-stretch">
          <!-- Map Area -->
          <div class="col-lg-8">
            <div class="map-card glass-panel p-2 h-100 d-flex flex-column border-neon-blue-glow">
              <div class="map-container flex-grow-1" #mapContainer></div>
              <div class="map-instructions p-2 text-start text-secondary small">
                <i class="fa-solid fa-circle-info text-neon-blue me-2"></i> Haga clic sobre las líneas o en el panel derecho para seleccionar una ruta.
              </div>
            </div>
          </div>
          
          <!-- Route details sidebar -->
          <div class="col-lg-4">
            <div class="details-card glass-panel p-4 h-100 d-flex flex-column justify-content-between border-glass text-start">
              <div>
                <span class="badge bg-neon-blue text-white fw-bold mb-3">CORREDOR LOGÍSTICO</span>
                
                <h3 class="text-white fw-bold mb-1">
                  {{ activeRoute().origin }} 
                  <i class="fa-solid fa-arrow-right-arrow-left text-neon-blue mx-2 fs-5"></i> 
                  {{ activeRoute().destination }}
                </h3>
                <p class="small mb-4">{{ activeRoute().description }}</p>
                
                <!-- Quick stats -->
                <div class="row g-3 mb-4">
                  <div class="col-6">
                    <div class="stat-box p-3 glass-panel border-glass">
                      <span class="text-neon-blue d-block x-small">DISTANCIA TOTAL</span>
                      <strong class="text-white fs-5"><i class="fa-solid fa-road text-neon-blue me-2"></i>{{ activeRoute().distance }}</strong>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="stat-box p-3 glass-panel border-glass">
                      <span class="text-neon-blue d-block x-small">TIEMPO ESTIMADO</span>
                      <strong class="text-neon-orange fs-5"><i class="fa-solid fa-clock text-neon-orange me-2"></i>{{ activeRoute().time }}</strong>
                    </div>
                  </div>
                </div>
                
                <!-- Info cards -->
                <div class="info-list d-flex flex-column gap-3 mb-4">
                  <div class="info-row d-flex gap-3">
                    <div class="icon-wrap-small orange"><i class="fa-solid fa-border-top-left"></i></div>
                    <div>
                      <span class="text-neon-blue d-block x-small">PASO FRONTERIZO HABILITADO</span>
                      <strong class="text-white small">{{ activeRoute().borderCrossing }}</strong>
                    </div>
                  </div>
                  
                  <div class="info-row d-flex gap-3">
                    <div class="icon-wrap-small blue"><i class="fa-solid fa-truck-moving"></i></div>
                    <div>
                      <span class="text-neon-blue d-block x-small">TIPO DE CARGA</span>
                      <strong class="text-white small">{{ activeRoute().cargo }}</strong>
                    </div>
                  </div>
                </div>

                <!-- Cities progression -->
                <div class="cities-timeline mb-4">
                  <h6 class="text-white fw-bold small mb-3">CIUDADES Y PUNTOS DE CONTROL:</h6>
                  <div class="cities-progression d-flex flex-wrap align-items-center gap-2">
                    <span 
                      *ngFor="let city of activeRoute().cities; let last = last" 
                      class="city-badge"
                    >
                      {{ city }} <i class="fa-solid fa-angles-right text-neon-blue ms-1" *ngIf="!last"></i>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Route Photographic Reference -->
              <div class="route-photo-wrap rounded-3 overflow-hidden border border-glass mt-3">
                <img [src]="getRoutePhoto()" [alt]="activeRoute().origin" class="w-100 route-photo">
                <div class="photo-caption p-2 bg-dark-glass text-center text-secondary x-small">
                  Fotografía de referencia - Carretera de la ruta
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .rutas-page {
      background-color: var(--bg-primary);
    }
    
    .banner-section {
      min-height: 120px;
      background: radial-gradient(circle at center, rgba(0, 91, 255, 0.1) 0%, var(--bg-primary) 100%);
    }

    .badge-premium {
      background: rgba(0, 184, 255, 0.1);
      border: 1px solid rgba(0, 184, 255, 0.25);
      color: var(--neon-blue);
      padding: 6px 14px;
      border-radius: 50px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 1.5px;
    }

    .fw-black {
      font-weight: 900;
    }

    .border-neon-blue-glow {
      box-shadow: 0 4px 25px rgba(0, 184, 255, 0.05);
      border-color: rgba(0, 184, 255, 0.2) !important;
    }

    .map-card {
      height: 600px;
      min-height: 450px;
      background: rgba(7, 30, 61, 0.4);
    }

    .map-container {
      border-radius: 12px;
      z-index: 10;
    }

    .bg-neon-blue {
      background-color: var(--brand-blue) !important;
    }

    .stat-box {
      background: rgba(17, 24, 39, 0.4);
    }

    .x-small {
      font-size: 0.65rem;
      letter-spacing: 1px;
    }

    .icon-wrap-small {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      
      &.orange {
        background: rgba(0, 91, 255, 0.1);
        color: var(--neon-orange);
        border: 1px solid rgba(0, 91, 255, 0.2);
      }
      &.blue {
        background: rgba(0, 184, 255, 0.1);
        color: var(--neon-blue);
        border: 1px solid rgba(0, 184, 255, 0.2);
      }
    }

    .city-badge {
      font-size: 0.75rem;
      color: var(--text-secondary);
      font-weight: 600;
    }

    .route-photo-wrap {
      height: 140px;
      position: relative;
    }

    .route-photo {
      height: 100%;
      object-fit: cover;
    }

    .bg-dark-glass {
      background: rgba(17, 24, 39, 0.85);
    }

    /* Glowing custom marker for map */
    ::ng-deep .custom-map-marker {
      background: transparent;
      border: none;
    }

    ::ng-deep .glowing-marker-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 2px solid #fff;
      box-shadow: 0 0 10px currentColor;
      animation: markerPulse 1.5s infinite ease-in-out;
    }

    @keyframes markerPulse {
      0% { transform: scale(1); box-shadow: 0 0 5px currentColor; }
      50% { transform: scale(1.2); box-shadow: 0 0 15px currentColor; }
      100% { transform: scale(1); box-shadow: 0 0 5px currentColor; }
    }

    @media (max-width: 991.98px) {
      .map-card {
        height: 400px;
      }
    }
  `]
})
export class RutasComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) private mapContainerRef!: ElementRef<HTMLDivElement>;
  
  routes = signal<RouteDetail[]>([]);
  activeRoute = signal<RouteDetail>({} as RouteDetail);
  
  private map!: L.Map;
  private polylines: { id: string; glow: L.Polyline; core: L.Polyline }[] = [];
  private markers: L.Marker[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getRoutes().subscribe(res => {
      this.routes.set(res);
      if (res.length > 0) {
        this.activeRoute.set(res[0]);
      }
    });
  }

  ngAfterViewInit() {
    this.initMap();
    this.drawRoutesOnMap();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap() {
    const el = this.mapContainerRef.nativeElement;
    
    // Centered between Bolivia & Chile
    this.map = L.map(el, {
      zoomControl: true,
      attributionControl: false
    }).setView([-18.5, -67.5], 6);

    // Dark-themed tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18
    }).addTo(this.map);
  }

  private drawRoutesOnMap() {
    const rList = this.routes();
    
    rList.forEach(route => {
      const isSelected = route.id === this.activeRoute().id;
      const color = isSelected ? '#00B8FF' : '#005BFF';
      
      // Glow polyline
      const glowLine = L.polyline(route.coordinates, {
        color: color,
        weight: 8,
        opacity: isSelected ? 0.35 : 0.12,
        lineCap: 'round'
      }).addTo(this.map);

      // Core polyline
      const coreLine = L.polyline(route.coordinates, {
        color: color,
        weight: 3,
        opacity: isSelected ? 0.95 : 0.45,
        lineCap: 'round'
      }).addTo(this.map);

      // Set interactive event clicks
      coreLine.on('click', () => this.selectRoute(route.id));
      glowLine.on('click', () => this.selectRoute(route.id));

      this.polylines.push({
        id: route.id,
        glow: glowLine,
        core: coreLine
      });

      // Add Start/End nodes to the map if not already present
      if (route.coordinates.length > 0) {
        const startPt = route.coordinates[0];
        const endPt = route.coordinates[route.coordinates.length - 1];

        this.addNodeMarker(startPt, '#005BFF', route.origin);
        this.addNodeMarker(endPt, '#00B8FF', route.destination);
      }
    });
  }

  private addNodeMarker(pos: [number, number], color: string, name: string) {
    const customIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `<div class="glowing-marker-dot" style="background-color: ${color}; color: ${color}"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    const marker = L.marker(pos, { icon: customIcon })
      .addTo(this.map)
      .bindPopup(`<strong style="color: #fff">${name}</strong>`, { closeButton: false });

    this.markers.push(marker);
  }

  selectRoute(id: string) {
    const foundRoute = this.routes().find(r => r.id === id);
    if (!foundRoute) return;

    this.activeRoute.set(foundRoute);

    // Update lines colors and weights
    this.polylines.forEach(p => {
      const active = p.id === id;
      const color = active ? '#00B8FF' : '#005BFF';
      
      p.glow.setStyle({
        color: color,
        opacity: active ? 0.35 : 0.12,
        weight: active ? 10 : 8
      });

      p.core.setStyle({
        color: color,
        opacity: active ? 0.95 : 0.45,
        weight: active ? 4 : 3
      });

      if (active) {
        p.core.bringToFront();
      }
    });

    // Zoom map fit bounds
    const bounds = L.latLngBounds(foundRoute.coordinates);
    this.map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
  }

  getRoutePhoto(): string {
    const id = this.activeRoute().id;
    if (id.includes('santacruz')) {
      return 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&auto=format&fit=crop&q=80';
    } else if (id.includes('lapaz')) {
      return 'https://images.unsplash.com/photo-1591768793355-74d75b5735cf?w=400&auto=format&fit=crop&q=80';
    } else if (id.includes('cochabamba')) {
      return 'https://images.unsplash.com/photo-1519003722824-192d992a7de6?w=400&auto=format&fit=crop&q=80';
    } else {
      return 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop&q=80';
    }
  }
}
