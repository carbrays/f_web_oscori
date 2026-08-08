import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer-section position-relative pt-5 pb-3">
      <!-- High-tech space / connection lines footer background -->
      <div class="footer-bg-lines position-absolute w-100 h-100 top-0 start-0"></div>
      
      <div class="container position-relative z-2">
        <div class="row g-5">
          <!-- Col 1: Bio and logo -->
          <div class="col-lg-4 text-start">
            <a class="d-flex align-items-center mb-4 text-decoration-none" routerLink="/inicio">
              <span class="logo-icon me-2">
                <i class="fa-solid fa-truck-fast text-neon-blue"></i>
              </span>
              <span class="brand-text">
                OSCORI<span class="brand-sub">Transportes</span>
              </span>
            </a>
            <p class="text-secondary small mb-4">
              Especialistas en la logística y el transporte terrestre internacional de carga pesada entre Bolivia y Chile. Conectando industrias y superando fronteras con absoluta seguridad y puntualidad.
            </p>
            <div class="social-links d-flex gap-3">
              <a href="https://www.facebook.com/profile.php?id=100057627541697" target="_blank" class="social-btn facebook" title="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
              <a href="https://instagram.com" target="_blank" class="social-btn instagram" title="Instagram"><i class="fa-brands fa-instagram"></i></a>
              <a href="https://www.tiktok.com/@iveroscorichambi?_r=1&_t=ZS-98hvghUrATF" target="_blank" class="social-btn tiktok" title="TikTok"><i class="fa-brands fa-tiktok"></i></a>
            </div>
          </div>

          <!-- Col 2: Navigation Links -->
          <div class="col-sm-6 col-lg-3 text-start ps-lg-5">
            <h5 class="text-white fw-bold mb-4 border-bottom border-glass pb-2">Navegación</h5>
            <ul class="list-unstyled footer-links mb-0">
              <li><a routerLink="/inicio">Inicio</a></li>
              <li><a routerLink="/nosotros">Nosotros</a></li>
              <li><a routerLink="/servicios">Servicios</a></li>
              <li><a routerLink="/rutas">Rutas Binacionales</a></li>
              <li><a routerLink="/seguimiento">Rastreo GPS</a></li>
              <li><a routerLink="/noticias">Noticias y Avisos</a></li>
              <li><a routerLink="/contacto">Contacto</a></li>
            </ul>
          </div>

          <!-- Col 3: Quick logistics services -->
          <div class="col-sm-6 col-lg-2 text-start">
            <h5 class="text-white fw-bold mb-4 border-bottom border-glass pb-2">Servicios</h5>
            <ul class="list-unstyled footer-links mb-0">
              <li><a routerLink="/servicios">Importación Directa</a></li>
              <li><a routerLink="/servicios">Exportación Segura</a></li>
              <li><a routerLink="/servicios">Carga Consolidada</a></li>
              <li><a routerLink="/servicios">Tractocamiones</a></li>
              <li><a routerLink="/servicios">Asesoría en Frontera</a></li>
              <li><a routerLink="/seguimiento">Monitoreo 24/7</a></li>
            </ul>
          </div>

          <!-- Col 4: Corporate info and schedule -->
          <div class="col-lg-3 text-start">
            <h5 class="text-white fw-bold mb-4 border-bottom border-glass pb-2">Atención Corporativa</h5>
            <p class="text-secondary small mb-2">
              <i class="fa-solid fa-clock text-neon-blue me-2"></i>
              <strong>Horarios Administrativos:</strong><br>
              Lunes a Viernes: 08:30 - 18:30<br>
              Sábados: 09:00 - 13:00
            </p>
            <p class="text-secondary small mb-0">
              <i class="fa-solid fa-headset text-neon-blue me-2"></i>
              <strong>Soporte en Carretera:</strong><br>
              Monitoreo Satelital 24 Horas
            </p>
          </div>
        </div>

        <!-- Copyright -->
        <div class="copyright-row row mt-5 pt-4 border-top border-glass text-center">
          <div class="col-12">
            <p class="mb-0 text-muted small">
              &copy; {{ currentYear }} Transportes OSCORI S.R.L. Todos los derechos reservados. Diseñado bajo estándares internacionales de logística.
            </p>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer-section {
      background-color: var(--bg-primary);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      z-index: 2;
      overflow: hidden;
    }

    .footer-bg-lines {
      background-image: 
        radial-gradient(circle at 50% 120%, rgba(0, 91, 255, 0.1) 0%, transparent 60%),
        radial-gradient(circle at 10% 20%, rgba(0, 184, 255, 0.03) 0%, transparent 40%);
      pointer-events: none;
      z-index: 1;
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

    .border-glass {
      border-color: rgba(255, 255, 255, 0.05) !important;
    }

    /* Social Buttons styling */
    .social-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(7, 30, 61, 0.5);
      color: var(--text-muted);
      border: 1px solid var(--border-glass);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition-smooth);
      text-decoration: none;
      
      &:hover {
        color: white;
        transform: translateY(-3px);
        
        &.facebook { background-color: #1877f2; border-color: #1877f2; box-shadow: 0 0 10px rgba(24, 119, 242, 0.5); }
        &.instagram { background-color: #e1306c; border-color: #e1306c; box-shadow: 0 0 10px rgba(225, 48, 108, 0.5); }
        &.linkedin { background-color: #0077b5; border-color: #0077b5; box-shadow: 0 0 10px rgba(0, 119, 181, 0.5); }
      }
    }

    /* Navigation Links */
    .footer-links {
      li {
        margin-bottom: 10px;
        
        a {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.9rem;
          transition: var(--transition-smooth);
          
          &:hover {
            color: var(--neon-blue);
            padding-left: 5px;
            text-shadow: 0 0 4px var(--neon-blue-glow);
          }
        }
      }
    }

    .copyright-row {
      border-color: rgba(255, 255, 255, 0.03) !important;
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
