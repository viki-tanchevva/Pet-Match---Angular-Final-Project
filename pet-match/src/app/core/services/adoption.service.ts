import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdoptionRequest, AdoptionStatus } from '../../models/adoption-request.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdoptionService {
  private apiUrl = 'http://localhost:3000/api/adoptionRequests';

  constructor(private http: HttpClient) {}

  create(animalId: string, message: string): Observable<AdoptionRequest> {
    return this.http.post<AdoptionRequest>(this.apiUrl, { animalId, message }, { withCredentials: true });
  }

  mine(): Observable<AdoptionRequest[]> {
    return this.http.get<AdoptionRequest[]>(`${this.apiUrl}/mine`, { withCredentials: true });
  }

  forShelter(): Observable<AdoptionRequest[]> {
    return this.http.get<AdoptionRequest[]>(`${this.apiUrl}/for-shelter`, { withCredentials: true });
  }

  updateStatus(id: string, status: AdoptionStatus): Observable<AdoptionRequest> {
    return this.http.patch<AdoptionRequest>(`${this.apiUrl}/${id}`, { status }, { withCredentials: true });
  }

  remove(id: string): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
