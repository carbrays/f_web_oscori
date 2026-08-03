import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TrackingStep {
  title: string;
  location: string;
  time: string;
  status: 'done' | 'active' | 'pending';
}

interface TrackingData {
  code: string;
  origin: string;
  destination: string;
  currentStatus: string;
  driver: string;
  plate: string;
  eta: string;
  steps: TrackingStep[];
}

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="tracking" class="section-padding position-relative">
      <div class="glow-bg-cyan position-absolute"></div>
      
      <div class="container position-relative z-2">
        <div class="row justify-content-center text-center mb-5">
          <div class="col-lg-7">
            <span class="section-subtitle">Rastreo Satelital</span>
            <h2 class="section-title text-white">Siga su Carga en Tiempo Real</h2>
            <p class="text-secondary">
              Ingrese el código de su manifiesto de carga internacional para obtener de inmediato el estado y los tiempos de tránsito estimativos.
            </p>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col-lg-8">
            <!-- Tracking Form -->
            <div class="tracking-search-box glass-panel p-4 mb-4 border-neon-blue-glow">
              <form (ngSubmit)="searchTracking()" class="row g-3 align-items-center">
                <div class="col-md-8">
                  <div class="input-group">
                    <span class="input-group-text bg-transparent text-secondary border-glass"><i class="fa-solid fa-barcode fs-4"></i></span>
                    <input 
                      type="text" 
                      name="trackingCode"
                      class="form-control bg-transparent text-white border-glass py-3 focus-orange" 
                      placeholder="Ingrese el código (Ej: OSC-7301-CL, OSC-9844-BO)"
                      [(ngModel)]="searchCode"
                      required
                    >
                  </div>
                </div>
                <div class="col-md-4">
                  <button type="submit" class="btn-neon-orange w-100 py-3 d-flex align-items-center justify-content-center" [disabled]="isLoading">
                    <span *ngIf="!isLoading">
                      <i class="fa-solid fa-location-crosshairs me-2"></i>Rastrear Carga
                    </span>
                    <span *ngIf="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  </button>
                </div>
              </form>
              
              <!-- Quick Help Demos -->
              <div class="mt-3 text-center text-secondary small">
                Códigos demo para probar: 
                <span class="demo-code-link mx-2" (click)="setDemoCode('OSC-7301-CL')">OSC-7301-CL</span> | 
                <span class="demo-code-link mx-2" (click)="setDemoCode('OSC-9844-BO')">OSC-9844-BO</span>
              </div>
            </div>

            <!-- Loading Spinner Trailer Animation -->
            <div class="glass-panel p-5 text-center mb-4" *ngIf="isLoading">
              <div class="truck-loading-animation mb-4">
                <i class="fa-solid fa-truck-moving text-neon-orange"></i>
              </div>
              <h5 class="text-white">Conectando con la Central Satelital GPS...</h5>
              <p class="text-muted small mb-0">Consultando posición en frontera y precintos de seguridad.</p>
            </div>

            <!-- Error Result -->
            <div class="alert alert-danger glass-panel border-danger text-white p-4" *ngIf="hasError && !isLoading">
              <div class="d-flex align-items-center">
                <i class="fa-solid fa-circle-exclamation fs-3 text-danger me-3"></i>
                <div>
                  <h5 class="fw-bold mb-1">Código de Carga no Identificado</h5>
                  <p class="mb-0 small text-secondary">
                    Por favor, verifique el código ingresado en su factura o MIC/DTA. Utilice alguno de los códigos de demostración en los enlaces superiores.
                  </p>
                </div>
              </div>
            </div>

            <!-- Tracking Result Detail -->
            <div class="tracking-results-panel glass-panel p-4" *ngIf="resultData && !isLoading && !hasError">
              <!-- Summary Header -->
              <div class="row align-items-center g-3 border-bottom border-glass pb-4 mb-4">
                <div class="col-md-6">
                  <span class="small text-muted d-block">CÓDIGO DE SEGUIMIENTO</span>
                  <h3 class="text-white fw-bold mb-0 text-neon-blue">{{ resultData.code }}</h3>
                </div>
                <div class="col-md-6 text-md-end">
                  <span class="status-badge" [ngClass]="resultData.currentStatus.includes('Entregada') ? 'status-delivered' : 'status-transit'">
                    <i class="fa-solid" [ngClass]="resultData.currentStatus.includes('Entregada') ? 'fa-circle-check' : 'fa-truck-ramp-box'"></i>
                    {{ resultData.currentStatus }}
                  </span>
                </div>
              </div>

              <!-- General Logistics details -->
              <div class="row g-4 mb-4 text-start">
                <div class="col-sm-6 col-md-3">
                  <span class="small text-muted d-block">ORIGEN</span>
                  <strong class="text-white small">{{ resultData.origin }}</strong>
                </div>
                <div class="col-sm-6 col-md-3">
                  <span class="small text-muted d-block">DESTINO</span>
                  <strong class="text-white small">{{ resultData.destination }}</strong>
                </div>
                <div class="col-sm-6 col-md-3">
                  <span class="small text-muted d-block">TRACTOCAMIÓN / CHOFER</span>
                  <span class="text-white small d-block">{{ resultData.plate }}</span>
                  <span class="text-muted x-small d-block">{{ resultData.driver }}</span>
                </div>
                <div class="col-sm-6 col-md-3">
                  <span class="small text-muted d-block">FECHA EST. / ENTREGA</span>
                  <strong class="text-neon-orange small">{{ resultData.eta }}</strong>
                </div>
              </div>

              <!-- Visual Timeline -->
              <div class="timeline-container ps-4 border-start border-glass position-relative ms-2">
                <div 
                  class="timeline-item position-relative mb-4" 
                  *ngFor="let step of resultData.steps"
                  [ngClass]="step.status"
                >
                  <!-- Custom marker dot -->
                  <div class="timeline-dot position-absolute start-0 translate-middle-x">
                    <i class="fa-solid" [ngClass]="step.status === 'done' ? 'fa-check' : (step.status === 'active' ? 'fa-truck-moving' : 'fa-circle-dot')"></i>
                  </div>
                  <div class="timeline-content ms-4 text-start">
                    <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                      <h6 class="text-white fw-bold mb-1" [class.text-neon-orange]="step.status === 'active'">{{ step.title }}</h6>
                      <span class="small text-muted">{{ step.time }}</span>
                    </div>
                    <p class="text-secondary small mb-0">{{ step.location }}</p>
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
    #tracking {
      background-color: var(--bg-secondary);
      z-index: 2;
    }

    .glow-bg-cyan {
      bottom: -10%;
      right: -10%;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(0, 240, 255, 0.06) 0%, transparent 70%);
      z-index: 1;
      pointer-events: none;
    }

    .border-neon-blue-glow {
      border-color: rgba(0, 240, 255, 0.15) !important;
      box-shadow: 0 4px 25px rgba(0, 240, 255, 0.05);
    }

    .border-glass {
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
    }

    .input-group-text {
      border-right: none !important;
    }

    input.form-control {
      border-left: none !important;
      font-size: 1rem;
      
      &:focus {
        background: transparent;
        color: white;
        border-color: var(--neon-orange) !important;
        box-shadow: 0 0 10px var(--neon-orange-glow);
      }
    }

    .demo-code-link {
      color: var(--neon-blue);
      text-decoration: underline;
      cursor: pointer;
      font-weight: 600;
      transition: var(--transition-smooth);
      
      &:hover {
        color: var(--neon-orange);
        text-shadow: 0 0 5px var(--neon-orange-glow);
      }
    }

    /* Truck loading animation */
    .truck-loading-animation {
      font-size: 3.5rem;
      display: inline-block;
      animation: truckDrive 2s infinite linear;
    }

    @keyframes truckDrive {
      0% { transform: translateX(-50px); opacity: 0; }
      20% { opacity: 1; }
      80% { opacity: 1; }
      100% { transform: translateX(50px); opacity: 0; }
    }

    /* Timeline Styling */
    .timeline-container {
      border-width: 2px !important;
    }

    .timeline-item {
      min-height: 50px;
    }

    .timeline-dot {
      left: -26px !important; /* adjust for borders */
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      background: var(--bg-primary);
      border: 2px solid var(--text-muted);
      color: var(--text-muted);
      z-index: 10;
    }

    /* Active & Completed steps statuses */
    .timeline-item.done {
      .timeline-dot {
        border-color: var(--neon-blue);
        color: var(--neon-blue);
        box-shadow: 0 0 8px var(--neon-blue-glow);
      }
    }

    .timeline-item.active {
      .timeline-dot {
        border-color: var(--neon-orange);
        color: var(--neon-orange);
        box-shadow: 0 0 10px var(--neon-orange-glow);
        animation: pulse 1.5s infinite;
      }
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 16px;
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: 700;
      
      &.status-delivered {
        background-color: rgba(22, 163, 74, 0.15);
        color: #4ade80;
        border: 1px solid rgba(22, 163, 74, 0.3);
      }
      
      &.status-transit {
        background-color: rgba(249, 115, 22, 0.15);
        color: var(--neon-orange);
        border: 1px solid rgba(249, 115, 22, 0.3);
      }
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); box-shadow: 0 0 15px var(--neon-orange); }
      100% { transform: scale(1); }
    }
  `]
})
export class TrackingComponent {
  searchCode = '';
  isLoading = false;
  hasError = false;
  resultData: TrackingData | null = null;

  // Mock tracking DB
  private mockDatabase: Record<string, TrackingData> = {
    'OSC-7301-CL': {
      code: 'OSC-7301-CL',
      origin: 'Puerto Iquique (Chile)',
      destination: 'Santa Cruz (Bolivia)',
      currentStatus: 'En Tránsito Internacional',
      plate: 'Mercedes-Benz Actros - Plat: 5938-KBD',
      driver: 'Hugo Choque Mamani',
      eta: '08 de Julio, 2026 - 10:00 AM (Aprox)',
      steps: [
        {
          title: 'Contenedor Recibido en Terminal Iquique',
          location: 'Terminal Puerto Iquique (CL)',
          time: '04 de Julio, 2026 - 09:00 AM',
          status: 'done'
        },
        {
          title: 'Carguío e Inspección Aduanera de Salida',
          location: 'Zona Franca Iquique (CL)',
          time: '05 de Julio, 2026 - 14:00 PM',
          status: 'done'
        },
        {
          title: 'Tránsito en Ruta y Cruce de Fronteras',
          location: 'Frontera Tambo Quemado - Aduana Nacional',
          time: '06 de Julio, 2026 - 02:00 AM (Último Registro)',
          status: 'active'
        },
        {
          title: 'Entrega Final en Almacenes de Cliente',
          location: 'Parque Industrial, Santa Cruz de la Sierra (BO)',
          time: 'Pendiente - Estimado 08/07',
          status: 'pending'
        }
      ]
    },
    'OSC-9844-BO': {
      code: 'OSC-9844-BO',
      origin: 'El Alto (Bolivia)',
      destination: 'Puerto Arica (Chile)',
      currentStatus: 'Carga Entregada con Éxito',
      plate: 'Volvo FH540 - Plat: 4920-PLX',
      driver: 'Rodrigo Mendoza Tapia',
      eta: 'Entregado el 04 de Julio, 2026 - 15:00 PM',
      steps: [
        {
          title: 'Despacho y Sellado de Seguridad en Origen',
          location: 'Complejo Industrial El Alto (BO)',
          time: '01 de Julio, 2026 - 08:00 AM',
          status: 'done'
        },
        {
          title: 'Cruce Aduanero y Emisión del MIC/DTA',
          location: 'Frontera Charaña / Visviri',
          time: '02 de Julio, 2026 - 16:00 PM',
          status: 'done'
        },
        {
          title: 'Recepción en Zona de Embarque Arica',
          location: 'Puerto de Arica, Terminal 02 (CL)',
          time: '03 de Julio, 2026 - 11:30 AM',
          status: 'done'
        },
        {
          title: 'Contenedor Estibado a Bordo de Buque Naviero',
          location: 'Puerto de Arica (CL)',
          time: '04 de Julio, 2026 - 15:00 PM',
          status: 'done'
        }
      ]
    }
  };

  setDemoCode(code: string) {
    this.searchCode = code;
    this.searchTracking();
  }

  searchTracking() {
    if (!this.searchCode.trim()) return;

    this.isLoading = true;
    this.hasError = false;
    this.resultData = null;

    // Simulate satellite latency
    setTimeout(() => {
      const codeKey = this.searchCode.trim().toUpperCase();
      if (this.mockDatabase[codeKey]) {
        this.resultData = this.mockDatabase[codeKey];
        this.hasError = false;
      } else {
        this.hasError = true;
        this.resultData = null;
      }
      this.isLoading = false;
    }, 1500);
  }
}
