import { Component, OnInit, signal, inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Animal } from '../../../models';
import { AnimalsService } from '../../../core/services/animal.service';
import { AdoptionService } from '../../../core/services/adoption.service';
import { AgePipe } from '../../../shared/pipes/age.pipe';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';

@Component({
  selector: 'app-animal-details',
  standalone: true,
  imports: [RouterLink, CommonModule, AgePipe, TruncatePipe],
  templateUrl: './animal-details.component.html',
  styleUrls: ['./animal-details.component.css']
})
export class AnimalDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private animalsService = inject(AnimalsService);
  private adoptionService = inject(AdoptionService);
  private platformId = inject(PLATFORM_ID);

  animal = signal<Animal | null>(null);
  favorited = signal<boolean>(false);
  alreadyApplied = false;

  authService = {
    isAuthenticated: (): boolean => !!this.readUser(),
    userRole: (): string => {
      const u = this.readUser();
      let role: any =
        u?.role ??
        (Array.isArray(u?.roles) ? u.roles[0] : undefined) ??
        (u?.isShelter ? 'Shelter' : u?.isUser ? 'User' : undefined) ??
        u?.userType ??
        u?.type ??
        '';
      role = String(role).trim().toLowerCase();
      if (role === 'shelter') return 'Shelter';
      if (role === 'user') return 'User';
      return role ? role.charAt(0).toUpperCase() + role.slice(1) : '';
    }
  };

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.animalsService.loadById(id).subscribe({
      next: a => {
        this.animal.set(a);
        const anyA: any = a as any;
        const initFav = anyA.isFavorite ?? anyA.favourite ?? anyA.likedByCurrentUser ?? false;
        this.favorited.set(!!initFav);
      }
    });
  }

  isFavorited(): boolean {
    return this.favorited();
  }

  isCreator(): boolean {
    const u = this.readUser();
    if (!u) return false;
    const a = this.animal();
    if (!a) return false;
    const userId = this.readUserId(u);
    const ownerCandidates = ['addedByUserId', 'ownerId', 'userId', 'authorId', 'shelterId', 'createdBy', 'addedBy'];
    let ownerVal = '';
    for (const k of ownerCandidates) {
      const v = (a as any)?.[k];
      if (v !== undefined && v !== null && String(v).length > 0) {
        ownerVal = String(v);
        break;
      }
    }
    return userId.length > 0 && ownerVal.length > 0 && userId === ownerVal;
  }

  onToggleFavorite(): void {
    const a = this.animal();
    if (!a) return;
    this.animalsService.toggleFavorite(a.id).subscribe({
      next: (res: any) => {
        if (typeof res?.favorited === 'boolean') this.favorited.set(res.favorited);
        else this.favorited.set(!this.favorited());
        if (typeof res?.likes === 'number') this.animal.set({ ...a, likes: res.likes });
      },
      error: () => {}
    });
  }

  onEdit(): void {
    const a = this.animal();
    if (!a) return;
    this.router.navigate(['/animals/edit', a.id]);
  }

  onDelete(): void {
    const a = this.animal();
    if (!a) return;
    const ok = confirm('Delete this animal?');
    if (!ok) return;
    this.animalsService.deleteAnimal(a.id).subscribe({
      next: () => this.router.navigate(['/animals']),
      error: () => alert('Delete failed. Please try again')
    });
  }

  onAdopt(): void {
    const a = this.animal();
    if (!a) return;
    if (this.alreadyApplied) return;
    this.router.navigate(['/adopt', a.id]);
  }

  private readUser(): any {
    try {
      const keys = ['user', 'currentUser', 'auth', 'profile'];
      for (const k of keys) {
        const raw = localStorage.getItem(k);
        if (raw) return JSON.parse(raw);
      }
      return null;
    } catch {
      return null;
    }
  }

  private readUserId(u: any): string {
    const id = u?._id ?? u?.id ?? u?.userId ?? u?.uid ?? (typeof u?.user === 'object' ? u.user?._id || u.user?.id : undefined);
    return String(id || '');
  }
}
