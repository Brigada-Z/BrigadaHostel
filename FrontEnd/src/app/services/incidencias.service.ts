import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Incidencia } from '../models/incidencia.model';
import { manejarErrorHttp } from './manejar-error-http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncidenciasService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/incidencias`;

  /**
   * Obtiene el listado de incidencias operativas registradas.
   */
  getIncidencias(): Observable<Incidencia[]> {
    return this.http.get<Incidencia[]>(this.apiUrl).pipe(
      catchError(manejarErrorHttp)
    );
  }

  /**
   * Registra una nueva incidencia (falla, mantenimiento o stock).
   */
  crearIncidencia(incidencia: Partial<Incidencia>): Observable<Incidencia> {
    return this.http.post<Incidencia>(this.apiUrl, incidencia);
  }
}
