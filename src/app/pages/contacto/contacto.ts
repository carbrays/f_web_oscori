import { Component, OnInit, AfterViewInit, OnDestroy, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';

interface ContactFormModel {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

@Component({
  selector: 'app-page-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="contacto-page bg-grafito min-vh-100 pt-5 pb-5">
      <!-- Title Banner -->
      <section class="banner-section position-relative py-5 border-bottom border-glass mb-5">
        <div class="banner-bg position-absolute w-100 h-100 top-0 start-0"></div>
        <div class="container position-relative z-2 py-5 text-center">
          <span class="badge-premium mb-3 d-inline-block">CONTACTO BINACIONAL</span>
          <h1 class="display-4 text-white fw-black mb-3">Conéctese con Nuestros Asesores</h1>
          <p class="lead text-secondary max-w-600 mx-auto">Oficinas operativas en Bolivia y Chile para responder a sus consultas de importación y exportación de carga pesada.</p>
        </div>
      </section>

      <div class="container">
        <div class="row g-5 align-items-stretch">
          <!-- Left Column: Details & Interactive Map -->
          <div class="col-lg-5 text-start d-flex flex-column justify-content-between">
            <div class="glass-panel p-4 mb-4 border-glass flex-grow-1 d-flex flex-column justify-content-between">
              <div>
                <h4 class="text-white fw-bold mb-4 text-neon-blue">Oficinas Binacionales</h4>
                
                <div class="office-box mb-4">
                  <h6 class="text-white fw-bold mb-1"><i class="fa-solid fa-location-dot text-neon-blue me-2"></i>Oficina Central (Bolivia)</h6>
                  <p class="text-secondary small mb-1">Av. 6 de Marzo,  Edificio Bella Vista, Piso 3. La Paz.</p>
                  <strong class="text-white small">Telf: +591 742 630 19</strong>
                </div>

                <div class="office-box mb-4">
                  <h6 class="text-white fw-bold mb-1"><i class="fa-solid fa-location-dot text-neon-blue me-2"></i>Oficina Operativa (Chile)</h6>
                  <p class="text-secondary small mb-1">Av. Arturo Prat 1092, Edificio Costanera, Iquique.</p>
                  <strong class="text-white small">Telf: +56 57 241 8390</strong>
                </div>
                
                <hr class="border-glass my-3">

                <!-- Contact methods -->
                <div class="d-flex flex-column gap-3">
                  <div class="d-flex align-items-center gap-3">
                    <div class="icon-wrap-neon-small"><i class="fa-solid fa-envelope"></i></div>
                    <div>
                      <span class="text-neon-blue d-block x-small">CORREO ELECTRÓNICO</span>
                      <strong class="text-white small">contacto&#64;transportesoscori.com</strong>
                    </div>
                  </div>
                  
                  <div class="d-flex align-items-center gap-3">
                    <div class="icon-wrap-neon-small"><i class="fa-solid fa-phone"></i></div>
                    <div>
                      <span class="text-neon-blue d-block x-small">CENTRAL DE SOPORTE</span>
                      <strong class="text-white small">+591 742 630 19</strong>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mini map showing office locations -->
              <div class="office-map-wrap rounded-3 overflow-hidden border border-glass mt-4" style="height: 180px;">
                <div class="office-map h-100" #officeMapContainer></div>
              </div>
            </div>
          </div>

          <!-- Right Column: Glassmorphic Form -->
          <div class="col-lg-7">
            <div class="glass-panel p-4 h-100 border-neon-blue-glow text-start">
              <h4 class="text-white fw-bold mb-4">Envíenos un Mensaje</h4>
              
              <form (ngSubmit)="sendMail()" #contactForm="ngForm">
                <div class="row g-3">
                  <!-- Name -->
                  <div class="col-md-6">
                    <div class="form-floating mb-3">
                      <input 
                        type="text" 
                        class="form-control" 
                        id="contactName" 
                        placeholder="Nombre Completo"
                        [(ngModel)]="formModel.name"
                        name="name"
                        required
                      >
                      <label for="contactName">Nombre Completo</label>
                    </div>
                  </div>

                  <!-- Email -->
                  <div class="col-md-6">
                    <div class="form-floating mb-3">
                      <input 
                        type="email" 
                        class="form-control" 
                        id="contactEmail" 
                        placeholder="Correo Electrónico"
                        [(ngModel)]="formModel.email"
                        name="email"
                        required
                        email
                      >
                      <label for="contactEmail">Correo Electrónico</label>
                    </div>
                  </div>

                  <!-- Phone -->
                  <div class="col-md-6">
                    <div class="form-floating mb-3">
                      <input 
                        type="text" 
                        class="form-control" 
                        id="contactPhone" 
                        placeholder="Teléfono / WhatsApp"
                        [(ngModel)]="formModel.phone"
                        name="phone"
                        required
                      >
                      <label for="contactPhone">Teléfono / WhatsApp</label>
                    </div>
                  </div>

                  <!-- Company -->
                  <div class="col-md-6">
                    <div class="form-floating mb-3">
                      <input 
                        type="text" 
                        class="form-control" 
                        id="contactCompany" 
                        placeholder="Empresa (Opcional)"
                        [(ngModel)]="formModel.company"
                        name="company"
                      >
                      <label for="contactCompany">Empresa (Opcional)</label>
                    </div>
                  </div>

                  <!-- Message -->
                  <div class="col-12">
                    <div class="form-floating mb-4">
                      <textarea 
                        class="form-control" 
                        placeholder="Escriba su consulta aquí..." 
                        id="contactMessage" 
                        style="height: 150px"
                        [(ngModel)]="formModel.message"
                        name="message"
                        required
                      ></textarea>
                      <label for="contactMessage">Detalles de su Consulta / Carga</label>
                    </div>
                  </div>

                  <!-- Success message -->
                  <div class="col-12 mb-2" *ngIf="submitted()">
                    <div class="alert alert-success bg-success-glow border-success text-white small p-3">
                      <i class="fa-solid fa-circle-check me-2"></i> ¡Mensaje enviado con éxito! Nos contactaremos con usted a la brevedad.
                    </div>
                  </div>

                  <!-- Submit button -->
                  <div class="col-12">
                    <button 
                      type="submit" 
                      class="btn-neon-orange py-3 w-100" 
                      [disabled]="!contactForm.form.valid"
                    >
                      <i class="fa-solid fa-paper-plane me-2"></i> ENVIAR SOLICITUD
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contacto-page {
      background-color: var(--bg-primary);
    }
    
    .banner-section {
      min-height: 250px;
      display: flex;
      align-items: center;
      background: radial-gradient(circle at center, rgba(0, 91, 255, 0.15) 0%, var(--bg-primary) 100%);
    }

    .banner-bg {
      background-image: linear-gradient(rgba(17, 24, 39, 0.9), rgba(17, 24, 39, 0.9)), url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80');
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

    .border-glass {
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
    }

    .border-neon-blue-glow {
      border-color: rgba(0, 184, 255, 0.2) !important;
      box-shadow: 0 4px 25px rgba(0, 184, 255, 0.05);
    }

    .icon-wrap-neon-small {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: rgba(0, 184, 255, 0.1);
      border: 1px solid rgba(0, 184, 255, 0.25);
      color: var(--neon-blue);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.95rem;
    }

    /* Form floating styling */
    .form-floating {
      label {
        color: var(--text-muted) !important;
      }
      
      .form-control {
        background-color: rgba(17, 24, 39, 0.4) !important;
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: white !important;
        border-radius: 12px;
        transition: var(--transition-smooth);
        
        &:focus {
          border-color: var(--neon-blue) !important;
          box-shadow: 0 0 15px var(--neon-blue-glow) !important;
        }
      }
    }

    .bg-success-glow {
      background-color: rgba(40, 167, 69, 0.15);
    }

    .x-small {
      font-size: 0.65rem;
      letter-spacing: 0.5px;
    }

    /* Custom glowing map markers */
    ::ng-deep .office-marker {
      background: transparent;
      border: none;
    }
    ::ng-deep .glowing-office-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 2px solid #fff;
      box-shadow: 0 0 10px #00B8FF;
      animation: markerPulse 1.5s infinite ease-in-out;
    }
    @keyframes markerPulse {
      0% { transform: scale(1); box-shadow: 0 0 5px #00B8FF; }
      50% { transform: scale(1.2); box-shadow: 0 0 15px #00B8FF; }
      100% { transform: scale(1); box-shadow: 0 0 5px #00B8FF; }
    }
  `]
})
export class ContactoComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('officeMapContainer') private mapRef!: ElementRef<HTMLDivElement>;

  formModel: ContactFormModel = {
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  };

  submitted = signal<boolean>(false);
  private map!: L.Map;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initOfficeMap();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  private initOfficeMap() {
    const el = this.mapRef.nativeElement;
    
    // Centered broadly between Santa Cruz (Bolivia) and Iquique (Chile)
    this.map = L.map(el, {
      zoomControl: false,
      attributionControl: false
    }).setView([-19.0, -66.0], 5);

    // Dark tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18
    }).addTo(this.map);

    // Custom DivIcon for Office marker
    const customIcon = L.divIcon({
      className: 'office-marker',
      html: `<div class="glowing-office-dot" style="background-color: #00B8FF;"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    // La Paz Office Marker
    L.marker([-16.516689, -68.167166], { icon: customIcon })
      .addTo(this.map)
      .bindPopup('<strong style="color:#fff;">La Paz (Bolivia)</strong><br><span style="color:#ccc;">Oficina Central</span>');

    // Iquique Office Marker
    L.marker([-20.2167, -70.1450], { icon: customIcon })
      .addTo(this.map)
      .bindPopup('<strong style="color:#fff;">Iquique (Chile)</strong><br><span style="color:#ccc;">Oficina Operativa</span>');
  }

  sendMail() {
    this.submitted.set(true);
    
    setTimeout(() => {
      this.formModel = {
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
      };
      
      setTimeout(() => {
        this.submitted.set(false);
      }, 5000);
    }, 1200);
  }
}
