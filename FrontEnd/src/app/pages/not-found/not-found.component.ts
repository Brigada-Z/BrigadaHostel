import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
  private location = inject(Location);
  public router = inject(Router);

  goBack(): void {
    this.location.back();
  }
}
