import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ServiceDetail {
  icon: string;
  title: string;
  desc: string;
  details: string[];
  image: string;
}

interface FleetItem {
  brand: string;
  model: string;
  capacity: string;
  power: string;
  type: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-page-servicios',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="servicios-page bg-grafito min-vh-100 pt-5 pb-5">
      <!-- Title Banner -->
      <section class="banner-section position-relative py-5 overflow-hidden border-bottom border-glass">
        <div class="banner-bg position-absolute w-100 h-100 top-0 start-0"></div>
        <div class="container position-relative z-2 py-5 text-center">
          <span class="badge-premium mb-3 d-inline-block">SERVICIOS LOGÍSTICOS</span>
          <h1 class="display-4 text-white fw-black mb-3">Nuestras Soluciones de Transporte</h1>
          <p class="lead text-secondary max-w-600 mx-auto">Equipamiento tecnológico y flota pesada preparada para cumplir con los más altos estándares del comercio internacional.</p>
        </div>
      </section>

      <!-- Services List with alternates layout -->
      <section class="py-5">
        <div class="container">
          <div class="row g-5">
            <div class="col-12" *ngFor="let srv of services; let idx = index">
              <div class="row align-items-center g-5" [ngClass]="{'flex-row-reverse': idx % 2 === 1}">
                <!-- Image -->
                <div class="col-lg-6">
                  <div class="img-wrap position-relative">
                    <img [src]="srv.image" [alt]="srv.title" class="img-fluid rounded-4 border border-glass shadow-lg w-100">
                    <div class="glow-border position-absolute top-0 start-0 w-100 h-100 rounded-4"></div>
                  </div>
                </div>
                
                <!-- Content -->
                <div class="col-lg-6 text-start">
                  <div class="icon-wrap-neon blue mb-3">
                    <i [class]="srv.icon"></i>
                  </div>
                  <h3 class="text-white fw-bold mb-3">{{ srv.title }}</h3>
                  <p class="text-secondary leading-relaxed mb-4">{{ srv.desc }}</p>
                  
