import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { User, UserRole } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private profile = inject(ProfileService);
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  me: User | null = null;
  loading = true;

  isEditing = false;
  successMsg = '';
  errorMsg = '';
  pwdMsg = '';
  pwdErr = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    role: ['' as UserRole | '', [Validators.required]],
    username: ['', [Validators.required, Validators.minLength(2)]]
  });

  passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(4)]],
    confirm: ['', [Validators.required]]
  });

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.load();
  }

  private c(name: 'email' | 'role' | 'username'): AbstractControl {
    return this.form.get(name)!;
  }
  private pc(name: 'currentPassword' | 'newPassword' | 'confirm'): AbstractControl {
    return this.passwordForm.get(name)!;
  }

  load(): void {
    this.loading = true;
    this.profile.me().subscribe({
      next: (u) => {
        this.me = u;
        this.form.setValue({
          email: u.email,
          role: u.role,
          username: u.username || ''
        });
        this.disableProfileInputs();
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load profile.';
        this.loading = false;
      }
    });
  }

  disableProfileInputs(): void {
    this.c('email').disable({ emitEvent: false });
    this.c('username').disable({ emitEvent: false });
    this.c('role').enable({ emitEvent: false });
  }

  enableProfileInputs(): void {
    this.c('email').enable({ emitEvent: false });
    this.c('username').enable({ emitEvent: false });
    this.c('role').enable({ emitEvent: false });
  }

  startEdit(): void {
    this.isEditing = true;
    this.successMsg = '';
    this.errorMsg = '';
    this.pwdMsg = '';
    this.pwdErr = '';
    this.passwordForm.reset();
    this.enableProfileInputs();
  }

  cancelEdit(): void {
    if (!this.me) return;
    this.isEditing = false;
    this.pwdMsg = '';
    this.pwdErr = '';
    this.passwordForm.reset();
    this.form.setValue({
      email: this.me.email,
      role: this.me.role,
      username: this.me.username || ''
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.disableProfileInputs();
    this.successMsg = '';
    this.errorMsg = '';
  }

  onRoleClick(): void {
    alert('Role cannot be changed.');
    if (this.me) this.c('role').setValue(this.me.role, { emitEvent: false });
  }
  onRoleKey(ev: Event): void {
    ev.preventDefault();
    this.onRoleClick();
  }

  private shouldChangePassword(): boolean {
    const v = this.passwordForm.value;
    return !!(v.currentPassword || v.newPassword || v.confirm);
  }

  get canSave(): boolean {
    if (!this.isEditing) return false;
    if (!this.form.valid) return false;
    if (!this.shouldChangePassword()) return true;
    if (!this.passwordForm.valid) return false;
    const { newPassword, confirm } = this.passwordForm.value;
    return newPassword === confirm;
  }

  saveAll(): void {
    this.successMsg = '';
    this.errorMsg = '';
    this.pwdMsg = '';
    this.pwdErr = '';

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const wantPwd = this.shouldChangePassword();

    if (wantPwd) {
      if (!this.passwordForm.valid) {
        this.passwordForm.markAllAsTouched();
        this.pwdErr = 'Please fill all password fields correctly.';
        return;
      }
      const { newPassword, confirm } = this.passwordForm.value;
      if (newPassword !== confirm) {
        this.passwordForm.markAllAsTouched();
        this.pwdErr = 'Passwords do not match.';
        return;
      }
      this.profile.changePassword(this.pc('currentPassword').value, this.pc('newPassword').value).subscribe({
        next: () => {
          this.pwdMsg = 'Password changed.';
          this.updateProfileOnly();
        },
        error: (e) => {
          this.pwdErr = e?.error?.message || 'Could not change password.';
        }
      });
      return;
    }

    this.updateProfileOnly();
  }

  private updateProfileOnly(): void {
    const { email, username } = this.form.getRawValue();
    this.profile.updateProfile({
      email: email || '',
      username: username || ''
    }).subscribe({
      next: (u) => {
        this.me = u;
        this.successMsg = 'Profile updated successfully.';
        this.isEditing = false;
        this.disableProfileInputs();
        this.passwordForm.reset();
      },
      error: () => {
        this.errorMsg = 'Could not update profile.';
      }
    });
  }

  get emailError(): string {
    const c = this.c('email');
    if (!c || !c.touched) return '';
    if (c.hasError('required')) return 'Email is required.';
    if (c.hasError('email')) return 'Enter a valid email address.';
    return '';
  }
  get usernameError(): string {
    const c = this.c('username');
    if (!c || !c.touched) return '';
    if (c.hasError('required')) return 'Username is required.';
    if (c.hasError('minlength')) return 'Username must be at least 2 characters.';
    return '';
  }
  get pwdCurrentError(): string {
    const c = this.pc('currentPassword');
    if (!c || !c.touched) return '';
    if (c.hasError('required')) return 'Current password is required.';
    return '';
  }
  get pwdNewError(): string {
    const c = this.pc('newPassword');
    if (!c || !c.touched) return '';
    if (c.hasError('required')) return 'New password is required.';
    if (c.hasError('minlength')) return 'New password must be at least 4 characters.';
    return '';
  }
  get pwdConfirmError(): string {
    const c = this.pc('confirm');
    if (!c || !c.touched) return '';
    if (c.hasError('required')) return 'Confirm password is required.';
    if (this.pc('newPassword').value && c.value !== this.pc('newPassword').value) return 'Passwords do not match.';
    return '';
  }
}