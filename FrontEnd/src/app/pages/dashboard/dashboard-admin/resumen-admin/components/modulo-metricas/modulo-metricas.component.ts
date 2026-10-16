import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MetricasService } from '../../../../../../services/metricas.service';
import { MetricasDashboard } from '../../../../../../models/metricas.model';

@Component({
  selector: 'app-modulo-metricas',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './modulo-metricas.component.html',
  styleUrl: './modulo-metricas.component.css'
})
export class ModuloMetricasComponent implements OnInit {
  private readonly metricasService = inject(MetricasService);
  private readonly cdr = inject(ChangeDetectorRef);

  metricas: MetricasDashboard | null = null;
  isLoading = true;
  hasError = false;

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
}
