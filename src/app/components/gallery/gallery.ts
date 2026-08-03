import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GalleryItem {
  id: number;
  title: string;
  category: 'flota' | 'puertos' | 'fronteras' | 'operaciones';
  imgUrl: string;
  desc: string;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="gallery" class="section-padding position-relative">
      <div class="container">
        <!-- Section Header -->
        <div class="row mb-5 justify-content-center text-center">
          <div class="col-lg-7">
            <span class="section-subtitle">Galería Visual</span>
            <h2 class="section-title text-white">Nuestras Operaciones en Ruta</h2>
            <p class="text-secondary">
              Explore de forma directa la infraestructura, unidades de carga pesada y personal altamente calificado que hace posible nuestra conexión diaria entre Bolivia y Chile.
            </p>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="row mb-4">
          <div class="col-12 d-flex justify-content-center flex-wrap gap-2 filter-buttons">
            <button 
              class="btn-filter" 
              [class.active]="activeFilter === 'todos'" 
              (click)="setFilter('todos')"
            >
              Todos
            </button>
            <button 
              class="btn-filter" 
              [class.active]="activeFilter === 'flota'" 
              (click)="setFilter('flota')"
            >
              Nuestra Flota
            </button>
            <button 
              class="btn-filter" 
              [class.active]="activeFilter === 'puertos'" 
              (click)="setFilter('puertos')"
            >
              Terminales y Puertos
            </button>
            <button 
              class="btn-filter" 
              [class.active]="activeFilter === 'fronteras'" 
              (click)="setFilter('fronteras')"
            >
              Fronteras y Aduanas
            </button>
            <button 
              class="btn-filter" 
              [class.active]="activeFilter === 'operaciones'" 
              (click)="setFilter('operaciones')"
            >
              Operaciones
            </button>
          </div>
        </div>

        <!-- Gallery Grid -->
        <div class="row g-4 gallery-grid">
          <div 
            class="col-sm-6 col-lg-3 gallery-item-col" 
            *ngFor="let item of filteredItems"
          >
            <div class="gallery-card glass-panel" (click)="openLightbox(item)">
              <div class="img-wrapper overflow-hidden position-relative">
                <img [src]="item.imgUrl" [alt]="item.title" class="img-fluid gallery-img" loading="lazy">
                <div class="img-overlay d-flex flex-column justify-content-end p-3">
                  <span class="category-badge mb-2">{{ item.category | uppercase }}</span>
                  <h5 class="text-white mb-1 fw-bold">{{ item.title }}</h5>
                  <p class="text-secondary mb-0 small">{{ item.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lightbox Modal -->
      <div 
        class="lightbox-modal d-flex align-items-center justify-content-center" 
        *ngIf="selectedItem" 
        (click)="closeLightbox()"
      >
        <div class="lightbox-content position-relative p-2" (click)="$event.stopPropagation()">
          <button class="btn-close-lightbox position-absolute" (click)="closeLightbox()">
            <i class="fa-solid fa-xmark"></i>
          </button>
          <img [src]="selectedItem.imgUrl" [alt]="selectedItem.title" class="img-fluid lightbox-img glass-panel">
          <div class="lightbox-caption p-3 text-center glass-panel mt-2">
            <h4 class="text-white fw-bold mb-1">{{ selectedItem.title }}</h4>
            <p class="text-secondary mb-0">{{ selectedItem.desc }}</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    #gallery {
      background-color: var(--bg-primary);
      z-index: 2;
    }

    /* Filter buttons styling */
    .btn-filter {
      background: rgba(13, 20, 38, 0.4);
      color: var(--text-secondary);
      border: 1px solid var(--border-glass);
      border-radius: 50px;
      padding: 8px 24px;
      font-size: 0.9rem;
      font-weight: 500;
      transition: var(--transition-smooth);
      
      &:hover, &.active {
        color: white;
        background: rgba(255, 107, 0, 0.15);
        border-color: var(--neon-orange);
        box-shadow: 0 0 15px var(--neon-orange-glow);
      }
    }

    /* Cards styling */
    .gallery-card {
      cursor: pointer;
      border-radius: 16px;
      overflow: hidden;
      border-color: rgba(255, 255, 255, 0.04);
      
      &:hover {
        border-color: rgba(0, 240, 255, 0.3);
        box-shadow: 0 12px 30px rgba(0, 240, 255, 0.12);
        
        .gallery-img {
          transform: scale(1.08);
        }
        .img-overlay {
          background: linear-gradient(to top, rgba(3, 7, 18, 0.95) 0%, rgba(3, 7, 18, 0.4) 100%);
          opacity: 1;
        }
      }
    }

    .img-wrapper {
      width: 100%;
      height: 250px;
    }

    .gallery-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .img-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to top, rgba(3, 7, 18, 0.85) 0%, rgba(3, 7, 18, 0.2) 100%);
      transition: var(--transition-smooth);
    }

    .category-badge {
      align-self: flex-start;
      background: rgba(255, 107, 0, 0.2);
      border: 1px solid rgba(255, 107, 0, 0.4);
      color: #ffffff;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 1px;
      padding: 3px 8px;
      border-radius: 4px;
    }

    /* Lightbox modal styles */
    .lightbox-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(3, 7, 18, 0.95);
      z-index: 9999;
      animation: fadeIn 0.3s ease-out;
    }

    .lightbox-content {
      max-width: 90%;
      max-height: 85%;
    }

    .lightbox-img {
      max-height: 70vh;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .lightbox-caption {
      background: rgba(13, 20, 38, 0.8);
      border-radius: 12px;
      border-color: var(--border-glass);
    }

    .btn-close-lightbox {
      background: rgba(3, 7, 18, 0.6);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      top: -20px;
      right: -20px;
      font-size: 1.2rem;
      transition: var(--transition-smooth);
      
      &:hover {
        background: var(--neon-orange);
        box-shadow: 0 0 15px var(--neon-orange-glow);
        transform: rotate(90deg);
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @media (max-width: 575.98px) {
      .btn-close-lightbox {
        top: 10px;
        right: 10px;
      }
    }
  `]
})
export class GalleryComponent implements AfterViewInit {
  items: GalleryItem[] = [
    {
      id: 1,
      title: 'Tractocamión Volvo FH540',
      category: 'flota',
      imgUrl: 'hero_truck.jpg',
      desc: 'Unidades de tracción premium para soportar las subidas más empinadas de la cordillera andina.'
    },
    {
      id: 2,
      title: 'Puerto de Arica (CL)',
      category: 'puertos',
      imgUrl: 'port_containers.jpg',
      desc: 'Enlace principal y carga de contenedores para la exportación e importación nacional.'
    },
    {
      id: 3,
      title: 'Aduana Tambo Quemado (BO)',
      category: 'fronteras',
      imgUrl: 'customs_border.jpg',
      desc: 'Coordinación eficiente en el cruce fronterizo andino para evitar demoras operativas.'
    },
    {
      id: 4,
      title: 'Inspección de Contenedores',
      category: 'operaciones',
      imgUrl: 'logistics_worker.jpg',
      desc: 'Nuestro personal revisa detalladamente precintos y condiciones de carga en patio logístico.'
    }
  ];

  activeFilter: 'todos' | 'flota' | 'puertos' | 'fronteras' | 'operaciones' = 'todos';
  filteredItems: GalleryItem[] = [...this.items];
  selectedItem: GalleryItem | null = null;

  ngAfterViewInit() {
    this.animateGrid();
  }

  setFilter(filter: 'todos' | 'flota' | 'puertos' | 'fronteras' | 'operaciones') {
    this.activeFilter = filter;
    if (filter === 'todos') {
      this.filteredItems = [...this.items];
    } else {
      this.filteredItems = this.items.filter(item => item.category === filter);
    }
    // Re-animate grid layout on filter change
    setTimeout(() => this.animateGrid(), 50);
  }

  private animateGrid() {
    gsap.from('.gallery-item-col', {
      scale: 0.85,
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  }

  openLightbox(item: GalleryItem) {
    this.selectedItem = item;
  }

  closeLightbox() {
    this.selectedItem = null;
  }
}
