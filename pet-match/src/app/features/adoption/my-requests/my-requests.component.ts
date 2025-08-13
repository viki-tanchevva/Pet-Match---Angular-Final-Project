import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdoptionService } from '../../../core/services/adoption.service';
import { AdoptionRequest } from '../../../models/adoption-request.model';
import { AuthService } from '../../../core/services';

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.css']
})
export class MyRequestsComponent {
  private adoption = inject(AdoptionService);
  private auth = inject(AuthService);
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  requests: AdoptionRequest[] = [];

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.auth.userRole() !== 'User') return;
    this.load();
  }

  load(): void {
    this.adoption.mine().subscribe(r => this.requests = r);
  }

  cancel(id: string): void {
    this.adoption.remove(id).subscribe(() => this.load());
  }
}
