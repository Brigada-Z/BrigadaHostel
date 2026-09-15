import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  AbstractControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { FormBuilder } from '@angular/forms';

import { ReservasService } from '../../services/reservas.service';
import { HabitacionesService } from '../../services/habitaciones.service';
import { Reserva } from '../../models/reserva.model';
import { Habitacion } from '../../models/habitacion.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly reservasService = inject(ReservasService);
  private readonly habitacionesService = inject(HabitacionesService);

  habitaciones: Habitacion[] = [];
  reservas: Reserva[] = [];

  isSubmitting = false;
  mensajeExito = '';
  mensajeError = '';

  consultaReservaForm = this.fb.nonNullable.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      fechaIngreso: ['', Validators.required],
      fechaSalida: ['', Validators.required],
      huespedes: [1, [Validators.required, Validators.min(1), Validators.max(8)]],
      tipoHabitacion: ['', Validators.required]
    },
    {
      validators: this.fechaSalidaPosteriorValidator
    }
  );

  ngOnInit(): void {
    this.cargarHabitaciones();
    this.cargarReservas();
  }

  get f() {
    return this.consultaReservaForm.controls;
  }

  registrarConsulta(): void {
    this.mensajeExito = '';
    this.mensajeError = '';

    if (this.consultaReservaForm.invalid) {
      this.consultaReservaForm.markAllAsTouched();
      return;
    }

    const formValue = this.consultaReservaForm.getRawValue();

    const nuevaReserva: Reserva = {
      nombre: formValue.nombre,
      email: formValue.email,
      fechaIngreso: formValue.fechaIngreso,
      fechaSalida: formValue.fechaSalida,
      huespedes: formValue.huespedes,
      tipoHabitacion: formValue.tipoHabitacion,
      estado: 'pendiente'
    };

    this.isSubmitting = true;

    this.reservasService.crearReserva(nuevaReserva).subscribe({
      next: (reservaCreada) => {
        this.mensajeExito = `Consulta registrada correctamente. Número de reserva: ${reservaCreada.id}.`;
        this.consultaReservaForm.reset({
          nombre: '',
          email: '',
          fechaIngreso: '',
          fechaSalida: '',
          huespedes: 1,
          tipoHabitacion: ''
        });
        this.isSubmitting = false;
        this.cargarReservas();
      },
      error: () => {
        this.mensajeError = 'No se pudo registrar la consulta. Verificá que json-server esté funcionando.';
        this.isSubmitting = false;
      }
    });
  }

  private cargarHabitaciones(): void {
    this.habitacionesService.obtenerHabitaciones().subscribe({
      next: (habitaciones) => {
        this.habitaciones = habitaciones.filter((habitacion) => habitacion.disponible);
      },
      error: () => {
        this.mensajeError = 'No se pudieron cargar las habitaciones disponibles.';
      }
    });
  }

  private cargarReservas(): void {
    this.reservasService.obtenerReservas().subscribe({
      next: (reservas) => {
        this.reservas = reservas.slice(-5).reverse();
      },
      error: () => {
        this.mensajeError = 'No se pudieron cargar las reservas registradas.';
      }
    });
  }

  private fechaSalidaPosteriorValidator(control: AbstractControl): ValidationErrors | null {
    const fechaIngreso = control.get('fechaIngreso')?.value;
    const fechaSalida = control.get('fechaSalida')?.value;

    if (!fechaIngreso || !fechaSalida) {
      return null;
    }

    return fechaSalida > fechaIngreso ? null : { fechaSalidaInvalida: true };
  }
}
