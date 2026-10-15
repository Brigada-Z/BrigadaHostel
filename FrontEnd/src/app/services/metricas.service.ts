import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { MetricasDashboard } from '../models/metricas.model';
import { manejarErrorHttp } from './manejar-error-http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetricasService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/dashboard/metricas`;

  /**
   * Obtiene los indicadores calculados por el backend (GET /api/dashboard/metricas/)
   */
  obtenerMetricas(): Observable<MetricasDashboard> {
    return this.http.get<MetricasDashboard>(this.apiUrl).pipe(
      catchError(manejarErrorHttp)
    );
  }
}
