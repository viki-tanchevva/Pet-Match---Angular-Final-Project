import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then(c => c.HomeComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(c => c.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(c => c.RegisterComponent)
    },
    {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(c => c.ProfileComponent)
    },
    {
        path: 'add-animal',
        loadComponent: () => import('./features/animals/create-animal/create-animal.component').then(c => c.CreateAnimalComponent)
    },
    {
        path: 'animals',
        loadComponent: () => import('./features/animals/animals-board/animals-board.component').then(c => c.AnimalsBoardComponent)
    },
    {
        path: 'animals/:id',
        loadComponent: () => import('./features/animals/animal-details/animal-details.component').then(c => c.AnimalDetailsComponent)
    },
    {
        path: 'animals/edit/:id',
        loadComponent: () => import('./features/animals/animal-edit/animal-edit.component').then(c => c.AnimalEditComponent)
    }
];
