import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdoptionService } from '../../../core/services/adoption.service';
import { AnimalsService } from '../../../core/services/animal.service';
import { Animal } from '../../../models';

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.css']
})
export class ApplyComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private adoption = inject(AdoptionService);
  private animals = inject(AnimalsService);

  animal: Animal | null = null;
  alreadyApplied = false;

  form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required]],
    message: ['']
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('animalId')!;
    this.animals.getAnimalById(id).subscribe(a => this.animal = a);
    this.adoption.mine().subscribe(list => {
      this.alreadyApplied = list.some(r => String(r.animalId) === String(id) && r.status !== 'Declined');
    });
  }

  submit(): void {
    if (!this.form.valid || !this.animal) return;
    if (this.alreadyApplied) {
      alert('Вече сте кандидатствали за това животно.');
      return;
    }
    const msg = `Name: ${this.form.value.fullName}\nPhone: ${this.form.value.phone}\n${this.form.value.message || ''}`;
    this.adoption.create(this.animal.id, msg).subscribe({
      next: () => this.router.navigate(['/my-requests']),
      error: (err) => {
        if (err?.status === 409) alert('Вече сте кандидатствали за това животно.');
      }
    });
  }
}
