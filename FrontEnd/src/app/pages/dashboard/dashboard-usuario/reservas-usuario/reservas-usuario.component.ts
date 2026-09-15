import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReservasService } from '../../../../services/reservas.service';
import { HabitacionesService } from '../../../../services/habitaciones.service';
import { Habitacion } from '../../../../models/habitacion.model';
import { Reserva } from '../../../../models/reserva.model';

@Component({
  selector: 'app-reservas-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reservas-usuario.component.html',
  styleUrl: './reservas-usuario.component.css'
})
export class ReservasUsuarioComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly reservasService = inject(ReservasService);
  private readonly habitacionesService = inject(HabitacionesService);

  currentStep = 1;
  showNoAvailability = false;
  bookingSuccess = false;
  isSubmitting = false;
  submitError: string | null = null;

  habitaciones: Habitacion[] = [];
  isLoadingHabitaciones = true;
  habitacionSeleccionada: Habitacion | null = null;
  reservaConfirmada: Reserva | null = null;

  // Formulario Reactivo principal
  reservaForm: FormGroup = this.fb.group(
    {
      // Paso 1: Fechas y Habitación
      fechaIngreso: ['2026-09-20', [Validators.required]],
      fechaSalida: ['2026-09-23', [Validators.required]],
      tipoHabitacion: ['', [Validators.required]],
      huespedes: [1, [Validators.required, Validators.min(1), Validators.max(8)]],

      // Paso 2: Datos del Huésped y Extras
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      dni: ['', [Validators.required, Validators.pattern(/^[0-9]{7,10}$/)]],
      telefono: ['', [Validators.required, Validators.minLength(6)]],
      desayuno: [true],
      traslado: [false],
      notas: ['']
    },
    {
      validators: [this.fechaSalidaPosteriorValidator]
    }
  );

  ngOnInit(): void {
    this.cargarHabitaciones();
  }

  // Getters para facilitar el acceso a validaciones en la plantilla
  get f() {
    return this.reservaForm.controls;
  }

  cargarHabitaciones(): void {
    this.isLoadingHabitaciones = true;
    this.habitacionesService.getHabitaciones().subscribe({
      next: (data) => {
        this.habitaciones = data;
        this.isLoadingHabitaciones = false;

        // Seleccionar por defecto la primera disponible
        const primeraDisponible = this.habitaciones.find(h => h.disponible);
        if (primeraDisponible) {
          this.seleccionarHabitacion(primeraDisponible);
        }
      },
      error: (err) => {
        console.error('Error al cargar habitaciones desde json-server:', err);
        this.isLoadingHabitaciones = false;
      }
    });
  }

  seleccionarHabitacion(hab: Habitacion): void {
    if (!hab.disponible) return;
    this.habitacionSeleccionada = hab;
    this.reservaForm.patchValue({
      tipoHabitacion: hab.tipo
    });
  }

  calcularNoches(): number {
    const ingreso = this.reservaForm.get('fechaIngreso')?.value;
    const salida = this.reservaForm.get('fechaSalida')?.value;
    if (!ingreso || !salida) return 1;

    const dIngreso = new Date(ingreso);
    const dSalida = new Date(salida);
    const diffTime = dSalida.getTime() - dIngreso.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }

  calcularTotal(): number {
    const noches = this.calcularNoches();
    const precioBase = this.habitacionSeleccionada ? this.habitacionSeleccionada.precioPorNoche : 30000;
    let total = precioBase * noches;

    if (this.reservaForm.get('desayuno')?.value) {
      total += 8000 * noches;
    }
    if (this.reservaForm.get('traslado')?.value) {
      total += 15000;
    }
    return total;
  }

  avanzarPaso2(): void {
    const ingreso = this.reservaForm.get('fechaIngreso');
    const salida = this.reservaForm.get('fechaSalida');
    const tipo = this.reservaForm.get('tipoHabitacion');
    const huespedes = this.reservaForm.get('huespedes');

    ingreso?.markAsTouched();
    salida?.markAsTouched();
    tipo?.markAsTouched();
    huespedes?.markAsTouched();

    if (ingreso?.invalid || salida?.invalid || tipo?.invalid || huespedes?.invalid || this.reservaForm.hasError('fechaSalidaInvalida')) {
      return;
    }

    this.currentStep = 2;
  }

  avanzarPaso3(): void {
    const nombre = this.reservaForm.get('nombre');
    const email = this.reservaForm.get('email');
    const dni = this.reservaForm.get('dni');
    const telefono = this.reservaForm.get('telefono');

    nombre?.markAsTouched();
    email?.markAsTouched();
    dni?.markAsTouched();
    telefono?.markAsTouched();

    if (nombre?.invalid || email?.invalid || dni?.invalid || telefono?.invalid) {
      return;
    }

    this.currentStep = 3;
  }

  confirmarReserva(): void {
    this.submitError = null;

    if (this.reservaForm.invalid) {
      this.reservaForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formVal = this.reservaForm.getRawValue();

    const serviciosExtra: string[] = [];
    if (formVal.desayuno) serviciosExtra.push('Desayuno Buffet Diario');
    if (formVal.traslado) serviciosExtra.push('Traslado Aeropuerto / Terminal');

    const nuevaReserva: Reserva = {
      nombre: formVal.nombre.trim(),
      email: formVal.email.trim(),
      dni: formVal.dni.trim(),
      telefono: formVal.telefono.trim(),
      fechaIngreso: formVal.fechaIngreso,
      fechaSalida: formVal.fechaSalida,
      huespedes: Number(formVal.huespedes),
      tipoHabitacion: formVal.tipoHabitacion,
      precioTotal: this.calcularTotal(),
      serviciosExtra,
      notas: formVal.notas ? formVal.notas.trim() : undefined,
      estado: 'pendiente',
      fechaCreacion: new Date().toISOString().split('T')[0]
    };

    this.reservasService.crearReserva(nuevaReserva).subscribe({
      next: (creada) => {
        this.reservaConfirmada = creada;
        this.bookingSuccess = true;
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Error al guardar reserva en json-server:', err);
        this.submitError = 'No se pudo guardar la reserva en el servidor. Verificá que json-server esté corriendo en el puerto 3000.';
        this.isSubmitting = false;
      }
    });
  }

  resetWizard(): void {
    this.bookingSuccess = false;
    this.currentStep = 1;
    this.submitError = null;
    this.reservaConfirmada = null;

    this.reservaForm.reset({
      fechaIngreso: '2026-09-20',
      fechaSalida: '2026-09-23',
      tipoHabitacion: this.habitaciones[0]?.tipo || '',
      huespedes: 1,
      nombre: '',
      email: '',
      dni: '',
      telefono: '',
      desayuno: true,
      traslado: false,
      notas: ''
    });

    if (this.habitaciones.length > 0) {
      this.seleccionarHabitacion(this.habitaciones[0]);
    }
  }

  private fechaSalidaPosteriorValidator(control: AbstractControl): ValidationErrors | null {
    const fechaIngreso = control.get('fechaIngreso')?.value;
    const fechaSalida = control.get('fechaSalida')?.value;

    if (!fechaIngreso || !fechaSalida) {
      return null;
    }

    return new Date(fechaSalida) > new Date(fechaIngreso) ? null : { fechaSalidaInvalida: true };
  }
}
