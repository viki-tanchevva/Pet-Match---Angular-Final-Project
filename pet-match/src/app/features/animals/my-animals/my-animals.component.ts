import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnimalItemComponent } from '../animal-item/animal-item.component';
import { AnimalsService } from '../../../core/services';
import { Animal } from '../../../models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-animals',
  standalone: true,
  imports: [AnimalItemComponent, CommonModule],
  templateUrl: './my-animals.component.html',
  styleUrls: ['./my-animals.component.css'],
})
export class MyAnimalsComponent implements OnInit, OnDestroy {
  animals: Animal[] = [];
  private subscription = new Subscription();

  private animalsService = inject(AnimalsService);

  ngOnInit(): void {
    this.subscription = this.animalsService.getMyAnimals().subscribe({
      next: (data) => {
        this.animals = data;
      },
      error: (err) => {
        console.error('Error loading my animals', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
