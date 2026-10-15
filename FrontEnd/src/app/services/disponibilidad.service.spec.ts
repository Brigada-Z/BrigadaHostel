import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DisponibilidadService } from './disponibilidad.service';
import { Habitacion } from '../models/habitacion.model';
import { environment } from '../../environments/environment';

describe('DisponibilidadService', () => {
  let service: DisponibilidadService;
  let httpTesting: HttpTestingController;

  const libres: Habitacion[] = [
    { id: '3', tipo: 'Suite', precioPorNoche: 85000, capacidad: 4, disponible: true }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DisponibilidadService, provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(DisponibilidadService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('obtenerHabitacionesLibres() debe consultar /habitaciones con el rango de fechas', () => {
    service.obtenerHabitacionesLibres('2026-10-12', '2026-10-13').subscribe((habitaciones) => {
      expect(habitaciones.map((h) => h.tipo)).toEqual(['Suite']);
    });

    const req = httpTesting.expectOne(
      (r) => r.url === `${environment.apiUrl}/habitaciones` &&
        r.params.get('fechaIngreso') === '2026-10-12' &&
        r.params.get('fechaSalida') === '2026-10-13'
    );
    expect(req.request.method).toBe('GET');
    req.flush(libres);
  });
});
