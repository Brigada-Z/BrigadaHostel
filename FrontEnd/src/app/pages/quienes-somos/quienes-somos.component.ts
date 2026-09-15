import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IntegrantesService } from '../../services/integrantes.service';

@Component({
  selector: 'app-quienes-somos',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  templateUrl: './quienes-somos.component.html',
  styleUrl: './quienes-somos.component.css'
})
export class QuienesSomosComponent {
  private readonly integrantesService = inject(IntegrantesService);

  integrantes$ = this.integrantesService.obtenerIntegrantes();
}