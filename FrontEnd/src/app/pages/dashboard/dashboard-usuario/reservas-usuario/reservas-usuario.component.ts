import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface RoomOption {
  id: string;
  name: string;
  desc: string;
  price: number;
}

@Component({
  selector: 'app-reservas-usuario',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="booking-wizard-container">
      
      <!-- STEPS INDICATOR -->
      <div class="d-flex justify-content-center gap-2 mb-4">
        <button 
          type="button" 
          class="btn rounded-pill text-xs font-weight-800 px-3 py-2"
          [class.btn-dark]="currentStep === 1"
          [class.btn-outline-secondary]="currentStep !== 1"
          (click)="currentStep = 1">
          1. Fechas y Habitación
        </button>
        <button 
          type="button" 
          class="btn rounded-pill text-xs font-weight-800 px-3 py-2"
          [class.btn-dark]="currentStep === 2"
          [class.btn-outline-secondary]="currentStep !== 2"
          (click)="currentStep = 2">
          2. Servicios y Extras
        </button>
        <button 
          type="button" 
          class="btn rounded-pill text-xs font-weight-800 px-3 py-2"
          [class.btn-dark]="currentStep === 3"
          [class.btn-outline-secondary]="currentStep !== 3"
          (click)="currentStep = 3">
          3. Confirmación
        </button>
      </div>

      <!-- PASO 1: BÚSQUEDA Y DISPONIBILIDAD -->
      @if (currentStep === 1) {
        <section class="content-section">
          <div class="text-center mb-40">
            <h2 class="text-3xl font-weight-900 mb-12">Planifica tu próxima aventura</h2>
            <p class="header-subtitle">Paso 1: Elige tus fechas y habitación</p>
          </div>
          
          <div class="user-booking-flow-grid">
            <div class="booking-form-box">
              <div class="form-grid-2 mb-32">
                <div class="form-group">
                  <label class="auth-label">Fecha de Check-in</label>
                  <input type="date" class="input-field" [(ngModel)]="checkInDate">
                </div>
                <div class="form-group">
                  <label class="auth-label">Fecha de Check-out</label>
                  <input type="date" class="input-field" [(ngModel)]="checkOutDate">
                </div>
              </div>

              <div class="room-selector-box">
                <h3 class="mb-20 font-weight-800 text-base">Elige tu tipo de habitación</h3>
                <div class="flex-column gap-12">
                  @for (room of roomOptions; track room.id) {
                    <div 
                      class="room-option-card"
                      [class.selected]="selectedRoom.id === room.id"
                      (click)="selectedRoom = room">
                      <input type="radio" [checked]="selectedRoom.id === room.id" name="roomSelect">
                      <div class="flex-1">
                        <strong>{{ room.name }}</strong>
                        <p class="text-secondary text-xs m-0">{{ room.desc }}</p>
                      </div>
                      <span class="font-weight-800">\${{ room.price }}/noche</span>
                    </div>
                  }
                </div>
              </div>
            </div>

            <div class="availability-check-sidebar">
              <div class="card p-4 rounded-4">
                @if (!showNoAvailability) {
                  <div>
                    <h3 class="mb-16">Consulta de Disponibilidad</h3>
                    <p class="text-secondary mb-32 text-sm">Verifica disponibilidad para avanzar con tu reserva.</p>
                    <button 
                      type="button" 
                      class="btn-premium w-full flex-center height-56 font-weight-800 cursor-pointer"
                      (click)="currentStep = 2">
                      VERIFICAR DISPONIBILIDAD & CONTINUAR
                    </button>
                    <button 
                      type="button" 
                      class="bg-transparent border-0 text-secondary cursor-pointer mt-16 w-full text-decoration-underline text-xs"
                      (click)="showNoAvailability = true">
                      Simular Sin Cupo
                    </button>
                  </div>
                } @else {
                  <div>
                    <div class="text-danger mb-2">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="3">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                    </div>
                    <h3 class="text-danger mb-2">Sin Disponibilidad</h3>
                    <p class="text-secondary mb-3 text-sm">Lo sentimos, no hay habitaciones disponibles para el tipo seleccionado en las fechas elegidas.</p>
                    <div class="flex-column gap-12">
                      <button type="button" class="btn-outline flex-center text-sm" (click)="showNoAvailability = false">Modificar Fechas</button>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </section>
      }

      <!-- PASO 2: SERVICIOS Y EXTRAS -->
      @if (currentStep === 2) {
        <section class="content-section">
          <div class="text-center mb-40">
            <h2 class="text-3xl font-weight-900 mb-12">Personaliza tu Estadía</h2>
            <p class="header-subtitle">Paso 2: Añade servicios extra para mejorar tu experiencia</p>
          </div>

          <div class="row g-4 mb-4">
            <div class="col-md-6">
              <div class="card p-3 rounded-4 d-flex flex-row align-items-center gap-3">
                <input type="checkbox" [(ngModel)]="extraBreakfast" id="extraBreakfast" style="width: 20px; height: 20px;">
                <label for="extraBreakfast" class="cursor-pointer flex-1 m-0">
                  <strong>Desayuno Buffet Diario</strong>
                  <p class="text-secondary text-xs m-0">Café, frutas de estación y panadería artesanal.</p>
                </label>
                <span class="font-weight-800">+\$8 / día</span>
              </div>
            </div>

            <div class="col-md-6">
              <div class="card p-3 rounded-4 d-flex flex-row align-items-center gap-3">
                <input type="checkbox" [(ngModel)]="extraTransfer" id="extraTransfer" style="width: 20px; height: 20px;">
                <label for="extraTransfer" class="cursor-pointer flex-1 m-0">
                  <strong>Traslado Aeropuerto / Terminal</strong>
                  <p class="text-secondary text-xs m-0">Pick-up exclusivo con transporte climatizado.</p>
                </label>
                <span class="font-weight-800">+\$15 Único</span>
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-between pt-3 border-top">
            <button type="button" class="btn-outline" (click)="currentStep = 1">Atrás</button>
            <button type="button" class="btn-premium" (click)="currentStep = 3">Siguiente: Resumen</button>
          </div>
        </section>
      }

      <!-- PASO 3: CONFIRMACIÓN Y PAGO -->
      @if (currentStep === 3) {
        <section class="content-section text-center">
          <div class="mb-40">
            <h2 class="text-3xl font-weight-900 mb-12">Resumen de tu Reserva</h2>
            <p class="header-subtitle">Paso 3: Confirma la información antes de finalizar</p>
          </div>

          <div class="card p-4 rounded-4 max-w-600 mx-auto text-start mb-4" style="max-width: 600px;">
            <div class="d-flex justify-content-between border-bottom pb-3 mb-3">
              <span class="text-secondary">Habitación:</span>
              <strong>{{ selectedRoom.name }}</strong>
            </div>
            <div class="d-flex justify-content-between border-bottom pb-3 mb-3">
              <span class="text-secondary">Fechas:</span>
              <strong>{{ checkInDate }} al {{ checkOutDate }} (3 Noches)</strong>
            </div>
            <div class="d-flex justify-content-between border-bottom pb-3 mb-3">
              <span class="text-secondary">Servicios Adicionales:</span>
              <span>
                {{ extraBreakfast ? 'Desayuno Buffet (+\$24)' : '' }}
                {{ extraTransfer ? (extraBreakfast ? ', Traslado (+\$15)' : 'Traslado (+\$15)') : '' }}
                {{ !extraBreakfast && !extraTransfer ? 'Ninguno' : '' }}
              </span>
            </div>
            <div class="d-flex justify-content-between fs-4 font-weight-800 pt-2">
              <span>Total a Pagar:</span>
              <span class="text-success">\${{ calculateTotal() }}</span>
            </div>
          </div>

          <div class="d-flex justify-content-center gap-3">
            <button type="button" class="btn-outline" (click)="currentStep = 2">Atrás</button>
            <button type="button" class="btn-premium" (click)="confirmBooking()">Confirmar y Reservar</button>
          </div>
        </section>
      }

      <!-- CONFIRMACIÓN ÉXITO -->
      @if (bookingSuccess) {
        <div class="modal-backdrop-custom">
          <div class="modal-content-premium">
            <div class="text-success mb-3">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2 class="text-2xl font-weight-800 mb-2">¡Reserva Realizada con Éxito!</h2>
            <p class="text-secondary mb-4">Código de Reserva: <strong>#BH-{{ randomCode }}</strong></p>
            <button type="button" class="btn-premium w-full" (click)="resetWizard()">Aceptar y Finalizar</button>
          </div>
        </div>
      }

    </div>
  `
})
export class ReservasUsuarioComponent {
  currentStep = 1;
  showNoAvailability = false;
  bookingSuccess = false;
  randomCode = Math.floor(1000 + Math.random() * 9000);

  checkInDate = '2026-06-20';
  checkOutDate = '2026-06-23';

  roomOptions: RoomOption[] = [
    { id: 'ind', name: 'Habitación Individual', desc: 'Perfecta para viajeros solitarios.', price: 30 },
    { id: 'dob', name: 'Habitación Doble', desc: 'Espacio compartido para dos personas.', price: 45 },
    { id: 'suite', name: 'Suite Premium', desc: 'Máximo lujo y vistas panorámicas.', price: 85 }
  ];

  selectedRoom: RoomOption = this.roomOptions[0];
  extraBreakfast = true;
  extraTransfer = false;

  calculateTotal(): number {
    let total = this.selectedRoom.price * 3;
    if (this.extraBreakfast) total += 24;
    if (this.extraTransfer) total += 15;
    return total;
  }

  confirmBooking(): void {
    this.randomCode = Math.floor(1000 + Math.random() * 9000);
    this.bookingSuccess = true;
  }

  resetWizard(): void {
    this.bookingSuccess = false;
    this.currentStep = 1;
  }
}
