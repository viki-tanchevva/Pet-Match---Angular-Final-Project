import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Animal } from '../../../models';
import { AnimalsService } from '../../../core/services';

@Component({
  selector: 'app-animal-edit',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './animal-edit.component.html',
  styleUrls: ['./animal-edit.component.css']
})
export class AnimalEditComponent implements OnInit {
  editAnimalForm!: FormGroup;
  animalId!: string | null;
  animal!: Animal | null;

  private animalsService = inject(AnimalsService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

ngOnInit(): void {
  this.animalId = this.route.snapshot.paramMap.get('id');
  console.log('Editing animal with ID:', this.animalId);

  this.createForm();
  console.log('Form created:', this.editAnimalForm);

  if (this.animalId) {
    this.animalsService.getAnimalById(this.animalId).subscribe({
      next: (animal) => {
        this.animal = animal;
        this.editAnimalForm.patchValue({
          name: animal.name,
          type: animal.type,
          age: animal.age,
          location: animal.location,
          imageUrl: animal.imageUrl,
          description: animal.description
        });
      },
      error: (err) => {
        console.error('Failed to load animal data:', err);
        this.router.navigate(['/animals']);
      }
    });
  } else {
    console.warn('No animal ID found in route parameters');
  }
}


  private createForm() {
    this.editAnimalForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      type: ['', [Validators.required, this.typeValidator(['Dog', 'Cat', 'Rabbit', 'Guinea pig', 'Hamster', 'Bird', 'Turtle', 'Other'])]],
      age: [null, [Validators.required, Validators.min(0)]],
      location: ['', Validators.required],
      imageUrl: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  get name() { return this.editAnimalForm.get('name'); }
  get type() { return this.editAnimalForm.get('type'); }
  get age() { return this.editAnimalForm.get('age'); }
  get location() { return this.editAnimalForm.get('location'); }
  get imageUrl() { return this.editAnimalForm.get('imageUrl'); }
  get description() { return this.editAnimalForm.get('description'); }

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
    this.editAnimalForm.markAllAsTouched();

    if (!this.animalId) {
      console.error('Animal ID is missing!');
      return;
    }

    if (this.editAnimalForm.valid) {
      const updatedAnimal = this.editAnimalForm.value;

      this.animalsService.updateAnimal(this.animalId, updatedAnimal).subscribe({
        next: () => {
          this.router.navigate(['/animals']);
        },
        error: (err) => {
          console.error('Failed to update animal!', err);
        }
      });
    } else {
      console.log('Form is invalid:', this.editAnimalForm);
    }
  }

  private typeValidator(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return allowedTypes.includes(control.value) ? null : { invalidType: true };
    };
  }
}
