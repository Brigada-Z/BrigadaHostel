import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  private router = inject(Router);
  username = '';

  onSubmit(): void {
    alert('Instrucciones enviadas correctamente. Redirigiendo al login...');
    this.router.navigate(['/dashboard/auth/login']);
  }
}
