import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservasService } from '../../../../../../services/reservas.service';
import { Reserva } from '../../../../../../models/reserva.model';

@Component({
  selector: 'app-modulo-huespedes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modulo-huespedes.component.html',
  styleUrl: './modulo-huespedes.component.css'
})
export class ModuloHuespedesComponent implements OnInit {
  private readonly reservasService = inject(ReservasService);

  huespedes: Reserva[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.cargarHuespedes();
  }

  cargarHuespedes(): void {
    this.isLoading = true;
    this.reservasService.getReservas().subscribe({
      next: (data) => {
        this.huespedes = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar huéspedes:', err);
        this.isLoading = false;
      }
    });
  }
}
