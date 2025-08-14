import { TestBed } from '@angular/core/testing';
import { AnimalEditComponent } from './animal-edit.component';
import { AnimalsService } from '../../../core/services/animal.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('AnimalEditComponent', () => {
  it('should create and load animal', async () => {
    await TestBed.configureTestingModule({
      imports: [AnimalEditComponent, RouterTestingModule],
      providers: [
        { provide: AnimalsService, useValue: { loadById: () => of({ id: '7' }), update: () => of({}) } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '7' }) } } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(AnimalEditComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
