import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { noWhitespaceValidator, customEmailValidator } from '../../../../validators/custom-validators';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  isSubmitted = false;
  isSent = false;
  isLoading = false;

  forgotForm: FormGroup = this.fb.group({
    emailOrUser: ['', [Validators.required, noWhitespaceValidator(), customEmailValidator()]]
  });

  get f() {
    return this.forgotForm.controls;
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
      this.isSent = true;
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 2500);
    }, 600);
  }
}
