import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface AdminReservation {
  code: string;
  guestName: string;
  dni: string;
  period: string;
  room: string;
  status: 'Pendiente' | 'Check-in' | 'Cancelada';
}

@Component({
  selector: 'app-reservas-admin',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="admin-wrapper">
      
      <!-- BÚSQUEDA Y FILTROS -->
      <section class="admin-search-module mb-40">
        <div class="row g-3 align-items-center">
          <div class="col-lg-6">
            <div class="search-premium-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                class="search-input" 
                placeholder="Buscar por Huésped, DNI/Pasaporte o Código #BH..."
                [(ngModel)]="searchQuery"
                (input)="filterReservations()">
            </div>
          </div>
          <div class="col-lg-6">
            <div class="d-flex gap-2">
              <select class="form-select height-52" [(ngModel)]="selectedPeriod" (change)="filterReservations()">
                <option value="all">Estadía: Todas</option>
                <option value="today">Estadía: Hoy</option>
                <option value="week">Esta Semana</option>
              </select>
              <select class="form-select height-52" [(ngModel)]="selectedStatus" (change)="filterReservations()">
                <option value="all">Estado: Todos</option>
                <option value="Pendiente">Pendientes</option>
                <option value="Check-in">Confirmadas / Check-in</option>
                <option value="Cancelada">Canceladas</option>
              </select>
              <button type="button" class="btn btn-outline-secondary flex-shrink-0" (click)="showErrorModal = true">
                Simular Error
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- DATA GRID RESULTS -->
      <section class="admin-results-grid content-section">
        <div class="flex-between mb-32">
          <h2 class="m-0 text-2xl font-weight-800">Listado Maestro de Reservas</h2>
          <span class="status-badge status-reserva-activa">{{ filteredList.length }} Registros Encontrados</span>
        </div>

        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th class="border-0">Código</th>
                <th class="border-0">Huésped</th>
                <th class="border-0">Periodo</th>
                <th class="border-0">Habitación</th>
                <th class="border-0">Estado</th>
                <th class="border-0 text-end">Acción</th>
              </tr>
            </thead>
            <tbody>
              @for (item of filteredList; track item.code) {
                <tr>
                  <td data-label="Código" class="font-bold text-accent">{{ item.code }}</td>
                  <td data-label="Huésped">
                    <div class="font-bold">{{ item.guestName }}</div>
                    <div class="text-xs text-secondary">DNI: {{ item.dni }}</div>
                  </td>
                  <td data-label="Periodo">{{ item.period }}</td>
                  <td data-label="Habitación">
                    <span class="badge bg-light text-dark border px-2 py-1">{{ item.room }}</span>
                  </td>
                  <td data-label="Estado">
                    <span 
                      class="badge-status"
                      [class.yellow]="item.status === 'Pendiente'"
                      [class.green]="item.status === 'Check-in'"
                      [class.red]="item.status === 'Cancelada'">
                      {{ item.status }}
                    </span>
                  </td>
                  <td data-label="Acción" class="text-end">
                    <button type="button" class="btn-premium btn-small" (click)="openDrawer(item)">
                      Gestionar
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="text-center py-4 text-secondary">
                    No se encontraron reservas con los criterios especificados.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <!-- SLIDE-OVER DRAWER DETALLES & GESTIÓN -->
      @if (activeDrawerReservation) {
        <div class="admin-side-panel-backdrop" (click)="closeDrawer()">
          <div class="panel-content-wrapper" (click)="$event.stopPropagation()">
            <div class="panel-top-bar flex-between">
              <div>
                <h3 class="m-0 font-weight-800">Gestionar Reserva {{ activeDrawerReservation.code }}</h3>
                <p class="text-secondary text-xs m-0">Detalles de huésped y control operacional</p>
              </div>
              <button type="button" class="btn-close" (click)="closeDrawer()"></button>
            </div>

            <div class="panel-main-body">
              <div class="d-flex gap-3 mb-4 border-bottom pb-2">
                <button 
                  type="button" 
                  class="btn p-0 pb-2 font-weight-800 text-sm border-0"
                  [class.text-dark]="activeDrawerTab === 'edit'"
                  [class.border-bottom]="activeDrawerTab === 'edit'"
                  (click)="activeDrawerTab = 'edit'">
                  Información y Edición
                </button>
                <button 
                  type="button" 
                  class="btn p-0 pb-2 font-weight-800 text-sm border-0"
                  [class.text-dark]="activeDrawerTab === 'audit'"
                  [class.border-bottom]="activeDrawerTab === 'audit'"
                  (click)="activeDrawerTab = 'audit'">
                  Historial de Auditoría
                </button>
              </div>

              @if (activeDrawerTab === 'edit') {
                <div>
                  <div class="form-group mb-3">
                    <label class="auth-label">Huésped</label>
                    <input type="text" class="input-field" [(ngModel)]="activeDrawerReservation.guestName">
                  </div>
                  <div class="form-group mb-3">
                    <label class="auth-label">DNI / Documento</label>
                    <input type="text" class="input-field" [(ngModel)]="activeDrawerReservation.dni">
                  </div>
                  <div class="form-group mb-3">
                    <label class="auth-label">Estado de la Reserva</label>
                    <select class="form-select input-field" [(ngModel)]="activeDrawerReservation.status">
                      <option value="Pendiente">Pendiente</option>
                      <option value="Check-in">Check-in / Confirmada</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>
                  </div>

                  <div class="d-flex gap-2 mt-4 pt-3 border-top">
                    <button type="button" class="btn-premium flex-1" (click)="saveChanges()">
                      Guardar Cambios
                    </button>
                    <button type="button" class="btn btn-outline-danger flex-1" (click)="showCancelConfirm = true">
                      Cancelar Reserva
                    </button>
                  </div>
                </div>
              } @else {
                <div class="timeline">
                  <div class="p-3 bg-light rounded-3 mb-2 border">
                    <strong class="text-xs text-secondary d-block">15/06/2026 10:45 AM</strong>
                    <span class="text-sm">Check-in realizado en recepción por Administrador</span>
                  </div>
                  <div class="p-3 bg-light rounded-3 mb-2 border">
                    <strong class="text-xs text-secondary d-block">10/06/2026 09:12 AM</strong>
                    <span class="text-sm">Reserva creada via Portal Web</span>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }

      <!-- MODAL CONFIRMAR CANCELACIÓN -->
      @if (showCancelConfirm) {
        <div class="modal-backdrop-custom">
          <div class="modal-content-premium">
            <div class="text-danger mb-3">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3 class="font-weight-800 mb-2">¿Confirmar Cancelación?</h3>
            <p class="text-secondary mb-4 text-sm">Esta acción cambiará el estado de la reserva a Cancelada.</p>
            <div class="d-flex gap-2">
              <button type="button" class="btn-outline flex-1" (click)="showCancelConfirm = false">Volver</button>
              <button type="button" class="btn btn-danger flex-1 rounded-3 font-weight-800" (click)="executeCancel()">Sí, Cancelar</button>
            </div>
          </div>
        </div>
      }

      <!-- MODAL ERROR SIMULADO -->
      @if (showErrorModal) {
        <div class="modal-backdrop-custom">
          <div class="modal-content-premium">
            <div class="text-warning mb-3">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <h3 class="font-weight-800 mb-2">Simulación de Error de Búsqueda</h3>
            <p class="text-secondary mb-4 text-sm">No se pudo obtener la conexión con el servidor maestro de reservas.</p>
            <button type="button" class="btn-premium w-full" (click)="showErrorModal = false">Cerrar Notificación</button>
          </div>
        </div>
      }

      <!-- TOAST NOTIFICACIÓN -->
      @if (toastMessage) {
        <div class="toast-fixed-stack">
          <div class="toast-item-premium">
            <div class="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style="width:28px;height:28px;">
              ✓
            </div>
            <span>{{ toastMessage }}</span>
          </div>
        </div>
      }

    </div>
  `
})
export class ReservasAdminComponent {
  searchQuery = '';
  selectedPeriod = 'all';
  selectedStatus = 'all';

  showErrorModal = false;
  showCancelConfirm = false;
  toastMessage: string | null = null;

  activeDrawerReservation: AdminReservation | null = null;
  activeDrawerTab: 'edit' | 'audit' = 'edit';

  reservations: AdminReservation[] = [
    { code: '#BH-9921', guestName: 'Juan Pérez', dni: '20.345.678', period: '15/06 - 18/06', room: 'Suite 101', status: 'Pendiente' },
    { code: '#BH-8840', guestName: 'María García', dni: '35.123.456', period: '14/06 - 16/06', room: 'Doble 102', status: 'Check-in' },
    { code: '#BH-7730', guestName: 'Carlos Ruiz', dni: '12.888.444', period: '10/06 - 12/06', room: 'Cama 4', status: 'Cancelada' }
  ];

  filteredList: AdminReservation[] = [...this.reservations];

  filterReservations(): void {
    this.filteredList = this.reservations.filter(item => {
      const matchesQuery = 
        item.code.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.guestName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.dni.includes(this.searchQuery);

      const matchesStatus = this.selectedStatus === 'all' || item.status === this.selectedStatus;
      return matchesQuery && matchesStatus;
    });
  }

  openDrawer(item: AdminReservation): void {
    this.activeDrawerReservation = { ...item };
    this.activeDrawerTab = 'edit';
  }

  closeDrawer(): void {
    this.activeDrawerReservation = null;
  }

  saveChanges(): void {
    if (!this.activeDrawerReservation) return;
    const index = this.reservations.findIndex(r => r.code === this.activeDrawerReservation!.code);
    if (index !== -1) {
      this.reservations[index] = { ...this.activeDrawerReservation };
      this.filterReservations();
    }
    this.showToast('Cambios guardados correctamente');
    this.closeDrawer();
  }

  executeCancel(): void {
    if (!this.activeDrawerReservation) return;
    this.activeDrawerReservation.status = 'Cancelada';
    this.saveChanges();
    this.showCancelConfirm = false;
  }

  showToast(msg: string): void {
    this.toastMessage = msg;
    setTimeout(() => {
      this.toastMessage = null;
    }, 3000);
  }
}
