import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sidebarOpen = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  hasRole(roles: string[]): boolean {
    return this.authService.hasAnyRole(roles);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}