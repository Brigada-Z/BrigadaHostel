import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ContactoService } from './contacto.service';
import { ErrorEnvioContacto, MensajeContacto } from '../models/mensaje-contacto.model';
import { environment } from '../../environments/environment';

describe('ContactoService', () => {
  let service: ContactoService;
  let httpTesting: HttpTestingController;

  const mensaje: MensajeContacto = {
    nombre: 'Lucía Fernández',
    email: 'lucia@example.com',
    asunto: 'Consulta por grupos',
    mensaje: 'Quisiera saber si tienen tarifas para grupos.'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContactoService, provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(ContactoService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('enviarMensaje() debe realizar una petición POST a /contacto con los datos del formulario', () => {
    service.enviarMensaje(mensaje).subscribe((respuesta) => {
      expect(respuesta.id).toBe('1');
    });

    const req = httpTesting.expectOne(`${environment.apiUrl}/contacto`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mensaje);
    req.flush({ ...mensaje, id: '1', fechaEnvio: '2026-10-13 20:00:00' }, { status: 201, statusText: 'Created' });
  });

  it('enviarMensaje() debe devolver los errores por campo cuando Django responde 400', () => {
    let error: ErrorEnvioContacto | undefined;

    service.enviarMensaje(mensaje).subscribe({ error: (err: ErrorEnvioContacto) => (error = err) });

    httpTesting.expectOne(`${environment.apiUrl}/contacto`).flush(
      { mensaje: 'Error de validación', errores: { email: ['Introduzca una dirección de correo electrónico válida.'] } },
      { status: 400, statusText: 'Bad Request' }
    );
    expect(error?.mensaje).toBe('Revisá los datos marcados en el formulario.');
    expect(error?.errores.email?.[0]).toContain('correo electrónico válida');
  });

  it('enviarMensaje() debe devolver un mensaje de conexión si el backend no responde', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    let error: ErrorEnvioContacto | undefined;

    service.enviarMensaje(mensaje).subscribe({ error: (err: ErrorEnvioContacto) => (error = err) });

    httpTesting.expectOne(`${environment.apiUrl}/contacto`).error(new ProgressEvent('error'), { status: 0 });
    expect(error?.mensaje).toContain('No se pudo conectar con el servidor');
    expect(error?.errores).toEqual({});
  });
});
