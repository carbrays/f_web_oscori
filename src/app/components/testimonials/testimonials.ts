import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
  avatar: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="testimonials" class="section-padding position-relative overflow-hidden">
      <!-- Background details -->
      <div class="circles-decor position-absolute"></div>
      
      <div class="container position-relative z-2">
        <!-- Section Header -->
        <div class="row mb-5 justify-content-center text-center">
          <div class="col-lg-7">
            <span class="section-subtitle">Testimonios</span>
            <h2 class="section-title text-white">Nuestros Clientes Hablan por Nosotros</h2>
            <p class="text-secondary">
              Conozca la experiencia de importadores y exportadores que confían diariamente su mercadería en nuestras manos.
            </p>
          </div>
        </div>

        <!-- Carousel Wrapper -->
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="testimonial-carousel glass-panel p-5 position-relative text-center border-neon-orange-glow">
              
              <!-- Quote Marks Icon -->
              <div class="quote-icon mb-4 text-neon-orange">
                <i class="fa-solid fa-quote-left"></i>
              </div>

              <!-- Testimonial Items -->
              <div class="slides-container position-relative">
                <div 
                  class="slide-item" 
                  *ngFor="let t of testimonials; let i = index" 
                  [class.active]="i === activeIndex"
                >
                  <p class="testimonial-text mb-4 text-white fs-5">
                    "{{ t.text }}"
                  </p>
                  
                  <div class="stars mb-3">
                    <i class="fa-solid fa-star text-warning mx-1" *ngFor="let s of [1,2,3,4,5]"></i>
                  </div>
                  
                  <div class="client-meta">
                    <h6 class="client-name text-white fw-bold mb-0">{{ t.name }}</h6>
                    <span class="client-role text-neon-blue small">{{ t.role }} - <strong>{{ t.company }}</strong></span>
                  </div>
                </div>
              </div>

              <!-- Carousel Controls Dots -->
              <div class="carousel-dots d-flex justify-content-center gap-2 mt-4 pt-2">
                <span 
                  class="dot" 
                  *ngFor="let t of testimonials; let i = index" 
                  [class.active]="i === activeIndex"
                  (click)="setSlide(i)"
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    #testimonials {
      background-color: var(--bg-primary);
      z-index: 2;
    }

    .circles-decor {
      top: -20%;
      right: 5%;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(255, 107, 0, 0.05) 0%, transparent 60%);
      z-index: 1;
      pointer-events: none;
    }

    .testimonial-carousel {
      background: rgba(13, 20, 38, 0.55);
      border-radius: 24px;
      min-height: 380px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    }

    .quote-icon {
      font-size: 3rem;
      opacity: 0.6;
    }

    .slides-container {
      min-height: 200px;
    }

    .slide-item {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      opacity: 0;
      transform: scale(0.95) translateY(10px);
      transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
      visibility: hidden;
      
      &.active {
        position: relative;
        opacity: 1;
        transform: scale(1) translateY(0);
        pointer-events: auto;
        visibility: visible;
      }
    }

    .testimonial-text {
      font-style: italic;
      font-weight: 300;
      line-height: 1.6;
    }

    .carousel-dots {
      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: var(--text-muted);
        cursor: pointer;
        transition: var(--transition-smooth);
        
        &:hover {
          background-color: var(--neon-blue);
        }
        
        &.active {
          width: 30px;
          border-radius: 50px;
          background-color: var(--neon-orange);
          box-shadow: 0 0 10px var(--neon-orange-glow);
        }
      }
    }
  `]
})
export class TestimonialsComponent implements OnInit, OnDestroy {
  activeIndex = 0;
  private intervalTimer: any;

  testimonials: Testimonial[] = [
    {
      name: 'Ing. Roberto Siles',
      role: 'Gerente de Operaciones',
      company: 'Minera Andina S.A.',
      text: 'Transportes OSCORI ha sido nuestro aliado estratégico clave para la importación de maquinaria minera pesada desde el puerto de Iquique. Su gestión aduanera en frontera es impecable y la seguridad que brindan a la carga nos da total tranquilidad.',
      rating: 5,
      avatar: ''
    },
    {
      name: 'Lic. Patricia Vargas',
      role: 'Directora de Logística',
      company: 'AgroBO Exportadora',
      text: 'Llevamos exportando soya e insumos hacia mercados de ultramar a través del puerto de Arica por más de 5 años. Trabajar con OSCORI nos garantiza una puntualidad rigurosa para cumplir con los plazos de estiba de las navieras.',
      rating: 5,
      avatar: ''
    },
    {
      name: 'Dr. Juan Carlos Mendoza',
      role: 'Presidente',
      company: 'Importadora Retail Bolivia',
      text: 'El sistema de seguimiento satelital de OSCORI y la atención directa de su personal son inigualables. Saber exactamente en qué punto de la carretera se encuentra nuestro camión y recibir reportes en tiempo real optimiza toda nuestra cadena de distribución.',
      rating: 5,
      avatar: ''
    }
  ];

  ngOnInit() {
    this.startAutoRotation();
  }

  ngOnDestroy() {
    this.stopAutoRotation();
  }

  startAutoRotation() {
    this.intervalTimer = setInterval(() => {
      this.nextSlide();
    }, 6000); // Rotate every 6 seconds
  }

  stopAutoRotation() {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
    }
  }

  nextSlide() {
    this.activeIndex = (this.activeIndex + 1) % this.testimonials.length;
  }

  setSlide(index: number) {
    this.activeIndex = index;
    this.stopAutoRotation();
    this.startAutoRotation(); // Reset timer on manual select
  }
}
