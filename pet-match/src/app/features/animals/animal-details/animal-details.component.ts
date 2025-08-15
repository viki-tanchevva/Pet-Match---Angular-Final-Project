import { Component, OnInit, Inject, PLATFORM_ID, inject, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { AgePipe } from '../../../shared/pipes/age.pipe';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';

@Component({
  selector: 'app-animal-details',
  standalone: true,
  imports: [CommonModule, RouterLink, AgePipe, TruncatePipe],
  templateUrl: './animal-details.component.html',
  styleUrls: ['./animal-details.component.css']
})
export class AnimalDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  public authService = inject(AuthService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  animal = signal<any | null>(null);
  user = signal<any | null>(null);
  favoriteLocal = signal<boolean | null>(null);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.loadAnimal(id);
    this.authService.profile().subscribe({
      next: u => {
        this.user.set(u);
        this.updateFavoriteFromData();
      },
      error: () => {}
    });
  }

  private loadAnimal(id: string): void {
    this.http.get<any>(`http://localhost:3000/api/animals/${id}`, { withCredentials: true })
      .subscribe(a => {
        this.animal.set(a);
        this.updateFavoriteFromData();
      });
  }

  private ownerId(a: any): string {
    return String(a?.addedByUserId ?? a?._ownerId ?? a?.ownerId ?? a?.createdById ?? '');
  }

  private currentUserId(): string {
    const u = this.user();
    return String(u?._id ?? this.authService.getCurrentUserId() ?? '');
  }

  private userLikedAnimal(a: any): boolean {
    const u = this.user();
    const aid = String(a?.id ?? a?._id ?? '');
    const liked = Array.isArray(u?.likedAnimals) ? u!.likedAnimals.map((x: any) => String(x)) : [];
    return !!aid && liked.includes(aid);
  }

  private extractFavorited(a: any, userId: string): boolean {
    if (!a || !userId) return false;
    if (a.isLikedByCurrentUser !== undefined) return !!a.isLikedByCurrentUser;
    if (a.isFavourite !== undefined) return !!a.isFavourite;
    if (a.isFavorite !== undefined) return !!a.isFavorite;
    const candidates = [
      a?.likedBy,
      a?.favouritedBy,
      a?.favorites,
      a?.favourites,
      a?.likers,
      a?.likesBy,
      a?.usersWhoLiked
    ].filter(Boolean) as any[];
    const uid = String(userId);
    for (const list of candidates) {
      if (Array.isArray(list)) {
        const asStrings = list.map((x: any) => String(x?.id ?? x?._id ?? x));
        if (asStrings.includes(uid)) return true;
      }
    }
    return false;
  }

  private updateFavoriteFromData(): void {
    const a = this.animal();
    const uid = this.currentUserId();
    if (!a || !uid) return;
    const fav = this.extractFavorited(a, uid) || this.userLikedAnimal(a);
    this.favoriteLocal.set(!!fav);
  }

  isCreator(): boolean {
    const a = this.animal();
    if (!a) return false;
    return this.ownerId(a) === this.currentUserId();
  }

  isFavorited(): boolean {
    const local = this.favoriteLocal();
    if (local !== null) return local;
    const a = this.animal();
    if (!a) return false;
    return this.extractFavorited(a, this.currentUserId()) || this.userLikedAnimal(a);
  }

  onToggleFavorite(): void {
    const a = this.animal();
    if (!a) return;
    const id = a.id || a._id;
    this.http.post<{ likes?: number; liked?: boolean }>(
      `http://localhost:3000/api/animals/${id}/like`,
      {},
      { withCredentials: true }
    ).subscribe(resp => {
      if (typeof resp?.liked === 'boolean') {
        this.favoriteLocal.set(resp.liked);
        const u = this.user();
        if (u) {
          const aid = String(id);
          const arr = Array.isArray(u.likedAnimals) ? [...u.likedAnimals.map((x: any) => String(x))] : [];
          const has = arr.includes(aid);
          if (resp.liked && !has) arr.push(aid);
          if (!resp.liked && has) this.user.set({ ...u, likedAnimals: arr.filter(x => x !== aid) });
          else this.user.set({ ...u, likedAnimals: arr });
        }
      } else {
        this.favoriteLocal.set(!this.isFavorited());
      }
      const cur = this.animal();
      if (cur && typeof resp?.likes === 'number') {
        cur.likes = resp.likes;
        this.animal.set({ ...cur });
      }
    });
  }

  onAdopt(): void {
    const a = this.animal();
    if (!a) return;
    const id = a.id || a._id;
    this.router.navigate(['/adopt', id]);
  }

  onEdit(): void {
    const a = this.animal();
    if (!a) return;
    const id = a.id || a._id;
    this.router.navigate(['/animals', 'edit', id]);
  }

  onDelete(): void {
    const a = this.animal();
    if (!a) return;
    if (!confirm('Сигурни ли сте, че искате да изтриете това животно?')) return;
    const id = a.id || a._id;
    this.http.delete(`http://localhost:3000/api/animals/${id}`, { withCredentials: true })
      .subscribe(() => this.router.navigate(['/animals']));
  }
}
