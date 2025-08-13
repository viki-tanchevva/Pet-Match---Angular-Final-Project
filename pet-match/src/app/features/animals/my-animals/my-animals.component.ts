import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AnimalsService } from '../../../core/services/animal.service';
import { Animal } from '../../../models';
import { AnimalItemComponent } from '../animal-item/animal-item.component';
import { AuthService } from '../../../core/services';

@Component({
  selector: 'app-my-animals',
  standalone: true,
  imports: [CommonModule, AnimalItemComponent],
  templateUrl: './my-animals.component.html',
  styleUrls: ['./my-animals.component.css']
})
export class MyAnimalsComponent {
  private animalsService = inject(AnimalsService);
  private auth = inject(AuthService);
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  animals: Animal[] = [];

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.auth.userRole() !== 'Shelter') return;
    this.load();
  }

  load(): void {
    this.animalsService.getMyAnimals().subscribe(list => this.animals = list);
  }
}
