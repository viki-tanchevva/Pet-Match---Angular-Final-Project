import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdoptionService } from '../../../core/services/adoption.service';
import { AdoptionRequest } from '../../../models/adoption-request.model';

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.css']
})
export class MyRequestsComponent {
  private adoption = inject(AdoptionService);
  requests: AdoptionRequest[] = [];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.adoption.mine().subscribe(r => this.requests = r);
  }

  cancel(id: string): void {
    this.adoption.remove(id).subscribe(() => this.load());
  }
}
