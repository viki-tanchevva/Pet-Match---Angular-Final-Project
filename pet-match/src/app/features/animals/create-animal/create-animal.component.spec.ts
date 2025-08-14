import { TestBed } from '@angular/core/testing';
import { CreateAnimalComponent } from './create-animal.component';
import { AnimalsService } from '../../../core/services/animal.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('CreateAnimalComponent', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAnimalComponent, RouterTestingModule],
      providers: [
        { provide: AnimalsService, useValue: { create: () => of({ id: '1' }) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(CreateAnimalComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
