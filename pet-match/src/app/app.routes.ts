import { Routes } from '@angular/router';
import { authGuard, roleGuard, guestGuard } from './core/guards';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  { path: 'home', loadComponent: () => import('./features/home/home.component').then(c => c.HomeComponent) },

  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(c => c.LoginComponent), canActivate: [guestGuard] },

  { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(c => c.RegisterComponent), canActivate: [guestGuard] },

  { path: 'animals', loadComponent: () => import('./features/animals/animals-board/animals-board.component').then(c => c.AnimalsBoardComponent) },

  { path: 'animals/create', loadComponent: () => import('./features/animals/create-animal/create-animal.component').then(c => c.CreateAnimalComponent), canActivate: [authGuard, roleGuard], data: { roles: ['Shelter'] } },

  { path: 'add-animal', redirectTo: 'animals/create', pathMatch: 'full' },

  { path: 'animals/edit/:id', loadComponent: () => import('./features/animals/animal-edit/animal-edit.component').then(c => c.AnimalEditComponent), canActivate: [authGuard, roleGuard], data: { roles: ['Shelter'] } },

  { path: 'animals/:id', loadComponent: () => import('./features/animals/animal-details/animal-details.component').then(c => c.AnimalDetailsComponent) },

  { path: 'favorites', loadComponent: () => import('./features/animals/favourite-animals/favourite-animals.component').then(c => c.FavoriteAnimalsComponent), canActivate: [authGuard] },

  { path: 'adopt/:animalId', loadComponent: () => import('./features/adoption/apply/apply.component').then(c => c.ApplyComponent), canActivate: [authGuard] },

  { path: 'my-animals', loadComponent: () => import('./features/animals/my-animals/my-animals.component').then(c => c.MyAnimalsComponent), canActivate: [authGuard, roleGuard], data: { roles: ['Shelter'] } },

  { path: 'my-requests', loadComponent: () => import('./features/adoption/my-requests/my-requests.component').then(c => c.MyRequestsComponent), canActivate: [authGuard] },

  { path: 'requests', loadComponent: () => import('./features/adoption/shelter-requests/shelter-requests.component').then(c => c.ShelterRequestsComponent), canActivate: [authGuard, roleGuard], data: { roles: ['Shelter'] } },

  { path: 'profile', loadComponent: () => import('./features/profile/profile.component').then(c => c.ProfileComponent), canActivate: [authGuard] },

  { path: 'geo', loadComponent: () => import('./features/geo/geo.component').then(c => c.GeoComponent) },

  { path: '**', loadComponent: () => import('./shared/components/not-found/not-found.component').then(c => c.NotFoundComponent) }
];
