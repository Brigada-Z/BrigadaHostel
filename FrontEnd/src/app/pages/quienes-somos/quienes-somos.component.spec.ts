import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { QuienesSomosComponent } from './quienes-somos.component';
import { IntegrantesService } from '../../services/integrantes.service';
import { ContactoService } from '../../services/contacto.service';
import { Integrante } from '../../models/integrante.model';
import { ErrorEnvioContacto } from '../../models/mensaje-contacto.model';

describe('QuienesSomosComponent (Formulario de contacto conectado a Django)', () => {
  let component: QuienesSomosComponent;
  let fixture: ComponentFixture<QuienesSomosComponent>;
  let contactoService: any;

  const mockIntegrantes: Integrante[] = [
    {
      id: '1',
      nombre: 'Giuliano',
      apellido: 'BATISTELLA',
      responsabilidad: 'Modelado DER y Backend',
      github: 'https://github.com/gbatistela'
    }
  ];

  const mensajeValido = {
    nombre: 'Lucía Fernández',
    email: 'lucia@example.com',
    asunto: 'Consulta por grupos',
    mensaje: 'Quisiera saber si tienen tarifas para grupos.'
  };

  beforeEach(async () => {
    contactoService = {
      enviarMensaje: vi.fn().mockReturnValue(of({ ...mensajeValido, id: '1' }))
    };

    await TestBed.configureTestingModule({
      imports: [QuienesSomosComponent],
      providers: [
        provideRouter([]),
        { provide: IntegrantesService, useValue: { obtenerIntegrantes: () => of(mockIntegrantes) } },
        { provide: ContactoService, useValue: contactoService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuienesSomosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe mostrar los integrantes obtenidos desde la API con su GitHub', () => {
    expect(fixture.nativeElement.textContent).toContain('Giuliano, BATISTELLA');

    const enlace: HTMLAnchorElement = fixture.nativeElement.querySelector('.integrante-card a');
    expect(enlace.href).toBe('https://github.com/gbatistela');
    expect(enlace.textContent?.trim()).toBe('https://github.com/gbatistela');
    expect(enlace.rel).toContain('noopener');
  });

  it('no debe enviar el mensaje si el formulario es inválido', () => {
    component.enviarMensaje();
    expect(contactoService.enviarMensaje).not.toHaveBeenCalled();
    expect(component.contactoForm.touched).toBe(true);
  });

  it('debe enviar el mensaje al endpoint de contacto y limpiar el formulario', () => {
    component.contactoForm.setValue(mensajeValido);

    component.enviarMensaje();

    expect(contactoService.enviarMensaje).toHaveBeenCalledWith(mensajeValido);
    expect(component.mensajeExito).toContain('lucia@example.com');
    expect(component.f.nombre.value).toBe('');
    expect(component.isSubmitting).toBe(false);
  });

  it('debe mostrar en cada campo los errores de validación que devuelve Django (400)', () => {
    const error: ErrorEnvioContacto = {
      mensaje: 'Revisá los datos marcados en el formulario.',
      errores: { email: ['Introduzca una dirección de correo electrónico válida.'] }
    };
    contactoService.enviarMensaje.mockReturnValue(throwError(() => error));
    component.contactoForm.setValue({ ...mensajeValido, email: 'lucia@ejemplo' });

    component.enviarMensaje();
    fixture.detectChanges();

    expect(component.mensajeError).toBe('Revisá los datos marcados en el formulario.');
    expect(component.f.email.getError('servidor')).toContain('correo electrónico válida');
    expect(fixture.nativeElement.textContent).toContain('Introduzca una dirección de correo electrónico válida.');
  });
});
