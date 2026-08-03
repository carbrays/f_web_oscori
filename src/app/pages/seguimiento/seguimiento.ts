import { Component, OnInit, AfterViewInit, OnDestroy, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, TrackingData } from '../../services/api.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-page-seguimiento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="seguimiento-page bg-grafito min-vh-100 pt-5 pb-5">
      <!-- Title Header -->
      <section class="banner-section position-relative py-4 border-bottom border-glass mb-4">
        <div class="container text-center pt-5">
          <span class="badge-premium mb-2 d-inline-block">RASTREO SATELITAL GPS</span>
          <h1 class="text-white fw-black mb-1">Monitoreo de Carga en Vivo</h1>
          <p class="text-secondary small mb-0">Consulte el estado de tránsito de su manifiesto internacional y la ubicación GPS exacta del camión.</p>
        </div>
      </section>

      <div class="container">
        <div class="row justify-content-center g-4">
          <!-- Search box -->
          <div class="col-lg-8">
            <div class="search-card glass-panel p-4 mb-4 border-neon-blue-glow text-start">
              <h5 class="text-white fw-bold mb-3">Buscar Manifiesto de Carga</h5>
              <form (ngSubmit)="queryGPS()" class="row g-3">
                <div class="col-md-9">
                  <div class="input-group">
                    <span class="input-group-text bg-transparent text-secondary border-glass"><i class="fa-solid fa-barcode fs-5"></i></span>
                    <input 
                      type="text" 
                      class="form-control bg-transparent text-white border-glass py-3 focus-orange" 
                      placeholder="Ingrese código de seguimiento (Ej: OSC-7301-CL, OSC-9844-BO)"
                      [(ngModel)]="searchCode"
                      name="searchCode"
                      required
                    >
                  </div>
                </div>
                <div class="col-md-3">
                  <button type="submit" class="btn-neon-orange w-100 py-3 d-flex align-items-center justify-content-center" [disabled]="loading()">
                    <span *ngIf="!loading()"><i class="fa-solid fa-satellite-dish me-2"></i>Consultar</span>
                    <span *ngIf="loading()" class="spinner-border spinner-border-sm" role="status"></span>
                  </button>
                </div>
              </form>
              <div class="mt-3 text-secondary small">
                Códigos de demostración para probar: 
                <span class="demo-link mx-2" (click)="loadDemo('OSC-7301-CL')">OSC-7301-CL (En ruta)</span> | 
                <span class="demo-link mx-2" (click)="loadDemo('OSC-9844-BO')">OSC-9844-BO (Entregado)</span>
              </div>
            </div>
          </div>

          <!-- Loading state -->
          <div class="col-lg-8" *ngIf="loading()">
            <div class="glass-panel p-5 text-center">
              <div class="truck-spin mb-4"><i class="fa-solid fa-truck-moving text-neon-blue"></i></div>
              <h5 class="text-white">Conectando con transpondedor satelital...</h5>
              <p class="text-muted small mb-0">Localizando señal GPS en fronteras andinas.</p>
            </div>
          </div>

          <!-- Error state -->
          <div class="col-lg-8" *ngIf="error() && !loading()">
            <div class="alert alert-danger glass-panel border-danger text-white p-4 text-start">
              <i class="fa-solid fa-circle-exclamation fs-3 text-danger me-3 d-inline-block align-middle"></i>
              <div class="d-inline-block align-middle">
                <h5 class="fw-bold mb-1">Manifiesto No Identificado</h5>
                <p class="mb-0 small text-secondary">El código ingresado no coincide con ningún despacho activo en base de datos. Utilice los códigos demo.</p>
              </div>
            </div>
          </div>

          <!-- Result layout -->
          <div class="col-12" *ngIf="trackingResult() && !loading() && !error()">
            <div class="row g-4">
              <!-- Left Col: Details & Progress Timeline -->
              <div class="col-lg-5 text-start">
                <div class="glass-panel p-4 h-100 border-glass">
                  <!-- Header details -->
                  <div class="border-bottom border-glass pb-3 mb-4">
                    <span class="text-muted x-small d-block">CÓDIGO DE TRÁNSITO</span>
                    <h3 class="text-neon-blue fw-bold mb-2">{{ trackingResult()!.code }}</h3>
                    <span class="badge" [ngClass]="trackingResult()!.currentStatus.includes('Entregada') ? 'badge-delivered' : 'badge-transit'">
                      <i class="fa-solid me-1" [ngClass]="trackingResult()!.currentStatus.includes('Entregada') ? 'fa-circle-check' : 'fa-truck-moving'"></i>
                      {{ trackingResult()!.currentStatus }}
                    </span>
                  </div>

                  <!-- General Info Grid -->
                  <div class="row g-3 mb-4">
                    <div class="col-6">
                      <span class="text-muted d-block x-small">ORIGEN</span>
                      <strong class="text-white small">{{ trackingResult()!.origin }}</strong>
                    </div>
                    <div class="col-6">
                      <span class="text-muted d-block x-small">DESTINO</span>
                      <strong class="text-white small">{{ trackingResult()!.destination }}</strong>
                    </div>
                    <div class="col-6">
                      <span class="text-muted d-block x-small">TRACTOCAMIÓN / PLACA</span>
                      <strong class="text-white small">{{ trackingResult()!.plate }}</strong>
                    </div>
                    <div class="col-6">
                      <span class="text-muted d-block x-small">ETA ESTIMADA</span>
                      <strong class="text-neon-orange small">{{ trackingResult()!.eta }}</strong>
                    </div>
                  </div>

                  <!-- Driver Details -->
                  <div class="driver-box p-3 glass-panel border-glass mb-4 d-flex align-items-center gap-3" *ngIf="trackingResult()!.driver">
                    <img [src]="trackingResult()!.driverPhoto" [alt]="trackingResult()!.driver" class="rounded-circle driver-photo border border-glass">
                    <div>
                      <span class="text-muted d-block x-small">CONDUCTOR ASIGNADO</span>
                      <strong class="text-white small">{{ trackingResult()!.driver }}</strong>
                      <span class="d-block text-secondary x-small">Certificación de Carga Pesada Binacional</span>
                    </div>
                  </div>

                  <!-- Progress Itinerary steps -->
                  <h6 class="text-white fw-bold mb-3 small">ITINERARIO LOGÍSTICO:</h6>
                  <div class="tracking-timeline ps-4 border-start border-glass position-relative ms-2">
                    <div 
                      class="timeline-item position-relative mb-4"
                      *ngFor="let step of trackingResult()!.steps"
                      [ngClass]="step.status"
                    >
                      <div class="timeline-dot-pos position-absolute start-0 translate-middle-x">
                        <div class="timeline-dot">
                          <i class="fa-solid" [ngClass]="step.status === 'done' ? 'fa-check' : (step.status === 'active' ? 'fa-truck-moving' : 'fa-circle')"></i>
                        </div>
                      </div>
                      
                      <div class="ms-3">
                        <h6 class="text-white fw-bold mb-0 small" [class.text-neon-orange]="step.status === 'active'">{{ step.title }}</h6>
                        <span class="x-small text-muted d-block">{{ step.time }}</span>
                        <p class="text-secondary x-small mb-0">{{ step.location }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Col: GPS Live Map -->
              <div class="col-lg-7">
                <div class="glass-panel p-2 h-100 border-neon-blue-glow d-flex flex-column" style="min-height: 480px;">
                  <div class="live-map flex-grow-1" #liveMapContainer></div>
                  <div class="p-2 text-start text-secondary small">
                    <i class="fa-solid fa-satellite text-neon-blue me-2"></i> Posición en tiempo real provista por el transmisor satelital GPS incorporado en el camión.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .seguimiento-page {
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

    .border-glass {
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
    }

    .border-neon-blue-glow {
      border-color: rgba(0, 184, 255, 0.2) !important;
      box-shadow: 0 4px 25px rgba(0, 184, 255, 0.05);
    }

    .input-group-text {
      border-right: none !important;
    }

    input.form-control {
      border-left: none !important;
      font-size: 1rem;
      &:focus {
        background: transparent;
        border-color: var(--neon-blue) !important;
        box-shadow: 0 0 10px var(--neon-blue-glow) !important;
        color: white;
      }
    }

    .demo-link {
      color: var(--neon-blue);
      text-decoration: underline;
      cursor: pointer;
      font-weight: 600;
      transition: var(--transition-smooth);
      &:hover {
        color: var(--white);
      }
    }

    .truck-spin {
      font-size: 3.5rem;
      display: inline-block;
      animation: truckMove 2s infinite linear;
    }

    @keyframes truckMove {
      0% { transform: translateX(-40px); opacity: 0; }
      20% { opacity: 1; }
      80% { opacity: 1; }
      100% { transform: translateX(40px); opacity: 0; }
    }

    .x-small {
      font-size: 0.65rem;
      letter-spacing: 0.5px;
    }

    .badge-delivered {
      background: rgba(40, 167, 69, 0.15);
      border: 1px solid rgba(40, 167, 69, 0.3);
      color: #28a745;
    }
    .badge-transit {
      background: rgba(255, 107, 0, 0.15);
      border: 1px solid rgba(255, 107, 0, 0.3);
      color: #ff6b00;
    }

    .driver-photo {
      width: 55px;
      height: 55px;
      object-fit: cover;
    }

    /* Timeline tracker */
    .tracking-timeline {
      border-width: 2px !important;
      border-color: rgba(255, 255, 255, 0.05) !important;
    }
    .timeline-dot-pos {
      left: -26px !important;
      top: 0px;
    }
    .timeline-dot {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--bg-primary);
      border: 2px solid var(--text-muted);
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.65rem;
      z-index: 10;
    }

    .timeline-item.done {
      .timeline-dot {
        border-color: var(--neon-blue);
        color: var(--neon-blue);
        box-shadow: 0 0 6px var(--neon-blue-glow);
      }
    }
    .timeline-item.active {
      .timeline-dot {
        border-color: var(--neon-orange);
        color: var(--neon-orange);
        box-shadow: 0 0 8px var(--neon-orange-glow);
        animation: activePulse 1.5s infinite ease-in-out;
      }
    }

    @keyframes activePulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.15); }
      100% { transform: scale(1); }
    }

    .live-map {
      border-radius: 12px;
      height: 100%;
    }

    /* Custom glowing truck marker on map */
    ::ng-deep .truck-map-marker {
      background: transparent;
      border: none;
    }
    ::ng-deep .glowing-truck-marker {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--bg-secondary);
      border: 2px solid var(--neon-blue);
      color: var(--neon-blue);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 15px var(--neon-blue);
      font-size: 1rem;
      animation: truckPulse 2s infinite ease-in-out;
    }
    @keyframes truckPulse {
      0% { transform: scale(1); box-shadow: 0 0 10px var(--neon-blue-glow); }
      50% { transform: scale(1.15); box-shadow: 0 0 25px var(--neon-blue); }
      100% { transform: scale(1); box-shadow: 0 0 10px var(--neon-blue-glow); }
    }
  `]
})
export class SeguimientoComponent implements OnInit, OnDestroy {
  @ViewChild('liveMapContainer') private mapRef!: ElementRef<HTMLDivElement>;

  searchCode = '';
  loading = signal<boolean>(false);
  error = signal<boolean>(false);
  trackingResult = signal<TrackingData | null>(null);

  private map!: L.Map;
  private truckMarker!: L.Marker;
  private pathLine!: L.Polyline;

  constructor(private apiService: ApiService) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.destroyMap();
  }

  loadDemo(code: string) {
    this.searchCode = code;
    this.queryGPS();
  }

  queryGPS() {
    if (!this.searchCode.trim()) return;

    this.loading.set(true);
    this.error.set(false);
    this.trackingResult.set(null);
    this.destroyMap();

    this.apiService.getTracking(this.searchCode).subscribe(res => {
      if (res) {
        this.trackingResult.set(res);
        this.error.set(false);
        // Initialize map after Angular updates the view
        setTimeout(() => {
          this.initTrackingMap(res);
        }, 100);
      } else {
        this.error.set(true);
      }
      this.loading.set(false);
    });
  }

  private destroyMap() {
    if (this.map) {
      this.map.remove();
      (this.map as any) = null;
    }
  }

  private initTrackingMap(data: TrackingData) {
    const el = this.mapRef.nativeElement;
    
    // Center around the current truck location
    this.map = L.map(el, {
      zoomControl: true,
      attributionControl: false
    }).setView(data.location, 8);

    // Dark styled tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18
    }).addTo(this.map);

    // Custom Marker for Truck position (divIcon with truck fontawesome)
    const truckIcon = L.divIcon({
      className: 'truck-map-marker',
      html: `<div class="glowing-truck-marker"><i class="fa-solid fa-truck"></i></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    this.truckMarker = L.marker(data.location, { icon: truckIcon })
      .addTo(this.map)
      .bindPopup(`<div style="color:#fff; text-align:left;">
                    <strong style="color:var(--neon-blue);">${data.code}</strong><br>
                    <span>Chofer: ${data.driver}</span><br>
                    <span>Placa: ${data.plate.split('|')[0]}</span>
                  </div>`)
      .openPopup();

    // Map markers for Route endpoints
    const originCoords = data.steps[0].status === 'done' ? data.location : data.location; // fallback
    
    // Zoom slightly out to show surrounding area
    this.map.panTo(data.location);
  }
}
