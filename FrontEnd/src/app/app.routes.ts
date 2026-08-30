import { Routes } from '@angular/router';

export const routes: Routes = [
  // ==========================================
  // 1. RUTA POR DEFECTO (Redirección inicial)
  // ==========================================
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  // ==========================================
  // 2. RUTAS GENERALES (Top-Level Routes)
  // ==========================================
  {
    path: 'home',
    title: 'Brigada Hostel - Inicio',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'quienes-somos',
    title: 'Brigada Hostel - Quiénes Somos',
    loadComponent: () => import('./pages/quienes-somos/quienes-somos.component').then(m => m.QuienesSomosComponent)
  },

  // ==========================================
  // 3. RUTAS DE AUTENTICACIÓN (Rutas Hijas / Nested)
  // ==========================================
  {
    path: 'auth',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        title: 'Brigada Hostel - Iniciar Sesión',
        loadComponent: () => import('./pages/dashboard/dashboard-auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'signup',
        title: 'Brigada Hostel - Registro de Usuario',
        loadComponent: () => import('./pages/dashboard/dashboard-auth/signup/signup.component').then(m => m.SignupComponent)
      },
      {
        path: 'forgot-password',
        title: 'Brigada Hostel - Recuperar Contraseña',
        loadComponent: () => import('./pages/dashboard/dashboard-auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      }
    ]
  },

  // Alias / Compatibilidad para rutas previas de auth
  {
    path: 'dashboard/auth/login',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'dashboard/auth/signup',
    redirectTo: 'auth/signup',
    pathMatch: 'full'
  },
  {
    path: 'dashboard/auth/forgot-password',
    redirectTo: 'auth/forgot-password',
    pathMatch: 'full'
  },

  // ==========================================
  // 4. RUTAS DEL PANEL DASHBOARD (Rutas Hijas / Nested)
  // ==========================================
  {
    path: 'dashboard',
    title: 'Brigada Hostel - Dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      {
        path: '',
        redirectTo: 'admin/resumen',
        pathMatch: 'full'
      },
      // Rutas hijas del Administrador
      {
        path: 'admin',
        children: [
          {
            path: '',
            redirectTo: 'resumen',
            pathMatch: 'full'
          },
          {
            path: 'resumen',
            title: 'Dashboard Admin - Resumen',
            loadComponent: () => import('./pages/dashboard/dashboard-admin/resumen-admin/resumen-admin.component').then(m => m.ResumenAdminComponent)
          },
          {
            path: 'reservas',
            title: 'Dashboard Admin - Reservas',
            loadComponent: () => import('./pages/dashboard/dashboard-admin/reservas-admin/reservas-admin.component').then(m => m.ReservasAdminComponent)
          },
          {
            path: 'configuracion',
            title: 'Dashboard Admin - Configuración',
            loadComponent: () => import('./pages/dashboard/dashboard-admin/configuracion-admin/configuracion-admin.component').then(m => m.ConfiguracionAdminComponent)
          }
        ]
      },
      // Rutas hijas del Huésped / Usuario
      {
        path: 'usuario',
        children: [
          {
            path: '',
            redirectTo: 'resumen',
            pathMatch: 'full'
          },
          {
            path: 'resumen',
            title: 'Dashboard Usuario - Mi Resumen',
            loadComponent: () => import('./pages/dashboard/dashboard-usuario/resumen-usuario/resumen-usuario.component').then(m => m.ResumenUsuarioComponent)
          },
          {
            path: 'reservas',
            title: 'Dashboard Usuario - Reservas',
            loadComponent: () => import('./pages/dashboard/dashboard-usuario/reservas-usuario/reservas-usuario.component').then(m => m.ReservasUsuarioComponent)
          }
        ]
      }
    ]
  },

  // ==========================================
  // 5. GESTIÓN DE RUTA 404 (Página no encontrada)
  // ==========================================
  {
    path: '404',
    title: 'Brigada Hostel - 404 No Encontrado',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  },
  {
    path: '**',
    title: 'Brigada Hostel - 404 No Encontrado',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
