import { Injectable, signal } from '@angular/core';

export type UserRole = 'admin' | 'usuario';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  readonly currentRole = signal<UserRole>('admin');
  readonly isSidebarOpen = signal<boolean>(false);

  setRole(role: UserRole): void {
    this.currentRole.set(role);
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update(val => !val);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }
}
