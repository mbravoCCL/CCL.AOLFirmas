import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path : 'firmas',
        loadComponent: () => import('./pages/firmas/firmas.component'),    
    },
    {
        path: '**',
        redirectTo : 'firmas',
        pathMatch: 'full'
    }
];
