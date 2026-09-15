import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Habitacion } from '../models/habitacion.model';

@Injectable({
  providedIn: 'root'
})
export class HabitacionesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/habitaciones';

  /**
   * Obtiene la lista completa de habitaciones
   */
  getHabitaciones(): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(this.apiUrl);
  }

  /**
   * Alias de compatibilidad
   */
  obtenerHabitaciones(): Observable<Habitacion[]> {
    return this.getHabitaciones();
  }

  /**
   * Obtiene habitaciones que están marcadas como disponibles
   */
  obtenerHabitacionesDisponibles(): Observable<Habitacion[]> {
    return this.getHabitaciones().pipe(
      map(habitaciones => habitaciones.filter(h => h.disponible))
    );
  }

  /**
   * Obtiene los detalles de una habitación por su identificador
   */
  getHabitacionPorId(id: string): Observable<Habitacion> {
    return this.http.get<Habitacion>(`${this.apiUrl}/${id}`);
  }
}