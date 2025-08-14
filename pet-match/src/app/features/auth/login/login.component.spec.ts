import { TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: { login: () => of({}) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(LoginComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
