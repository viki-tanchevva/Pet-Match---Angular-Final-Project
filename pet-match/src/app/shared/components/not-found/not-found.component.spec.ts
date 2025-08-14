import { TestBed } from '@angular/core/testing';
import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(NotFoundComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
