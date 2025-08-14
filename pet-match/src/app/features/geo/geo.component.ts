import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';

type City = { name: string; lat: number; lng: number };

@Component({
  selector: 'app-geo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './geo.component.html',
  styleUrls: ['./geo.component.css']
})
export class GeoComponent implements OnInit, AfterViewInit {
  @ViewChild('mapCanvas', { static: true }) mapCanvas!: ElementRef<HTMLCanvasElement>;

  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  lat: number | null = null;
  lng: number | null = null;
  error = '';
  nearby: { city: string; distanceKm: number }[] = [];

  private cities: City[] = [
    { name: 'Sofia', lat: 42.6977, lng: 23.3219 },
    { name: 'Plovdiv', lat: 42.1354, lng: 24.7453 },
    { name: 'Varna', lat: 43.2141, lng: 27.9147 },
    { name: 'Burgas', lat: 42.5048, lng: 27.4626 },
    { name: 'Ruse', lat: 43.8356, lng: 25.9657 },
    { name: 'Stara Zagora', lat: 42.4258, lng: 25.6345 },
    { name: 'Pleven', lat: 43.417, lng: 24.6067 },
    { name: 'Veliko Tarnovo', lat: 43.0757, lng: 25.6172 },
    { name: 'Gotse Delchev', lat: 41.5667, lng: 23.7333 }
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.drawPlaceholder();
  }

  locate(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!navigator.geolocation) {
      this.error = 'Geolocation not supported';
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        this.lat = pos.coords.latitude;
        this.lng = pos.coords.longitude;
        this.error = '';
        this.drawPoint();
        this.computeNearby();
      },
      () => {
        this.error = 'Unable to get location';
      }
    );
  }

  viewAnimals(city: string): void {
    this.router.navigate(['/animals'], { queryParams: { city } });
  }

  private drawPlaceholder(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const canvas = this.mapCanvas?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#f5f7fb';
    ctx.fillRect(0, 0, w, h);
  }

  private drawPoint(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const canvas = this.mapCanvas?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#f5f7fb';
    ctx.fillRect(0, 0, w, h);
    if (this.lat === null || this.lng === null) return;
    const x = ((this.lng + 180) / 360) * w;
    const y = ((90 - this.lat) / 180) * h;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#0288d1';
    ctx.fill();
  }

  private computeNearby(): void {
    if (this.lat === null || this.lng === null) {
      this.nearby = [];
      return;
    }
    const res = this.cities
      .map(c => ({
        city: c.name,
        distanceKm: Math.round(this.haversine(this.lat as number, this.lng as number, c.lat, c.lng))
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 5);
    this.nearby = res;
  }

  private haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const toRad = (v: number) => (v * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
