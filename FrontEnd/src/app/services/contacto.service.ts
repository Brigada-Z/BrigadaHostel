import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { ErrorEnvioContacto, MensajeContacto } from '../models/mensaje-contacto.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/contacto`;

  /**
   * Envía un mensaje del formulario de contacto (POST /api/contacto/)
   */
  enviarMensaje(mensaje: MensajeContacto): Observable<MensajeContacto> {
    return this.http.post<MensajeContacto>(this.apiUrl, mensaje).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorEnvio: ErrorEnvioContacto;

    if (error.status === 0) {
      // Error del lado del cliente o de red (por ejemplo, el backend Django no está corriendo)
      console.error('Error de red al enviar el mensaje de contacto:', error.error);
      errorEnvio = {
        mensaje: 'No se pudo conectar con el servidor. Intentá nuevamente en unos minutos.',
        errores: {}
      };
    } else if (error.status === 400) {
      // Django rechazó los datos: se devuelven los errores de validación por campo
      errorEnvio = {
        mensaje: 'Revisá los datos marcados en el formulario.',
        errores: error.error?.errores ?? {}
      };
    } else {
      console.error(`La API respondió con código ${error.status}:`, error.error);
      errorEnvio = {
        mensaje: 'Ocurrió un error al enviar el mensaje. Intentá nuevamente más tarde.',
        errores: {}
      };
    }

    return throwError(() => errorEnvio);
  }
}
