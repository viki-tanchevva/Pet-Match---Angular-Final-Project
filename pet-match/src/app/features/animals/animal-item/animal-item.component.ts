import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Animal } from '../../../models';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-animal-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './animal-item.component.html',
  styleUrls: ['./animal-item.component.css'],
  animations: [
    trigger('itemAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.98)' }),
        animate('150ms ease-out', style({ opacity: 1, transform: 'none' }))
      ])
    ])
  ]
})
export class AnimalItemComponent {
  @Input() animal!: Animal;
}
