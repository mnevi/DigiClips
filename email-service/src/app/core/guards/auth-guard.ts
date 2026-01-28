import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth'; // fixed path

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const res: any = this.auth.isAuthenticated(); // use existing method name

    if (res && typeof res.subscribe === 'function') {
      return (res as Observable<boolean>).pipe(
        take(1),
        map((ok) => (ok ? true : this.router.createUrlTree(['/login'])))
      );
    }

    if (res && typeof res.then === 'function') {
      return (res as Promise<boolean>).then((ok) =>
        ok ? true : this.router.createUrlTree(['/login'])
      );
    }

    return res ? true : this.router.createUrlTree(['/login']);
  }
}