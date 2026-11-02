import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MetricasService } from '../../../../../../services/metricas.service';
import { PreferencesService } from '../../../../../../services/preferences.service';
import { MetricasDashboard } from '../../../../../../models/metricas.model';

@Component({
  selector: 'app-modulo-metricas',
  standalone: true,
  imports: [CommonModule, DecimalPipe, FormsModule],
  templateUrl: './modulo-metricas.component.html',
  styleUrl: './modulo-metricas.component.css'
})
export class ModuloMetricasComponent implements OnInit {
  private readonly metricasService = inject(MetricasService);
  public readonly preferencesService = inject(PreferencesService);
  private readonly cdr = inject(ChangeDetectorRef);

  metricas: MetricasDashboard | null = null;
  isLoading = true;
  hasError = false;
  periodo = 'Este Mes';

  ngOnInit(): void {
    this.cargarMetricas();
  }

  cargarMetricas(): void {
    this.isLoading = true;
    this.hasError = false;
    this.metricasService.obtenerMetricas().subscribe({
      next: (data) => {
        this.metricas = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al cargar métricas del backend:', err);
        this.hasError = true;
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  onPeriodoChange(valor: string): void {
    this.periodo = valor;
    this.cargarMetricas();
  }

  /**
   * Genera un informe en PDF con los indicadores actuales del dashboard.
   */
  exportarPdf(): void {
    const metricas = this.metricas;
    if (!metricas) {
      return;
    }

    // Import dinámico para no inflar el bundle principal del frontend
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      const fecha = new Date().toLocaleDateString('es-AR');

      doc.setFontSize(20);
      doc.text('Informe de Métricas - Brigada Hostel', 14, 20);
      doc.setFontSize(12);
      doc.text(`Período: ${this.periodo}`, 14, 30);
      doc.text(`Fecha de generación: ${fecha}`, 14, 36);

      doc.setFontSize(14);
      doc.text('Indicadores principales', 14, 48);
      let y = 56;
      const lineas: Array<[string, string]> = [
        ['Ocupación Hoy', `${metricas.ocupacionHoy?.porcentaje ?? 0}%`],
        ['Ingresos Confirmados', `$${(metricas.ingresosTotales ?? 0).toFixed(2)}`],
        ['Check-ins Hoy', `${metricas.checkinsHoy?.total ?? 0}`],
        ['Ratio de Cancelación', `${metricas.ratioCancelacion?.porcentaje ?? 0}%`],
      ];
      for (const [label, valor] of lineas) {
        doc.text(`${label}: ${valor}`, 14, y);
        y += 10;
      }

      doc.setFontSize(14);
      doc.text('Totales', 14, y + 6);
      const totales = metricas.totales;
      y += 16;
      doc.text(`Reservas: ${totales?.reservas ?? 0}`, 14, y);
      doc.text(`Reservas Confirmadas: ${totales?.confirmadas ?? 0}`, 14, y + 10);
      doc.text(`Reservas Pendientes: ${totales?.pendientes ?? 0}`, 14, y + 20);
      doc.text(`Habitaciones Disponibles: ${totales?.habitacionesDisponibles ?? 0} de ${totales?.habitaciones ?? 0}`, 14, y + 30);

      doc.save(`informe-metricas-${Date.now()}.pdf`);
    });
  }
}
