import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, max: number = 120, suffix: string = '...'): string {
    const s = value ?? '';
    if (s.length <= max) return s;
    return s.slice(0, Math.max(0, max)).trimEnd() + suffix;
  }
}
