import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age',
  standalone: true
})
export class AgePipe implements PipeTransform {
  transform(value: number | null | undefined, singular: string = 'year', plural: string = 'years', unknown: string = 'Unknown'): string {
    if (value === null || value === undefined) return unknown;
    const n = Math.floor(Number(value));
    if (!Number.isFinite(n) || n <= 0) return unknown;
    return `${n} ${n === 1 ? singular : plural}`;
  }
}
