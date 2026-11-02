import { Injectable, signal } from '@angular/core';

export type Language = 'es' | 'en';
export type Theme = 'light' | 'dark';

const STORAGE_LANG = 'brigada_hostel_lang';
const STORAGE_THEME = 'brigada_hostel_theme';

/**
 * Diccionarios de traducción (español por defecto / inglés).
 * Se agregan nuevas claves a medida que se internacionaliza las pantallas.
 */
const DICTIONARY: Record<Language, Record<string, string>> = {
  es: {
    // Navegación (Sidebar / Dashboard)
    resumen: 'Resumen',
    reservas: 'Reservas',
    configuracion: 'Configuración',
    miResumen: 'Mi Resumen',
    reservarEstancia: 'Reservar Estancia',
    panelDashboard: 'Panel dashboard',

    // Módulos
    moduloOperaciones: 'Módulo Operaciones',
    moduloMetricas: 'Módulo Métricas',
    verPlanillaMensual: 'Ver Planilla Mensual',
    nuevaIncidencia: 'Nueva Incidencia',
    exportarPdf: 'Exportar PDF',
    actualizar: 'Actualizar',
    ocupacionHoy: 'Ocupación Hoy',
    ingresosConfirmados: 'Ingresos Confirmados',
    checkinsHoy: 'Check-ins Hoy',
    ratioCancelacion: 'Ratio de Cancelación',
    estadoHabitaciones: 'Estado de Habitaciones',
    mantenimientoPendiente: 'Mantenimiento Pendiente',
    stockInsumos: 'Control de Stock e Insumos',
    guardar: 'Guardar',
    cancelar: 'Cancelar',
    cerrar: 'Cerrar',
    habitaciones: 'Habitaciones',
    habitacion: 'Habitación',
    noches: 'noches',
    estado: 'Estado',
    precio: 'Precio',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    nombre: 'Nombre',
    incidenciaRegistrada: 'Incidencia registrada correctamente.',
    planMensual: 'Planilla Mensual',
    planMensualCargada: 'Planilla mensual generada correctamente.',
    nuevaReserva: 'Nueva Reserva',
    preferenciasPanel: 'Preferencias del Panel',
    preferenciasAplicadas: 'Preferencias aplicadas correctamente.',
  },
  en: {
    // Navigation (Sidebar / Dashboard)
    resumen: 'Overview',
    reservas: 'Reservations',
    configuracion: 'Settings',
    miResumen: 'My Overview',
    reservarEstancia: 'Book Stay',
    panelDashboard: 'Dashboard Panel',

    // Modules
    moduloOperaciones: 'Operations Module',
    moduloMetricas: 'Metrics Module',
    verPlanillaMensual: 'View Monthly Plan',
    nuevaIncidencia: 'New Incident',
    exportarPdf: 'Export PDF',
    actualizar: 'Refresh',
    ocupacionHoy: 'Occupancy Today',
    ingresosConfirmados: 'Confirmed Revenue',
    checkinsHoy: 'Check-ins Today',
    ratioCancelacion: 'Cancellation Rate',
    estadoHabitaciones: 'Room Status',
    mantenimientoPendiente: 'Pending Maintenance',
    stockInsumos: 'Inventory & Supplies',
    guardar: 'Save',
    cancelar: 'Cancel',
    cerrar: 'Close',
    habitaciones: 'Rooms',
    habitacion: 'Room',
    noches: 'nights',
    estado: 'Status',
    precio: 'Price',
    email: 'Email',
    password: 'Password',
    nombre: 'Name',
    incidenciaRegistrada: 'Incident registered successfully.',
    planMensual: 'Monthly Plan',
    planMensualCargada: 'Monthly plan generated successfully.',
    nuevaReserva: 'New Reservation',
    preferenciasPanel: 'Panel Preferences',
    preferenciasAplicadas: 'Preferences applied successfully.',
  },
};

/**
 * Servicio de Preferencias del Sistema:
 * - Idioma de la aplicación (es / en) con persistencia y aplicación global.
 * - Tema visual (light / dark) con persistencia y variables CSS.
 * - Vista previa de foto de perfil del administrador.
 */
@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  readonly language = signal<Language>(PreferencesService.load<Language>(STORAGE_LANG, 'es'));
  readonly theme = signal<Theme>(PreferencesService.load<Theme>(STORAGE_THEME, 'light'));
  readonly photoDataUrl = signal<string | null>(null);

  constructor() {
    // Aplicar preferencias guardadas al arrancar la aplicación
    if (typeof document !== 'undefined') {
      document.documentElement.lang = this.language();
      document.documentElement.setAttribute('data-theme', this.theme());
    }
  }

  setLanguage(language: Language): void {
    this.language.set(language);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_LANG, language);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_THEME, theme);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }

  setPhoto(dataUrl: string | null): void {
    this.photoDataUrl.set(dataUrl);
  }

  /** Devuelve la traducción de una clave; si no existe, devuelve la clave en español por defecto. */
  t(key: string): string {
    const traducciones = DICTIONARY[this.language()];
    return traducciones?.[key] ?? DICTIONARY['es'][key] ?? key;
  }

  private static load<T>(key: string, fallback: T): T {
    try {
      const stored = localStorage.getItem(key);
      return (stored as T) ?? fallback;
    } catch {
      return fallback;
    }
  }
}
