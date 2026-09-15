import { Component } from '@angular/core';
import { ModuloHuespedesComponent } from './components/modulo-huespedes/modulo-huespedes.component';
import { ModuloOperacionesComponent } from './components/modulo-operaciones/modulo-operaciones.component';
import { ModuloMetricasComponent } from './components/modulo-metricas/modulo-metricas.component';

@Component({
  selector: 'app-resumen-admin',
  standalone: true,
  imports: [
    ModuloHuespedesComponent,
    ModuloOperacionesComponent,
    ModuloMetricasComponent
  ],
  templateUrl: './resumen-admin.component.html',
  styleUrl: './resumen-admin.component.css'
})
export class ResumenAdminComponent {}
