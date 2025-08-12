import { Injectable, Inject, PLATFORM_ID, signal } from "@angular/core";
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { Animal } from "../../models";

export type CreateAnimalDto = {
  name: string;
  type: string;
  imageUrl: string;
  age?: number | null;
  description?: string;
  location?: string;
};
export type UpdateAnimalDto = Partial<CreateAnimalDto> & { adopted?: boolean; };

@Injectable({ providedIn: 'root' })
export class AnimalsService {
  private apiUrl = 'http://localhost:3000/api/animals';

  private _animals = signal<Animal[]>([]);
  private _selectedAnimal = signal<Animal | null>(null);

  public animals = this._animals.asReadonly();
  public selectedAnimal = this._selectedAnimal.asReadonly();

  constructor(
    private httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getAll(): Observable<Animal[]> {
    return this.httpClient.get<Animal[]>(this.apiUrl, { withCredentials: true });
  }

  getAllAnimals(): Observable<Animal[]> {
    return this.getAll();
  }

  loadAll(): Observable<Animal[]> {
    return this.getAll().pipe(tap(list => this._animals.set(list)));
  }

  getAnimalById(id: string): Observable<Animal> {
    return this.httpClient.get<Animal>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
  loadById(id: string): Observable<Animal> {
    return this.getAnimalById(id).pipe(tap(a => this._selectedAnimal.set(a)));
  }

  getFavoriteAnimals(): Observable<Animal[]> {
    return this.httpClient.get<Animal[]>(`${this.apiUrl}/favorites`, { withCredentials: true });
  }
  getMyAnimals(): Observable<Animal[]> {
    return this.httpClient.get<Animal[]>(`${this.apiUrl}/mine`, { withCredentials: true });
  }

  createAnimal(payload: CreateAnimalDto): Observable<Animal> {
    return this.httpClient.post<Animal>(this.apiUrl, payload, { withCredentials: true })
      .pipe(tap(newA => this._animals.set([newA, ...this._animals()])));
  }
  updateAnimal(id: string, payload: UpdateAnimalDto): Observable<Animal> {
    return this.httpClient.put<Animal>(`${this.apiUrl}/${id}`, payload, { withCredentials: true })
      .pipe(tap(updated => {
        const list = this._animals().map(a => a.id === id ? updated : a);
        this._animals.set(list);
        const sel = this._selectedAnimal(); if (sel && sel.id === id) this._selectedAnimal.set(updated);
      }));
  }
  deleteAnimal(id: string): Observable<{ ok?: boolean; message?: string }> {
    return this.httpClient.delete<{ ok?: boolean; message?: string }>(`${this.apiUrl}/${id}`, { withCredentials: true })
      .pipe(tap(() => {
        this._animals.set(this._animals().filter(a => a.id !== id));
        const sel = this._selectedAnimal(); if (sel && sel.id === id) this._selectedAnimal.set(null);
      }));
  }

  toggleFavorite(animalId: string): Observable<{ likes: number; liked: boolean; likedAnimals: string[] }> {
    return this.httpClient.post<{ likes: number; liked: boolean; likedAnimals: string[] }>(
      `${this.apiUrl}/${animalId}/like`, {}, { withCredentials: true }
    ).pipe(tap(res => {
      const list = this._animals().map(a => a.id === animalId ? { ...a, likes: res.likes } as Animal : a);
      this._animals.set(list);
      const sel = this._selectedAnimal(); if (sel && sel.id === animalId) this._selectedAnimal.set({ ...sel, likes: res.likes });
    }));
  }

  setAnimals(list: Animal[]) { this._animals.set(list); }
  setSelected(animal: Animal | null) { this._selectedAnimal.set(animal); }
  get isBrowser(): boolean { return isPlatformBrowser(this.platformId); }
}
