import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AnimalsService } from '../../../core/services/animal.service';
import { Animal } from '../../../models';
import { AnimalItemComponent } from '../animal-item/animal-item.component';

@Component({
  selector: 'app-animals-board',
  standalone: true,
  imports: [CommonModule, AnimalItemComponent],
  templateUrl: './animals-board.component.html',
  styleUrls: ['./animals-board.component.css']
})
export class AnimalsBoardComponent implements OnInit, OnDestroy {
  private animalsService = inject(AnimalsService);
  private subscription?: Subscription;

  animals: Animal[] = [];
  isLoading = false;
  errorMsg = '';

  ngOnInit(): void {
    this.isLoading = true;
    this.subscription = this.animalsService.getAllAnimals().subscribe({
      next: (data: Animal[]) => {
        this.animals = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMsg = 'Failed to load animals';
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
