import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, NewsItem } from '../../services/api.service';

@Component({
  selector: 'app-page-noticias',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="noticias-page bg-grafito min-vh-100 pt-5 pb-5">
      <!-- Title Banner -->
      <section class="banner-section position-relative py-5 overflow-hidden border-bottom border-glass">
        <div class="banner-bg position-absolute w-100 h-100 top-0 start-0"></div>
        <div class="container position-relative z-2 py-5 text-center">
          <span class="badge-premium mb-3 d-inline-block">NOTICIAS Y AVISOS</span>
          <h1 class="display-4 text-white fw-black mb-3">Actualidad del Sector Logístico</h1>
          <p class="lead text-secondary max-w-600 mx-auto">Información sobre pasos fronterizos, cambios en reglamentos de aduana y comunicados internos de nuestra empresa.</p>
        </div>
      </section>

      <div class="container py-5">
        <!-- Category Filters -->
        <div class="d-flex justify-content-center flex-wrap gap-2 mb-5">
          <button 
            class="filter-pill" 
            [class.active]="activeCategory() === 'todos'"
            (click)="setCategory('todos')"
          >
            Todos los Avisos
          </button>
          <button 
            class="filter-pill" 
            [class.active]="activeCategory() === 'frontera'"
            (click)="setCategory('frontera')"
          >
            Estado de Fronteras
          </button>
          <button 
            class="filter-pill" 
            [class.active]="activeCategory() === 'logistica'"
            (click)="setCategory('logistica')"
          >
            Logística y Aduana
          </button>
          <button 
            class="filter-pill" 
            [class.active]="activeCategory() === 'empresa'"
            (click)="setCategory('empresa')"
          >
            Novedades Corporativas
          </button>
        </div>

        <!-- News Cards Grid -->
        <div class="row g-4 text-start justify-content-center">
          <div class="col-md-6 col-lg-4" *ngFor="let item of filteredNews()">
            <div class="news-card glass-panel h-100 border-glass d-flex flex-column justify-content-between overflow-hidden">
              <div class="news-img-wrap position-relative">
                <img [src]="item.image" [alt]="item.title" class="w-100 news-img">
                <span class="badge-category position-absolute top-0 start-0 m-3" [ngClass]="item.category">
                  {{ item.category | uppercase }}
                </span>
              </div>
              
              <div class="p-4 flex-grow-1 d-flex flex-column justify-content-between">
                <div>
                  <span class="date-text text-neon-blue small mb-2 d-block"><i class="fa-solid fa-calendar me-2"></i>{{ item.date }}</span>
                  <h5 class="text-white fw-bold mb-3 line-clamp-2">{{ item.title }}</h5>
                  <p class="text-secondary small mb-4 line-clamp-3">{{ item.summary }}</p>
                </div>
                
                <button 
                  class="btn-neon-outline w-100 py-2 px-3 small d-flex align-items-center justify-content-center"
                  (click)="openDetail(item)"
                >
                  Leer Más <i class="fa-solid fa-angles-right ms-2 small"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detail Modal Overlay -->
      <div class="modal-overlay" *ngIf="selectedNews()">
        <div class="modal-content-box glass-panel border-neon-blue p-4">
          <button class="close-modal-btn" (click)="closeDetail()">&times;</button>
          
          <div class="modal-body text-start" *ngIf="selectedNews()">
            <span class="badge-category mb-3 d-inline-block" [ngClass]="selectedNews()!.category">
              {{ selectedNews()!.category | uppercase }}
            </span>
            <span class="date-text text-neon-blue small ms-3"><i class="fa-solid fa-calendar me-2"></i>{{ selectedNews()!.date }}</span>
            
            <h3 class="text-white fw-bold mb-4 mt-2">{{ selectedNews()!.title }}</h3>
            
            <img [src]="selectedNews()!.image" [alt]="selectedNews()!.title" class="img-fluid rounded-4 border border-glass shadow-lg w-100 mb-4 modal-banner-img">
            
            <p class="text-secondary leading-relaxed body-text">{{ selectedNews()!.content }}</p>
            
            <div class="mt-4 pt-3 border-top border-glass text-end">
              <button class="btn-neon-orange px-4 py-2 small fw-bold" (click)="closeDetail()">
                Cerrar Aviso
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .noticias-page {
      background-color: var(--bg-primary);
    }
    
    .banner-section {
      min-height: 250px;
      display: flex;
      align-items: center;
      background: radial-gradient(circle at center, rgba(0, 91, 255, 0.15) 0%, var(--bg-primary) 100%);
    }

    .banner-bg {
      background-image: linear-gradient(rgba(17, 24, 39, 0.9), rgba(17, 24, 39, 0.9)), url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&auto=format&fit=crop&q=80');
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

    /* Category Filter pills */
    .filter-pill {
      background: rgba(17, 24, 39, 0.5);
      border: 1px solid var(--border-glass);
      color: var(--text-muted);
      padding: 8px 20px;
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition-smooth);
      
      &:hover {
        border-color: rgba(0, 184, 255, 0.3);
        color: #fff;
        background: rgba(0, 184, 255, 0.05);
      }
      
      &.active {
        background: var(--brand-blue);
        border-color: var(--brand-blue);
        color: #fff;
        box-shadow: 0 0 12px var(--brand-blue-glow);
      }
    }

    /* News Cards */
    .news-card {
      transition: var(--transition-smooth);
      
      &:hover {
        transform: translateY(-5px);
        border-color: var(--neon-blue);
        box-shadow: 0 10px 30px rgba(0, 184, 255, 0.08);
        
        .news-img {
          transform: scale(1.05);
        }
      }
    }

    .news-img-wrap {
      height: 180px;
      overflow: hidden;
    }

    .news-img {
      height: 100%;
      object-fit: cover;
      transition: var(--transition-smooth);
    }

    .badge-category {
      font-size: 0.65rem;
      font-weight: 800;
      letter-spacing: 1px;
      padding: 4px 10px;
      border-radius: 4px;
      color: #fff;
      
      &.frontera { background-color: rgba(220, 53, 69, 0.85); }
      &.logistica { background-color: rgba(0, 91, 255, 0.85); }
      &.empresa { background-color: rgba(40, 167, 69, 0.85); }
    }

    .date-text {
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    /* Line clamps */
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* Modal Styling */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(3, 7, 18, 0.85);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      animation: fadeIn 0.3s ease-out;
    }

    .modal-content-box {
      width: 90%;
      max-width: 650px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      background: rgba(7, 30, 61, 0.9);
      border-radius: 20px !important;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6) !important;
      animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .close-modal-btn {
      position: absolute;
      top: 10px;
      right: 15px;
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 1.8rem;
      cursor: pointer;
      z-index: 10;
      &:hover { color: #fff; }
    }

    .modal-banner-img {
      max-height: 250px;
      object-fit: cover;
    }

    .body-text {
      font-size: 0.95rem;
      line-height: 1.7;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class NoticiasComponent implements OnInit {
  newsList = signal<NewsItem[]>([]);
  activeCategory = signal<string>('todos');
  selectedNews = signal<NewsItem | null>(null);

  filteredNews = computed(() => {
    const list = this.newsList();
    const cat = this.activeCategory();
    if (cat === 'todos') return list;
    return list.filter(item => item.category === cat);
  });

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.newsList.set(this.apiService.newsItems());
  }

  setCategory(cat: string) {
    this.activeCategory.set(cat);
  }

  openDetail(item: NewsItem) {
    this.selectedNews.set(item);
  }

  closeDetail() {
    this.selectedNews.set(null);
  }
}
