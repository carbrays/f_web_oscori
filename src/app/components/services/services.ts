import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ServiceItem {
  icon: string;
  title: string;
  description: string;
  accent: 'orange' | 'blue';
  details: string[];
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="services" class="section-padding position-relative">
      <div class="container">
        <!-- Section Header -->
        <div class="row mb-5 justify-content-center text-center">
          <div class="col-lg-7">
            <span class="section-subtitle">Nuestros Servicios</span>
            <h2 class="section-title">Soluciones Logísticas Especializadas</h2>
            <p class="text-secondary">
              Ofrecemos servicios de transporte internacional y logística diseñados para garantizar que su mercancía cruce fronteras de forma rápida y segura.
            </p>
          </div>
        </div>

        <!-- Services Grid -->
        <div class="row g-4 justify-content-center tilt-card-wrap">
          <div 
            class="col-md-6 col-lg-4 service-card-col" 
            *ngFor="let service of services"
          >
            <div 
              #cardElement
              class="glass-card h-100 p-4 d-flex flex-column service-card"
              [ngClass]="service.accent === 'orange' ? 'accent-orange' : 'accent-blue'"
              (mousemove)="onMouseMove($event, cardElement)"
              (mouseleave)="onMouseLeave(cardElement)"
            >
              <div class="icon-container mb-4">
                <i [class]="service.icon"></i>
              </div>
              
              <h4 class="card-title mb-3">{{ service.title }}</h4>
              <p class="card-desc text-secondary mb-4 flex-grow-1">{{ service.description }}</p>
              
              <ul class="service-details mb-0 ps-0 list-unstyled">
                <li class="d-flex align-items-center mb-2 text-secondary" *ngFor="let item of service.details">
                  <i class="fa-solid fa-circle-check me-2" [ngClass]="service.accent === 'orange' ? 'text-neon-orange' : 'text-neon-blue'"></i>
                  <span class="small">{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    #services {
      background-color: var(--bg-primary);
      z-index: 2;
    }

    .service-card {
      position: relative;
      transition: transform 0.15s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease, border-color 0.3s ease;
      transform-style: preserve-3d;
      backface-visibility: hidden;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.05) 0%, transparent 60%);
        opacity: 0;
        transition: opacity 0.5s ease;
        pointer-events: none;
      }
      
      &:hover::before {
        opacity: 1;
      }
    }

    .icon-container {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      transition: var(--transition-smooth);
      transform: translateZ(30px); /* 3D layer pop */
    }

    .card-title {
      font-weight: 700;
      color: #ffffff;
      transform: translateZ(20px);
    }

    .card-desc {
      transform: translateZ(10px);
    }

    .service-details {
      transform: translateZ(15px);
    }

    /* Accent Classes */
    .accent-orange {
      .icon-container {
        background: rgba(255, 107, 0, 0.1);
        color: var(--neon-orange);
        border: 1px solid rgba(255, 107, 0, 0.2);
        box-shadow: 0 0 15px rgba(255, 107, 0, 0.1);
      }
      
      &:hover {
        border-color: rgba(255, 107, 0, 0.3);
        box-shadow: 0 10px 30px rgba(255, 107, 0, 0.15) !important;
      }
    }

    .accent-blue {
      .icon-container {
        background: rgba(0, 240, 255, 0.1);
        color: var(--neon-blue);
        border: 1px solid rgba(0, 240, 255, 0.2);
        box-shadow: 0 0 15px rgba(0, 240, 255, 0.1);
      }
      
      &:hover {
        border-color: rgba(0, 240, 255, 0.3);
        box-shadow: 0 10px 30px rgba(0, 240, 255, 0.15) !important;
      }
    }

    /* Hover adjustments */
    .service-card:hover {
      .icon-container {
        transform: translateZ(40px) scale(1.1);
        box-shadow: 0 0 25px currentColor;
      }
    }
  `]
})
export class ServicesComponent implements AfterViewInit {
  services: ServiceItem[] = [
    {
      icon: 'fa-solid fa-file-import',
      title: 'Importación Directa',
      description: 'Traemos sus insumos, maquinaria y productos terminados desde puertos chilenos (Arica, Iquique, San Antonio) hacia Bolivia con trámites aduaneros optimizados.',
      accent: 'orange',
      details: ['Desaduanización rápida', 'Enlace directo con puertos chilenos', 'Flota certificada']
    },
    {
      icon: 'fa-solid fa-file-export',
      title: 'Exportación Segura',
      description: 'Llevamos la producción nacional boliviana (minerales, soya, madera, etc.) hacia puertos de embarque chilenos para su distribución global con los más altos estándares.',
      accent: 'blue',
      details: ['Logística de puerto chilena', 'Coordinación con navieras', 'Estrictas normas de seguridad']
    },
    {
      icon: 'fa-solid fa-truck-container',
      title: 'Transporte en Tráiler',
      description: 'Contamos con una moderna flota de tractocamiones y semirremolques adaptados para carga contenerizada, granel, sobredimensionada y carga consolidada.',
      accent: 'orange',
      details: ['Tráileres modernos de alta potencia', 'Conductores calificados en ruta', 'Seguro de carga internacional']
    },
    {
      icon: 'fa-solid fa-satellite-dish',
      title: 'Seguimiento Satelital',
      description: 'Monitoreo continuo de cada unidad en tránsito mediante GPS satelital. Acceda a información precisa sobre la ubicación y tiempos estimados de llegada.',
      accent: 'blue',
      details: ['Actualización en tiempo real', 'Alertas automáticas en fronteras', 'Soporte 24/7 de tráfico']
    },
    {
      icon: 'fa-solid fa-warehouse',
      title: 'Almacenamiento y Depósito',
      description: 'Instalaciones de almacenamiento seguro en puntos estratégicos de Bolivia y cercanías a la frontera con Chile para consolidar, resguardar y clasificar su carga.',
      accent: 'orange',
      details: ['Control estricto de inventarios', 'Zonas de carga y descarga', 'Seguridad física armada']
    },
    {
      icon: 'fa-solid fa-handshake-angle',
      title: 'Asesoría Aduanera',
      description: 'Asesoramiento experto sobre normativas aduaneras en Bolivia y Chile, aranceles, regímenes de importación/exportación y resolución de incidencias en frontera.',
      accent: 'blue',
      details: ['Expertos en MIC/DTA y CRT', 'Clasificación arancelaria', 'Evitamos retrasos y multas']
    }
  ];

  ngAfterViewInit() {
    gsap.from('.service-card-col', {
      scrollTrigger: {
        trigger: '#services',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out'
    });
  }

  onMouseMove(event: MouseEvent, card: HTMLDivElement) {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left; // x position within the element
    const y = event.clientY - rect.top;  // y position within the element
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((centerY - y) / centerY) * 12; // Max 12 deg
    const rotateY = ((x - centerX) / centerX) * 12; // Max 12 deg
    
    // Set custom CSS variables for light reflection gradient
    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${pctX}%`);
    card.style.setProperty('--mouse-y', `${pctY}%`);
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }

  onMouseLeave(card: HTMLDivElement) {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  }
}
