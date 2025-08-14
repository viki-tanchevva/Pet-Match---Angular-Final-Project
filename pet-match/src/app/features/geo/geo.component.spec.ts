import { TestBed } from '@angular/core/testing';
import { GeoComponent } from './geo.component';
import { PLATFORM_ID } from '@angular/core';

describe('GeoComponent', () => {
  function setup() {
    TestBed.configureTestingModule({
      imports: [GeoComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }]
    });
    const fixture = TestBed.createComponent(GeoComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return { fixture, component };
  }

  it('should create', () => {
    const { component } = setup();
    expect(component).toBeTruthy();
  });

  it('should set error when geolocation is not supported', () => {
    const original = (navigator as any).geolocation;
    delete (navigator as any).geolocation;

    const { component } = setup();
    component.locate();
    expect(component.error).toBe('Geolocation not supported');

    (navigator as any).geolocation = original;
  });
});
