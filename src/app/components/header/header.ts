import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg fixed-top nav-transition" [ngClass]="{'nav-scrolled': isScrolled}">
      <div class="container py-2">
        <a class="navbar-brand d-flex align-items-center" routerLink="/inicio">
          <!-- Stylized truck wheel and wing icon for logo -->
          <span class="logo-icon me-2">
            <i class="fa-solid fa-truck-fast text-neon-blue"></i>
          </span>
          <span class="brand-text">
            OSCORI<span class="brand-sub">Transportes</span>
          </span>
        </a>
        
        <button 
          class="navbar-toggler border-0" 
          type="button" 
          (click)="toggleMenu()"
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span class="toggler-icon" [ngClass]="{'open': isMenuOpen}">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        
        <div class="collapse navbar-collapse" [ngClass]="{'show': isMenuOpen}" id="navbarNav">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            <li class="nav-item" *ngFor="let item of navItems">
              <a 
                class="nav-link px-3" 
                [routerLink]="item.link" 
                routerLinkActive="active-link"
                (click)="closeMenu()"
              >
                {{ item.label }}
              </a>
            </li>
            <li class="nav-item ms-lg-3 mt-3 mt-lg-0">
              <a routerLink="/seguimiento" class="btn-neon-outline py-2 px-4" (click)="closeMenu()">
                <i class="fa-solid fa-location-dot me-2"></i>Rastrear
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .nav-transition {
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      background: transparent;
      border-bottom: 1px solid rgba(255, 255, 255, 0);
    }
    
    .nav-scrolled {
      background: rgba(17, 24, 39, 0.85) !important; /* Negro Grafito opacity */
      backdrop-filter: blur(12px) !important;
      -webkit-backdrop-filter: blur(12px) !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
    }

    .brand-text {
      font-weight: 800;
      font-size: 1.4rem;
      letter-spacing: 1px;
      color: #ffffff;
      
      .brand-sub {
        font-weight: 300;
        font-size: 1rem;
        color: var(--neon-blue);
        margin-left: 5px;
        text-shadow: 0 0 5px var(--neon-blue-glow);
      }
    }

    .logo-icon i {
      font-size: 1.6rem;
      filter: drop-shadow(0 0 6px var(--neon-blue-glow));
    }

    .nav-link {
      color: var(--text-muted);
      font-weight: 500;
      font-size: 0.95rem;
      transition: var(--transition-smooth);
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 15px;
        width: 0;
        height: 2px;
        background-color: var(--neon-blue);
        box-shadow: 0 0 8px var(--neon-blue);
        transition: var(--transition-smooth);
      }

      &:hover, &.active-link {
        color: #ffffff !important;
        
        &::after {
          width: calc(100% - 30px);
        }
      }
    }

    .active-link {
      color: #ffffff !important;
      font-weight: 700;
      &::after {
        width: calc(100% - 30px) !important;
      }
    }

    /* Mobile Toggler Styles */
    .navbar-toggler {
      outline: none !important;
      background: transparent;
      padding: 5px;
    }

    .toggler-icon {
      width: 24px;
      height: 18px;
      position: relative;
      display: block;
      
      span {
        display: block;
        position: absolute;
        height: 2px;
        width: 100%;
        background: #ffffff;
        border-radius: 9px;
        opacity: 1;
        left: 0;
        transform: rotate(0deg);
        transition: .25s ease-in-out;
        
        &:nth-child(1) { top: 0px; }
        &:nth-child(2) { top: 8px; }
        &:nth-child(3) { top: 16px; }
      }
      
      &.open span {
        &:nth-child(1) {
          top: 8px;
          transform: rotate(135deg);
        }
        &:nth-child(2) {
          opacity: 0;
          left: -60px;
        }
        &:nth-child(3) {
          top: 8px;
          transform: rotate(-135deg);
        }
      }
    }

    @media (max-width: 991.98px) {
      .navbar-collapse {
        background: rgba(7, 30, 61, 0.95);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid var(--border-glass);
        border-radius: 16px;
        padding: 20px;
        margin-top: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      }
      
      .nav-link::after {
        display: none;
      }
      
      .nav-link:hover, .active-link {
        padding-left: 10px;
        color: var(--neon-blue) !important;
      }
    }
  `]
})
export class HeaderComponent {
  isScrolled = false;
  isMenuOpen = false;

  navItems = [
    { label: 'Inicio', link: '/inicio' },
    { label: 'Nosotros', link: '/nosotros' },
    { label: 'Servicios', link: '/servicios' },
    { label: 'Rutas', link: '/rutas' },
    { label: 'Seguimiento', link: '/seguimiento' },
    { label: 'Noticias', link: '/noticias' },
    { label: 'Contacto', link: '/contacto' }
  ];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
