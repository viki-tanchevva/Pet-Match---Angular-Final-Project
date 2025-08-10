import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnimalItemComponent } from '../animal-item/animal-item.component';
import { AnimalsService } from '../../../core/services';
import { Animal } from '../../../models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-animals-board',
  standalone: true,
  imports: [AnimalItemComponent, CommonModule],
  templateUrl: './animals-board.component.html',
  styleUrls: ['./animals-board.component.css'],
})
export class AnimalsBoardComponent implements OnInit, OnDestroy {
  animals: Animal[] = [];
  private subscription = new Subscription();

  private animalsService = inject(AnimalsService);

  ngOnInit(): void {
    this.subscription = this.animalsService.getAllAnimals().subscribe({
      next: (data) => {
        this.animals = data;
      },
      error: (err) => {
        console.error('Error loading animals', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
