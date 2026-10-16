import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MetricasService } from './metricas.service';
import { environment } from '../../environments/environment';

describe('MetricasService', () => {
  let service: MetricasService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MetricasService, provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(MetricasService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('obtenerMetricas() debe realizar una petición GET a /dashboard/metricas', () => {
    service.obtenerMetricas().subscribe((metricas) => {
      expect(metricas.totales.reservas).toBe(4);
      expect(metricas.totales.habitacionesDisponibles).toBe(3);
    });

    const req = httpTesting.expectOne(`${environment.apiUrl}/dashboard/metricas`);
    expect(req.request.method).toBe('GET');
    req.flush({
      totales: {
        reservas: 4,
        confirmadas: 2,
        pendientes: 1,
        canceladas: 1,
        habitaciones: 4,
        habitacionesDisponibles: 3
      }
    });
  });
});
