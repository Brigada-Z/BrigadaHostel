import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-configuracion-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './configuracion-admin.component.html',
  styleUrl: './configuracion-admin.component.css'
})
export class ConfiguracionAdminComponent {
  fullName = 'Administrador General';
  email = 'admin@brigadahostel.com';
  currentPass = '';
  newPass = '';
  confirmPass = '';
  enable2FA = true;
  language = 'es';
  theme = 'light';

  toastMessage: string | null = null;

  notify(msg: string): void {
    this.toastMessage = msg;
    setTimeout(() => {
      this.toastMessage = null;
    }, 3000);
  }
}
