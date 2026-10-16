import { ChangeDetectorRef, Component, DestroyRef, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import {
  AbstractControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { catchError, distinctUntilChanged, forkJoin, map, of, switchMap, tap } from 'rxjs';

import { ReservasService } from '../../services/reservas.service';
import { HabitacionesService } from '../../services/habitaciones.service';
import { ServiciosService } from '../../services/servicios.service';
import { MetricasService } from '../../services/metricas.service';
import { DisponibilidadService } from '../../services/disponibilidad.service';
import { Reserva } from '../../models/reserva.model';
import { Habitacion } from '../../models/habitacion.model';
import { Servicio } from '../../models/servicio.model';
import { MetricasDashboard } from '../../models/metricas.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, DatePipe, DecimalPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  // Sin encapsulación emulada Angular no agrega atributos _ngcontent-* al DOM (inválidos para W3C).
  // Los estilos del componente ya están acotados con el prefijo .public-page.
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly reservasService = inject(ReservasService);
  private readonly habitacionesService = inject(HabitacionesService);
  private readonly serviciosService = inject(ServiciosService);
  private readonly metricasService = inject(MetricasService);
  private readonly disponibilidadService = inject(DisponibilidadService);

  private readonly cantidadConsultasVisibles = 5;

  habitaciones: Habitacion[] = [];
  reservas: Reserva[] = [];
  servicios: Servicio[] = [];
  metricas: MetricasDashboard | null = null;

  // Habitaciones libres para las fechas elegidas (null: todavía no hay un rango de fechas válido)
  habitacionesLibres: Habitacion[] | null = null;
  consultandoDisponibilidad = false;
  avisoDisponibilidad = '';

  cargandoHabitaciones = true;
  cargandoReservas = true;
  cargandoResumen = true;
  errorHabitaciones = '';
  errorReservas = '';
  errorResumen = '';

  isSubmitting = false;
  mensajeExito = '';
  mensajeError = '';

  // La cantidad máxima de huéspedes la define la capacidad real de la habitación elegida
  private readonly capacidadHabitacionValidator = (control: AbstractControl): ValidationErrors | null => {
    const habitacion = this.buscarHabitacion(control.get('habitacionId')?.value);
    const huespedes = control.get('huespedes')?.value;

    if (!habitacion || !huespedes) {
      return null;
    }

    return huespedes > habitacion.capacidad ? { capacidadExcedida: habitacion.capacidad } : null;
  };

  consultaReservaForm = this.fb.nonNullable.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      fechaIngreso: ['', Validators.required],
      fechaSalida: ['', Validators.required],
      huespedes: [1, [Validators.required, Validators.min(1)]],
      habitacionId: ['', Validators.required]
    },
    {
      validators: [this.fechaSalidaPosteriorValidator, this.capacidadHabitacionValidator]
    }
  );

  ngOnInit(): void {
    this.cargarHabitaciones();
    this.cargarReservas();
    this.cargarResumen();
    this.verificarDisponibilidadAlCambiarFechas();
  }

  get f() {
    return this.consultaReservaForm.controls;
  }

  get habitacionSeleccionada(): Habitacion | undefined {
    return this.buscarHabitacion(this.f.habitacionId.value);
  }

  // Opciones del selector: con fechas válidas, solo las habitaciones libres en ese rango
  get opcionesHabitacion(): Habitacion[] {
    return this.habitacionesLibres ?? this.habitaciones;
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
      tipoHabitacion: this.buscarHabitacion(formValue.habitacionId)?.tipo ?? '',
      estado: 'pendiente'
    };

    this.isSubmitting = true;

    this.reservasService.crearReserva(nuevaReserva).subscribe({
      next: (reservaCreada) => {
        this.mensajeExito = `Consulta registrada correctamente. Número de reserva: #BH-${reservaCreada.id}.`;
        this.consultaReservaForm.reset({
          nombre: '',
          email: '',
          fechaIngreso: '',
          fechaSalida: '',
          huespedes: 1,
          habitacionId: ''
        });
        this.isSubmitting = false;
        this.cdr.markForCheck();
        this.cargarReservas();
        this.cargarResumen();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) {
          // Django detectó que las fechas se superponen con otras reservas y no queda cupo
          this.mensajeError = err.error?.error ?? 'No hay disponibilidad para las fechas elegidas.';
        } else if (err.status === 400) {
          this.mensajeError = 'El servidor rechazó la consulta. Revisá los datos ingresados.';
        } else {
          this.mensajeError = 'No se pudo registrar la consulta. Verificá que el servidor backend esté funcionando.';
        }
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }

  /**
   * Cada vez que cambian las fechas consulta en Django qué habitaciones tienen cupo en ese rango.
   * switchMap descarta la consulta anterior si el usuario vuelve a cambiar las fechas.
   */
  private verificarDisponibilidadAlCambiarFechas(): void {
    this.consultaReservaForm.valueChanges.pipe(
      map((valor) => ({ fechaIngreso: valor.fechaIngreso ?? '', fechaSalida: valor.fechaSalida ?? '' })),
      distinctUntilChanged((a, b) => a.fechaIngreso === b.fechaIngreso && a.fechaSalida === b.fechaSalida),
      tap(({ fechaIngreso, fechaSalida }) => {
        this.consultandoDisponibilidad = !!fechaIngreso && !!fechaSalida && fechaSalida > fechaIngreso;
        this.cdr.markForCheck();
      }),
      switchMap(({ fechaIngreso, fechaSalida }) => {
        if (!fechaIngreso || !fechaSalida || fechaSalida <= fechaIngreso) {
          return of(null);
        }
        // undefined: no se pudo consultar (el backend igual valida al enviar y responde 409 si no hay cupo)
        return this.disponibilidadService.obtenerHabitacionesLibres(fechaIngreso, fechaSalida).pipe(
          catchError(() => of(undefined))
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((libres) => this.aplicarDisponibilidad(libres));
  }

  private aplicarDisponibilidad(libres: Habitacion[] | null | undefined): void {
    this.consultandoDisponibilidad = false;
    this.avisoDisponibilidad = '';
    this.habitacionesLibres = libres ?? null;

    if (libres === undefined) {
      this.avisoDisponibilidad = 'No se pudo verificar la disponibilidad para esas fechas; se validará al enviar la consulta.';
    } else if (libres) {
      const seleccion = this.f.habitacionId.value;
      if (seleccion && !libres.some((habitacion) => habitacion.id === seleccion)) {
        this.f.habitacionId.setValue('');
        this.avisoDisponibilidad = 'La habitación elegida no está disponible en esas fechas. Elegí otra.';
      }
    }

    this.cdr.markForCheck();
  }

  cargarHabitaciones(): void {
    this.cargandoHabitaciones = true;
    this.errorHabitaciones = '';

    this.habitacionesService.obtenerHabitacionesDisponibles().subscribe({
      next: (habitaciones) => {
        this.habitaciones = habitaciones;
        this.cargandoHabitaciones = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorHabitaciones = 'No se pudieron cargar las habitaciones disponibles.';
        this.cargandoHabitaciones = false;
        this.cdr.markForCheck();
      }
    });
  }

  cargarReservas(): void {
    this.cargandoReservas = true;
    this.errorReservas = '';

    this.reservasService.obtenerReservas().subscribe({
      next: (reservas) => {
        // Django ya devuelve las reservas ordenadas de la más reciente a la más antigua
        this.reservas = reservas.slice(0, this.cantidadConsultasVisibles);
        this.cargandoReservas = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorReservas = 'No se pudieron cargar las consultas registradas.';
        this.cargandoReservas = false;
        this.cdr.markForCheck();
      }
    });
  }

  cargarResumen(): void {
    this.cargandoResumen = true;
    this.errorResumen = '';

    forkJoin({
      metricas: this.metricasService.obtenerMetricas(),
      servicios: this.serviciosService.obtenerServicios()
    }).subscribe({
      next: ({ metricas, servicios }) => {
        this.metricas = metricas;
        this.servicios = servicios;
        this.cargandoResumen = false;
        this.cdr.markForCheck();
      },
      error: (err: Error) => {
        this.errorResumen = err.message;
        this.cargandoResumen = false;
        this.cdr.markForCheck();
      }
    });
  }

  private buscarHabitacion(id: string | undefined): Habitacion | undefined {
    return this.habitaciones.find((habitacion) => habitacion.id === id);
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
