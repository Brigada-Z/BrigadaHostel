import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiciosService } from './servicios.service';
import { Servicio } from '../models/servicio.model';
import { environment } from '../../environments/environment';

describe('ServiciosService', () => {
  let service: ServiciosService;
  let httpTesting: HttpTestingController;

  const mockServicios: Servicio[] = [
    { id: 1, nombre: 'Desayuno Buffet Diario', descripcion: 'Desayuno continental.', costo: '4500.00' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiciosService, provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(ServiciosService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('obtenerServicios() debe realizar una petición GET a /servicios', () => {
    service.obtenerServicios().subscribe((servicios) => {
      expect(servicios.length).toBe(1);
      expect(servicios[0].nombre).toBe('Desayuno Buffet Diario');
    });

    const req = httpTesting.expectOne(`${environment.apiUrl}/servicios`);
    expect(req.request.method).toBe('GET');
    req.flush(mockServicios);
  });

  it('obtenerServicios() debe devolver un mensaje apto para el usuario si la API falla', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    let mensaje = '';

    service.obtenerServicios().subscribe({
      error: (err: Error) => (mensaje = err.message)
    });

    httpTesting.expectOne(`${environment.apiUrl}/servicios`)
      .flush('Error', { status: 500, statusText: 'Internal Server Error' });
    expect(mensaje).toContain('No se pudo obtener la información del servidor');
  });
});
