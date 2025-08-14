import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimalsService, UpdateAnimalDto } from '../../../core/services/animal.service';
import { Animal } from '../../../models';

const urlValidator: ValidatorFn = (control: AbstractControl) => {
  const v = control.value;
  if (!v) return null;
  try { new URL(v); return null; } catch { return { url: true } }
};

@Component({
  selector: 'app-animal-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './animal-edit.component.html',
  styleUrls: ['./animal-edit.component.css']
})
export class AnimalEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private animals = inject(AnimalsService);
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  animalId = '';
  loading = true;

  editAnimalForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    type: ['', [Validators.required]],
    age: [null as number | null],
    location: ['', [Validators.minLength(2)]],
    imageUrl: ['', [Validators.required, urlValidator]],
    description: ['', [Validators.minLength(5)]],
    adopted: [false]
  });

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.animalId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.animalId) return;

    this.animals.getAnimalById(this.animalId).subscribe({
      next: (a: Animal) => {
        this.editAnimalForm.patchValue({
          name: a.name || '',
          type: a.type || '',
          imageUrl: a.imageUrl || '',
          age: (a.age ?? null) as number | null,
          location: a.location || '',
          description: a.description || '',
          adopted: !!a.adopted
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/animals']);
      }
    });
  }

  onSubmit(): void {
    if (!this.editAnimalForm.valid || !this.animalId) return;
    const v = this.editAnimalForm.value;
    const payload: UpdateAnimalDto = {
      name: v.name!,
      type: v.type!,
      imageUrl: v.imageUrl!,
      age: v.age ?? null,
      location: v.location || '',
      description: v.description || '',
      adopted: !!v.adopted
    };
    this.animals.updateAnimal(this.animalId, payload).subscribe({
      next: () => this.router.navigate(['/animals', this.animalId])
    });
  }

  cancel(): void {
    if (!this.animalId) return;
    this.router.navigate(['/animals', this.animalId]);
  }

  get nameCtrl() { return this.editAnimalForm.get('name')!; }
  get typeCtrl() { return this.editAnimalForm.get('type')!; }
  get ageCtrl() { return this.editAnimalForm.get('age')!; }
  get locationCtrl() { return this.editAnimalForm.get('location')!; }
  get imageUrlCtrl() { return this.editAnimalForm.get('imageUrl')!; }
  get descriptionCtrl() { return this.editAnimalForm.get('description')!; }

  get isNameInvalid() { const c = this.nameCtrl; return c.invalid && (c.dirty || c.touched); }
  get isTypeInvalid() { const c = this.typeCtrl; return c.invalid && (c.dirty || c.touched); }
  get isAgeInvalid() { const c = this.ageCtrl; return c.invalid && (c.dirty || c.touched); }
  get isLocationInvalid() { const c = this.locationCtrl; return c.invalid && (c.dirty || c.touched); }
  get isImageUrlInvalid() { const c = this.imageUrlCtrl; return c.invalid && (c.dirty || c.touched); }
  get isDescriptionInvalid() { const c = this.descriptionCtrl; return c.invalid && (c.dirty || c.touched); }

  get nameErrorMessage(): string {
    const c = this.nameCtrl;
    if (c.hasError('required')) return 'Name is required';
    if (c.hasError('minlength')) return 'Name must be at least 2 characters';
    return '';
    }

  get typeErrorMessage(): string {
    const c = this.typeCtrl;
    if (c.hasError('required')) return 'Type is required';
    return '';
  }

  get ageErrorMessage(): string {
    const c = this.ageCtrl;
    if (c.hasError('min')) return 'Age cannot be negative';
    return '';
  }

  get locationErrorMessage(): string {
    const c = this.locationCtrl;
    if (c.hasError('minlength')) return 'Location must be at least 2 characters';
    return '';
  }

  get imageUrlErrorMessage(): string {
    const c = this.imageUrlCtrl;
    if (c.hasError('required')) return 'Image URL is required';
    if (c.hasError('url')) return 'Please enter a valid URL';
    return '';
  }

  get descriptionErrorMessage(): string {
    const c = this.descriptionCtrl;
    if (c.hasError('minlength')) return 'Description must be at least 5 characters';
    return '';
  }
}