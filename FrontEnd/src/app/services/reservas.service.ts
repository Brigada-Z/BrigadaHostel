import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva } from '../models/reserva.model';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/reservas';

  /**
   * Obtiene todas las reservas registradas desde json-server
   */
  getReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.apiUrl);
  }

  /**
   * Alias de compatibilidad con código existente
   */
  obtenerReservas(): Observable<Reserva[]> {
    return this.getReservas();
  }

  /**
   * Obtiene una reserva individual por su identificador
   */
  getReservaPorId(id: string): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.apiUrl}/${id}`);
  }

  /**
   * Registra una nueva reserva (POST)
   */
  crearReserva(reserva: Reserva): Observable<Reserva> {
    return this.http.post<Reserva>(this.apiUrl, reserva);
  }

  /**
   * Actualiza parcialmente los datos de una reserva (PATCH)
   */
  actualizarReserva(id: string, cambios: Partial<Reserva>): Observable<Reserva> {
    return this.http.patch<Reserva>(`${this.apiUrl}/${id}`, cambios);
  }

  /**
   * Actualiza el estado de una reserva (pendiente, confirmada, cancelada)
   */
  actualizarEstado(id: string, estado: 'pendiente' | 'confirmada' | 'cancelada'): Observable<Reserva> {
    return this.actualizarReserva(id, { estado });
  }

  /**
   * Elimina una reserva por id (DELETE)
   */
  eliminarReserva(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}