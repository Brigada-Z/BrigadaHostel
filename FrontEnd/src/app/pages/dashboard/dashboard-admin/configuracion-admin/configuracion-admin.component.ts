import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PreferencesService, Language, Theme } from '../../../../services/preferences.service';
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
  private cdr = inject(ChangeDetectorRef);
  public readonly preferencesService = inject(PreferencesService);

  toastMessage: string | null = null;
  profileSubmitted = false;
  securitySubmitted = false;
  fotoPreview: string | null = null;

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
    language: ['es', Validators.required],
    theme: ['light', Validators.required]
  });

  get pf() {
    return this.profileForm.controls;
  }

  get sf() {
    return this.securityForm.controls;
  }

  get preferences() {
    return this.preferencesForm.controls;
  }

  ngOnInit(): void {
    // Sincronizar el formulario con las preferencias persistidas de la sesión
    this.preferencesForm.patchValue({
      language: this.preferencesService.language(),
      theme: this.preferencesService.theme()
    });
    this.fotoPreview = this.preferencesService.photoDataUrl();
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
    if (this.preferencesForm.invalid) {
      this.preferencesForm.markAllAsTouched();
      return;
    }

    const language = this.preferencesForm.get('language')?.value as Language;
    const theme = this.preferencesForm.get('theme')?.value as Theme;

    // Aplicar idioma y tema al sitio completo
    this.preferencesService.setLanguage(language);
    this.preferencesService.setTheme(theme);
    this.notify(this.preferencesService.t('preferenciasAplicadas'));

    // Forzar re-renderizado del panel con los nuevos valores
    this.cdr.markForCheck();
  }

  onFotoSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (!archivo) {
      return;
    }

    const lector = new FileReader();
    lector.onload = () => {
      const dataUrl = lector.result as string;
      this.preferencesService.setPhoto(dataUrl);
      this.fotoPreview = dataUrl;
      this.cdr.markForCheck();
    };
    lector.readAsDataURL(archivo);
  }

  notify(msg: string): void {
    this.toastMessage = msg;
    this.cdr.markForCheck();
    setTimeout(() => {
      this.toastMessage = null;
      this.cdr.markForCheck();
    }, 3000);
  }
}
