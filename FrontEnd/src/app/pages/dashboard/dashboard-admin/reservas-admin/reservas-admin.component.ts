import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservasService } from '../../../../services/reservas.service';
import { Reserva } from '../../../../models/reserva.model';

@Component({
  selector: 'app-reservas-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas-admin.component.html',
  styleUrl: './reservas-admin.component.css'
})
export class ReservasAdminComponent implements OnInit {
  private readonly reservasService = inject(ReservasService);

  searchQuery = '';
  selectedPeriod = 'all';
  selectedStatus = 'all';

  isLoading = true;
  hasError = false;
  errorMessage = '';

  showCancelConfirm = false;
  showDeleteConfirm = false;
  toastMessage: string | null = null;
  toastType: 'success' | 'danger' | 'info' = 'success';

  activeDrawerReservation: Reserva | null = null;
  activeDrawerTab: 'edit' | 'audit' = 'edit';

  reservas: Reserva[] = [];
  filteredList: Reserva[] = [];

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';

    this.reservasService.getReservas().subscribe({
      next: (data) => {
        this.reservas = data;
        this.filterReservations();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al obtener reservas desde json-server:', err);
        this.hasError = true;
        this.errorMessage = 'No se pudo conectar con el servidor (json-server en puerto 3000). Verificá que la API esté corriendo.';
        this.isLoading = false;
      }
    });
  }

  filterReservations(): void {
    const query = this.searchQuery.trim().toLowerCase();

    this.filteredList = this.reservas.filter((item) => {
      const codeMatch = item.id ? `#bh-${item.id.toLowerCase()}`.includes(query) || item.id.toLowerCase().includes(query) : false;
      const guestMatch = item.nombre ? item.nombre.toLowerCase().includes(query) : false;
      const emailMatch = item.email ? item.email.toLowerCase().includes(query) : false;
      const dniMatch = item.dni ? item.dni.toLowerCase().includes(query) : false;
      const roomMatch = item.tipoHabitacion ? item.tipoHabitacion.toLowerCase().includes(query) : false;

      const matchesQuery = query === '' || codeMatch || guestMatch || emailMatch || dniMatch || roomMatch;
      const matchesStatus = this.selectedStatus === 'all' || item.estado === this.selectedStatus;

      let matchesPeriod = true;
      if (this.selectedPeriod === 'today' && item.fechaIngreso) {
        const todayStr = new Date().toISOString().split('T')[0];
        matchesPeriod = item.fechaIngreso === todayStr;
      }

      return matchesQuery && matchesStatus && matchesPeriod;
    });
  }

  openDrawer(item: Reserva): void {
    this.activeDrawerReservation = { ...item };
    this.activeDrawerTab = 'edit';
  }

  closeDrawer(): void {
    this.activeDrawerReservation = null;
    this.showCancelConfirm = false;
    this.showDeleteConfirm = false;
  }

  saveChanges(): void {
    if (!this.activeDrawerReservation || !this.activeDrawerReservation.id) return;

    const id = this.activeDrawerReservation.id;
    this.reservasService.actualizarReserva(id, this.activeDrawerReservation).subscribe({
      next: (updated) => {
        this.showToast(`Reserva #BH-${updated.id} actualizada correctamente.`, 'success');
        this.closeDrawer();
        this.cargarReservas();
      },
      error: (err) => {
        console.error('Error al guardar cambios de reserva:', err);
        this.showToast('Error al actualizar en json-server.', 'danger');
      }
    });
  }

  cambiarEstadoDirecto(item: Reserva, nuevoEstado: 'pendiente' | 'confirmada' | 'cancelada'): void {
    if (!item.id) return;

    this.reservasService.actualizarEstado(item.id, nuevoEstado).subscribe({
      next: () => {
        this.showToast(`Reserva #BH-${item.id} marcada como ${nuevoEstado}.`, 'success');
        this.cargarReservas();
      },
      error: (err) => {
        console.error('Error al cambiar estado:', err);
        this.showToast('Error al actualizar estado en json-server.', 'danger');
      }
    });
  }

  executeCancel(): void {
    if (!this.activeDrawerReservation || !this.activeDrawerReservation.id) return;

    this.reservasService.actualizarEstado(this.activeDrawerReservation.id, 'cancelada').subscribe({
      next: () => {
        this.showToast(`Reserva #BH-${this.activeDrawerReservation?.id} cancelada.`, 'info');
        this.showCancelConfirm = false;
        this.closeDrawer();
        this.cargarReservas();
      },
      error: (err) => {
        console.error('Error al cancelar reserva:', err);
        this.showToast('Error al cancelar en el servidor.', 'danger');
      }
    });
  }

  executeDelete(): void {
    if (!this.activeDrawerReservation || !this.activeDrawerReservation.id) return;

    const id = this.activeDrawerReservation.id;
    this.reservasService.eliminarReserva(id).subscribe({
      next: () => {
        this.showToast(`Reserva #BH-${id} eliminada de db.json.`, 'info');
        this.showDeleteConfirm = false;
        this.closeDrawer();
        this.cargarReservas();
      },
      error: (err) => {
        console.error('Error al eliminar reserva:', err);
        this.showToast('Error al eliminar en json-server.', 'danger');
      }
    });
  }

  showToast(msg: string, type: 'success' | 'danger' | 'info' = 'success'): void {
    this.toastMessage = msg;
    this.toastType = type;
    setTimeout(() => {
      this.toastMessage = null;
    }, 3500);
  }
}
