import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

// Import all sub-sections of the Landing page
import { HeroComponent } from '../../components/hero/hero';
import { ServicesComponent } from '../../components/services/services';
import { WhyUsComponent } from '../../components/why-us/why-us';
import { RouteMapComponent } from '../../components/route-map/route-map';
import { StatsComponent } from '../../components/stats/stats';
import { TrackingComponent } from '../../components/tracking/tracking';

@Component({
  selector: 'app-page-inicio',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    ServicesComponent,
    WhyUsComponent,
    RouteMapComponent,
    StatsComponent,
    TrackingComponent
  ],
  template: `
    <!-- Cinematic Hero Section -->
    <app-hero></app-hero>

    <!-- Interactive Client Logos Infinite Marquee -->
    <section class="py-5 bg-grafito border-bottom border-glass overflow-hidden">
      <div class="container text-center">
        <h6 class="text-neon-blue small text-uppercase letter-spacing-2 mb-4">Empresas e Industrias que confían en nosotros</h6>
        <div class="logo-marquee-container">
          <div class="logo-marquee-track">
            <!-- Double the array to allow infinite seamless scroll -->
            <img 
              *ngFor="let logo of doubleLogos()" 
              [src]="logo" 
              alt="Client Logo" 
              class="marquee-logo mx-4"
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Core Services Section -->
    <app-services></app-services>

    <!-- Value Propositions / About Us Section -->
    <app-why-us></app-why-us>

    <!-- WebGL ThreeJS Route Map -->
    <app-route-map></app-route-map>

    <!-- Animated Counters Statistics -->
    <app-stats></app-stats>

    <!-- Real-time Satellite GPS Simulation -->
    <app-tracking></app-tracking>

    <!-- Premium Call To Action: Cotizaciones -->
    <section class="py-5 bg-gradient-deep border-top border-glass position-relative overflow-hidden">
      <div class="glow-cta position-absolute"></div>
      <div class="container position-relative z-2 py-4">
        <div class="row align-items-center justify-content-between g-4">
          <div class="col-lg-8 text-start text-lg-start">
            <span class="badge-premium mb-2 d-inline-block">SIN COMPROMISO</span>
            <h2 class="text-white fw-bold mb-2">¿Listo para coordinar su próximo despacho internacional?</h2>
            <p class="text-secondary mb-0">Solicite una cotización a medida. Nuestros operadores responderán en menos de 2 horas con tarifas y tiempos garantizados.</p>
          </div>
          <div class="col-lg-4 text-center text-lg-end">
            <!-- Redirección al sistema de cotizaciones simulado/existente -->
            <a href="https://transportesoscori.com/" target="_blank" class="btn-neon-orange btn-lg px-5 py-3 d-inline-flex align-items-center">
              <i class="fa-solid fa-file-invoice-dollar me-2 fs-5"></i> SOLICITAR COTIZACIÓN <i class="fa-solid fa-square-arrow-up-right ms-2 small"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .bg-grafito {
      background-color: var(--bg-primary);
    }
    
    .border-glass {
      border-color: rgba(255, 255, 255, 0.04) !important;
    }

    .letter-spacing-2 {
      letter-spacing: 2px;
    }

    .bg-gradient-deep {
      background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
    }

    .glow-cta {
      top: -50%;
      left: -20%;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(0, 91, 255, 0.08) 0%, transparent 70%);
      z-index: 1;
      pointer-events: none;
    }

    .badge-premium {
      background: rgba(0, 184, 255, 0.1);
      border: 1px solid rgba(0, 184, 255, 0.25);
      color: var(--neon-blue);
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 1px;
    }
  `]
})
export class InicioComponent implements OnInit {
  logos = signal<string[]>([]);
  doubleLogos = signal<string[]>([]);

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    // Load logos from ApiService
    const clientLogosList = this.apiService.clientLogos();
    this.logos.set(clientLogosList);
    // Duplicate array to achieve infinite scroll loop
    this.doubleLogos.set([...clientLogosList, ...clientLogosList, ...clientLogosList]);
  }
}
