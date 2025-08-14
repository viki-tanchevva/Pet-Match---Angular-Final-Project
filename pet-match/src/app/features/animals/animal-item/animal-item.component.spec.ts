
import { TestBed } from '@angular/core/testing';
import { AnimalItemComponent } from './animal-item.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('AnimalItemComponent', () => {
  it('should render animal name and details link', async () => {
    await TestBed.configureTestingModule({
      imports: [AnimalItemComponent, RouterTestingModule]
    }).compileComponents();

    const fixture = TestBed.createComponent(AnimalItemComponent);
    const component = fixture.componentInstance;
    component.animal = { id: '1', name: 'Buddy', type: 'Dog', imageUrl: 'img.jpg', likes: 0, addedByUserId: 'u' } as any;
    fixture.detectChanges();

    const h3: HTMLElement = fixture.nativeElement.querySelector('h3');
    const link: HTMLElement = fixture.nativeElement.querySelector('a');

    expect(component).toBeTruthy();
    expect(h3?.textContent).toContain('Buddy');
    expect(link?.textContent).toContain('Details');
  });
});
