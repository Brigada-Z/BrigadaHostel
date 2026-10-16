import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Servicio } from '../models/servicio.model';
import { manejarErrorHttp } from './manejar-error-http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/servicios`;

  /**
   * Obtiene el catálogo de servicios adicionales del hostel (GET /api/servicios/)
   */
  obtenerServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.apiUrl).pipe(
      catchError(manejarErrorHttp)
    );
  }
}
