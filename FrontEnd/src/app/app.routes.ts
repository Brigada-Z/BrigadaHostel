import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'quienes-somos',
    loadComponent: () => import('./pages/quienes-somos/quienes-somos.component').then(m => m.QuienesSomosComponent)
  },
  {
    path: 'dashboard/auth/login',
    loadComponent: () => import('./pages/dashboard/dashboard-auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard/auth/signup',
    loadComponent: () => import('./pages/dashboard/dashboard-auth/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'dashboard/auth/forgot-password',
    loadComponent: () => import('./pages/dashboard/dashboard-auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      {
        path: '',
        redirectTo: 'admin/resumen',
        pathMatch: 'full'
      },
      {
        path: 'usuario/resumen',
        loadComponent: () => import('./pages/dashboard/dashboard-usuario/resumen-usuario/resumen-usuario.component').then(m => m.ResumenUsuarioComponent)
      },
      {
        path: 'usuario/reservas',
        loadComponent: () => import('./pages/dashboard/dashboard-usuario/reservas-usuario/reservas-usuario.component').then(m => m.ReservasUsuarioComponent)
      },
      {
        path: 'admin/resumen',
        loadComponent: () => import('./pages/dashboard/dashboard-admin/resumen-admin/resumen-admin.component').then(m => m.ResumenAdminComponent)
      },
      {
        path: 'admin/reservas',
        loadComponent: () => import('./pages/dashboard/dashboard-admin/reservas-admin/reservas-admin.component').then(m => m.ReservasAdminComponent)
      },
      {
        path: 'admin/configuracion',
        loadComponent: () => import('./pages/dashboard/dashboard-admin/configuracion-admin/configuracion-admin.component').then(m => m.ConfiguracionAdminComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
