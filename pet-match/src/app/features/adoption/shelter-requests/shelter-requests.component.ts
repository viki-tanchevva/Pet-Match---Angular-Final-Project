import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdoptionService } from '../../../core/services/adoption.service';
import { AdoptionRequest, AdoptionStatus } from '../../../models/adoption-request.model';
import { AuthService } from '../../../core/services';

type ParsedInfo = { name: string; phone: string; note: string };

@Component({
  selector: 'app-shelter-requests',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './shelter-requests.component.html',
  styleUrls: ['./shelter-requests.component.css']
})
export class ShelterRequestsComponent {
  private adoption = inject(AdoptionService);
  private auth = inject(AuthService);
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  requests: AdoptionRequest[] = [];
  expandedId: string | null = null;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.auth.userRole() !== 'Shelter') return;
    this.load();
  }

  load(): void {
    this.adoption.forShelter().subscribe(r => this.requests = r);
  }

  toggle(id: string): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  setStatus(id: string, status: AdoptionStatus): void {
    this.adoption.updateStatus(id, status).subscribe(() => this.load());
  }

  parse(msg: string): ParsedInfo {
    const lines = (msg || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    let name = '', phone = '', note = '';
    for (const l of lines) {
      if (!name && /^name\s*:/i.test(l)) name = l.replace(/^name\s*:/i, '').trim();
      else if (!phone && /^phone\s*:/i.test(l)) phone = l.replace(/^phone\s*:/i, '').trim();
      else note += (note ? '\n' : '') + l;
    }
    return { name, phone, note };
  }
}
