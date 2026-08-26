import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
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
