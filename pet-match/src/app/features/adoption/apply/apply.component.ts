import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdoptionService } from '../../../core/services/adoption.service';
import { AnimalsService } from '../../../core/services/animal.service';
import { Animal } from '../../../models';
import { AuthService } from '../../../core/services';

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
  private auth = inject(AuthService);
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

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

    if (isPlatformBrowser(this.platformId) && this.auth.userRole() === 'User') {
      this.adoption.mine().subscribe(list => {
        this.alreadyApplied = list.some(r => String(r.animalId) === String(id) && r.status !== 'Declined');
      });
    }
  }

  submit(): void {
    if (!this.form.valid || !this.animal) return;
    if (this.alreadyApplied) {
      alert('You have already applied for this animal.');
      return;
    }
    const msg = `Name: ${this.form.value.fullName}\nPhone: ${this.form.value.phone}\n${this.form.value.message || ''}`;
    this.adoption.create(this.animal.id, msg).subscribe({
      next: () => this.router.navigate(['/my-requests']),
      error: (err) => {
        if (err?.status === 409) alert('You have already applied for this animal.');
      }
    });
  }
}
