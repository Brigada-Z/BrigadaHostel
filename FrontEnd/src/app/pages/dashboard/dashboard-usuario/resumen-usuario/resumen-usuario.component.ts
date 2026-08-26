import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-resumen-usuario',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div id="user-summary-section">
      <div class="mb-40">
        <h2 class="section-header-title">Tu resumen</h2>
        <p class="header-subtitle">Estado actual de tu cuenta y viajes</p>
      </div>

      <!-- METRIC CARDS USUARIO -->
      <div class="dashboard-grid mb-40">
        <div class="metric-card">
          <div class="flex-between">
            <h3 class="font-semibold text-secondary text-xs">Días para tu viaje</h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div class="metric-value">13</div>
          <div class="metric-trend trend-up">Check-in: 15 Jun</div>
        </div>

        <div class="metric-card">
          <div class="flex-between">
            <h3 class="font-semibold text-secondary text-xs">Estadías Totales</h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            </svg>
          </div>
          <div class="metric-value">4</div>
          <div class="metric-trend">Huésped Frecuente</div>
        </div>

        <div class="metric-card">
          <div class="flex-between">
            <h3 class="font-semibold text-secondary text-xs">Brigada Points</h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
              <circle cx="12" cy="8" r="7"></circle>
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
            </svg>
          </div>
          <div class="metric-value">1,250</div>
          <div class="metric-trend trend-up">▲ 200 este mes</div>
        </div>

        <div class="metric-card">
          <div class="flex-between">
            <h3 class="font-semibold text-secondary text-xs">Crédito Disponible</h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2">
              <rect x="2" y="5" width="20" height="14" rx="2"></rect>
              <line x1="2" y1="10" x2="22" y2="10"></line>
            </svg>
          </div>
          <div class="metric-value">$25.00</div>
          <div class="metric-trend">Para tu próxima cena</div>
        </div>
      </div>

      <!-- MIS RESERVAS ACTIVAS -->
      <section class="content-section mb-40">
        <div class="flex-between mb-32">
          <h2 class="m-0 text-2xl font-weight-800">Tus Próximas Estadías</h2>
          <span class="status-badge status-reserva-activa">1 Reserva Activa</span>
        </div>
        
        <div class="card p-4 border-1 rounded-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div class="d-flex align-items-center gap-3">
            <div class="bg-primary text-white p-3 rounded-4 text-center" style="min-width: 90px;">
              <span class="d-block text-uppercase text-xs font-semibold opacity-75">HABITACIÓN</span>
              <strong class="fs-4">101</strong>
            </div>
            <div>
              <div class="d-flex align-items-center gap-2 mb-1">
                <span class="status-badge status-badge-custom">Confirmada</span>
                <span class="text-secondary text-sm font-semibold">Código: #BH-9921</span>
              </div>
              <h3 class="text-lg m-0 mb-1">Suite Premium - 3 Noches</h3>
              <p class="header-subtitle m-0 d-flex align-items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg> 
                15/06/2026 al 18/06/2026
              </p>
            </div>
          </div>
          <div>
            <a routerLink="/dashboard/usuario/reservas" class="btn-premium">Nueva Reserva</a>
          </div>
        </div>
      </section>
    </div>
  `
})
export class ResumenUsuarioComponent {}
