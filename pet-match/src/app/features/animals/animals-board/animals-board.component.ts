import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, switchMap } from 'rxjs';
import { AnimalsService } from '../../../core/services/animal.service';
import { Animal } from '../../../models';
import { AnimalItemComponent } from '../animal-item/animal-item.component';
import { trigger, transition, query, style, animate, stagger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';

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
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  animals: Animal[] = [];
  isLoading = false;
  errorMsg = '';
  activeCity: string | null = null;
  private subscription?: Subscription;

  ngOnInit(): void {
    this.isLoading = true;
    this.subscription = this.route.queryParamMap
      .pipe(
        switchMap(params => {
          this.activeCity = params.get('city');
          return this.animalsService.loadAll();
        })
      )
      .subscribe({
        next: list => {
          this.animals = this.filterByCity(list, this.activeCity);
          this.isLoading = false;
        },
        error: () => {
          this.errorMsg = 'Failed to load animals';
          this.isLoading = false;
        }
      });
  }

  clearFilter(): void {
    this.router.navigate(['/animals']);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private filterByCity(list: Animal[], city: string | null): Animal[] {
    if (!city) return list;
    return list.filter(a => (a.location || '').toLowerCase() === city.toLowerCase());
  }
}
