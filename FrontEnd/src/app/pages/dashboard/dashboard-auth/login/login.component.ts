import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardService, UserRole } from '../../../../services/dashboard.service';
import { noWhitespaceValidator } from '../../../../validators/custom-validators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private dashboardService = inject(DashboardService);

  selectedRole: UserRole = 'admin';
  isSubmitted = false;
  loginError: string | null = null;
  isLoading = false;

  loginForm: FormGroup = this.fb.group({
    username: ['admin', [Validators.required, Validators.minLength(3), noWhitespaceValidator()]],
    password: ['admin123', [Validators.required, Validators.minLength(4)]],
    rememberMe: [false]
  });

  // Getter para acceso rápido a controles desde el template
  get f() {
    return this.loginForm.controls;
  }

  selectRole(role: UserRole): void {
    this.selectedRole = role;
    if (role === 'admin') {
      this.loginForm.patchValue({
        username: 'admin',
        password: 'admin123'
      });
    } else {
      this.loginForm.patchValue({
        username: 'huesped@brigada.com',
        password: 'user123'
      });
    }
  }

  onSubmit(): void {
    this.isSubmitted = true;
    this.loginError = null;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // Simulación de autenticación reactiva
    setTimeout(() => {
      this.dashboardService.setRole(this.selectedRole);
      this.isLoading = false;
      if (this.selectedRole === 'admin') {
        this.router.navigate(['/dashboard/admin/resumen']);
      } else {
        this.router.navigate(['/dashboard/usuario/resumen']);
      }
    }, 400);
  }
}
