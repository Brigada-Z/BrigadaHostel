import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, ViewEncapsulation, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { IntegrantesService } from '../../services/integrantes.service';
import { ContactoService } from '../../services/contacto.service';
import { ErrorEnvioContacto } from '../../models/mensaje-contacto.model';

@Component({
  selector: 'app-quienes-somos',
  standalone: true,
  imports: [RouterLink, AsyncPipe, ReactiveFormsModule],
  templateUrl: './quienes-somos.component.html',
  styleUrl: './quienes-somos.component.css',
  // Sin encapsulación emulada Angular no agrega atributos _ngcontent-* al DOM (inválidos para W3C).
  // Los estilos del componente ya están acotados con el prefijo .public-page.
  encapsulation: ViewEncapsulation.None
})
export class QuienesSomosComponent {
  private readonly integrantesService = inject(IntegrantesService);
  private readonly contactoService = inject(ContactoService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  // Límites alineados con el modelo MensajeContacto de Django
  readonly largoMaximoMensaje = 1000;

  integrantes$ = this.integrantesService.obtenerIntegrantes();

  isSubmitting = false;
  mensajeExito = '';
  mensajeError = '';

  contactoForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    asunto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
    mensaje: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(this.largoMaximoMensaje)]]
  });

  get f() {
    return this.contactoForm.controls;
  }

  enviarMensaje(): void {
    this.mensajeExito = '';
    this.mensajeError = '';

    if (this.contactoForm.invalid) {
      this.contactoForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.contactoService.enviarMensaje(this.contactoForm.getRawValue()).subscribe({
      next: (mensajeEnviado) => {
        this.mensajeExito = `¡Gracias, ${mensajeEnviado.nombre}! Recibimos tu mensaje y te responderemos a ${mensajeEnviado.email}.`;
        this.contactoForm.reset();
        this.isSubmitting = false;
        this.cdr.markForCheck();
      },
      error: (err: ErrorEnvioContacto) => {
        this.mensajeError = err.mensaje;
        // Se muestran debajo de cada campo los errores de validación que devolvió Django (400)
        for (const [campo, mensajes] of Object.entries(err.errores)) {
          const control = this.contactoForm.get(campo);
          if (control && mensajes?.length) {
            control.setErrors({ servidor: mensajes[0] });
            control.markAsTouched();
          }
        }
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }
}
