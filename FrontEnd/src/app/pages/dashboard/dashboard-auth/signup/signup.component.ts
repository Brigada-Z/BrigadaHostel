import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="auth-body">
      <div class="auth-wrapper">
        <div class="auth-card">
          <div class="brand-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>

          <div class="auth-header">
            <h1>Nueva Cuenta</h1>
            <p>Únete a BrigadaHostel hoy</p>
          </div>

          <form (ngSubmit)="onSubmit()">
            <div class="form-grid-2">
              <div class="form-group">
                <label class="auth-label">Nombre</label>
                <input type="text" class="input-field" placeholder="Juan" [(ngModel)]="firstName" name="firstName" required>
              </div>
              <div class="form-group">
                <label class="auth-label">Apellido</label>
                <input type="text" class="input-field" placeholder="Pérez" [(ngModel)]="lastName" name="lastName" required>
              </div>
            </div>
            <div class="form-group mt-20">
              <label class="auth-label">Email</label>
              <input type="email" class="input-field" placeholder="ejemplo@correo.com" [(ngModel)]="email" name="email" required>
            </div>
            <div class="form-group mt-20">
              <label class="auth-label">Contraseña</label>
              <input type="password" class="input-field" placeholder="••••••••" [(ngModel)]="password" name="password" required minlength="8">
            </div>
            <button type="submit" class="btn-submit mt-24">
              Registrarse 
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
            </button>
          </form>

          <div class="auth-footer">
            ¿Ya eres miembro? <a routerLink="/dashboard/auth/login">Iniciar sesión</a>
          </div>
        </div>
      </div>

      <a routerLink="/home" class="back-home" title="Volver al inicio">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </a>
    </div>
  `
})
export class SignupComponent {
  private router = inject(Router);

  firstName = '';
  lastName = '';
  email = '';
  password = '';

  onSubmit(): void {
    this.router.navigate(['/dashboard/auth/login']);
  }
}
