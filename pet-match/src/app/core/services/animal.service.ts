import { Injectable, Inject, PLATFORM_ID, signal } from "@angular/core";
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Animal } from "../../models";

@Injectable({
  providedIn: 'root'
})
export class AnimalsService {
  private apiUrl = 'http://localhost:3000/api/animals';
  
  private _animals = signal<Animal[]>([]);
  private _selectedAnimal = signal<Animal | null>(null);

  public animals = this._animals.asReadonly();
  public selectedAnimal = this._selectedAnimal.asReadonly();

  private isBrowser: boolean;

  constructor(
    private httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  createAnimal(animal: Partial<Animal>): Observable<Animal> {
    return this.httpClient.post<Animal>(`${this.apiUrl}`, animal, {
      withCredentials: true
    });
  }

  getAllAnimals(): Observable<Animal[]> {
    return this.httpClient.get<Animal[]>(`${this.apiUrl}`, {
      withCredentials: true
    });
  }

  getAnimalById(id: string): Observable<Animal> {
    return this.httpClient.get<Animal>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }

  updateAnimal(id: string, animal: Partial<Animal>): Observable<Animal> {
    return this.httpClient.put<Animal>(`${this.apiUrl}/${id}`, animal, {
      withCredentials: true
    });
  }

  deleteAnimal(id: string): Observable<{ message: string; animal: Animal }> {
    return this.httpClient.delete<{ message: string; animal: Animal }>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }

  likeAnimal(id: string): Observable<{ message: string; likes: number }> {
    return this.httpClient.post<{ message: string; likes: number }>(`${this.apiUrl}/${id}/like`, {}, {
      withCredentials: true
    });
  }

  getFavoriteAnimals(): Observable<Animal[]> {
  return this.httpClient.get<Animal[]>(`${this.apiUrl}/favorites`, {
    withCredentials: true
  });
}

}
