import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnimalItemComponent } from '../animal-item/animal-item.component';
import { AnimalsService } from '../../../core/services';
import { Animal } from '../../../models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favorite-animals',
  standalone: true,
  imports: [AnimalItemComponent, CommonModule],
  templateUrl: './favourite-animals.component.html',
  styleUrls: ['./favourite-animals.component.css'],
})
export class FavoriteAnimalsComponent implements OnInit, OnDestroy {
  animals: Animal[] = [];
  private subscription = new Subscription();

  private animalsService = inject(AnimalsService);

  ngOnInit(): void {
    this.subscription = this.animalsService.getFavoriteAnimals().subscribe({
      next: (data) => {
        this.animals = data;
      },
      error: (err) => {
        console.error('Error loading favorite animals', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
