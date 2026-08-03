import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ReasonItem {
  icon: string;
  title: string;
  desc: string;
  badge: string;
}

@Component({
  selector: 'app-why-us',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="why-us" class="section-padding position-relative overflow-hidden">
      <!-- Decorative background blur -->
      <div class="glow-bg position-absolute"></div>
      
      <div class="container position-relative z-2">
        <div class="row align-items-center g-5">
          <!-- Left Column: Big visual presentation -->
          <div class="col-lg-5 why-us-left">
            <span class="section-subtitle">¿Por qué elegirnos?</span>
            <h2 class="section-title text-white mb-4">Llevamos su confianza sobre ruedas, cruzando fronteras</h2>
            <p class="text-secondary mb-4">
              En Transportes OSCORI entendemos que su mercadería representa el motor de su empresa. Por eso hemos construido una red de transporte internacional altamente eficiente, segura y conectada entre Bolivia y Chile.
            </p>
            
            <div class="experience-box glass-panel p-4 d-flex align-items-center gap-4 border-neon-orange">
              <h1 class="exp-number mb-0 text-neon-orange">15+</h1>
              <div>
                <h5 class="mb-1 text-white fw-bold">Años de Liderazgo</h5>
                <p class="mb-0 text-secondary small">Superando los retos geográficos y aduaneros más exigentes.</p>
              </div>
            </div>
          </div>
          
          <!-- Right Column: Interactive cards list -->
          <div class="col-lg-7">
            <div class="row g-4">
              <div class="col-sm-6" *ngFor="let item of reasons">
                <div class="why-card glass-panel p-4 h-100 d-flex flex-column">
                  <div class="why-icon-wrap mb-3" [ngClass]="item.badge">
                    <i [class]="item.icon"></i>
                  </div>
                  <h5 class="text-white fw-bold mb-2">{{ item.title }}</h5>
                  <p class="text-secondary small mb-0 flex-grow-1">{{ item.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    #why-us {
      background-color: var(--bg-secondary);
      z-index: 2;
    }

    .glow-bg {
      top: 50%;
      left: -10%;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(255, 107, 0, 0.08) 0%, transparent 70%);
      z-index: 1;
      pointer-events: none;
      transform: translateY(-50%);
    }

    .experience-box {
      background: rgba(255, 107, 0, 0.05);
      
      .exp-number {
        font-size: 3.5rem;
        font-weight: 900;
        line-height: 1;
      }
    }

    .why-card {
      transition: var(--transition-smooth);
      
      &:hover {
        transform: translateY(-5px);
        background: var(--bg-card-hover);
        border-color: rgba(255, 107, 0, 0.25);
        box-shadow: 0 10px 25px rgba(255, 107, 0, 0.05);
        
        .why-icon-wrap {
          transform: scale(1.1) rotate(5deg);
        }
      }
    }

    .why-icon-wrap {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      transition: var(--transition-smooth);

      &.orange {
        background: rgba(255, 107, 0, 0.12);
        color: var(--neon-orange);
        border: 1px solid rgba(255, 107, 0, 0.2);
      }

      &.blue {
        background: rgba(0, 240, 255, 0.12);
        color: var(--neon-blue);
        border: 1px solid rgba(0, 240, 255, 0.2);
      }
    }
  `]
})
export class WhyUsComponent implements AfterViewInit {
  reasons: ReasonItem[] = [
    {
      icon: 'fa-solid fa-shield-halved',
      title: 'Seguridad Garantizada',
      desc: 'Monitoreo preventivo de sellos aduaneros, choferes rigurosamente calificados y seguro internacional de carga.',
      badge: 'orange'
    },
    {
      icon: 'fa-solid fa-clock-rotate-left',
      title: 'Puntualidad Rigurosa',
      desc: 'Planificación de itinerarios minuto a minuto para cumplir con los tiempos pactados en bodegas y puertos.',
      badge: 'blue'
    },
    {
      icon: 'fa-solid fa-earth-americas',
      title: 'Cobertura Binacional',
      desc: 'Presencia física y operativa directa en los tramos principales y cruces aduaneros de Bolivia y Chile.',
      badge: 'orange'
    },
    {
      icon: 'fa-solid fa-users',
      title: 'Atención 1 a 1',
      desc: 'Ejecutivos dedicados exclusivamente a la gestión de sus envíos, manteniéndolo siempre al tanto de todo.',
      badge: 'blue'
    },
    {
      icon: 'fa-solid fa-tower-broadcast',
      title: 'Rastreo Constante',
      desc: 'Transparencia de principio a fin. Conozca la ubicación de su carga en tiempo real mediante sistemas satelitales.',
      badge: 'orange'
    },
    {
      icon: 'fa-solid fa-gears',
      title: 'Flota Especializada',
      desc: 'Tráileres acondicionados para soportar las difíciles carreteras andinas de altura y terrenos áridos chilenos.',
      badge: 'blue'
    }
  ];

  ngAfterViewInit() {
    gsap.from('.why-us-left', {
      scrollTrigger: {
        trigger: '#why-us',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      x: -60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from('.why-card', {
      scrollTrigger: {
        trigger: '#why-us',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      x: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out'
    });
  }
}
