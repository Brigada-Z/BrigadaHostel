import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ReservasAdminComponent } from './reservas-admin.component';
import { ReservasService } from '../../../../services/reservas.service';
import { Reserva } from '../../../../models/reserva.model';

describe('ReservasAdminComponent (Listado Dinámico GET y Gestión)', () => {
  let component: ReservasAdminComponent;
  let fixture: ComponentFixture<ReservasAdminComponent>;
  let reservasService: any;

  const mockReservas: Reserva[] = [
    {
      id: '1',
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      dni: '20345678',
      fechaIngreso: '2026-09-20',
      fechaSalida: '2026-09-23',
      huespedes: 2,
      tipoHabitacion: 'Doble',
      estado: 'pendiente'
    },
    {
      id: '2',
      nombre: 'María García',
      email: 'maria@example.com',
      dni: '35123456',
      fechaIngreso: '2026-09-22',
      fechaSalida: '2026-09-25',
      huespedes: 1,
      tipoHabitacion: 'Individual',
      estado: 'confirmada'
    }
  ];

  beforeEach(async () => {
    reservasService = {
      getReservas: vi.fn().mockReturnValue(of(mockReservas)),
      actualizarEstado: vi.fn().mockReturnValue(of({ ...mockReservas[0], estado: 'confirmada' })),
      actualizarReserva: vi.fn().mockReturnValue(of({ ...mockReservas[0], nombre: 'Juan Modificado' })),
      eliminarReserva: vi.fn().mockReturnValue(of(undefined))
    };

    await TestBed.configureTestingModule({
      imports: [ReservasAdminComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ReservasService, useValue: reservasService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReservasAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse el componente y cargar las reservas en ngOnInit()', () => {
    expect(component).toBeTruthy();
    expect(reservasService.getReservas).toHaveBeenCalled();
    expect(component.reservas.length).toBe(2);
    expect(component.filteredList.length).toBe(2);
    expect(component.isLoading).toBe(false);
  });

  it('debe filtrar las reservas por búsqueda de texto', () => {
    component.searchQuery = 'María';
    component.filterReservations();
    expect(component.filteredList.length).toBe(1);
    expect(component.filteredList[0].nombre).toBe('María García');
  });

  it('debe filtrar las reservas por estado', () => {
    component.selectedStatus = 'confirmada';
    component.filterReservations();
    expect(component.filteredList.length).toBe(1);
    expect(component.filteredList[0].id).toBe('2');
  });

  it('debe confirmar una reserva directamente', () => {
    component.cambiarEstadoDirecto(mockReservas[0], 'confirmada');
    expect(reservasService.actualizarEstado).toHaveBeenCalledWith('1', 'confirmada');
  });
});
