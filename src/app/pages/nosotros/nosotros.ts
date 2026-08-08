import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-page-nosotros',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="nosotros-page bg-grafito min-vh-100 pt-5 pb-5">
      <!-- Title banner with mountain backdrop -->
      <section class="banner-section position-relative py-5 overflow-hidden border-bottom border-glass">
        <div class="banner-bg position-absolute w-100 h-100 top-0 start-0"></div>
        <div class="container position-relative z-2 py-5 text-center">
          <span class="badge-premium mb-3 d-inline-block">SOBRE NOSOTROS</span>
          <h1 class="display-4 text-white fw-black mb-3">Transportes OSCORI</h1>
          <p class="lead text-secondary max-w-600 mx-auto">Conectando las carreteras de Bolivia y Chile con precisión, seguridad e innovación tecnológica.</p>
        </div>
      </section>

      <!-- History and Presentation -->
      <section class="py-5">
        <div class="container">
          <div class="row align-items-center g-5">
            <div class="col-lg-6 text-start">
              <span class="section-subtitle">NUESTRA TRAYECTORIA</span>
              <h2 class="text-white fw-bold mb-4">Más de 15 años superando desafíos geográficos y aduaneros</h2>
              <p class="text-secondary mb-4 leading-relaxed">
                {{ companyInfo().history }}
              </p>
              <p class="text-secondary mb-4 leading-relaxed">
                Desde nuestros inicios, nos enfocamos en proveer un servicio diferenciado de transporte de carga pesada. Entendemos las complejidades del altiplano y de las fronteras binacionales. Por ello, invertimos continuamente en capacitar a nuestros conductores y equipar nuestras unidades con lo último en rastreo GPS y seguridad.
              </p>
            </div>
            
            <div class="col-lg-6">
              <div class="image-stack position-relative h-100 min-h-350">
                <img src="https://images.unsplash.com/photo-1516576885506-dfa1d82f6e91?w=600&auto=format&fit=crop&q=80" alt="Mountain pass truck" class="img-fluid rounded-4 border border-glass shadow-lg w-75 position-absolute top-0 start-0 z-2">
                <img src="https://images.unsplash.com/photo-1519003722824-192d992a7de6?w=600&auto=format&fit=crop&q=80" alt="Volvo Truck" class="img-fluid rounded-4 border border-glass shadow-lg w-75 position-absolute bottom-0 end-0 z-1">
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Mission and Vision -->
      <section class="py-5 bg-gradient-deep">
        <div class="container">
          <div class="row g-4 justify-content-center">
            <!-- Mission -->
            <div class="col-md-6 text-start">
              <div class="glass-card p-5 h-100 border-neon-blue-glow">
                <div class="icon-circle mb-4 text-neon-blue bg-blue-glow">
                  <i class="fa-solid fa-bullseye fs-3"></i>
                </div>
                <h3 class="text-white fw-bold mb-3">Misión</h3>
                <p class="text-secondary mb-0 leading-relaxed">{{ companyInfo().mission }}</p>
              </div>
            </div>
            
            <!-- Vision -->
            <div class="col-md-6 text-start">
              <div class="glass-card p-5 h-100 border-neon-orange-glow">
                <div class="icon-circle mb-4 text-neon-orange bg-orange-glow">
                  <i class="fa-solid fa-eye fs-3"></i>
                </div>
                <h3 class="text-white fw-bold mb-3">Visión</h3>
                <p class="text-secondary mb-0 leading-relaxed">{{ companyInfo().vision }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Values List -->
      <section class="py-5">
        <div class="container">
          <div class="text-center mb-5">
            <span class="section-subtitle">NUESTROS CIMIENTOS</span>
            <h2 class="text-white fw-bold">Valores Corporativos</h2>
          </div>
          
          <div class="row g-4 text-start">
            <div class="col-md-6 col-lg-3" *ngFor="let val of companyInfo().values">
              <div class="value-card glass-panel p-4 h-100 border-glass">
                <div class="text-neon-blue mb-3">
                  <i class="fa-solid fa-circle-check fs-4"></i>
                </div>
                <h5 class="text-white fw-bold mb-2">{{ val.name }}</h5>
                <p class="text-secondary small mb-0">{{ val.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Interactive Milestones Timeline -->
      <section class="py-5 bg-gradient-deep">
        <div class="container">
          <div class="text-center mb-5">
            <span class="section-subtitle">CRECIMIENTO</span>
            <h2 class="text-white fw-bold">Nuestra Historia en Hitos</h2>
          </div>
          
          <div class="timeline-wrapper position-relative py-4 ps-4 border-start border-glass max-w-800 mx-auto">
            <div 
              *ngFor="let mile of milestones; let idx = index" 
              class="milestone-item position-relative mb-5 text-start cursor-pointer"
              (click)="selectMilestone(idx)"
              [class.active]="selectedMilestoneIdx() === idx"
            >
              <!-- Timeline indicator dot -->
              <div class="timeline-dot-pos position-absolute start-0 translate-middle-x">
                <div class="timeline-dot" [class.active]="selectedMilestoneIdx() === idx">
                  <i [class]="mile.icon"></i>
                </div>
              </div>
              
              <div class="timeline-content-box ms-4 p-4 glass-panel border-glass" [class.highlighted]="selectedMilestoneIdx() === idx">
                <span class="badge-year text-neon-blue fw-black fs-5 mb-2 d-inline-block">{{ mile.year }}</span>
                <h5 class="text-white fw-bold mb-2">{{ mile.title }}</h5>
                <p class="text-secondary small mb-0">{{ mile.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Executive Team -->
      <section class="py-5">
        <div class="container">
          <div class="text-center mb-5">
            <span class="section-subtitle">LIDERAZGO</span>
            <h2 class="text-white fw-bold">Nuestro Equipo Directivo</h2>
          </div>
          
          <div class="row g-4 justify-content-center text-center">
            <div class="col-md-4" *ngFor="let member of companyInfo().team">
              <div class="team-card glass-panel p-4 h-100 border-glass">
                <div class="avatar-container mb-3 position-relative d-inline-block">
                  <img [src]="member.photo" [alt]="member.name" class="rounded-circle border border-glass shadow-lg profile-img">
                  <div class="avatar-glow position-absolute top-0 start-0 w-100 h-100 rounded-circle"></div>
                </div>
                <h5 class="text-white fw-bold mb-1">{{ member.name }}</h5>
                <p class="text-neon-blue small mb-0 fw-semibold">{{ member.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .nosotros-page {
      background-color: var(--bg-primary);
    }
    
    .banner-section {
      min-height: 250px;
      display: flex;
      align-items: center;
      background: radial-gradient(circle at center, rgba(0, 91, 255, 0.15) 0%, var(--bg-primary) 100%);
    }

    .banner-bg {
      background-image: linear-gradient(rgba(17, 24, 39, 0.9), rgba(17, 24, 39, 0.9)), url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&auto=format&fit=crop&q=80');
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
    .max-w-800 {
      max-width: 800px;
    }

    .min-h-350 {
      min-height: 380px;
    }

    /* Image Stack Parallax effect */
    .image-stack {
      img {
        transition: var(--transition-smooth);
        &:hover {
          transform: scale(1.03) translateZ(10px);
          z-index: 10 !important;
          border-color: var(--neon-blue);
        }
      }
    }

    /* Mission / Vision icon styles */
    .icon-circle {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid currentColor;
    }

    .bg-blue-glow {
      background: rgba(0, 184, 255, 0.1);
      box-shadow: 0 0 15px var(--neon-blue-glow);
    }
    .bg-orange-glow {
      background: rgba(0, 91, 255, 0.1);
      box-shadow: 0 0 15px var(--brand-blue-glow);
    }

    .bg-gradient-deep {
      background: linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
    }

    /* Value cards hover */
    .value-card {
      transition: var(--transition-smooth);
      &:hover {
        border-color: var(--neon-blue);
        background: var(--bg-card-hover);
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 184, 255, 0.08);
      }
    }

    /* History timeline styling */
    .timeline-wrapper {
      border-width: 2px !important;
      border-color: rgba(255, 255, 255, 0.05) !important;
    }
    .timeline-dot-pos {
      left: -26px !important;
      top: 30px;
    }
    .timeline-dot {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--bg-primary);
      border: 2px solid var(--text-muted);
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      z-index: 10;
      transition: var(--transition-smooth);
      
      &.active {
        background: var(--neon-blue);
        border-color: var(--neon-blue);
        color: #fff;
        box-shadow: 0 0 12px var(--neon-blue);
      }
    }

    .timeline-content-box {
      transition: var(--transition-smooth);
      &.highlighted {
        border-color: var(--neon-blue) !important;
        background: var(--bg-card-hover) !important;
        box-shadow: 0 0 20px rgba(0, 184, 255, 0.1);
        transform: scale(1.02);
      }
    }

    .badge-year {
      text-shadow: 0 0 5px var(--neon-blue-glow);
    }

    /* Team cards avatar */
    .profile-img {
      width: 120px;
      height: 120px;
      object-fit: cover;
      position: relative;
      z-index: 2;
    }

    .avatar-glow {
      border: 2px solid var(--neon-blue);
      box-shadow: 0 0 20px var(--neon-blue-glow);
      z-index: 1;
      opacity: 0;
      transform: scale(0.9);
      transition: var(--transition-smooth);
    }

    .team-card {
      transition: var(--transition-smooth);
      
      &:hover {
        border-color: var(--neon-blue);
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 184, 255, 0.08);
        
        .avatar-glow {
          opacity: 1;
          transform: scale(1.05);
        }
      }
    }
  `]
})
export class NosotrosComponent implements OnInit {
  companyInfo = signal<any>({} as any);
  selectedMilestoneIdx = signal<number>(0);

  milestones: Milestone[] = [
    { year: '2010', title: 'Fundación en La Paz', description: 'Inicio de operaciones con 2 tractocamiones dedicados al tramo Oruro - Arica.', icon: 'fa-solid fa-truck' },
    { year: '2015', title: 'Expansión de Flota', description: 'Adquisición de 12 semirremolques modernos y apertura de oficinas en la ciudad de Iquique (Chile).', icon: 'fa-solid fa-warehouse' },
    { year: '2020', title: 'Seguimiento Satelital GPS', description: 'Implementación integral de telemetría y monitoreo preventivo satelital en tiempo real en toda la flota.', icon: 'fa-solid fa-satellite-dish' },
    { year: '2025', title: 'Liderazgo Binacional', description: 'Consolidación de la ruta Santa Cruz - Iquique y reconocimiento por despacho oportuno sin incidencias.', icon: 'fa-solid fa-earth-americas' }
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.companyInfo.set(this.apiService.companyInfo());
  }

  selectMilestone(idx: number) {
    this.selectedMilestoneIdx.set(idx);
  }
}
