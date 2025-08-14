import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AnimalsService } from '../../../core/services/animal.service';
import { Animal } from '../../../models';
import { AnimalItemComponent } from '../animal-item/animal-item.component';
import { trigger, transition, query, style, animate, stagger } from '@angular/animations';

@Component({
  selector: 'app-animals-board',
  standalone: true,
  imports: [CommonModule, AnimalItemComponent],
  templateUrl: './animals-board.component.html',
  styleUrls: ['./animals-board.component.css'],
  animations: [
    trigger('listAnimation', [
      transition(':enter', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(8px)' }),
          stagger(50, animate('200ms ease-out', style({ opacity: 1, transform: 'none' })))
        ], { optional: true })
      ])
    ])
  ]
})
export class AnimalsBoardComponent implements OnInit, OnDestroy {
  private animalsService = inject(AnimalsService);
  animals: Animal[] = [];
  isLoading = false;
  errorMsg = '';
  private subscription?: Subscription;

  ngOnInit(): void {
    this.isLoading = true;
    this.subscription = this.animalsService.loadAll().subscribe({
      next: list => {
        this.animals = list;
        this.isLoading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load animals';
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
