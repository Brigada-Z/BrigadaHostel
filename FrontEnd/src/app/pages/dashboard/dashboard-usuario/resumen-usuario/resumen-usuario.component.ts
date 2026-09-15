import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReservasService } from '../../../../services/reservas.service';
import { Reserva } from '../../../../models/reserva.model';

@Component({
  selector: 'app-resumen-usuario',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './resumen-usuario.component.html',
  styleUrl: './resumen-usuario.component.css'
})
export class ResumenUsuarioComponent implements OnInit {
  private readonly reservasService = inject(ReservasService);

  reservas: Reserva[] = [];
  reservasActivas: Reserva[] = [];
  proximaReserva: Reserva | null = null;
  diasParaViaje: number = 0;
  isLoading: boolean = true;

  ngOnInit(): void {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario(): void {
    this.isLoading = true;
    this.reservasService.getReservas().subscribe({
      next: (data) => {
        this.reservas = data;
        this.reservasActivas = data.filter((r) => r.estado !== 'cancelada');

        if (this.reservasActivas.length > 0) {
          // Tomar la primera activa como próxima reserva
          this.proximaReserva = this.reservasActivas[0];
          this.diasParaViaje = this.calcularDias(this.proximaReserva.fechaIngreso);
        } else {
          this.proximaReserva = null;
          this.diasParaViaje = 0;
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar reservas de usuario:', err);
        this.isLoading = false;
      }
    });
  }

  private calcularDias(fechaStr?: string): number {
    if (!fechaStr) return 0;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const destino = new Date(fechaStr);
    destino.setHours(0, 0, 0, 0);
    const diff = Math.ceil((destino.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff : 0;
  }
}
