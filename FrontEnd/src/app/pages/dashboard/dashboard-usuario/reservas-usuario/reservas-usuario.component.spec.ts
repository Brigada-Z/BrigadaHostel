import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ReservasUsuarioComponent } from './reservas-usuario.component';
import { ReservasService } from '../../../../services/reservas.service';
import { HabitacionesService } from '../../../../services/habitaciones.service';
import { Habitacion } from '../../../../models/habitacion.model';

describe('ReservasUsuarioComponent (Formulario Reactivo)', () => {
  let component: ReservasUsuarioComponent;
  let fixture: ComponentFixture<ReservasUsuarioComponent>;
  let reservasService: any;
  let habitacionesService: any;

  const mockHabitaciones: Habitacion[] = [
    { id: '1', tipo: 'Individual', precioPorNoche: 30000, capacidad: 1, disponible: true },
    { id: '2', tipo: 'Doble', precioPorNoche: 45000, capacidad: 2, disponible: true }
  ];

  beforeEach(async () => {
    reservasService = {
      crearReserva: vi.fn().mockReturnValue(of({ id: '99', nombre: 'Test', estado: 'pendiente' }))
    };
    habitacionesService = {
      getHabitaciones: vi.fn().mockReturnValue(of(mockHabitaciones))
    };

    await TestBed.configureTestingModule({
      imports: [ReservasUsuarioComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ReservasService, useValue: reservasService },
        { provide: HabitacionesService, useValue: habitacionesService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReservasUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe instanciar el componente e inicializar el formulario reactivo', () => {
    expect(component).toBeTruthy();
    expect(component.reservaForm).toBeDefined();
    expect(component.reservaForm.get('nombre')).toBeDefined();
    expect(component.reservaForm.get('email')).toBeDefined();
  });

  it('el formulario debe ser inválido si los campos requeridos están vacíos', () => {
    component.reservaForm.patchValue({
      nombre: '',
      email: 'invalido',
      dni: '',
      telefono: ''
    });

    expect(component.reservaForm.valid).toBe(false);
    expect(component.reservaForm.get('nombre')?.hasError('required')).toBe(true);
    expect(component.reservaForm.get('email')?.hasError('email')).toBe(true);
  });

  it('debe cargar habitaciones dinámicamente desde HabitacionesService', () => {
    expect(habitacionesService.getHabitaciones).toHaveBeenCalled();
    expect(component.habitaciones.length).toBe(2);
    expect(component.habitacionSeleccionada?.tipo).toBe('Individual');
  });

  it('debe validar que la fecha de salida sea posterior a la de ingreso', () => {
    component.reservaForm.patchValue({
      fechaIngreso: '2026-09-25',
      fechaSalida: '2026-09-20'
    });

    expect(component.reservaForm.hasError('fechaSalidaInvalida')).toBe(true);
  });

  it('debe enviar la reserva al servicio al completar los datos válidos', () => {
    component.reservaForm.patchValue({
      nombre: 'Huésped Válido',
      email: 'valido@hostel.com',
      dni: '12345678',
      telefono: '1122334455',
      fechaIngreso: '2026-09-20',
      fechaSalida: '2026-09-24',
      tipoHabitacion: 'Individual',
      huespedes: 1,
      desayuno: true,
      traslado: false
    });

    expect(component.reservaForm.valid).toBe(true);
    component.confirmarReserva();

    expect(reservasService.crearReserva).toHaveBeenCalled();
    expect(component.bookingSuccess).toBe(true);
    expect(component.reservaConfirmada?.id).toBe('99');
  });
});
