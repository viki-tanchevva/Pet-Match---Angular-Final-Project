import { TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../../core/services';

describe('HeaderComponent', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: { isAuthenticated: () => true, user: () => ({ role: 'User' }) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(HeaderComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
