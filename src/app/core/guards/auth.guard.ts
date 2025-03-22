import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const token = localStorage.getItem('auth-token');
        const currentUser = localStorage.getItem('currentUser');

        if (!token || !currentUser) {
            const queryParams: any = {};
            if (state.url !== '/') {
                queryParams['returnUrl'] = state.url.startsWith('/') ? state.url.substring(1) : state.url;
            }
            else if (state.url === '/') {
                this.router.navigate(['auth/login']);
                return false; // redirecting and restricting access
            }
            this.router.navigate(['auth/login'], { queryParams });
            return false;  // redirecting and restricting access
        }

        return true;
    }
}

