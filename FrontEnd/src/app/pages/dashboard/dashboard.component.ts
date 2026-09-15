import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { DashboardService, UserRole } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  public dashboardService = inject(DashboardService);
  private router = inject(Router);

  ngOnInit(): void {
    this.syncRoleFromUrl(this.router.url);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.syncRoleFromUrl(event.urlAfterRedirects || event.url);
    });
  }

  private syncRoleFromUrl(url: string): void {
    if (url.includes('/dashboard/usuario')) {
      this.dashboardService.setRole('usuario');
    } else if (url.includes('/dashboard/admin')) {
      this.dashboardService.setRole('admin');
    }
  }

  switchRole(role: UserRole): void {
    this.dashboardService.setRole(role);
    if (role === 'admin') {
      this.router.navigate(['/dashboard/admin/resumen']);
    } else {
      this.router.navigate(['/dashboard/usuario/resumen']);
    }
  }
}
