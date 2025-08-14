import { TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../core/services';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: { register: () => of({}) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(RegisterComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
