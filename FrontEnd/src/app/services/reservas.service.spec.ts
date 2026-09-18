import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ReservasService } from './reservas.service';
import { Reserva } from '../models/reserva.model';

describe('ReservasService', () => {
  let service: ReservasService;
  let httpTesting: HttpTestingController;

  const mockReservas: Reserva[] = [
    {
      id: '1',
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      fechaIngreso: '2026-09-20',
      fechaSalida: '2026-09-23',
      huespedes: 2,
      tipoHabitacion: 'Doble',
      estado: 'pendiente'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReservasService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ReservasService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('debe crearse correctamente el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('getReservas() debe realizar una petición GET y retornar el listado', () => {
    service.getReservas().subscribe((reservas) => {
      expect(reservas.length).toBe(1);
      expect(reservas[0].nombre).toBe('Juan Pérez');
    });

    const req = httpTesting.expectOne('http://localhost:3000/reservas');
    expect(req.request.method).toBe('GET');
    req.flush(mockReservas);
  });

  it('crearReserva() debe realizar una petición POST con los datos de la reserva', () => {
    const nuevaReserva: Reserva = {
      nombre: 'Carlos Ruiz',
      email: 'carlos@example.com',
      fechaIngreso: '2026-10-01',
      fechaSalida: '2026-10-04',
      huespedes: 1,
      tipoHabitacion: 'Individual',
      estado: 'pendiente'
    };

    service.crearReserva(nuevaReserva).subscribe((reserva) => {
      expect(reserva.id).toBe('2');
      expect(reserva.nombre).toBe('Carlos Ruiz');
    });

    const req = httpTesting.expectOne('http://localhost:3000/reservas');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nuevaReserva);
    req.flush({ ...nuevaReserva, id: '2' });
  });

  it('actualizarEstado() debe enviar un PATCH con el nuevo estado', () => {
    service.actualizarEstado('1', 'confirmada').subscribe((reserva) => {
      expect(reserva.estado).toBe('confirmada');
    });

    const req = httpTesting.expectOne('http://localhost:3000/reservas/1');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ estado: 'confirmada' });
    req.flush({ ...mockReservas[0], estado: 'confirmada' });
  });
});
