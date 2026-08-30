import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  noWhitespaceValidator,
  customEmailValidator,
  passwordStrengthValidator,
  passwordMatchValidator
} from '../../../../validators/custom-validators';

@Component({
  selector: 'app-configuracion-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './configuracion-admin.component.html',
  styleUrl: './configuracion-admin.component.css'
})
export class ConfiguracionAdminComponent {
  private fb = inject(FormBuilder);

  toastMessage: string | null = null;
  profileSubmitted = false;
  securitySubmitted = false;

  // Formulario Reactivo de Perfil
  profileForm: FormGroup = this.fb.group({
    fullName: ['Administrador General', [Validators.required, Validators.minLength(3), noWhitespaceValidator()]],
    email: ['admin@brigadahostel.com', [Validators.required, Validators.email, customEmailValidator()]]
  });

  // Formulario Reactivo de Seguridad con validación cruzada de contraseña
  securityForm: FormGroup = this.fb.group(
    {
      currentPass: ['', [Validators.required, Validators.minLength(4)]],
      newPass: ['', [Validators.required, Validators.minLength(6), passwordStrengthValidator()]],
      confirmPass: ['', [Validators.required]],
      enable2FA: [true]
    },
    {
      validators: [passwordMatchValidator('newPass', 'confirmPass')]
    }
  );

  // Formulario Reactivo de Preferencias del Panel
  preferencesForm: FormGroup = this.fb.group({
    language: ['es'],
    theme: ['light']
  });

  get pf() {
    return this.profileForm.controls;
  }

  get sf() {
    return this.securityForm.controls;
  }

  onSaveProfile(): void {
    this.profileSubmitted = true;
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.notify('Perfil guardado con éxito');
  }

  onUpdateSecurity(): void {
    this.securitySubmitted = true;
    if (this.securityForm.invalid) {
      this.securityForm.markAllAsTouched();
      return;
    }
    this.notify('Contraseña actualizada correctamente');
    this.securityForm.patchValue({
      currentPass: '',
      newPass: '',
      confirmPass: ''
    });
    this.securitySubmitted = false;
    this.securityForm.markAsPristine();
    this.securityForm.markAsUntouched();
  }

  onSavePreferences(): void {
    this.notify('Preferencias aplicadas correctamente');
  }

  notify(msg: string): void {
    this.toastMessage = msg;
    setTimeout(() => {
      this.toastMessage = null;
    }, 3000);
  }
}
