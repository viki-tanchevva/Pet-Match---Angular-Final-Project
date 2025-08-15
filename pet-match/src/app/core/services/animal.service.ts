import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Animal } from '../../models';

export type CreateAnimalDto = {
  name: string;
  type: string;
  imageUrl: string;
  age?: number | null;
  description?: string;
  location?: string;
};

export type UpdateAnimalDto = Partial<CreateAnimalDto> & {
  adopted?: boolean;
};

@Injectable({ providedIn: 'root' })
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

  // Create
  createAnimal(animal: Partial<Animal> | CreateAnimalDto): Observable<Animal> {
    return this.httpClient.post<Animal>(`${this.apiUrl}`, animal, { withCredentials: true });
  }

  // Read - list with optional filters
  getAllAnimals(params?: { city?: string; species?: string; q?: string }): Observable<Animal[]> {
    let httpParams = new HttpParams();
    if (params) {
      if (params['city']) httpParams = httpParams.set('city', params['city']);
      if (params['species']) httpParams = httpParams.set('species', params['species']);
      if (params['q']) httpParams = httpParams.set('q', params['q']);
    }
    return this.httpClient.get<Animal[]>(`${this.apiUrl}`, { params: httpParams, withCredentials: true });
  }

  // Alias за съвместимост
  getAll(params?: { city?: string; species?: string; q?: string }): Observable<Animal[]> {
    return this.getAllAnimals(params);
  }

  // Read - one
  getAnimalById(id: string): Observable<Animal> {
    return this.httpClient.get<Animal>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  // Update
  updateAnimal(id: string, animal: Partial<Animal> | UpdateAnimalDto): Observable<Animal> {
    return this.httpClient.put<Animal>(`${this.apiUrl}/${id}`, animal, { withCredentials: true });
  }

  // Delete
  deleteAnimal(id: string): Observable<{ message?: string; animal?: Animal }> {
    return this.httpClient.delete<{ message?: string; animal?: Animal }>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  // Like / favorite
  likeAnimal(id: string): Observable<{ message?: string; likes: number; liked?: boolean; likedAnimals?: string[] }> {
    return this.httpClient.post<{ message?: string; likes: number; liked?: boolean; likedAnimals?: string[] }>(
      `${this.apiUrl}/${id}/like`,
      {},
      { withCredentials: true }
    );
  }

  // Съвместимост с компоненти, които викат toggleFavorite()
  toggleFavorite(id: string): Observable<{ likes: number; liked: boolean; likedAnimals?: string[] }> {
    return this.httpClient.post<{ likes: number; liked: boolean; likedAnimals?: string[] }>(
      `${this.apiUrl}/${id}/like`,
      {},
      { withCredentials: true }
    );
  }

  // Favorites / Mine
  getFavoriteAnimals(): Observable<Animal[]> {
    return this.httpClient.get<Animal[]>(`${this.apiUrl}/favorites`, { withCredentials: true });
  }

  getMyAnimals(): Observable<Animal[]> {
    return this.httpClient.get<Animal[]>(`${this.apiUrl}/mine`, { withCredentials: true });
  }

  // Signals helpers
  loadAll(params?: { city?: string; species?: string; q?: string }): Observable<Animal[]> {
    return this.getAllAnimals(params).pipe(tap(list => this._animals.set(list)));
  }

  loadById(id: string): Observable<Animal> {
    return this.getAnimalById(id).pipe(tap(a => this._selectedAnimal.set(a)));
  }

  setAnimals(list: Animal[]) {
    this._animals.set(list);
  }

  setSelected(animal: Animal | null) {
    this._selectedAnimal.set(animal);
  }
}
