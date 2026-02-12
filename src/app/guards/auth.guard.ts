import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../components/login-dialog/login-dialog.component';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    if (!this.auth.isLoggedIn()) {
      this.dialog.open(LoginDialogComponent, { width: '420px' });
      return this.router.parseUrl('/');
    }
    const roles = route.data['roles'] as string[] | undefined;
    if (roles && !roles.some(r => this.auth.hasRole(r))) {
      return this.router.parseUrl('/');
    }
    return true;
  }
}
