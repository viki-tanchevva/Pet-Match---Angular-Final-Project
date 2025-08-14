import { TestBed } from '@angular/core/testing';
import { MyAnimalsComponent } from './my-animals.component';
import { AnimalsService } from '../../../core/services/animal.service';
import { of } from 'rxjs';

describe('MyAnimalsComponent', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [MyAnimalsComponent],
      providers: [
        { provide: AnimalsService, useValue: { loadMine: () => of([]) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(MyAnimalsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
