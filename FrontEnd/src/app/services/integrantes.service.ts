import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Integrante } from '../models/integrante.model';

@Injectable({
  providedIn: 'root'
})
export class IntegrantesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/integrantes';

  obtenerIntegrantes(): Observable<Integrante[]> {
    return this.http.get<Integrante[]>(this.apiUrl);
  }
}