                  <div class="row g-3">
                    <div class="col-sm-6" *ngFor="let detail of srv.details">
                      <div class="d-flex align-items-center gap-2 text-secondary">
                        <i class="fa-solid fa-circle-check text-neon-blue"></i>
                        <span class="small">{{ detail }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Separator (omit on last item) -->
              <hr class="border-glass my-5" *ngIf="idx < services.length - 1">
            </div>
          </div>
        </div>
      </section>

      <!-- Fleet Presentation Section (Volvo, Scania, Mercedes style) -->
      <section class="py-5 bg-gradient-deep border-top border-bottom border-glass">
        <div class="container">
          <div class="text-center mb-5">
            <span class="section-subtitle">FLOTA PREMIUM</span>
            <h2 class="text-white fw-bold">Unidades de Alto Rendimiento</h2>
            <p class="text-secondary max-w-600 mx-auto">Contamos con camiones modernos provistos de sistemas de asistencia al conductor y reducción de impacto ecológico.</p>
          </div>
          
          <div class="row g-4 text-start">
            <div class="col-lg-4 col-md-6" *ngFor="let truck of fleet">
              <div class="fleet-card glass-panel h-100 overflow-hidden border-glass d-flex flex-column">
                <div class="fleet-img-wrap position-relative">
                  <img [src]="truck.image" [alt]="truck.brand + ' ' + truck.model" class="w-100 fleet-img">
                  <div class="img-gradient-overlay position-absolute bottom-0 w-100 p-3 d-flex justify-content-between align-items-end">
                    <span class="badge bg-neon-blue text-white fw-bold small">{{ truck.type }}</span>
                  </div>
                </div>
                
                <div class="p-4 flex-grow-1 d-flex flex-column justify-content-between">
                  <div>
                    <h5 class="text-white fw-bold mb-2">{{ truck.brand }} <span class="text-neon-blue">{{ truck.model }}</span></h5>
                    <p class="text-muted small mb-4">{{ truck.description }}</p>
                  </div>
                  
                  <div class="d-flex justify-content-between pt-3 border-top border-glass text-secondary small">
                    <div>
                      <i class="fa-solid fa-weight-hanging text-neon-blue me-1"></i> Cap.: <strong>{{ truck.capacity }}</strong>
                    </div>
                    <div>
                      <i class="fa-solid fa-gauge-high text-neon-blue me-1"></i> Pot.: <strong>{{ truck.power }}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .servicios-page {
      background-color: var(--bg-primary);
    }
    
    .banner-section {
      min-height: 250px;
      display: flex;
      align-items: center;
      background: radial-gradient(circle at center, rgba(0, 91, 255, 0.15) 0%, var(--bg-primary) 100%);
    }

    .banner-bg {
      background-image: linear-gradient(rgba(17, 24, 39, 0.9), rgba(17, 24, 39, 0.9)), url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80');
      background-size: cover;
      background-position: center;
      z-index: 1;
      opacity: 0.15;
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

    .max-w-600 {
      max-width: 600px;
    }

    .icon-wrap-neon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      
      &.blue {
        background: rgba(0, 184, 255, 0.12);
        color: var(--neon-blue);
        border: 1px solid rgba(0, 184, 255, 0.2);
        box-shadow: 0 0 10px rgba(0, 184, 255, 0.1);
      }
    }

    .img-wrap {
      overflow: hidden;
      border-radius: 16px;
      img {
        transition: var(--transition-smooth);
        &:hover {
          transform: scale(1.03);
        }
      }
    }

    .glow-border {
      border: 1px solid rgba(0, 184, 255, 0.2);
      pointer-events: none;
      box-shadow: inset 0 0 15px rgba(0, 184, 255, 0.05);
    }

    .bg-gradient-deep {
      background: linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
    }

    /* Fleet Cards */
    .fleet-card {
      transition: var(--transition-smooth);
      
      &:hover {
        transform: translateY(-5px);
        border-color: var(--neon-blue);
        box-shadow: 0 10px 30px rgba(0, 184, 255, 0.08);
        
        .fleet-img {
          transform: scale(1.05);
        }
      }
    }

    .fleet-img-wrap {
      overflow: hidden;
      height: 200px;
    }

    .fleet-img {
      height: 100%;
      object-fit: cover;
      transition: var(--transition-smooth);
    }

    .img-gradient-overlay {
      background: linear-gradient(to top, rgba(17, 24, 39, 0.9) 0%, transparent 100%);
      z-index: 2;
    }

    .bg-neon-blue {
      background-color: var(--brand-blue) !important;
      box-shadow: 0 0 8px var(--brand-blue-glow);
    }
  `]
})
export class ServiciosComponent implements OnInit {
  services: ServiceDetail[] = [
    {
      icon: 'fa-solid fa-file-import',
      title: 'Importación Directa (Chile -> Bolivia)',
      desc: 'Transportamos insumos industriales, mercaderías de Zona Franca y bienes de capital desde los puertos de Arica e Iquique hasta almacenes en La Paz, Oruro, Cochabamba y Santa Cruz. Gestionamos el precintado de aduana, emisión de MIC/DTA y seguros internacionales.',
      details: ['Trámites MIC/DTA en puertos chilenos', 'Precinto de seguridad satelital', 'Seguro de carga transfronterizo', 'Coordinación directa con aduana'],
      image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=80'
    },
    {
      icon: 'fa-solid fa-file-export',
      title: 'Exportación Segura (Bolivia -> Chile)',
      desc: 'Corredores logísticos especializados para la exportación de la producción nacional (soya, minerales, madera, alimentos y manufacturas) hacia los puertos de embarque del norte de Chile para su despacho global.',
      details: ['Desaduanización rápida de salida', 'Estiba y coordinación en puertos', 'Control de peso de camiones', 'Garantía de tiempos de entrega en puerto'],
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'
    },
    {
      icon: 'fa-solid fa-truck-ramp-box',
      title: 'Transporte de Carga Pesada y Contenedores',
      desc: 'Equipamiento robusto para la movilización de contenedores FCL y carga general sobredimensionada. Nuestras unidades están adaptadas para el tránsito seguro por el altiplano andino bajo climas severos.',
      details: ['Semirremolques porta-contenedores', 'Plataformas planas reforzadas', 'Unidades furgonadas herméticas', 'Carga consolidada consolidante'],
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=80'
    }
  ];

  fleet: FleetItem[] = [
    {
      brand: 'Volvo',
      model: 'FH540 Globetrotter',
      capacity: '45 Toneladas',
      power: '540 HP',
      type: 'Tractocamión',
      description: 'Líder en seguridad altiplánica. Equipado con frenado electrónico EBS y control de carril para el cruce de la Cordillera de los Andes.',
      image: 'https://images.unsplash.com/photo-1591768793355-74d75b5735cf?w=400&auto=format&fit=crop&q=80'
    },
    {
      brand: 'Scania',
      model: 'R540 XT V8',
      capacity: '45 Toneladas',
      power: '540 HP',
      type: 'Tractocamión',
      description: 'Diseño reforzado XT para condiciones extremas de desierto y polvo. Alta eficiencia en torque para pendientes de alta montaña.',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&auto=format&fit=crop&q=80'
    },
    {
      brand: 'Mercedes-Benz',
      model: 'Actros 2646',
      capacity: '42 Toneladas',
      power: '460 HP',
      type: 'Tractocamión',
      description: 'Equipado con telemetría de consumo inteligente. Confort total para viajes de larga distancia y estabilidad aerodinámica superior.',
      image: 'https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?w=400&auto=format&fit=crop&q=80'
    }
  ];

  ngOnInit() {}
}
