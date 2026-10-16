import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

/**
 * Manejo centralizado de errores HTTP para usar con catchError().
 * Registra el detalle técnico en consola y devuelve al componente un mensaje apto para el usuario.
 */
export function manejarErrorHttp(error: HttpErrorResponse): Observable<never> {
  if (error.status === 0) {
    // Error del lado del cliente o de red (por ejemplo, el backend Django no está corriendo)
    console.error('Error de red al contactar la API:', error.error);
  } else {
    // El backend rechazó la petición y respondió con un código de estado
    console.error(`La API respondió con código ${error.status}:`, error.error);
  }
  return throwError(() => new Error('No se pudo obtener la información del servidor. Intentá nuevamente más tarde.'));
}
