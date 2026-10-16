import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HomeComponent } from './home.component';
import { ReservasService } from '../../services/reservas.service';
import { HabitacionesService } from '../../services/habitaciones.service';
import { ServiciosService } from '../../services/servicios.service';
import { MetricasService } from '../../services/metricas.service';
import { DisponibilidadService } from '../../services/disponibilidad.service';
import { Habitacion } from '../../models/habitacion.model';
import { Reserva } from '../../models/reserva.model';
import { Servicio } from '../../models/servicio.model';
import { MetricasDashboard } from '../../models/metricas.model';

describe('HomeComponent (Inicio con datos de la API Django)', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let reservasService: any;
  let habitacionesService: any;
  let serviciosService: any;
  let metricasService: any;
  let disponibilidadService: any;

  const mockHabitaciones: Habitacion[] = [
    { id: '1', tipo: 'Individual', precioPorNoche: 30000, capacidad: 1, disponible: true },
    { id: '2', tipo: 'Doble', precioPorNoche: 45000, capacidad: 2, disponible: true }
  ];

  // Django devuelve las reservas ordenadas de la más reciente a la más antigua
  const mockReservas: Reserva[] = Array.from({ length: 6 }, (_, i) => ({
    id: String(6 - i),
    nombre: `Huésped ${6 - i}`,
    email: `huesped${6 - i}@example.com`,
    fechaIngreso: '2026-11-10',
    fechaSalida: '2026-11-12',
    huespedes: 1,
    tipoHabitacion: 'Individual',
    estado: 'pendiente' as const
  }));

  const mockServicios: Servicio[] = [
    { id: 1, nombre: 'Desayuno Buffet Diario', descripcion: '', costo: '4500.00' }
  ];

  const mockMetricas = {
    ocupacionHoy: { porcentaje: 15.4, camasOcupadas: 2, camasTotales: 13, indicador: '' },
    totales: {
      reservas: 6,
      confirmadas: 0,
      pendientes: 6,
      canceladas: 0,
      habitaciones: 2,
      habitacionesDisponibles: 2
    }
  } as MetricasDashboard;

  beforeEach(async () => {
    reservasService = {
      obtenerReservas: vi.fn().mockReturnValue(of(mockReservas)),
      crearReserva: vi.fn().mockReturnValue(of({ ...mockReservas[0], id: '7' }))
    };
    habitacionesService = {
      obtenerHabitacionesDisponibles: vi.fn().mockReturnValue(of(mockHabitaciones))
    };
    serviciosService = {
      obtenerServicios: vi.fn().mockReturnValue(of(mockServicios))
    };
    metricasService = {
      obtenerMetricas: vi.fn().mockReturnValue(of(mockMetricas))
    };
    disponibilidadService = {
      obtenerHabitacionesLibres: vi.fn().mockReturnValue(of(mockHabitaciones))
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        { provide: ReservasService, useValue: reservasService },
        { provide: HabitacionesService, useValue: habitacionesService },
        { provide: ServiciosService, useValue: serviciosService },
        { provide: MetricasService, useValue: metricasService },
        { provide: DisponibilidadService, useValue: disponibilidadService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe cargar habitaciones, consultas y resumen desde la API en ngOnInit()', () => {
    expect(habitacionesService.obtenerHabitacionesDisponibles).toHaveBeenCalled();
    expect(reservasService.obtenerReservas).toHaveBeenCalled();
    expect(metricasService.obtenerMetricas).toHaveBeenCalled();
    expect(serviciosService.obtenerServicios).toHaveBeenCalled();

    const html: HTMLElement = fixture.nativeElement;
    expect(html.querySelectorAll('.habitacion-card').length).toBe(2);
    expect(html.querySelectorAll('#habitacion option').length).toBe(3);
    expect(html.textContent).toContain('Desayuno Buffet Diario');
    expect(html.textContent).toContain('Registradas: 6');
  });

  it('debe mostrar las 5 consultas más recientes respetando el orden del backend', () => {
    expect(component.reservas.length).toBe(5);
    expect(component.reservas[0].id).toBe('6');
    expect(component.reservas[4].id).toBe('2');
  });

  it('debe validar la cantidad de huéspedes contra la capacidad real de la habitación', () => {
    component.consultaReservaForm.patchValue({ habitacionId: '2', huespedes: 3 });
    expect(component.consultaReservaForm.hasError('capacidadExcedida')).toBe(true);
    expect(component.consultaReservaForm.getError('capacidadExcedida')).toBe(2);

    component.consultaReservaForm.patchValue({ huespedes: 2 });
    expect(component.consultaReservaForm.hasError('capacidadExcedida')).toBe(false);
  });

  it('no debe enviar la consulta si el formulario es inválido', () => {
    component.registrarConsulta();
    expect(reservasService.crearReserva).not.toHaveBeenCalled();
  });

  it('debe registrar la consulta con el tipo de la habitación elegida y refrescar los datos', () => {
    component.consultaReservaForm.setValue({
      nombre: 'Carlos Ruiz',
      email: 'carlos@example.com',
      fechaIngreso: '2026-11-10',
      fechaSalida: '2026-11-12',
      huespedes: 2,
      habitacionId: '2'
    });

    component.registrarConsulta();

    expect(reservasService.crearReserva).toHaveBeenCalledWith(
      expect.objectContaining({ tipoHabitacion: 'Doble', huespedes: 2, estado: 'pendiente' })
    );
    expect(component.mensajeExito).toContain('#BH-7');
    expect(reservasService.obtenerReservas).toHaveBeenCalledTimes(2);
    expect(metricasService.obtenerMetricas).toHaveBeenCalledTimes(2);
  });

  it('debe mostrar un mensaje de error si no se pueden cargar las habitaciones', () => {
    habitacionesService.obtenerHabitacionesDisponibles.mockReturnValue(throwError(() => new Error('sin conexión')));

    component.cargarHabitaciones();
    fixture.detectChanges();

    expect(component.errorHabitaciones).toBe('No se pudieron cargar las habitaciones disponibles.');
    expect(fixture.nativeElement.querySelector('[role=alert]')?.textContent).toContain('Reintentar');
  });

  it('debe mostrar solo las habitaciones libres al elegir un rango de fechas válido', () => {
    disponibilidadService.obtenerHabitacionesLibres.mockReturnValue(of([mockHabitaciones[0]]));

    component.consultaReservaForm.patchValue({ fechaIngreso: '2026-11-10', fechaSalida: '2026-11-12' });
    fixture.detectChanges();

    expect(disponibilidadService.obtenerHabitacionesLibres).toHaveBeenCalledWith('2026-11-10', '2026-11-12');
    expect(component.opcionesHabitacion.map((h) => h.tipo)).toEqual(['Individual']);
    expect(fixture.nativeElement.querySelectorAll('#habitacion option').length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('Habitaciones libres para las fechas elegidas: 1.');
  });

  it('no debe consultar la disponibilidad si la fecha de salida no es posterior a la de ingreso', () => {
    component.consultaReservaForm.patchValue({ fechaIngreso: '2026-11-12', fechaSalida: '2026-11-10' });

    expect(disponibilidadService.obtenerHabitacionesLibres).not.toHaveBeenCalled();
    expect(component.opcionesHabitacion.length).toBe(2);
  });

  it('debe limpiar la habitación elegida si no está libre en las nuevas fechas', () => {
    disponibilidadService.obtenerHabitacionesLibres.mockReturnValue(of([mockHabitaciones[0]]));
    component.consultaReservaForm.patchValue({ habitacionId: '2' });

    component.consultaReservaForm.patchValue({ fechaIngreso: '2026-11-10', fechaSalida: '2026-11-12' });

    expect(component.f.habitacionId.value).toBe('');
    expect(component.avisoDisponibilidad).toContain('no está disponible en esas fechas');
  });

  it('debe mostrar el motivo que devuelve Django cuando la reserva responde 409', () => {
    const motivo = "No hay habitaciones 'Doble' disponibles del 2026-11-10 al 2026-11-12.";
    reservasService.crearReserva.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 409, error: { error: motivo } }))
    );
    component.consultaReservaForm.setValue({
      nombre: 'Carlos Ruiz',
      email: 'carlos@example.com',
      fechaIngreso: '2026-11-10',
      fechaSalida: '2026-11-12',
      huespedes: 2,
      habitacionId: '2'
    });

    component.registrarConsulta();

    expect(component.mensajeError).toBe(motivo);
    expect(component.isSubmitting).toBe(false);
  });
});
