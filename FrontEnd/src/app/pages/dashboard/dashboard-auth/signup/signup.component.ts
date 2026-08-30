import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  noWhitespaceValidator,
  customEmailValidator,
  dniValidator,
  passwordStrengthValidator,
  passwordMatchValidator
} from '../../../../validators/custom-validators';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  isSubmitted = false;
  isRegistered = false;
  isLoading = false;

  signupForm: FormGroup = this.fb.group(
    {
      firstName: ['', [Validators.required, Validators.minLength(2), noWhitespaceValidator()]],
      lastName: ['', [Validators.required, Validators.minLength(2), noWhitespaceValidator()]],
      dni: ['', [Validators.required, dniValidator()]],
      email: ['', [Validators.required, Validators.email, customEmailValidator()]],
      password: ['', [Validators.required, Validators.minLength(6), passwordStrengthValidator()]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    },
    {
      validators: [passwordMatchValidator('password', 'confirmPassword')]
    }
  );

  // Getter para acceso directo a los controles
  get f() {
    return this.signupForm.controls;
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // Simular registro exitoso
    setTimeout(() => {
      this.isLoading = false;
      this.isRegistered = true;
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 1500);
    }, 500);
  }
}
