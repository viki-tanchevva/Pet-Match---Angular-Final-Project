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
  loading = false;
  submitError = '';

  editAnimalForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    type: ['', [Validators.required]],
    imageUrl: ['', [Validators.required, urlValidator]],
    age: [null as number | null],
    location: [''],
    description: ['', [Validators.minLength(5)]],
    adopted: [false]
  });

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const id = this.route.snapshot.paramMap.get('id') || this.route.snapshot.paramMap.get('animalId');
    if (!id) {
      this.router.navigate(['/animals']);
      return;
    }
    this.animalId = id;
    this.loading = true;
    this.animals.loadById(id).subscribe({
      next: (a: Animal) => {
        this.editAnimalForm.setValue({
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
    this.submitError = '';
    this.editAnimalForm.markAllAsTouched();

    if (!this.animalId) {
      this.submitError = 'Animal not found';
      return;
    }
    if (this.editAnimalForm.invalid) {
      this.submitError = 'Please fix the highlighted fields';
      return;
    }

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

    this.loading = true;
    this.animals.updateAnimal(this.animalId, payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/animals', this.animalId]);
      },
      error: (err) => {
        this.loading = false;
        const status = err?.status;
        if (status === 401) this.submitError = 'Please login to continue';
        else if (status === 403) this.submitError = 'You can edit only your own animals';
        else if (status === 404) this.submitError = 'Animal not found';
        else this.submitError = 'Update failed. Please try again';
      }
    });
  }

  cancel(): void {
    if (!this.animalId) return;
    this.router.navigate(['/animals', this.animalId]);
  }

  get nameCtrl(): AbstractControl { return this.editAnimalForm.get('name')!; }
  get typeCtrl(): AbstractControl { return this.editAnimalForm.get('type')!; }
  get imageUrlCtrl(): AbstractControl { return this.editAnimalForm.get('imageUrl')!; }
  get descriptionCtrl(): AbstractControl { return this.editAnimalForm.get('description')!; }

  get isNameInvalid(): boolean { const c = this.nameCtrl; return c.touched && c.invalid; }
  get isTypeInvalid(): boolean { const c = this.typeCtrl; return c.touched && c.invalid; }
  get isImageUrlInvalid(): boolean { const c = this.imageUrlCtrl; return c.touched && c.invalid; }
  get isDescriptionInvalid(): boolean { const c = this.descriptionCtrl; return c.touched && c.invalid; }

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
