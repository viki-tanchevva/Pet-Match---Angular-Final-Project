import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services';
import { Router, RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  protected authService = inject(AuthService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  emailExistsError = false;

  registerForm: FormGroup;

  constructor() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      passwords: this.formBuilder.group({
        password: ['', [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern(/[a-zA-Z0-9]/)
        ]],
        rePassword: ['', Validators.required]
      }, { validators: this.passwordMatchValidator }),
      role: ['', [Validators.required, this.roleValidator(['User', 'Shelter'])]]
    });
  }

  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get passwords(): FormGroup { return this.registerForm.get('passwords') as FormGroup; }
  get password() { return this.passwords.get('password'); }
  get rePassword() { return this.passwords.get('rePassword'); }
  get role() { return this.registerForm.get('role'); }

  get isUsernameValid() {
    return this.username?.invalid && (this.username?.touched || this.username?.dirty);
  }

  get isEmailValid() {
    return this.email?.invalid && (this.email?.touched || this.email?.dirty);
  }

  get isPasswordsValid() {
    return this.passwords?.invalid && (this.passwords?.touched || this.passwords?.dirty);
  }

  get isRoleValid() {
    return this.role?.invalid && (this.role?.touched || this.role?.dirty);
  }

  get usernameErrorMessage(): string {
    if (this.username?.hasError('required')) return 'Username is required!';
    if (this.username?.hasError('minlength')) return 'Username should be at least 5 characters!';
    return '';
  }

  get emailErrorMessage(): string {
    if (this.email?.hasError('required')) return 'Email is required!';
    if (this.email?.hasError('pattern')) return 'Email is not valid!';
    return '';
  }

  get passwordErrorMessage(): string {
    if (this.password?.hasError('required')) return 'Password is required!';
    if (this.password?.hasError('minlength')) return 'Password should be at least 5 characters!';
    if (this.password?.hasError('pattern')) return 'Password is not valid!';
    return '';
  }

  get rePasswordErrorMessage(): string {
    if (this.rePassword?.hasError('required')) return 'Repeat password is required!';
    if (this.passwords?.hasError('passwordMatchValidator')) return 'Passwords do not match!';
    return '';
  }

  get roleErrorMessage(): string {
    if (this.role?.hasError('invalidRole')) return 'Role must be "User" or "Shelter"!';
    return '';
  }

  onSubmit(): void {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.valid) {
      const { username, email, role } = this.registerForm.value;
      const { password, rePassword } = this.registerForm.value.passwords;

      this.authService.register(username, email, password, rePassword, role).subscribe({
        next: () => {
          this.emailExistsError = false;
          this.router.navigate(['/home']);
        },
        error: (err) => {
          if (err.status === 409) {
            this.emailExistsError = true;
            this.email?.setErrors({ emailExists: true });
          } else {
            console.error('Registration failed!', err);
            this.markFormGroupTouched();
          }
        }
      });
    } else {
      console.log('Form is invalid:', this.registerForm);
    }
  }


  private markFormGroupTouched(): void {
    Object.values(this.registerForm.controls).forEach(control => {
      if (control instanceof FormGroup) {
        Object.values(control.controls).forEach(nestedControl => {
          nestedControl.markAsTouched();
        });
      } else {
        control.markAsTouched();
      }
    });
  }

  private passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;
    return password === rePassword ? null : { passwordMatchValidator: true };
  };

  private roleValidator(allowedRoles: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return allowedRoles.includes(control.value) ? null : { invalidRole: true };
    };
  }
}

