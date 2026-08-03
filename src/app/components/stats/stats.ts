import { Component, AfterViewInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StatItem {
  value: number;
  current: number;
  suffix: string;
  title: string;
  subtitle: string;
  icon: string;
}

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="stats" class="section-padding position-relative overflow-hidden">
      <!-- Cyber line background effect -->
      <div class="line-overlay position-absolute top-0 start-0 w-100 h-100"></div>

      <div class="container position-relative z-2">
        <div class="row g-4 text-center">
          <div class="col-6 col-lg-3 stat-col" *ngFor="let stat of stats; let i = index">
            <div class="stat-card glass-panel p-4 h-100 d-flex flex-column align-items-center justify-content-center">
              <div class="stat-icon mb-3">
                <i [class]="stat.icon"></i>
              </div>
              <h2 class="stat-number mb-2 text-white">
                <span>{{ stat.current }}</span>{{ stat.suffix }}
              </h2>
              <h5 class="stat-title text-neon-orange fw-bold mb-1">{{ stat.title }}</h5>
              <p class="stat-subtitle text-secondary small mb-0">{{ stat.subtitle }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    #stats {
      background: linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
      z-index: 2;
    }

    .line-overlay {
      background-image: 
        linear-gradient(rgba(255, 107, 0, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 107, 0, 0.03) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
      z-index: 1;
    }

    .stat-card {
      transition: var(--transition-smooth);
      border-color: rgba(255, 255, 255, 0.03);
      
      &:hover {
        border-color: rgba(0, 240, 255, 0.2);
        box-shadow: 0 10px 30px rgba(0, 240, 255, 0.08);
        transform: translateY(-5px);

        .stat-icon {
          color: var(--neon-blue);
          text-shadow: 0 0 15px var(--neon-blue-glow);
          transform: scale(1.1);
        }
      }
    }

    .stat-icon {
      font-size: 2.2rem;
      color: var(--text-muted);
      transition: var(--transition-smooth);
    }

    .stat-number {
      font-size: 3rem;
      font-weight: 900;
      letter-spacing: -1px;
    }

    @media (max-width: 767.98px) {
      .stat-number {
        font-size: 2rem;
      }
      .stat-title {
        font-size: 0.95rem;
      }
      .stat-subtitle {
        font-size: 0.75rem;
      }
    }
  `]
})
export class StatsComponent implements AfterViewInit {
  stats: StatItem[] = [
    {
      value: 150,
      current: 0,
      suffix: '+',
      title: 'Clientes Activos',
      subtitle: 'Empresas confían su logística binacional',
      icon: 'fa-solid fa-users'
    },
    {
      value: 2500,
      current: 0,
      suffix: '+',
      title: 'Cargas Entregadas',
      subtitle: 'Envíos exitosos consolidados sin incidencias',
      icon: 'fa-solid fa-box-open'
    },
    {
      value: 500,
      current: 0,
      suffix: 'K+',
      title: 'Kilómetros Recorridos',
      subtitle: 'Rutas seguras completadas por el altiplano',
      icon: 'fa-solid fa-road'
    },
    {
      value: 15,
      current: 0,
      suffix: '+',
      title: 'Años de Experiencia',
      subtitle: 'Liderando el transporte internacional de carga',
      icon: 'fa-solid fa-clock'
    }
  ];

  constructor(private cdr: ChangeDetectorRef, private zone: NgZone) {}

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      const targets = this.stats;
      
      gsap.to(targets, {
        scrollTrigger: {
          trigger: '#stats',
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        current: (i: number) => targets[i].value,
        duration: 2.2,
        roundProps: 'current',
        ease: 'power2.out',
        onUpdate: () => {
          this.zone.run(() => {
            this.cdr.detectChanges();
          });
        }
      });

      // Entry animations for the cards
      gsap.from('.stat-col', {
        scrollTrigger: {
          trigger: '#stats',
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
      });
    });
  }
}
