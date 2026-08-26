import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

export interface RoomOption {
  id: string;
  name: string;
  desc: string;
  price: number;
}

@Component({
  selector: 'app-reservas-usuario',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './reservas-usuario.component.html',
  styleUrl: './reservas-usuario.component.css'
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
