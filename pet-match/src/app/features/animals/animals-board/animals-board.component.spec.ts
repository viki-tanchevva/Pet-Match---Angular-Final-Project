import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalsBoardComponent } from './animals-board.component';

describe('AnimalsBoardComponent', () => {
  let component: AnimalsBoardComponent;
  let fixture: ComponentFixture<AnimalsBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimalsBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimalsBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
