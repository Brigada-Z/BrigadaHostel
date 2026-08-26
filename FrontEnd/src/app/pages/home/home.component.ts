import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container py-5">
      <header class="text-center mb-5">
        <h1 class="display-4 font-weight-900 text-primary">Brigada Hostel</h1>
        <p class="lead text-secondary">Sistema de gestión para hoteles pequeños y medianos</p>
      </header>

      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card p-4 shadow-sm border-0 rounded-4">
            <div class="card-body text-center">
              <span class="badge bg-warning text-dark mb-3 px-3 py-2 rounded-pill">Componente Pendiente de Conversión</span>
              <h2 class="h4 mb-3">Sección Inicio (Home)</h2>
              <p class="text-muted">
                Estructura de componente preparada en Angular. El contenido completo de esta sección se convertirá en la siguiente fase.
              </p>
              <div class="d-flex justify-content-center gap-3 mt-4">
                <a routerLink="/quienes-somos" class="btn btn-outline-secondary rounded-pill px-4">Quiénes Somos</a>
                <a routerLink="/dashboard/auth/login" class="btn-premium">Ir al Dashboard Admin</a>
                <a routerLink="/dashboard/auth/login" class="btn btn-dark rounded-pill px-4">Acceder al Panel</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 900px; }
  `]
})
export class HomeComponent {}
