import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DashboardService, UserRole } from '../../../../services/dashboard.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private router = inject(Router);
  private dashboardService = inject(DashboardService);

  username = 'admin';
  password = '••••';
  selectedRole: UserRole = 'admin';

  onSubmit(): void {
    this.dashboardService.setRole(this.selectedRole);
    if (this.selectedRole === 'admin') {
      this.router.navigate(['/dashboard/admin/resumen']);
    } else {
      this.router.navigate(['/dashboard/usuario/resumen']);
    }
  }
}
