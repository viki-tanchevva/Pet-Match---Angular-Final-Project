import { TestBed } from '@angular/core/testing';
import { MyRequestsComponent } from './my-requests.component';
import { of } from 'rxjs';
import { AdoptionService } from '../../../core/services';

describe('MyRequestsComponent', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [MyRequestsComponent],
      providers: [
        { provide: AdoptionService, useValue: { myRequests: () => of([]) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(MyRequestsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
