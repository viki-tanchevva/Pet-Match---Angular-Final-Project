import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteAnimalsComponent } from './favourite-animals.component';

describe('FavouriteAnimalsComponent', () => {
  let component: FavouriteAnimalsComponent;
  let fixture: ComponentFixture<FavouriteAnimalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavouriteAnimalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavouriteAnimalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
