import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Animal } from '../../../models';
import { AnimalsService, AuthService } from '../../../core/services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-animal-details',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './animal-details.component.html',
  styleUrls: ['./animal-details.component.css']
})
export class AnimalDetailsComponent implements OnInit {
  animal = signal<Animal | null>(null);
  liked = false;

  constructor(
    private route: ActivatedRoute,
    private animalsService: AnimalsService,
    private authService: AuthService,
    private router: Router
  ) { }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get currentUser() {
    return this.authService.currentUser();
  }

  get userRole() {
    return this.authService.userRole();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.animalsService.getAnimalById(id).subscribe({
        next: (animal) => {
          this.animal.set(animal);
          const likedAnimals = this.getLikedAnimals();
          this.liked = likedAnimals.includes(animal.id);
        },
        error: () => this.router.navigate(['/animals'])
      });
    }
  }

  onEdit(): void {
    const animal = this.animal();
    if (!animal) {
      return;
    }
    this.router.navigate(['/animals/edit', animal.id]);
  }

  private getLikedAnimals(): string[] {
    const data = localStorage.getItem('likedAnimals');
    return data ? JSON.parse(data) : [];
  }

  private addLikedAnimal(id: string): void {
    const likedAnimals = this.getLikedAnimals();
    if (!likedAnimals.includes(id)) {
      likedAnimals.push(id);
      localStorage.setItem('likedAnimals', JSON.stringify(likedAnimals));
    }
  }

  onLike() {
    if (!this.animal() || this.liked) return;
    this.animalsService.likeAnimal(this.animal()!.id).subscribe({
      next: ({ likes }) => {
        this.animal.update(a => ({ ...a!, likes }));
        this.liked = true;
        this.addLikedAnimal(this.animal()!.id);
      }
    });
  }

  


  onDelete() {
    if (!this.animal()) return;
    if (confirm('Are you sure you want to delete this animal?')) {
      this.animalsService.deleteAnimal(this.animal()!.id).subscribe({
        next: () => this.router.navigate(['/animals'])
      });
    }
  }

  isCreator(): boolean {
    const user = this.currentUser;
    const animal = this.animal();

    if (!user || !animal) {
      return false;
    }

    return String(user._id) === String(animal.addedByUserId);
  }
}
