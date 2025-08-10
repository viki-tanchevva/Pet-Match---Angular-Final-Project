import { Component, inject } from '@angular/core';
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
import { AuthService } from '../../../core/services/auth.service'; // провери пътя
import { AnimalsService } from '../../../core/services';

@Component({
  selector: 'app-create-animal',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink, CommonModule],
  templateUrl: './create-animal.component.html',
  styleUrl: './create-animal.component.css'
})
export class CreateAnimalComponent {
  protected animalsService = inject(AnimalsService);
  protected authService = inject(AuthService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  createAnimalForm: FormGroup;

  constructor() {
    this.createAnimalForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      type: ['', [Validators.required, this.typeValidator(['Dog', 'Cat', 'Rabbit', 'Guinea pig', 'Hamster', 'Bird', 'Turtle', 'Other'])]],
      age: [null, [Validators.required, Validators.min(0)]],
      location: ['', Validators.required],
      imageUrl: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  get name() { return this.createAnimalForm.get('name'); }
  get type() { return this.createAnimalForm.get('type'); }
  get age() { return this.createAnimalForm.get('age'); }
  get location() { return this.createAnimalForm.get('location'); }
  get imageUrl() { return this.createAnimalForm.get('imageUrl'); }
  get description() { return this.createAnimalForm.get('description'); }

  get nameErrorMessage(): string {
    if (this.name?.hasError('required')) return 'Name is required!';
    if (this.name?.hasError('minlength')) return 'Name should be at least 2 characters!';
    return '';
  }

  get typeErrorMessage(): string {
    if (this.type?.hasError('required')) return 'Type is required!';
    if (this.type?.hasError('invalidType')) return 'Invalid type!';
    return '';
  }

  get ageErrorMessage(): string {
    if (this.age?.hasError('required')) return 'Age is required!';
    if (this.age?.hasError('min')) return 'Age cannot be negative!';
    return '';
  }

  get locationErrorMessage(): string {
    if (this.location?.hasError('required')) return 'Location is required!';
    return '';
  }

  get imageUrlErrorMessage(): string {
    if (this.imageUrl?.hasError('required')) return 'Image URL is required!';
    return '';
  }

  get descriptionErrorMessage(): string {
    if (this.description?.hasError('required')) return 'Description is required!';
    return '';
  }

  get isNameInvalid(): boolean {
    return !!this.name?.invalid && (this.name?.touched || this.name?.dirty);
  }

  get isTypeInvalid(): boolean {
    return !!this.type?.invalid && (this.type?.touched || this.type?.dirty);
  }

  get isAgeInvalid(): boolean {
    return !!this.age?.invalid && (this.age?.touched || this.age?.dirty);
  }

  get isLocationInvalid(): boolean {
    return !!this.location?.invalid && (this.location?.touched || this.location?.dirty);
  }

  get isImageUrlInvalid(): boolean {
    return !!this.imageUrl?.invalid && (this.imageUrl?.touched || this.imageUrl?.dirty);
  }

  get isDescriptionInvalid(): boolean {
    return !!this.description?.invalid && (this.description?.touched || this.description?.dirty);
  }

  onSubmit(): void {
    this.createAnimalForm.markAllAsTouched();

    if (this.createAnimalForm.valid) {
      const formValue = this.createAnimalForm.value;

      const animalToCreate = {
        ...formValue,
        addedByUserId: this.authService.currentUser()?._id || null
      };

      this.animalsService.createAnimal(animalToCreate).subscribe({
        next: () => {
          this.router.navigate(['/animals']);
        },
        error: (err) => {
          console.error('Failed to create animal!', err);
          this.markFormGroupTouched();
        }
      });
    } else {
      console.log('Form is invalid:', this.createAnimalForm);
    }
  }

  private markFormGroupTouched(): void {
    Object.values(this.createAnimalForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  private typeValidator(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return allowedTypes.includes(control.value) ? null : { invalidType: true };
    };
  }
}
