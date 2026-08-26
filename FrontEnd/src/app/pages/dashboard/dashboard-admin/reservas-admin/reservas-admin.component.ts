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
  templateUrl: './reservas-admin.component.html',
  styleUrl: './reservas-admin.component.css'
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
