import { TestBed } from '@angular/core/testing';
import { AnimalDetailsComponent } from './animal-details.component';
import { AnimalsService } from '../../../core/services/animal.service';
import { AdoptionService } from '../../../core/services/adoption.service';
import { AuthService } from '../../../core/services';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';

describe('AnimalDetailsComponent', () => {
  it('should load animal by id and render', async () => {
    const animal = { id: '42', name: 'Rex', type: 'Dog', imageUrl: '', location: 'Sofia', likes: 0, addedByUserId: 'u1' } as any;

    await TestBed.configureTestingModule({
      imports: [AnimalDetailsComponent, RouterTestingModule],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: AnimalsService, useValue: { loadById: () => of(animal), toggleFavorite: () => of({ likes: 1 }) } },
        { provide: AdoptionService, useValue: {} },
        { provide: AuthService, useValue: { user: () => ({ id: 'u2', role: 'User' }) } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '42' }) } } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(AnimalDetailsComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.animal()?.id).toBe('42');
  });
});
