import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ContactModel {
  name: string;
  email: string;
  phone: string;
  type: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="contact" class="section-padding position-relative overflow-hidden">
      <!-- Decorative Glows -->
      <div class="decor-glow orange position-absolute"></div>
      <div class="decor-glow blue position-absolute"></div>

      <div class="container position-relative z-2">
        <!-- Section Header -->
        <div class="row mb-5 justify-content-center text-center">
          <div class="col-lg-7">
            <span class="section-subtitle">Cotizaciones e Informes</span>
            <h2 class="section-title text-white">Inicie su Operación con Nosotros</h2>
            <p class="text-secondary">
              Escríbanos hoy mismo. Nuestro equipo de asesores internacionales le brindará una cotización a la medida de sus requerimientos.
            </p>
          </div>
        </div>

        <div class="row g-5 align-items-stretch">
          <!-- Left: Contact Details and Offices -->
          <div class="col-lg-5 d-flex flex-column justify-content-between">
            <div class="contact-info-panel glass-panel p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <h4 class="text-white fw-bold mb-4 text-neon-orange">Información de Contacto</h4>
                
                <div class="d-flex align-items-center mb-4 gap-3 text-start">
                  <div class="icon-box-neon">
                    <i class="fa-solid fa-phone"></i>
                  </div>
                  <div>
                    <span class="text-muted d-block small">CENTRAL TELEFÓNICA</span>
                    <strong class="text-white">+591 3 345 9292</strong>
                  </div>
                </div>

                <div class="d-flex align-items-center mb-4 gap-3 text-start">
                  <div class="icon-box-neon">
                    <i class="fa-solid fa-envelope"></i>
                  </div>
                  <div>
                    <span class="text-muted d-block small">CORREO ELECTRÓNICO</span>
                    <strong class="text-white">contacto&#64;transportes-oscori.com</strong>
                  </div>
                </div>

                <div class="d-flex align-items-center mb-4 gap-3 text-start">
                  <div class="icon-box-neon">
                    <i class="fa-solid fa-business-time"></i>
                  </div>
                  <div>
                    <span class="text-muted d-block small">HORARIO DE ATENCIÓN</span>
                    <strong class="text-white">Lunes a Viernes: 08:30 - 18:30 | Sábados: 09:00 - 13:00</strong>
                  </div>
                </div>
              </div>

              <!-- Binational Offices -->
              <div class="offices-container mt-4 pt-4 border-top border-glass">
                <h5 class="text-white fw-bold mb-3">Nuestras Oficinas</h5>
                <div class="row g-3">
                  <div class="col-sm-6 text-start">
                    <h6 class="text-neon-blue fw-bold mb-1"><i class="fa-solid fa-location-dot me-1"></i>La Paz (BO)</h6>
                    <p class="text-secondary small mb-0">Av. 6 de Marzo,  Edificio Bella Vista, Piso 3.</p>
                  </div>
                  <div class="col-sm-6 text-start">
                    <h6 class="text-neon-blue fw-bold mb-1"><i class="fa-solid fa-location-dot me-1"></i>Iquique (CL)</h6>
                    <p class="text-secondary small mb-0">Av. Arturo Prat 1092, Edificio Costanera, Iquique.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Glassmorphic Form -->
          <div class="col-lg-7">
            <div class="contact-form-panel glass-panel p-4 h-100">
              <h4 class="text-white fw-bold mb-4 text-start">Solicitud de Cotización</h4>
              
              <form (ngSubmit)="onSubmit()" #contactForm="ngForm">
                <div class="row g-3">
                  <!-- Name -->
                  <div class="col-md-6">
                    <div class="form-floating mb-3">
                      <input 
                        type="text" 
                        class="form-control" 
                        id="nameInput" 
                        placeholder="Nombre Completo"
                        [(ngModel)]="formModel.name"
                        name="name"
                        required
                        #nameRef="ngModel"
                      >
                      <label for="nameInput">Nombre Completo</label>
                    </div>
                  </div>
                  
                  <!-- Email -->
                  <div class="col-md-6">
                    <div class="form-floating mb-3">
                      <input 
                        type="email" 
                        class="form-control" 
                        id="emailInput" 
                        placeholder="Correo Electrónico"
                        [(ngModel)]="formModel.email"
                        name="email"
                        required
                        email
                        #emailRef="ngModel"
                      >
                      <label for="emailInput">Correo Electrónico</label>
                    </div>
                  </div>

                  <!-- Phone -->
                  <div class="col-md-6">
                    <div class="form-floating mb-3">
                      <input 
                        type="text" 
                        class="form-control" 
                        id="phoneInput" 
                        placeholder="Teléfono / WhatsApp"
                        [(ngModel)]="formModel.phone"
                        name="phone"
                        required
                        #phoneRef="ngModel"
                      >
                      <label for="phoneInput">Teléfono / WhatsApp</label>
                    </div>
                  </div>

                  <!-- Operation Type -->
                  <div class="col-md-6">
                    <div class="form-floating mb-3">
                      <select 
                        class="form-select" 
                        id="typeSelect"
                        [(ngModel)]="formModel.type"
                        name="type"
                        required
                      >
                        <option value="importacion">Importación (Chile -> Bolivia)</option>
                        <option value="exportacion">Exportación (Bolivia -> Chile)</option>
                        <option value="nacional">Carga Especial / Sobredimensionada</option>
                        <option value="otra">Otras Consultas</option>
                      </select>
                      <label for="typeSelect">Tipo de Operación</label>
                    </div>
                  </div>

                  <!-- Message -->
                  <div class="col-12">
                    <div class="form-floating mb-4">
                      <textarea 
                        class="form-control" 
                        placeholder="Detalles de la carga (Peso, volumen, ruta y tipo de mercancía)" 
                        id="messageTextarea" 
                        style="height: 120px"
                        [(ngModel)]="formModel.message"
                        name="message"
                        required
                        #msgRef="ngModel"
                      ></textarea>
                      <label for="messageTextarea">Detalles de su Carga (Peso, ruta...)</label>
                    </div>
                  </div>

                  <!-- Feedback Success message -->
                  <div class="col-12 mb-3" *ngIf="isSubmitted">
                    <div class="alert alert-success bg-success-glow border-success text-white small p-3 text-start">
                      <i class="fa-solid fa-circle-check me-2"></i> ¡Mensaje enviado con éxito! Un especialista en logística internacional se contactará con usted a la brevedad.
                    </div>
                  </div>

                  <!-- Submit button -->
                  <div class="col-12 text-start">
                    <button 
                      type="submit" 
                      class="btn-neon-orange py-3 px-5 w-100" 
                      [disabled]="!contactForm.form.valid"
                    >
                      <i class="fa-solid fa-paper-plane me-2"></i> Enviar Mensaje
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating WhatsApp widget -->
      
    </section>
  `,
  styles: [`
    #contact {
      background-color: var(--bg-secondary);
      z-index: 2;
    }

    .decor-glow {
      width: 400px;
      height: 400px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 1;
      
      &.orange {
        top: -10%;
        right: -10%;
        background: radial-gradient(circle, rgba(255, 107, 0, 0.04) 0%, transparent 70%);
      }
      
      &.blue {
        bottom: -10%;
        left: -10%;
        background: radial-gradient(circle, rgba(0, 240, 255, 0.04) 0%, transparent 70%);
      }
    }

    .border-glass {
      border-color: rgba(255, 255, 255, 0.05) !important;
    }

    .icon-box-neon {
      width: 45px;
      height: 45px;
      border-radius: 10px;
      background: rgba(255, 107, 0, 0.1);
      border: 1px solid rgba(255, 107, 0, 0.2);
      color: var(--neon-orange);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      box-shadow: 0 0 10px rgba(255, 107, 0, 0.1);
    }

    /* Floating labels styling */
    .form-floating {
      label {
        color: var(--text-secondary) !important;
      }
      
      .form-control, .form-select {
        background-color: rgba(3, 7, 18, 0.4) !important;
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: white !important;
        border-radius: 12px;
        transition: var(--transition-smooth);
        
        &:focus {
          border-color: var(--neon-orange) !important;
          box-shadow: 0 0 15px var(--neon-orange-glow) !important;
          background-color: rgba(3, 7, 18, 0.6) !important;
        }
      }

      .form-select option {
        background-color: var(--bg-primary);
        color: white;
      }
    }

    .bg-success-glow {
      background-color: rgba(25, 135, 84, 0.15);
    }

    /* WhatsApp floating widget */
    
  `]
})
export class ContactComponent {
  formModel: ContactModel = {
    name: '',
    email: '',
    phone: '',
    type: 'importacion',
    message: ''
  };

  isSubmitted = false;

  onSubmit() {
    this.isSubmitted = true;
    
    // Simulate API delay
    setTimeout(() => {
      // Clear form
      this.formModel = {
        name: '',
        email: '',
        phone: '',
        type: 'importacion',
        message: ''
      };
      
      // Auto-hide feedback after 5 seconds
      setTimeout(() => {
        this.isSubmitted = false;
      }, 5000);
    }, 1000);
  }
}
