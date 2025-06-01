import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return authService.checkGuard().pipe(
    map(response => {
      if (response.status === 200) {
        return true;
      } else {
        router.navigate(['/login']);
        console.log('Access denied. No valid session found.')
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );

  
};

export const authGuardAdmin: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return authService.checkGuard().pipe(
    map(response => {
      console.log(response)
      if (response.body.userType === 'admin') {
        return true;
      } else {
        router.navigate(['/user/dashboard']);
        console.log('Access denied.')
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );

  
};
