import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador personalizado para asegurar que un campo no contenga solo espacios en blanco.
 */
export function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const isWhitespace = (control.value || '').toString().trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}

/**
 * Validador personalizado para formato de Email estricto (ej: usuario@dominio.com).
 */
export function customEmailValidator(): ValidatorFn {
  const EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const isValid = EMAIL_REGEXP.test(control.value.trim());
    return isValid ? null : { invalidEmailFormat: true };
  };
}

/**
 * Validador personalizado para DNI (formato numérico argentino / genérico de 7 a 8 dígitos).
 */
export function dniValidator(): ValidatorFn {
  const DNI_REGEXP = /^\d{7,8}$/;
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const cleanDni = control.value.toString().replace(/\./g, '').trim();
    const isValid = DNI_REGEXP.test(cleanDni);
    return isValid ? null : { invalidDni: true };
  };
}

/**
 * Validador personalizado para comprobar la fortaleza de la contraseña.
 * Requiere al menos 6 caracteres y que contenga letras y al menos un número.
 */
export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value || '';
    if (!value) {
      return null;
    }

    const hasNumber = /\d/.test(value);
    const hasLetter = /[a-zA-Z]/.test(value);
    const isValidLength = value.length >= 6;

    const passwordValid = hasNumber && hasLetter && isValidLength;

    if (!passwordValid) {
      return {
        weakPassword: {
          needsNumber: !hasNumber,
          needsLetter: !hasLetter,
          needsMinLength: !isValidLength
        }
      };
    }
    return null;
  };
}

/**
 * Validador cruzado (Cross-field validator) para verificar que dos contraseñas coincidan.
 */
export function passwordMatchValidator(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordKey)?.value;
    const confirmPassword = group.get(confirmPasswordKey)?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    if (password !== confirmPassword) {
      const confirmControl = group.get(confirmPasswordKey);
      if (confirmControl) {
        confirmControl.setErrors({ ...confirmControl.errors, passwordsMismatch: true });
      }
      return { passwordsMismatch: true };
    } else {
      const confirmControl = group.get(confirmPasswordKey);
      if (confirmControl && confirmControl.hasError('passwordsMismatch')) {
        const errors = { ...confirmControl.errors };
        delete errors['passwordsMismatch'];
        confirmControl.setErrors(Object.keys(errors).length ? errors : null);
      }
      return null;
    }
  };
}
