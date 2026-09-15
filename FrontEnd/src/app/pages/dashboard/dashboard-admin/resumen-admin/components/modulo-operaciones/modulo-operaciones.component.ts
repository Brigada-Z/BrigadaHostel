import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitacionesService } from '../../../../../../services/habitaciones.service';
import { Habitacion } from '../../../../../../models/habitacion.model';

@Component({
  selector: 'app-modulo-operaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modulo-operaciones.component.html',
  styleUrl: './modulo-operaciones.component.css'
})
export class ModuloOperacionesComponent implements OnInit {
  private readonly habitacionesService = inject(HabitacionesService);

  habitaciones: Habitacion[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.cargarHabitaciones();
  }

  cargarHabitaciones(): void {
    this.isLoading = true;
    this.habitacionesService.getHabitaciones().subscribe({
      next: (data) => {
        this.habitaciones = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar habitaciones en módulo operaciones:', err);
        this.isLoading = false;
      }
    });
  }
}
