import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router); 
  const token = authService.getTokenFromLocalStorage(); 
  if (token) {
   
    return true;
  } else {
   
    router.navigate(['/login']);
    return false;
  }
};
