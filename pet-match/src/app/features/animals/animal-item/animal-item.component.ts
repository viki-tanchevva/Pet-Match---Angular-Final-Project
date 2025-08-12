import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Animal } from '../../../models';

@Component({
  selector: 'app-animal-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './animal-item.component.html',
  styleUrls: ['./animal-item.component.css']
})
export class AnimalItemComponent {
  @Input() animal!: Animal;
}
