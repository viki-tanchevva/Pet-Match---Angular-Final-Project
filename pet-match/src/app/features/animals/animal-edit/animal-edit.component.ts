import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimalsService, UpdateAnimalDto } from '../../../core/services/animal.service';
import { Animal } from '../../../models';

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

  // НИКАКВИ ВАЛИДАТОРИ за теста
  editAnimalForm = this.fb.group({
    name: [''],
    type: [''],
    age: [null as number | null],
    location: [''],
    imageUrl: [''],
    description: [''],
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
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/animals']);
      },
    });
  }

  // Насилваме submit, без никакви проверки
  onSubmit(): void {
    if (!this.animalId) return;

    const v = this.editAnimalForm.getRawValue();
    const payload: UpdateAnimalDto = {
      name: v.name || '',
      type: v.type || '',
      imageUrl: v.imageUrl || '',
      age: v.age ?? null,
      location: v.location || '',
      description: v.description || '',
      adopted: !!v.adopted,
    };

    console.log('[EDIT] submitting payload', payload);
    this.animals.updateAnimal(this.animalId, payload).subscribe({
      next: () => this.router.navigate(['/animals', this.animalId]),
      error: (e) => {
        console.error('[EDIT] error', e);
        alert(e?.error?.message || 'Update failed');
      },
    });
  }

  cancel(): void {
    if (!this.animalId) return;
    this.router.navigate(['/animals', this.animalId]);
  }

  // Гетъри за шаблона (да не гърми)
  get nameCtrl() { return this.editAnimalForm.get('name')!; }
  get typeCtrl() { return this.editAnimalForm.get('type')!; }
  get ageCtrl() { return this.editAnimalForm.get('age')!; }
  get locationCtrl() { return this.editAnimalForm.get('location')!; }
  get imageUrlCtrl() { return this.editAnimalForm.get('imageUrl')!; }
  get descriptionCtrl() { return this.editAnimalForm.get('description')!; }

  get isNameInvalid() { return false; }
  get isTypeInvalid() { return false; }
  get isAgeInvalid() { return false; }
  get isLocationInvalid() { return false; }
  get isImageUrlInvalid() { return false; }
  get isDescriptionInvalid() { return false; }

  get nameErrorMessage() { return ''; }
  get typeErrorMessage() { return ''; }
  get ageErrorMessage() { return ''; }
  get locationErrorMessage() { return ''; }
  get imageUrlErrorMessage() { return ''; }
  get descriptionErrorMessage() { return ''; }
}
