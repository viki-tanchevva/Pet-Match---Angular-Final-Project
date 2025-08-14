import { TestBed } from '@angular/core/testing';
import { ShelterRequestsComponent } from './shelter-requests.component';
import { of } from 'rxjs';
import { AdoptionService } from '../../../core/services';

describe('ShelterRequestsComponent', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [ShelterRequestsComponent],
      providers: [
        { provide: AdoptionService, useValue: { shelterRequests: () => of([]) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(ShelterRequestsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
