import { TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthService } from '../../core/services';
import { ProfileService } from '../../core/services/profile.service';

describe('ProfileComponent', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: { user: () => ({ id: 'u1', username: 'test' }) } },
        { provide: ProfileService, useValue: { getProfile: () => of({ username: 'test' }) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(ProfileComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
