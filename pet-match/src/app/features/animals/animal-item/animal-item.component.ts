import { Component, inject, Input } from '@angular/core';
import { Animal } from '../../../models';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-animal-item',
  imports: [CommonModule, RouterLink],
  templateUrl: './animal-item.component.html',
  styleUrl: './animal-item.component.css'
})
export class AnimalItemComponent {
  @Input() animal!: Animal
}
