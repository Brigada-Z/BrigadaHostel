import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Habitacion } from '../models/habitacion.model';
import { manejarErrorHttp } from './manejar-error-http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DisponibilidadService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/habitaciones`;

  /**
   * Habitaciones con cupo libre en el rango de fechas
   * (GET /api/habitaciones/?fechaIngreso=AAAA-MM-DD&fechaSalida=AAAA-MM-DD)
   */
  obtenerHabitacionesLibres(fechaIngreso: string, fechaSalida: string): Observable<Habitacion[]> {
    const params = new HttpParams()
      .set('fechaIngreso', fechaIngreso)
      .set('fechaSalida', fechaSalida);

    return this.http.get<Habitacion[]>(this.apiUrl, { params }).pipe(
      catchError(manejarErrorHttp)
    );
  }
}
