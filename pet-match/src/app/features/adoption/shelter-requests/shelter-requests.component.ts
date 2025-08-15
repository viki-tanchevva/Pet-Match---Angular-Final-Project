import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shelter-requests',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shelter-requests.component.html',
  styleUrls: ['./shelter-requests.component.css']
})
export class ShelterRequestsComponent implements OnInit {
  private http = inject(HttpClient);

  requests: any[] = [];
  expandedId: string | null = null;

  ngOnInit(): void {
    this.loadRequests();
  }

  private loadRequests(): void {
    this.http.get<any[]>('http://localhost:3000/api/adoptionRequests/for-shelter', { withCredentials: true })
      .subscribe(arr => {
        const data = Array.isArray(arr) ? arr : [];
        this.requests = data;
      });
  }

  toggle(id: string): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  parse(msg: any): { name?: string; phone?: string; note?: string } {
    if (!msg) return {};
    if (typeof msg === 'object') {
      const name = String((msg as any).name ?? (msg as any).applicant ?? '').trim() || undefined;
      const phone = String((msg as any).phone ?? (msg as any).tel ?? '').trim() || undefined;
      const note = String((msg as any).note ?? (msg as any).message ?? '').trim() || undefined;
      return { name, phone, note };
    }
    const s = String(msg);
    const nameMatch = s.match(/name\s*[:\-]\s*([^\n,]+)/i) || s.match(/applicant\s*[:\-]\s*([^\n,]+)/i);
    const phoneMatch = s.match(/phone\s*[:\-]\s*([\d\s\+\-\(\)]+)/i) || s.match(/tel\s*[:\-]\s*([\d\s\+\-\(\)]+)/i);
    const noteMatch = s.match(/note\s*[:\-]\s*([\s\S]+)/i) || s.match(/message\s*[:\-]\s*([\s\S]+)/i);
    return {
      name: nameMatch ? nameMatch[1].trim() : undefined,
      phone: phoneMatch ? phoneMatch[1].trim() : undefined,
      note: noteMatch ? noteMatch[1].trim() : undefined
    };
  }

  setStatus(id: string, status: 'Approved' | 'Declined'): void {
    const body = { status };
    this.http.patch(`http://localhost:3000/api/adoptionRequests/${id}`, body, { withCredentials: true })
      .subscribe(() => {
        this.requests = this.requests.map(r => (r.id === id || r._id === id) ? { ...r, status } : r);
        this.loadRequests();
      });
  }
}
