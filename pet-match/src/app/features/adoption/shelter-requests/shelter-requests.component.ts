import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdoptionService } from '../../../core/services/adoption.service';
import { AdoptionRequest, AdoptionStatus } from '../../../models/adoption-request.model';

@Component({
  selector: 'app-shelter-requests',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './shelter-requests.component.html',
  styleUrls: ['./shelter-requests.component.css']
})
export class ShelterRequestsComponent {
  private adoption = inject(AdoptionService);
  requests: AdoptionRequest[] = [];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.adoption.forShelter().subscribe(r => this.requests = r);
  }

  setStatus(id: string, status: AdoptionStatus): void {
    this.adoption.updateStatus(id, status).subscribe(() => this.load());
  }
}
