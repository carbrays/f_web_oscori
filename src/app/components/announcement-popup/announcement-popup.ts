import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Announcement } from '../../services/api.service';

@Component({
  selector: 'app-announcement-popup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="announcement-overlay" *ngIf="isVisible()">
      <div class="announcement-modal glass-panel border-neon-blue p-4">
        <!-- Close button -->
        <button class="close-btn" (click)="closePopup()">&times;</button>
        
        <div class="row align-items-center g-4">
          <!-- Announcement Image -->
          <div class="col-md-5" *ngIf="announcement().image">
            <img [src]="announcement().image" [alt]="announcement().title" class="img-fluid rounded-4 border border-glass shadow-lg">
          </div>
          
          <!-- Content -->
          <div class="col-md-7 text-start">
            <span class="badge-tech mb-2 d-inline-block"><i class="fa-solid fa-triangle-exclamation text-neon-blue me-2"></i>AVISO IMPORTANTE</span>
            <h3 class="title-text fw-bold text-white mb-3">{{ announcement().title }}</h3>
            <p class="description-text text-secondary mb-4">{{ announcement().description }}</p>
            
            <div class="d-flex align-items-center justify-content-between flex-wrap gap-3">
              <a [href]="announcement().actionLink" class="btn-neon-orange decoration-none text-white px-4 py-2 small fw-bold" (click)="closePopup()">
                {{ announcement().actionText }} <i class="fa-solid fa-arrow-right ms-2"></i>
              </a>
              
              <!-- Don't show again checkbox -->
              <div class="form-check">
                <input 
                  class="form-check-input bg-transparent border-glass focus-orange" 
                  type="checkbox" 
                  id="dontShowTodayCheckbox"
                  (change)="toggleDontShow($event)"
                >
                <label class="form-check-label text-muted small cursor-pointer" for="dontShowTodayCheckbox">
                  No mostrar hoy
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .announcement-overlay {
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
      animation: fadeIn 0.4s ease-out;
    }

    .announcement-modal {
      width: 90%;
      max-width: 750px;
      position: relative;
      background: rgba(7, 30, 61, 0.9);
      border-radius: 24px !important;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6) !important;
      animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .close-btn {
      position: absolute;
      top: 15px;
      right: 20px;
      background: transparent;
      border: none;
      color: var(--text-secondary);
      font-size: 2rem;
      cursor: pointer;
      transition: var(--transition-smooth);
      z-index: 10;
      
      &:hover {
        color: #fff;
        transform: scale(1.1);
      }
    }

    .badge-tech {
      background: rgba(0, 184, 255, 0.1);
      border: 1px solid rgba(0, 184, 255, 0.25);
      color: var(--neon-blue);
      padding: 6px 14px;
      border-radius: 50px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 1px;
    }

    .title-text {
      font-size: 1.8rem;
      background: linear-gradient(135deg, #fff 30%, var(--neon-blue) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .description-text {
      font-size: 0.95rem;
      line-height: 1.6;
    }

    .decoration-none {
      text-decoration: none;
    }

    .border-glass {
      border-color: rgba(255, 255, 255, 0.15) !important;
    }

    .focus-orange:focus {
      border-color: var(--neon-blue) !important;
      box-shadow: 0 0 8px var(--neon-blue-glow) !important;
    }

    .cursor-pointer {
      cursor: pointer;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 767.98px) {
      .announcement-modal {
        padding: 30px 20px !important;
      }
      .title-text {
        font-size: 1.4rem;
      }
    }
  `]
})
export class AnnouncementPopupComponent implements OnInit {
  announcement = signal<Announcement>({} as Announcement);
  isVisible = signal<boolean>(false);
  dontShowAgain = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.announcement.set(this.apiService.announcement());
    
    // Check localStorage
    const dontShowDate = localStorage.getItem('oscori_announcement_dontshow');
    const today = new Date().toDateString();
    
    if (dontShowDate !== today) {
      // Delay showing the popup to make it feel premium
      setTimeout(() => {
        this.isVisible.set(true);
      }, 1000);
    }
  }

  toggleDontShow(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.dontShowAgain = checked;
  }

  closePopup() {
    if (this.dontShowAgain) {
      const today = new Date().toDateString();
      localStorage.setItem('oscori_announcement_dontshow', today);
    }
    this.isVisible.set(false);
  }
}
