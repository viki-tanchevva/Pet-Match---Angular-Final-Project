import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimalsService, UpdateAnimalDto } from '../../../core/services/animal.service';
import { Animal } from '../../../models';

const urlWhenDirty: ValidatorFn = (control: AbstractControl) => {
  const v = control.value;
  if (!control.dirty || !v) return null;
  try { new URL(v); return null; } catch { return { url: true }; }
};

const minLenWhenDirty = (n: number): ValidatorFn => {
  return (control: AbstractControl) => {
    const v = control.value ?? '';
    if (!control.dirty) return null;
    return String(v).trim().length >= n ? null : { minlength: { requiredLength: n, actualLength: String(v).trim().length } };
  };
};

@Component({
  selector: 'app-animal-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './animal-edit.component.html',
  styleUrls: ['./animal-edit.component.css'],
})
export class AnimalEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private animals = inject(AnimalsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  animalId = '';
  loading = true;

  editAnimalForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    type: ['', [Validators.required]],
    age: [null as number | null], 
    location: ['', [minLenWhenDirty(2)]],
    imageUrl: ['', [urlWhenDirty]],
    description: ['', [minLenWhenDirty(5)]],
    adopted: [false],
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
          adopted: !!a.adopted,
        });
        this.editAnimalForm.markAsPristine();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/animals']);
      },
    });
  }

  get canSubmit(): boolean {
    const f = this.editAnimalForm;
    if (!f) return false;

    const requiredOk = this.nameCtrl.valid && this.typeCtrl.valid;
    if (!requiredOk) return false;

    if (!f.dirty) return false;

    const controls = f.controls;
    for (const key of Object.keys(controls)) {
      const c = controls[key as keyof typeof controls]!;
      if (c.dirty && c.invalid) return false;
    }
    return true;
  }

  onSubmit(): void {
    if (!this.animalId) return;

    if (!this.canSubmit) {
      this.editAnimalForm.markAllAsTouched();
      return;
    }

    const c = this.editAnimalForm.controls;
    const payload: UpdateAnimalDto = {};
    if (c.name.dirty) payload.name = String(c.name.value || '').trim();
    if (c.type.dirty) payload.type = String(c.type.value || '').trim();
    if (c.imageUrl.dirty) payload.imageUrl = String(c.imageUrl.value || '').trim();
    if (c.age.dirty) payload.age = (c.age.value as number | null) ?? null;
    if (c.location.dirty) payload.location = String(c.location.value || '').trim();
    if (c.description.dirty) payload.description = String(c.description.value || '').trim();
    if (c.adopted.dirty) payload.adopted = !!c.adopted.value;

    this.animals.updateAnimal(this.animalId, payload).subscribe({
      next: () => this.router.navigate(['/animals', this.animalId]),
      error: (e) => {
        console.error(e);
        alert(e?.error?.message || 'Update failed');
      },
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

  get isNameInvalid() { return this.nameCtrl.invalid && (this.nameCtrl.touched || this.nameCtrl.dirty); }
  get isTypeInvalid() { return this.typeCtrl.invalid && (this.typeCtrl.touched || this.typeCtrl.dirty); }
  get isAgeInvalid() { return this.ageCtrl.invalid && (this.ageCtrl.touched || this.ageCtrl.dirty); }           
  get isLocationInvalid() { return this.locationCtrl.invalid && (this.locationCtrl.touched || this.locationCtrl.dirty); }
  get isImageUrlInvalid() { return this.imageUrlCtrl.invalid && (this.imageUrlCtrl.touched || this.imageUrlCtrl.dirty); }
  get isDescriptionInvalid() { return this.descriptionCtrl.invalid && (this.descriptionCtrl.touched || this.descriptionCtrl.dirty); }

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
  get ageErrorMessage(): string { return ''; }
  get locationErrorMessage(): string {
    const c = this.locationCtrl;
    if (c.hasError('minlength')) return 'Location must be at least 2 characters';
    return '';
  }
  get imageUrlErrorMessage(): string {
    const c = this.imageUrlCtrl;
    if (c.hasError('url')) return 'Please enter a valid URL (e.g. https://example.com/img.jpg)';
    return '';
  }
  get descriptionErrorMessage(): string {
    const c = this.descriptionCtrl;
    if (c.hasError('minlength')) return 'Description must be at least 5 characters';
    return '';
  }
}
