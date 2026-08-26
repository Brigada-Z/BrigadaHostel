import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
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
            <h1>Recuperar Acceso</h1>
            <p>Ingresa tu usuario para recibir instrucciones</p>
          </div>

          <form (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label class="auth-label">Usuario / Email</label>
              <input type="text" class="input-field" placeholder="1234" [(ngModel)]="username" name="username" required>
            </div>
            <button type="submit" class="btn-submit mt-24">
              Enviar Instrucciones
            </button>
          </form>

          <div class="auth-footer">
            <a routerLink="/dashboard/auth/login">Volver al login</a>
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
export class ForgotPasswordComponent {
  private router = inject(Router);
  username = '';

  onSubmit(): void {
    alert('Instrucciones enviadas correctamente. Redirigiendo al login...');
    this.router.navigate(['/dashboard/auth/login']);
  }
}
