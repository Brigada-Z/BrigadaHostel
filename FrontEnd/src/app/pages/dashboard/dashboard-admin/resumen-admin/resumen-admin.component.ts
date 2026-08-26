import { Component } from '@angular/core';

@Component({
  selector: 'app-resumen-admin',
  standalone: true,
  template: `
    <div>
      <div class="mb-40">
        <h2 class="section-header-title">Datos Principales</h2>
        <p class="header-subtitle">Resumen operativo actual del hostel (Vista Administrador)</p>
      </div>

      <!-- MÉTRICAS CLAVE -->
      <div class="row g-4 mb-40">
        <!-- Ocupación Hoy -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="metric-card hero-card h-100">
            <div class="flex-between">
              <h3 class="metric-title">Ocupación Hoy</h3>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="3">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              </svg>
            </div>
            <div class="metric-value">85%</div>
            <div class="metric-trend trend-up">▲ 18/24 Camas disponibles</div>
          </div>
        </div>

        <!-- Check-ins Hoy -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="metric-card h-100">
            <div class="flex-between">
              <h3 class="metric-title">Check-ins Hoy</h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
            </div>
            <div class="metric-value">6</div>
            <div class="metric-trend font-semibold text-secondary">Pendientes: 2</div>
          </div>
        </div>

        <!-- Ratio de Cancelación (Admin Only) -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="metric-card h-100">
            <div class="flex-between">
              <h3 class="metric-title">Ratio Cancelación</h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <div class="metric-value">4.2%</div>
            <div class="metric-trend trend-up">▲ 0.8% riesgo</div>
          </div>
        </div>

        <!-- Estadía Promedio (Admin Only) -->
        <div class="col-12 col-md-6 col-xl-3">
          <div class="metric-card h-100">
            <div class="flex-between">
              <h3 class="metric-title">Estadía Promedio</h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </div>
            <div class="metric-value">3.2 Noches</div>
            <div class="metric-trend trend-up">▲ 0.5 noches</div>
          </div>
        </div>
      </div>

      <!-- GRÁFICOS OPERATIVOS -->
      <div class="chart-grid">
        <!-- Estado de Camas -->
        <section class="content-section text-center">
          <div class="flex-between mb-20">
            <h2 class="chart-title h5 m-0">Estado de Habitaciones</h2>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e293b" stroke-width="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            </svg>
          </div>
          <div class="d-flex align-items-center justify-content-center mt-20 gap-24">
            <div class="pie-chart"></div>
            <div class="pie-legend">
              <div class="legend-item"><div class="legend-color color-1"></div> Ocupadas (18)</div>
              <div class="legend-item"><span class="d-inline-block rounded-circle me-2" style="width:12px;height:12px;background:#10b981;"></span> Limpias (4)</div>
              <div class="legend-item"><span class="d-inline-block rounded-circle me-2" style="width:12px;height:12px;background:#ef4444;"></span> Sucias (2)</div>
            </div>
          </div>
        </section>

        <!-- Ingresos Semanales -->
        <section class="content-section">
          <div class="flex-between mb-24">
            <h2 class="chart-title h5 m-0">Ingresos Semanales</h2>
            <div class="user-avatar-small" style="background: rgba(37, 99, 235, 0.1);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
          </div>
          <div class="chart-container">
            <div class="bar" style="height: 60%;" data-label="Lun"></div>
            <div class="bar" style="height: 45%;" data-label="Mar"></div>
            <div class="bar" style="height: 85%;" data-label="Mie"></div>
            <div class="bar" style="height: 75%;" data-label="Jue"></div>
            <div class="bar" style="height: 95%;" data-label="Vie"></div>
            <div class="bar" style="height: 100%;" data-label="Sab"></div>
          </div>
        </section>
      </div>

      <!-- ÚLTIMOS MOVIMIENTOS -->
      <section class="content-section mt-32">
        <div class="flex-between mb-20">
          <h2 class="chart-title h5 m-0">Últimos Movimientos</h2>
        </div>
        <div class="flex-column gap-12">
          <div class="flex-between border-bottom pb-2">
            <div>
              <span class="font-semibold">Check-in: #BH-9921</span>
              <p class="header-subtitle m-0">Juan Pérez - Hab 101</p>
            </div>
            <span class="text-success font-semibold">10:45 AM</span>
          </div>
          <div class="flex-between border-bottom pb-2">
            <div>
              <span class="font-semibold">Nueva Reserva: #BH-1045</span>
              <p class="header-subtitle m-0">Ana Smith - Dorm 4</p>
            </div>
            <span class="text-secondary">09:12 AM</span>
          </div>
          <div class="flex-between pb-2">
            <div>
              <span class="font-semibold">Check-out: #BH-8840</span>
              <p class="header-subtitle m-0">María García - Hab 102</p>
            </div>
            <span class="text-secondary">08:30 AM</span>
          </div>
        </div>
      </section>
    </div>
  `
})
export class ResumenAdminComponent {}
