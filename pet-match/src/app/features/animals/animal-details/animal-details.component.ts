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

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.loadAnimal(id);
    this.authService.profile().subscribe({
      next: u => this.user.set(u),
      error: () => {}
    });
  }

  private loadAnimal(id: string): void {
    this.http.get<any>(`http://localhost:3000/api/animals/${id}`, { withCredentials: true })
      .subscribe(a => this.animal.set(a));
  }

  private ownerId(a: any): string {
    return String(a?.addedByUserId ?? a?._ownerId ?? a?.ownerId ?? a?.createdById ?? '');
  }

  private currentUserId(): string {
    const u = this.user();
    return String(u?._id ?? '');
  }

  isCreator(): boolean {
    const a = this.animal();
    if (!a) return false;
    return this.ownerId(a) === this.currentUserId();
  }

  isFavorited(): boolean {
    const a = this.animal();
    if (!a) return false;
    const id = this.currentUserId();
    const lists = [
      a?.likedBy,
      a?.favouritedBy,
      a?.favorites,
      a?.favourites,
      a?.likers,
      a?.likesBy
    ].filter(Boolean) as any[];
    return lists.some(arr => Array.isArray(arr) && arr.map((x: any) => String(x)).includes(String(id)));
  }

  onToggleFavorite(): void {
    const a = this.animal();
    if (!a) return;
    const id = a.id || a._id;
    const action = this.isFavorited() ? 'unlike' : 'like';
    this.http.post(`http://localhost:3000/api/animals/${id}/${action}`, {}, { withCredentials: true })
      .subscribe(() => this.loadAnimal(String(id)));
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
    if (!confirm('Are you sure you want to delete this animal?')) return;
    const id = a.id || a._id;
    this.http.delete(`http://localhost:3000/api/animals/${id}`, { withCredentials: true })
      .subscribe(() => this.router.navigate(['/animals']));
  }
}
