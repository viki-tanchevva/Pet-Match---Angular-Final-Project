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

  // Върни стойността на сигнала (извиквай сигнала с ())
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
        next: (animal) => this.animal.set(animal),
        error: () => this.router.navigate(['/animals']) // Ако няма животно - върни към списъка
      });
    }
  }

  onLike() {
    if (!this.animal()) return;
    this.animalsService.likeAnimal(this.animal()!.id).subscribe({
      next: ({ likes }) => {
        this.animal.update(a => ({ ...a!, likes }));
        this.liked = true;
      }
    });
  }

  onDelete() {
    if (!this.animal()) return;
    if (confirm('Сигурни ли сте, че искате да изтриете това животно?')) {
      this.animalsService.deleteAnimal(this.animal()!.id).subscribe({
        next: () => this.router.navigate(['/animals'])
      });
    }
  }

 isCreator(): boolean {
  const user = this.currentUser;
  const animal = this.animal();

  console.log('Current user ID:', user?._id);
  console.log('Animal addedByUserId:', animal?.addedByUserId);

  if (!user || !animal) {
    return false;
  }

  return String(user._id) === String(animal.addedByUserId);
}

}
