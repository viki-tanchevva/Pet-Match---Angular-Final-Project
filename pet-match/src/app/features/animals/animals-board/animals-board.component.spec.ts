import { TestBed } from '@angular/core/testing';
import { AnimalsService } from '../../../core/services/animal.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AnimalsBoardComponent } from './animals-board.component';

describe('AnimalsBoardComponent', () => {
  it('should create and filter by city from query params', async () => {
    const animals = [
      { id: '1', name: 'A', type: 'Dog', imageUrl: '', location: 'Sofia', likes: 0, addedByUserId: 'u1' } as any,
      { id: '2', name: 'B', type: 'Cat', imageUrl: '', location: 'Plovdiv', likes: 0, addedByUserId: 'u2' } as any
    ];

    await TestBed.configureTestingModule({
      imports: [AnimalsBoardComponent, NoopAnimationsModule],
      providers: [
        { provide: AnimalsService, useValue: { loadAll: () => of(animals) } },
        { provide: ActivatedRoute, useValue: { queryParamMap: of(convertToParamMap({ city: 'Sofia' })) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(AnimalsBoardComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.activeCity).toBe('Sofia');
    expect(component.animals.length).toBe(1);
    expect(component.animals[0].location).toBe('Sofia');
  });
});