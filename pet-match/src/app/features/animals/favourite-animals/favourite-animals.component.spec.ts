import { TestBed } from '@angular/core/testing';
import { FavoriteAnimalsComponent } from './favourite-animals.component';
import { AnimalsService } from '../../../core/services/animal.service';
import { of } from 'rxjs';

describe('FavouriteAnimalsComponent', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteAnimalsComponent],
      providers: [
        { provide: AnimalsService, useValue: { loadFavorites: () => of([]) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(FavoriteAnimalsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
