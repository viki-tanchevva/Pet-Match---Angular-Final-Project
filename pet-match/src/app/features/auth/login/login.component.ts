import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  protected authService = inject(AuthService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  loginForm: FormGroup;

  constructor() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    })
  }

  get email(): AbstractControl<any, any> | null {
     return this.loginForm.get('email');
  }

  get password(): AbstractControl<any, any> | null {
    return this.loginForm.get('password');
  }

  get emailError(): boolean {
    return this.email?.invalid && (this.email?.dirty || this.email?.touched) || false;
  }

  get passwordError(): boolean {
    return this.password?.invalid && (this.password?.dirty || this.password?.touched) || false;
  }

  get emailErrorMessage(): string {
    if (this.email?.errors?.['required']) {
      return 'Email is required!';
    }

    if (this.email?.errors?.['emailValidator']) {
      return 'Email is not valid!';
    }

    return '';
  }

  get passwordErrorMessage(): string {
    if (this.password?.errors?.['required']) {
      return 'Password is required!';
    }

    if (this.password?.errors?.['minlength']) {
      return 'Password should be at least 5 characters!';
    }

    return '';
  }

  isFormValid(): boolean {
    return this.loginForm.valid;
  }

  onSubmit(): void {

    if (this.isFormValid()) {
      const {email, password} = this.loginForm.value;
      const response = this.authService.login(email, password).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        }, 
        error: (err) => {
          console.log('Login failed!', err);
          this.markFormGroupTouched();
        }
      });

    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    })
  }
 

}

