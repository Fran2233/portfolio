import { CanActivateFn } from '@angular/router';

export const guardGuard: CanActivateFn = (route, state) => {
  console.log('Guard!!!');
  return true;
};
