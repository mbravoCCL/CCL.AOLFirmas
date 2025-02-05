import { Routes } from '@angular/router';
import { AuthorizeComponent } from './layout/authorize/authorize.component';
import { FullComponent } from './layout/full/full.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',  
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: FullComponent,  
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/auth/login/login.component'),  
      }
    ]
  },
  {
    path: 'firmas',  
    canActivate: [authGuard],
    component: AuthorizeComponent,  
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/firmas/firmas.component'),  
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login' 
  }
];
