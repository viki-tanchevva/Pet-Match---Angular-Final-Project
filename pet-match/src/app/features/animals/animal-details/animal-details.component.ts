import { Component, Inject, OnInit, signal, inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Animal } from '../../../models';
import { AnimalsService, AuthService } from '../../../core/services';
import { AdoptionService } from '../../../core/services/adoption.service';
import { AgePipe, TruncatePipe } from '../../../shared/pipes';

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
  protected authService = inject(AuthService);
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  animal = signal<Animal | null>(null);
  private favoriteIds = new Set<string>();
  alreadyApplied = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.animalsService.getAnimalById(id).subscribe({
      next: (a) => {
        this.animal.set(a);
        if (isPlatformBrowser(this.platformId) && this.authService.userRole() === 'User') {
          this.adoptionService.mine().subscribe(list => {
            this.alreadyApplied = list.some(r => String(r.animalId) === String(id) && r.status !== 'Declined');
          });
        }
      },
      error: () => this.router.navigate(['/animals'])
    });

    if (isPlatformBrowser(this.platformId) && this.authService.userRole() === 'User') {
      this.animalsService.getFavoriteAnimals().subscribe({
        next: (arr) => { this.favoriteIds = new Set(arr.map(x => x.id)); }
      });
    }
  }

  onToggleFavorite(): void {
    const current = this.animal();
    if (!current || this.authService.userRole() !== 'User') return;
    this.animalsService.toggleFavorite(current.id).subscribe({
      next: (res) => {
        const a = this.animal();
        if (a) this.animal.set({ ...a, likes: res.likes });
        if (res.liked) this.favoriteIds.add(current.id);
        else this.favoriteIds.delete(current.id);
      }
    });
  }

  isFavorited(): boolean {
    const a = this.animal();
    return !!a && this.favoriteIds.has(a.id);
  }

  isCreator(): boolean {
    const a = this.animal();
    const user = this.authService.currentUser();
    if (!a || !user) return false;
    return String(user._id) === String(a.addedByUserId);
  }

  onEdit(): void {
    const a = this.animal();
    if (a) this.router.navigate(['/animals/edit', a.id]);
  }

  onDelete(): void {}

  onAdopt(): void {
    const a = this.animal();
    if (!a) return;
    if (this.alreadyApplied) {
      alert('You have already applied for this animal.');
      return;
    }
    this.router.navigate(['/adopt', a.id]);
  }
}
