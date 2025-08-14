import { TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(HomeComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
