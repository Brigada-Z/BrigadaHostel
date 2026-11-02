import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HabitacionesService } from '../../../../../../services/habitaciones.service';
import { Habitacion } from '../../../../../../models/habitacion.model';
import { ReservasService } from '../../../../../../services/reservas.service';
import { Reserva } from '../../../../../../models/reserva.model';
import { IncidenciasService } from '../../../../../../services/incidencias.service';
import { PreferencesService } from '../../../../../../services/preferences.service';

@Component({
  selector: 'app-modulo-operaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './modulo-operaciones.component.html',
  styleUrl: './modulo-operaciones.component.css'
})
export class ModuloOperacionesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly habitacionesService = inject(HabitacionesService);
  private readonly reservasService = inject(ReservasService);
  private readonly incidenciasService = inject(IncidenciasService);
  public readonly preferencesService = inject(PreferencesService);

  habitaciones: Habitacion[] = [];
  isLoading = true;

  // Toast
  toastMessage: string | null = null;
  toastType: 'success' | 'danger' | 'info' = 'success';

  // Modal: Ver Planilla Mensual
  mostrarPlanilla = false;
  planMes = '';
  planReservas: Reserva[] = [];
  isLoadingPlanilla = false;

  // Modal: Nueva Incidencia
  mostrarModalIncidencia = false;
  incidenciaForm: FormGroup = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    habitacionId: ['', Validators.required],
    severidad: ['media', Validators.required],
    descripcion: ['']
  });

  ngOnInit(): void {
    this.cargarHabitaciones();
  }

  cargarHabitaciones(): void {
    this.isLoading = true;
    this.habitacionesService.getHabitaciones().subscribe({
      next: (data) => {
        this.habitaciones = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al cargar habitaciones en módulo operaciones:', err);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  // ==========================================================================
  // PLANILLA MENSUAL
  // ==========================================================================

  abrirPlanilla(): void {
    this.planMes = this.mesActual();
    this.mostrarPlanilla = true;
    this.cargarPlanilla();
  }

  cerrarPlanilla(): void {
    this.mostrarPlanilla = false;
    this.planReservas = [];
    this.cdr.markForCheck();
  }

  cargarPlanilla(mes?: string): void {
    const mesReferencia = mes || this.planMes || this.mesActual();
    const [anio, mesNumero] = mesReferencia.split('-').map(Number);
    const ultimoDia = new Date(anio, (mesNumero || 1) - 1, 0).getDate();
    const fechaFin = `${mesReferencia}-${String(ultimoDia).padStart(2, '0')}`;

    this.isLoadingPlanilla = true;
    this.reservasService.getReservas().subscribe({
      next: (reservas) => {
        // Una reserva entra en la planilla del mes si se cruza con el rango del mes
        this.planReservas = reservas
          .filter((r) => r.fechaIngreso && r.fechaSalida && r.fechaIngreso <= fechaFin && r.fechaSalida >= mesReferencia)
          .sort((a, b) => (a.fechaIngreso || '').localeCompare(b.fechaIngreso || ''));
        this.isLoadingPlanilla = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al armar la planilla mensual:', err);
        this.isLoadingPlanilla = false;
        this.cdr.markForCheck();
      }
    });
  }

  mesActual(): string {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
  }

  // ==========================================================================
  // NUEVA INCIDENCIA
  // ==========================================================================

  abrirModalIncidencia(): void {
    this.incidenciaForm.reset({
      titulo: '',
      habitacionId: this.habitaciones.find((h) => h.disponible)?.id ?? '',
      severidad: 'media',
      descripcion: ''
    });
    this.mostrarModalIncidencia = true;
  }

  cerrarModalIncidencia(): void {
    this.mostrarModalIncidencia = false;
    this.incidenciaForm.reset();
    this.cdr.markForCheck();
  }

  onSubmitIncidencia(): void {
    if (this.incidenciaForm.invalid) {
      this.incidenciaForm.markAllAsTouched();
      return;
    }

    const value = this.incidenciaForm.getRawValue();
    this.incidenciasService.crearIncidencia({
      titulo: value.titulo.trim(),
      descripcion: value.descripcion?.trim() ?? '',
      severidad: value.severidad,
      habitacion: value.habitacionId ? Number(value.habitacionId) : null
    }).subscribe({
      next: () => {
        this.showToast(this.preferencesService.t('incidenciaRegistrada'), 'success');
        this.cerrarModalIncidencia();
      },
      error: (err) => {
        console.error('Error al registrar la incidencia en el backend:', err);
        this.showToast('Error al registrar la incidencia en el servidor.', 'danger');
      }
    });
  }

  showToast(msg: string, type: 'success' | 'danger' | 'info' = 'success'): void {
    this.toastMessage = msg;
    this.toastType = type;
    this.cdr.markForCheck();
    setTimeout(() => {
      this.toastMessage = null;
      this.cdr.markForCheck();
    }, 3500);
  }
}
